import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuoteSchema, insertPaymentSchema } from "@shared/schema";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, CreditCard, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { addMonths } from "date-fns";

interface BookingFormProps {
  doctor: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingForm({ doctor, isOpen, onOpenChange }: BookingFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [showPayment, setShowPayment] = useState(false);

  const maxDate = addMonths(new Date(), 6);

  const form = useForm({
    resolver: zodResolver(insertQuoteSchema.extend({
      patientName: z.string().min(3, "Nombre completo es requerido"),
      patientPhone: z.string().min(10, "Teléfono válido es requerido"),
      patientEmail: z.string().email("Correo electrónico inválido"),
      appointmentTime: z.string().min(1, "Hora es requerida"),
      // Payment fields (optional if free)
      paymentMethod: z.string().optional(),
      zelleAccount: z.string().optional(),
      zelleBank: z.string().optional(),
      zelleDate: z.string().optional(),
      zelleAmount: z.string().optional(),
      zelleRef: z.string().optional(),
      pagoMovilBank: z.string().optional(),
      pagoMovilId: z.string().optional(),
      pagoMovilPhone: z.string().optional(),
      pagoMovilDate: z.string().optional(),
      pagoMovilAmount: z.string().optional(),
      pagoMovilRef: z.string().optional(),
    })),
    defaultValues: {
      patientId: 3, 
      doctorId: doctor.user.id,
      diagnosis: "",
      status: "review",
      surgeryCost: doctor.consultationFee || 0,
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      appointmentTime: "",
      paymentMethod: "zelle",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const finalDate = date ? new Date(date) : new Date();
      if (values.appointmentTime) {
        const [hours, minutes] = values.appointmentTime.split(":");
        finalDate.setHours(parseInt(hours), parseInt(minutes));
      }

      const quoteRes = await fetch(api.quotes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          appointmentDate: finalDate,
        }),
      });
      if (!quoteRes.ok) throw new Error("Failed to create quote");
      const quoteData = await quoteRes.json();

      // Handle payment if not free
      if (!doctor.isFreeConsultation) {
        const paymentData = {
          quoteId: quoteData.id,
          amount: doctor.consultationFee,
          referenceNumber: values.paymentMethod === 'zelle' ? values.zelleRef : values.pagoMovilRef,
          bankName: values.paymentMethod === 'zelle' ? values.zelleBank : values.pagoMovilBank,
          status: "pending"
        };
        await fetch(api.payments.create.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        });
      }

      return quoteData;
    },
    onSuccess: () => {
      const message = doctor.isFreeConsultation 
        ? "En breve le enviaremos un correo con su ticket de cita."
        : "Al momento de validar su pago le notificaremos a su correo ticket de su cita, muchas gracias.";
      
      toast({
        title: "Solicitud Enviada",
        description: message,
      });
      onOpenChange(false);
      setLocation("/");
    },
  });

  const timeSlots = [];
  let current = new Date();
  current.setHours(8, 30, 0, 0);
  const end = new Date();
  end.setHours(17, 0, 0, 0);

  while (current <= end) {
    timeSlots.push(format(current, "HH:mm"));
    current.setMinutes(current.getMinutes() + 30);
  }

  const handleInitialSubmit = () => {
    if (!doctor.isFreeConsultation) {
      setShowPayment(true);
    } else {
      form.handleSubmit((v) => mutation.mutate(v))();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary">
            Agendar con {doctor.user.name}
          </DialogTitle>
          <DialogDescription>
            {showPayment ? "Anexar método de pago para confirmar la cita." : "Complete su información para iniciar el proceso."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            {!showPayment ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" className="rounded-xl border-primary/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+58 412..." className="rounded-xl border-primary/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="patientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" className="rounded-xl border-primary/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem className="flex flex-col">
                    <FormLabel>Día de la Cita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-xl border-primary/10 py-6",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {date ? format(date, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl border border-primary/10 shadow-2xl overflow-hidden bg-white" align="start">
                        <div className="p-4 bg-primary/5 border-b border-primary/10 text-center">
                          <span className="text-sm font-bold text-primary uppercase tracking-wider">Seleccionar Fecha</span>
                        </div>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date() || date > maxDate || date.getDay() === 0}
                          locale={es}
                          className="p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de la Cita</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-primary/10 py-6 bg-white hover:bg-primary/5 transition-colors group">
                              <Clock className="mr-2 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                              <SelectValue placeholder="Seleccione hora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px] rounded-2xl border-primary/10 shadow-xl overflow-hidden bg-white">
                            <div className="p-2 bg-primary/5 border-b border-primary/10 text-center mb-1">
                              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Horarios Disponibles</span>
                            </div>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time} className="rounded-lg focus:bg-primary focus:text-white m-1 cursor-pointer">
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de Consulta / Síntomas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describa brevemente su caso..." 
                          className="rounded-2xl border-primary/10 resize-none h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Costo de Consulta:</span>
                    <span className="font-bold text-primary">
                      {doctor.isFreeConsultation ? "Gratis (Cortesía)" : `$${doctor.consultationFee}`}
                    </span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="w-full rounded-full py-6 text-lg shadow-lg" 
                  onClick={handleInitialSubmit}
                  disabled={!date || !form.getValues("patientEmail")}
                >
                  {doctor.isFreeConsultation ? "Confirmar Cita" : "Continuar al Pago"}
                </Button>
              </>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <Tabs defaultValue="zelle" onValueChange={(v) => form.setValue("paymentMethod", v)}>
                  <TabsList className="grid w-full grid-cols-3 rounded-xl bg-primary/5 p-1 h-12">
                    <TabsTrigger value="zelle" className="rounded-lg gap-2"><Wallet className="w-4 h-4" /> Zelle</TabsTrigger>
                    <TabsTrigger value="pagomovil" className="rounded-lg gap-2"><Landmark className="w-4 h-4" /> Pago Móvil</TabsTrigger>
                    <TabsTrigger value="card" className="rounded-lg gap-2"><CreditCard className="w-4 h-4" /> Tarjeta</TabsTrigger>
                  </TabsList>

                  <TabsContent value="zelle" className="space-y-4 pt-4">
                    <FormField control={form.control} name="zelleAccount" render={({ field }) => (
                      <FormItem><FormLabel>Nombre del Titular</FormLabel><FormControl><Input placeholder="Titular de la cuenta" {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="zelleBank" render={({ field }) => (
                        <FormItem><FormLabel>Banco</FormLabel><FormControl><Input placeholder="Chase, BofA, etc." {...field} /></FormControl></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name="zelleDay" render={({ field }) => (
                          <FormItem><FormLabel>Día</FormLabel><FormControl><Input placeholder="DD" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="zelleMonth" render={({ field }) => (
                          <FormItem><FormLabel>Mes</FormLabel><FormControl><Input placeholder="MM" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="zelleAmount" render={({ field }) => (
                        <FormItem><FormLabel>Monto</FormLabel><FormControl><Input placeholder="$" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="zelleRef" render={({ field }) => (
                        <FormItem><FormLabel>Referencia</FormLabel><FormControl><Input placeholder="Referencia" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  <TabsContent value="pagomovil" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="pagoMovilBank" render={({ field }) => (
                        <FormItem><FormLabel>Banco</FormLabel><FormControl><Input placeholder="Banesco, Mercantil..." {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="pagoMovilId" render={({ field }) => (
                        <FormItem><FormLabel>Cédula</FormLabel><FormControl><Input placeholder="V-12345678" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="pagoMovilPhone" render={({ field }) => (
                      <FormItem><FormLabel>Número de Teléfono</FormLabel><FormControl><Input placeholder="0412..." {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 grid grid-cols-2 gap-2">
                        <FormField control={form.control} name="pagoMovilDay" render={({ field }) => (
                          <FormItem><FormLabel>Día</FormLabel><FormControl><Input placeholder="DD" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="pagoMovilMonth" render={({ field }) => (
                          <FormItem><FormLabel>Mes</FormLabel><FormControl><Input placeholder="MM" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="pagoMovilAmount" render={({ field }) => (
                        <FormItem className="col-span-1"><FormLabel>Monto</FormLabel><FormControl><Input placeholder="Bs." {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="pagoMovilRef" render={({ field }) => (
                        <FormItem className="col-span-1"><FormLabel>Referencia</FormLabel><FormControl><Input placeholder="Referencia" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  <TabsContent value="card" className="pt-8 pb-4 text-center space-y-2">
                    <p className="text-muted-foreground italic">Disculpe en estos momentos estamos en mantenimiento</p>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button variant="outline" type="button" className="flex-1 rounded-full" onClick={() => setShowPayment(false)}>Atrás</Button>
                  <Button type="submit" className="flex-[2] rounded-full" disabled={mutation.isPending || form.watch("paymentMethod") === "card"}>
                    {mutation.isPending ? "Procesando..." : "Confirmar Cita"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


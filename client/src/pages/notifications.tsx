import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, FileText, History, Calendar as CalendarIcon, Hotel, Plane, Utensils, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [stayDays, setStayDays] = useState(1);
  const [vipTransport, setVipTransport] = useState(false);
  const [mealPlan, setMealPlan] = useState(false);

  const { data: quotes, isLoading } = useQuery({
    queryKey: ["/api/quotes"],
  });

  const { data: hotels } = useQuery({
    queryKey: ["/api/hotels"],
  });

  if (isLoading) return <div className="p-20"><Skeleton className="h-[600px] w-full rounded-3xl" /></div>;

  const approvedQuote = quotes?.find((q: any) => q.status === "ready" || q.status === "pending_payment");

  const handleLogisticsClick = () => {
    if (!approvedQuote) {
      toast({
        title: "Atención",
        description: "Para configurar su estadía y traslados, primero debe contar con una propuesta de cirugía aprobada por nuestro equipo médico.",
        variant: "destructive",
      });
      return;
    }
    setIsLogisticsOpen(true);
  };

  const calculateTotal = () => {
    if (!approvedQuote || !selectedHotel) return approvedQuote?.surgeryCost || 0;
    const surgery = approvedQuote.surgeryCost || 0;
    const hotel = (selectedHotel.pricePerNight || 0) * stayDays;
    const logistics = vipTransport ? (approvedQuote.logisticsFee || 150) : 0;
    const meals = mealPlan ? (selectedHotel.mealPrice || 30) * stayDays : 0;
    return surgery + hotel + logistics + meals;
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-display text-primary">Panel de Usuario</h1>
          <Button 
            onClick={handleLogisticsClick}
            size="lg"
            className="rounded-full bg-secondary hover:bg-secondary/90 text-white px-8 py-6 shadow-xl hover:scale-105 transition-all group"
          >
            <Hotel className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Hoteles y Traslados
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Notifications Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display text-primary mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Estado de Citas
            </h2>
            
            {quotes?.length === 0 ? (
              <Card className="border-none shadow-sm rounded-3xl bg-primary/5">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tienes citas o solicitudes activas.</p>
                </CardContent>
              </Card>
            ) : (
              quotes?.map((quote: any) => (
                <Card key={quote.id} className="border-none shadow-md rounded-3xl overflow-hidden hover-elevate transition-all">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row justify-between items-center py-4">
                    <CardTitle className="text-lg text-primary flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Cita #{quote.id}
                    </CardTitle>
                    <div className="px-4 py-1 bg-white rounded-full text-xs font-bold text-primary border border-primary/20">
                      {quote.status === "review" ? "ESPERA DE VALIDACIÓN DE PAGO" : 
                       quote.status === "ready" ? "PROPUESTA LISTA" : quote.status.toUpperCase()}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Paciente</p>
                        <p className="font-medium">{quote.patientName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Fecha Solicitada</p>
                        <p className="font-medium">
                          {quote.appointmentDate ? format(new Date(quote.appointmentDate), "PPP p", { locale: es }) : "Pendiente"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold mb-2">Datos de Pago</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Monto Estimado:</span>
                        <span className="font-bold text-primary">${quote.totalCost || quote.surgeryCost}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 rounded-full gap-2">
                        <FileText className="w-4 h-4" />
                        Anexar Historial Médico
                      </Button>
                      {quote.status === "ready" && (
                        <Button onClick={handleLogisticsClick} variant="outline" className="flex-1 rounded-full border-secondary text-secondary hover:bg-secondary/5">
                          Configurar Logística
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Activity/History Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display text-primary mb-4 flex items-center gap-2">
                <History className="w-6 h-6" />
                Actividad Reciente
              </h2>
              <Card className="border-none shadow-sm rounded-3xl bg-secondary/5">
                <CardContent className="pt-6 space-y-6">
                  {[
                    { text: "Solicitud de cita enviada", time: "Hoy", icon: CheckCircle2 },
                    { text: "Perfil médico actualizado", time: "Ayer", icon: CheckCircle2 },
                    { text: "Pago registrado con éxito", time: "Hace 2 días", icon: CheckCircle2 }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-primary hover:bg-primary/5 rounded-full text-xs">
                    Ver historial completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Logistics Dialog */}
      <Dialog open={isLogisticsOpen} onOpenChange={setIsLogisticsOpen}>
        <DialogContent className="sm:max-w-[800px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display text-primary">Configurador de Estancia</DialogTitle>
            <DialogDescription>
              Seleccione su hotel y servicios adicionales para completar su presupuesto personalizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 block">Hoteles Aliados</Label>
                <div className="grid grid-cols-1 gap-4">
                  {hotels?.map((hotel: any) => (
                    <div 
                      key={hotel.id}
                      onClick={() => setSelectedHotel(hotel)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center ${
                        selectedHotel?.id === hotel.id 
                        ? 'border-secondary bg-secondary/5 shadow-md' 
                        : 'border-primary/10 hover:border-primary/30'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${hotel.imageUrls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'})` }} />
                      <div className="flex-1">
                        <p className="font-bold text-primary">{hotel.name}</p>
                        <p className="text-sm text-secondary font-medium">${hotel.pricePerNight} / noche</p>
                      </div>
                      {selectedHotel?.id === hotel.id && <CheckCircle2 className="w-6 h-6 text-secondary" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stay-days" className="font-bold">Días de estadía</Label>
                  <Input 
                    id="stay-days"
                    type="number" 
                    min="1" 
                    value={stayDays} 
                    onChange={(e) => setStayDays(parseInt(e.target.value) || 1)}
                    className="w-20 rounded-xl text-center font-bold border-primary/20"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-bold">Traslados VIP</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Aeropuerto - Hotel - Clínica</p>
                    </div>
                  </div>
                  <Switch checked={vipTransport} onCheckedChange={setVipTransport} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-bold">Plan de Alimentación</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Menú adaptado post-operatorio</p>
                    </div>
                  </div>
                  <Switch checked={mealPlan} onCheckedChange={setMealPlan} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-xl rounded-3xl bg-primary text-white overflow-hidden sticky top-0">
                <div className="p-8 space-y-6">
                  <h3 className="text-xl font-display border-b border-white/20 pb-4">Resumen de Presupuesto</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between opacity-80">
                      <span>Cirugía Base:</span>
                      <span className="font-mono">${approvedQuote?.surgeryCost || 0}</span>
                    </div>
                    {selectedHotel && (
                      <div className="flex justify-between opacity-80 animate-in fade-in slide-in-from-left-2">
                        <span>Hotel ({stayDays} noches):</span>
                        <span className="font-mono">${selectedHotel.pricePerNight * stayDays}</span>
                      </div>
                    )}
                    {vipTransport && (
                      <div className="flex justify-between opacity-80 animate-in fade-in slide-in-from-left-2">
                        <span>Logística VIP:</span>
                        <span className="font-mono">${approvedQuote?.logisticsFee || 150}</span>
                      </div>
                    )}
                    {mealPlan && selectedHotel && (
                      <div className="flex justify-between opacity-80 animate-in fade-in slide-in-from-left-2">
                        <span>Plan Comidas:</span>
                        <span className="font-mono">${(selectedHotel.mealPrice || 30) * stayDays}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/20 flex justify-between items-end">
                    <span className="text-lg font-display uppercase tracking-widest">Total Inversión</span>
                    <span className="text-4xl font-display text-accent">${calculateTotal()}</span>
                  </div>

                  <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-full py-8 text-lg font-bold shadow-2xl transition-transform hover:scale-105">
                    Confirmar Presupuesto Final
                  </Button>
                </div>
              </Card>
              
              {!approvedQuote && (
                <div className="bg-destructive/10 p-6 rounded-3xl border border-destructive/20 flex gap-4 items-start">
                  <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
                  <p className="text-xs text-destructive font-medium leading-relaxed">
                    Atención: Los costos mostrados son referenciales. El monto final de cirugía debe ser validado por su cirujano tras la evaluación virtual.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

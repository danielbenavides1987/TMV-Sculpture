import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { api, buildUrl } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Hotel, 
  Plane, 
  Utensils, 
  Calendar, 
  Calculator,
  ChevronRight,
  Info,
  Check
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuoteConfigurator({ quoteId }: { quoteId: number }) {
  const { toast } = useToast();
  const [stayDays, setStayDays] = useState(7);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [includeLogistics, setIncludeLogistics] = useState(false);
  const [includeMeals, setIncludeMeals] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  const { data: quote, isLoading: isLoadingQuote } = useQuery({
    queryKey: [buildUrl(api.quotes.get.path, { id: quoteId })],
  });

  const { data: hotels, isLoading: isLoadingHotels } = useQuery({
    queryKey: [api.hotels.list.path],
  });

  const selectedHotel = useMemo(() => 
    hotels?.find((h: any) => h.id === Number(selectedHotelId)),
    [hotels, selectedHotelId]
  );

  const mutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(buildUrl(api.quotes.update.path, { id: quoteId }), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.quotes.list.path] });
      toast({
        title: "Presupuesto Actualizado",
        description: "Tus preferencias han sido guardadas con éxito.",
      });
    }
  });

  const calculations = useMemo(() => {
    if (!quote) return { total: 0, hotelTotal: 0, mealTotal: 0, logistics: 0 };
    
    const hotelRate = selectedHotel?.pricePerNight || 0;
    const mealRate = selectedHotel?.mealPrice || 0;
    
    const hotelTotal = hotelRate * stayDays;
    const mealTotal = includeMeals ? (mealRate * stayDays) : 0;
    const logistics = includeLogistics ? 150 : 0; // Flat fee example
    
    const total = (quote.surgeryCost || 0) + hotelTotal + mealTotal + logistics;
    
    return { total, hotelTotal, mealTotal, logistics };
  }, [quote, selectedHotel, stayDays, includeMeals, includeLogistics]);

  const handleSave = () => {
    mutation.mutate({
      hotelId: Number(selectedHotelId),
      stayDays,
      includeLogistics,
      includeMealPlan: includeMeals,
      whatsappNumber: whatsapp,
      totalCost: calculations.total,
      status: "pending_payment"
    });
  };

  if (isLoadingQuote || isLoadingHotels) {
    return <Skeleton className="h-[600px] w-full rounded-3xl" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-primary">Configurador de Paquete</h1>
          <p className="text-muted-foreground text-sm">Personalice su estancia y servicios adicionales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Hotel Selection */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Hotel className="w-5 h-5" />
                <span>Selección de Alojamiento</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Elija un Hotel Aliado</Label>
                <Select value={selectedHotelId} onValueChange={setSelectedHotelId}>
                  <SelectTrigger className="rounded-xl border-primary/10 py-6">
                    <SelectValue placeholder="Seleccione un hotel..." />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels?.map((h: any) => (
                      <SelectItem key={h.id} value={h.id.toString()}>
                        {h.name} - ${h.pricePerNight}/noche
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Días de Estancia</Label>
                  <span className="text-sm font-bold text-primary">{stayDays} días</span>
                </div>
                <Input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={stayDays} 
                  onChange={(e) => setStayDays(parseInt(e.target.value))}
                  className="accent-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Extras */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Plus className="w-5 h-5" />
                <span>Servicios VIP y Extras</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold">Logística VIP</div>
                    <div className="text-xs text-muted-foreground">Recogida aeropuerto y transporte local</div>
                  </div>
                </div>
                <Switch checked={includeLogistics} onCheckedChange={setIncludeLogistics} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-bold">Plan de Comidas Personalizado</div>
                    <div className="text-xs text-muted-foreground">3 comidas saludables/día</div>
                  </div>
                </div>
                <Switch checked={includeMeals} onCheckedChange={setIncludeMeals} />
              </div>

              {(includeLogistics || includeMeals) && (
                <div className="animate-fade-in space-y-2 pt-4">
                  <Label className="text-primary flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Número de WhatsApp para coordinación
                  </Label>
                  <Input 
                    placeholder="+58 412..." 
                    className="rounded-xl border-primary/20"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    * Un administrador le contactará en 24-48h para personalizar estos servicios.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-primary text-white sticky top-24">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white font-display text-xl">Resumen de Cotización</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm opacity-80">
                <span>Base Médica</span>
                <span>${quote.surgeryCost}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>Estancia ({stayDays} noches)</span>
                <span>+${calculations.hotelTotal}</span>
              </div>
              {includeMeals && (
                <div className="flex justify-between text-sm opacity-80">
                  <span>Plan de Comidas</span>
                  <span>+${calculations.mealTotal}</span>
                </div>
              )}
              {includeLogistics && (
                <div className="flex justify-between text-sm opacity-80">
                  <span>Logística VIP</span>
                  <span>+${calculations.logistics}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                <span className="font-bold text-lg text-white">Total</span>
                <span className="text-3xl font-display">${calculations.total}</span>
              </div>
            </CardContent>
            <CardFooter className="pb-8 px-6">
              <Button 
                className="w-full rounded-full bg-white text-primary hover:bg-white/90 py-7 text-lg shadow-lg group"
                onClick={handleSave}
                disabled={mutation.isPending || !selectedHotelId}
              >
                {mutation.isPending ? "Guardando..." : "Confirmar Presupuesto"}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>

          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Este es un presupuesto preliminar. El costo médico final está sujeto a la evaluación física del especialista.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

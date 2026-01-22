import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, buildUrl } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileDown, 
  Stethoscope, 
  User as UserIcon, 
  GraduationCap,
  MessageCircle,
  Filter
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingForm } from "@/components/booking-form";

export default function DoctorDirectory() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["/api/doctors"],
  });

  const filteredDoctors = doctors?.filter((doc: any) => {
    const matchesSearch = doc.user.name.toLowerCase().includes(search.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialty === "all" || doc.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = Array.from(new Set(doctors?.map((d: any) => d.specialty) || []));

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-primary/5 border-b border-primary/10 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Directorio Médico</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encuentre a los mejores especialistas de Venezuela certificados internacionalmente.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Search & Filters */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center mb-12 shadow-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre o especialidad..." 
              className="pl-12 py-6 rounded-2xl border-primary/10 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-[200px] py-6 rounded-2xl border-primary/10">
                <Filter className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {specialties.map((s: any) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[450px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors?.map((doc: any) => (
              <Card key={doc.id} className="group hover-elevate border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={doc.imageUrls?.[0] || `https://placehold.co/600x400?text=${doc.user.name}`} 
                    alt={doc.user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={doc.isFreeConsultation ? "bg-green-500" : "bg-primary"}>
                      {doc.isFreeConsultation ? "Cortesía" : "Con Costo"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pt-6 px-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary/60">
                      {doc.specialty}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-primary">{doc.user.name}</CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-6 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {doc.bioEs}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-primary/5">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Cirujano Certificado</span>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <Button 
                        className="flex-1 rounded-full bg-primary hover:bg-primary/90 gap-2"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsBookingOpen(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Agendar Cita
                      </Button>
                      {doc.cvUrl && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="rounded-full border-primary/20 text-primary hover:bg-primary/5"
                          onClick={() => window.open(doc.cvUrl, '_blank')}
                          title="Descargar CV"
                        >
                          <FileDown className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedDoctor && (
          <BookingForm 
            doctor={selectedDoctor} 
            isOpen={isBookingOpen} 
            onOpenChange={setIsBookingOpen} 
          />
        )}

        {!isLoading && filteredDoctors?.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-2xl font-display text-primary mb-2">No se encontraron especialistas</h3>
            <p className="text-muted-foreground">Intente con otros términos de búsqueda o filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Stethoscope, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 z-[1]" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            Turismo Médico Premium
          </span>
          <h1 className="text-6xl md:text-8xl font-display mb-6 drop-shadow-lg text-white">
            Turismo Médico Venezuela
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-sans max-w-2xl mx-auto opacity-95 leading-relaxed">
            Uniendo la excelencia quirúrgica con la hospitalidad de 5 estrellas en una experiencia 360°.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/doctors">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                Ver Especialistas
              </Button>
            </Link>
            <Link href="/notifications">
              <Button size="lg" variant="outline" className="text-white border-2 border-white/50 hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all hover:scale-105">
                Notificaciones de usuario
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Cirujanos Certificados", value: "50+" },
            { label: "Pacientes Satisfechos", value: "2k+" },
            { label: "Hoteles Aliados", value: "12" },
            { label: "Años de Experiencia", value: "15+" }
          ].map((stat, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-3xl font-display text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Experiencia Sculpture</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nuestra metodología integral asegura que cada etapa de su viaje sea manejada con precisión quirúrgica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="group hover-elevate border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
              <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardHeader className="pt-8 px-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Stethoscope className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-3">Especialistas Elite</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Acceso directo a los mejores cirujanos de Venezuela, seleccionados por sus certificaciones internacionales.
                </p>
                <ul className="space-y-3">
                  {["Bio Bilingüe", "Descarga de CV", "Galería de Resultados"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
              <div className="h-2 bg-secondary/20 group-hover:bg-secondary transition-colors" />
              <CardHeader className="pt-8 px-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Building2 className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl mb-3">Hospedaje de Lujo</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Su recuperación merece confort. Alianzas estratégicas con hoteles de 5 estrellas y servicios VIP.
                </p>
                <ul className="space-y-3">
                  {["Configurador Dinámico", "Plan de Comidas", "Estancia Flexible"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover-elevate border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
              <div className="h-2 bg-accent/20 group-hover:bg-accent transition-colors" />
              <CardHeader className="pt-8 px-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-3">Logística 360°</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Seguridad y transporte privado desde el aeropuerto hasta su retorno a casa. Sin preocupaciones.
                </p>
                <ul className="space-y-3">
                  {["Pick-up Aeropuerto", "Transporte Local", "Asistencia 24/7"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-6 text-white font-display">Inicie su Transformación Hoy</h2>
          <p className="text-xl opacity-90 mb-10 font-sans">
            Solicite una evaluación virtual con nuestros especialistas y reciba un presupuesto personalizado.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-10 py-7 text-xl rounded-full transition-transform hover:scale-105 shadow-2xl">
            Comenzar Proceso
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-display text-primary mb-2">TMV</h3>
            <p className="text-sm text-muted-foreground font-sans uppercase tracking-widest">Turismo Médico Venezuela</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Doctores</a>
            <a href="#" className="hover:text-primary transition-colors">Hoteles</a>
            <a href="#" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#" className="hover:text-primary transition-colors">Contacto</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 Sculpture. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

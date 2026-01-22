import { Activity, Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl text-white">TMV</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Conectando pacientes internacionales con la excelencia médica de Venezuela. Calidad, seguridad y confort en un solo lugar.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-white mb-6">Enlaces Rápidos</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
            <li><Link href="/doctors" className="hover:text-primary transition-colors">Especialistas</Link></li>
            <li><Link href="/hotels" className="hover:text-primary transition-colors">Hoteles Aliados</Link></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">Portal Pacientes</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Aviso Legal</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>Caracas, Venezuela<br/>Distrito Capital</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>+58 (212) 555-0199</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>contacto@tmv.com.ve</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <p className="flex items-center justify-center gap-2">
          © {new Date().getFullYear()} Turismo Médico Venezuela. Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by TMV Team.
        </p>
      </div>
    </footer>
  );
}

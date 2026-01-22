import { Link, useLocation } from 'wouter';
import { useLanguage } from './LanguageToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Activity, LayoutDashboard, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: t('Inicio', 'Home') },
    { href: '/doctors', label: t('Especialistas', 'Specialists') },
    { href: '/hotels', label: t('Alojamiento', 'Hotels') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tight text-primary leading-none">TMV</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Turismo Médico</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-gray-500'}`}>
                {link.label}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 mx-2" />
            
            <LanguageToggle />
            
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">{t('Acceder', 'Login')}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  {t('Registrarse', 'Sign Up')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="p-4 space-y-4">
              {links.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-600 hover:text-primary">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t('Idioma', 'Language')}</span>
                  <LanguageToggle />
                </div>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">{t('Acceder', 'Login')}</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary">{t('Registrarse', 'Sign Up')}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

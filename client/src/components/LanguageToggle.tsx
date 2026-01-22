import { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (es: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (es: string, en: string) => {
    return language === 'es' ? es : en;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="gap-2 font-medium text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors"
    >
      <Globe className="w-4 h-4" />
      {language.toUpperCase()}
    </Button>
  );
}

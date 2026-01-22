import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  const [lang, setLang] = useState("es");

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 rounded-full gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-medium text-xs uppercase">{lang}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLang("es")}>
            Español (ES)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang("en")}>
            English (EN)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

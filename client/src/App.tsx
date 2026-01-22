import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import DoctorDirectory from "@/pages/doctor-directory";
import QuotePage from "@/pages/quote-page";
import NotificationsPage from "@/pages/notifications";
import { LanguageSelector } from "@/components/language-selector";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/doctors" component={DoctorDirectory}/>
      <Route path="/quote/:id" component={QuotePage}/>
      <Route path="/notifications" component={NotificationsPage}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageSelector />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

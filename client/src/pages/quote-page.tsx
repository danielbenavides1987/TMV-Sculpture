import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@/lib/api";
import QuoteConfigurator from "@/components/quote-configurator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function QuotePage({ params }: { params: { id: string } }) {
  const quoteId = Number(params.id);

  const { data: quote, isLoading, error } = useQuery({
    queryKey: [buildUrl(api.quotes.get.path, { id: quoteId })],
  });

  if (isLoading) return <div className="p-20"><Skeleton className="h-[600px] w-full rounded-3xl" /></div>;

  if (error || !quote) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full border-none shadow-xl rounded-3xl">
          <CardContent className="pt-10 pb-10 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4 opacity-20" />
            <h2 className="text-2xl font-display text-primary mb-2">Presupuesto no encontrado</h2>
            <p className="text-muted-foreground">Lo sentimos, no pudimos localizar la cotización solicitada.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <QuoteConfigurator quoteId={quoteId} />;
}

import { TrendingUp, TrendingDown, IndianRupee, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/config";
import { useFavorites } from "@/hooks/use-favorites";

interface PredictionCardProps {
  prediction: number;
  ticker: string;
  previousPrice?: number;
}

export function PredictionCard({ prediction, ticker, previousPrice }: PredictionCardProps) {
  const change = previousPrice ? prediction - previousPrice : null;
  const changePercent = previousPrice ? ((change! / previousPrice) * 100) : null;
  const isPositive = change ? change > 0 : null;

  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(ticker);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Predicted Price for {ticker}
          <div
            role="button"
            className="cursor-pointer ml-1 text-primary hover:opacity-80"
            onClick={() => toggleFavorite({ symbol: ticker, name: ticker })}
          >
            <Star className={`h-4 w-4 ${isFav ? 'fill-primary' : ''}`} />
          </div>
        </CardTitle>
        <IndianRupee className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {APP_CONFIG.currencySymbol}{prediction.toFixed(2)}
        </div>
        {change !== null && changePercent !== null && (
          <div className={`flex items-center gap-1 text-sm mt-1 ${isPositive ? 'text-success' : 'text-destructive'
            }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {isPositive ? '+' : ''}{APP_CONFIG.currencySymbol}{change.toFixed(2)} ({changePercent.toFixed(1)}%)
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Next-day prediction based on historical data
        </p>
      </CardContent>
    </Card>
  );
}
import { TrendingUp, TrendingDown, Star } from "lucide-react";
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
    <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        {isPositive || isPositive === null ? (
          <TrendingUp className="w-24 h-24 text-on-surface" />
        ) : (
          <TrendingDown className="w-24 h-24 text-on-surface" />
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">
          Price Prediction for {ticker}
        </p>
        <button
          className="p-2 transition-colors hover:bg-white/5 rounded-full"
          onClick={() => toggleFavorite({ symbol: ticker, name: ticker })}
        >
          <Star className={`h-5 w-5 ${isFav ? 'fill-primary text-primary' : 'text-on-surface-variant'}`} />
        </button>
      </div>

      <div className="mb-8">
        <h4 className="text-on-surface-variant text-sm font-medium mb-1">Predicted Value</h4>
        <p className="font-headline text-5xl font-black text-on-surface">
          {APP_CONFIG.currencySymbol}{prediction.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-secondary-container/20 rounded-xl border border-secondary/20 mt-auto">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-on-surface-variant">
            Outlook
          </p>
          {change !== null && changePercent !== null ? (
            <div className={`flex items-center gap-2 font-headline text-xl font-bold ${isPositive ? 'text-secondary' : 'text-tertiary'}`}>
              {isPositive ? "Bullish" : "Bearish"}
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
          ) : (
            <div className="font-headline text-xl font-bold text-on-surface">Calculating...</div>
          )}
        </div>

        {change !== null && changePercent !== null && (
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-on-surface-variant">
              Delta
            </p>
            <p className={`font-headline text-xl font-bold ${isPositive ? 'text-secondary' : 'text-tertiary'}`}>
              {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">Timeframe</span>
          <span className="font-bold text-on-surface">Next 7 Days</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant">AI Reliability</span>
          <span className="text-primary font-bold">Historical Base</span>
        </div>
      </div>
    </div>
  );
}
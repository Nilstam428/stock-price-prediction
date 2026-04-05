import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentSearchesProps {
  recentTickers: string[];
  onTickerSelect: (ticker: string) => void;
  onClear?: () => void;
}

export function RecentSearches({ recentTickers, onTickerSelect, onClear }: RecentSearchesProps) {
  if (recentTickers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-headline font-bold text-on-surface">Recently Observed</h3>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            Clear History
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {recentTickers.slice(0, 4).map((tickerStr) => {
          // tickerStr format is often "Company Name - TICKER" or just ticker
          const parts = tickerStr.split("–");
          const symbol = parts.length > 1 ? parts.pop()?.trim() || tickerStr : tickerStr;
          const name = parts.length > 1 ? parts[0].trim() : symbol;

          return (
            <div
              key={tickerStr}
              onClick={() => onTickerSelect(symbol)}
              className="flex items-center justify-between p-4 bg-surface-container-low border border-white/5 rounded-xl group hover:border-primary/50 hover:bg-surface-container transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center font-bold text-primary text-xl">
                  {symbol.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface truncate max-w-[150px] sm:max-w-xs">{name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">{symbol} • Equity</p>
                </div>
              </div>

              {/* Decorative mini chart */}
              <div className="h-10 w-24 hidden sm:flex items-end gap-1 px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-1 bg-primary/40 rounded-full h-[40%]"></div>
                <div className="w-1 bg-primary/60 rounded-full h-[60%]"></div>
                <div className="w-1 bg-primary/40 rounded-full h-[30%]"></div>
                <div className="w-1 bg-primary rounded-full h-[80%]"></div>
                <div className="w-1 bg-primary/80 rounded-full h-[50%]"></div>
              </div>

              <div className="text-right flex flex-col justify-center items-end hidden sm:flex">
                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  Select
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { PredictionCard } from "./PredictionCard";
import { StockChart } from "./StockChart";
import { RecentSearches } from "./RecentSearches";

export function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchParams] = useSearchParams();

  const [prediction, setPrediction] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ name: string; price: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentTickers, setRecentTickers] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recent-tickers");
    if (saved) setRecentTickers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.toUpperCase() !== ticker.toUpperCase() && !loading) {
      setSearch(q);
      fetchPrediction(q);
    }
  }, [searchParams]);

  const saveToRecent = (display: string, symbol: string) => {
    const entry = `${display} – ${symbol.toUpperCase()}`;
    const updated = [entry, ...recentTickers.filter((t) => t !== entry)].slice(0, 5);
    setRecentTickers(updated);
    localStorage.setItem("recent-tickers", JSON.stringify(updated));
  };


  const clearRecent = () => {
    setRecentTickers([]);
    localStorage.removeItem("recent-tickers");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!search || search.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        const url = `http://127.0.0.1:5000/search?q=${encodeURIComponent(search)}`;
        const res = await fetch(url);
        const data = await res.json();
        const quotes = data.quotes || [];
        setSuggestions(quotes);
        setShowDropdown(quotes.length > 0);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [search]);

  const handleSelect = (symbol: string, name?: string) => {
    const symbolUpper = symbol.toUpperCase();
    const display = name && name !== symbol ? name : symbolUpper;

    setTicker(symbolUpper);
    setSearch(`${display} – ${symbolUpper}`);
    setShowDropdown(false);

    fetchPrediction(symbolUpper, display);
    saveToRecent(display, symbolUpper);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const first = suggestions[0];
        handleSelect(first.symbol, first.shortname || first.symbol);
      } else if (search.trim()) {
        setTicker(search.trim().toUpperCase());
        fetchPrediction(search.trim());
      }
    }
  };

  const fetchPrediction = async (tickerSymbol?: string, displayName?: string) => {
    let targetTicker = tickerSymbol || ticker;
    if (!targetTicker) return;

    setLoading(true);
    setError("");
    setPrediction(null);
    setHistory([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: targetTicker }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setHistory(data.recent_history || []);
      setTicker(targetTicker.toUpperCase());

      const symbolUpper = targetTicker.toUpperCase();
      const display = displayName && displayName !== symbolUpper ? displayName : symbolUpper;

      setSearch(`${display} – ${symbolUpper}`);
      saveToRecent(display, symbolUpper);
    } catch (err) {
      console.error("Prediction error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setShowDropdown(false);
    }
  };

  const getPreviousPrice = () =>
    history.length > 0 ? history[history.length - 1].price : undefined;

  return (
    <div className="flex-1 p-8 space-y-12">
      {/* Hero: Market Prediction Engine */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary">Market Pulse</h2>
            <p className="text-on-surface-variant max-w-xl">Leveraging neural-temporal modeling to anticipate the next 24 hours of global equity flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[300px]">
            {/* If prediction implies we should show it instead, we can inject it inline, or keep Market Overview Cards temporarily */}
            {prediction !== null ? (
              <PredictionCard
                prediction={prediction}
                ticker={ticker}
                previousPrice={getPreviousPrice()}
              />
            ) : (
              <>
                <div className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group border border-white/5 shadow-sm">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="material-symbols-outlined text-secondary opacity-40 group-hover:opacity-100 transition-opacity">trending_up</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">Index Alpha</span>
                      <h3 className="text-2xl font-headline font-bold text-on-surface">S&P 500</h3>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-headline font-bold text-on-surface">5,241.53</span>
                      <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-bold mb-1">+1.24%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-gradient-to-r from-primary to-primary-container"></div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-medium">Prediction Confidence: <span className="text-primary font-bold">88%</span></p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-6 relative overflow-hidden group border border-white/5 shadow-sm">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="material-symbols-outlined text-tertiary opacity-40 group-hover:opacity-100 transition-opacity">trending_down</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest font-bold">Tech Index</span>
                      <h3 className="text-2xl font-headline font-bold text-on-surface">NASDAQ 100</h3>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="text-3xl font-headline font-bold text-on-surface">18,307.98</span>
                      <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full text-xs font-bold mb-1">-0.42%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full w-[42%] bg-surface-container-high"></div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-medium">Prediction Confidence: <span className="text-primary font-bold">74%</span></p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Prediction Input Card */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="bg-surface-container p-8 rounded-3xl h-full min-h-[300px] flex flex-col border border-white/5 shadow-sm">
            <div className="space-y-4">
              <h4 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Quick Predict
              </h4>
              <p className="text-sm text-on-surface-variant">Input a ticker symbol to run a 7-day volatility analysis.</p>
            </div>
            <div className="mt-8 space-y-4 flex-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search.trim()) fetchPrediction(search.trim());
                }}
                className="relative"
              >
                <input
                  className="w-full bg-surface border-none rounded-xl py-4 px-6 text-lg font-headline font-bold placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary transition-all shadow-sm text-on-surface"
                  placeholder="Ticker (e.g. NVDA)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowDropdown(suggestions.length > 0)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="submit"
                  disabled={loading || !search.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary-container p-3 rounded-lg text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">auto_graph</span>
                  )}
                </button>

                {/* Autocomplete Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 bg-surface-container-low border border-white/10 rounded-xl shadow-2xl w-full mt-2 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((s) => (
                      <div
                        key={s.symbol + (s.exchange || "")}
                        onClick={() => handleSelect(s.symbol, s.shortname || s.symbol)}
                        className="p-3 text-sm cursor-pointer hover:bg-surface-container-high transition-colors flex justify-between"
                      >
                        <div>
                          <div className="font-bold text-on-surface">{s.shortname || s.symbol}</div>
                          <div className="text-xs text-primary">{s.symbol}</div>
                        </div>
                        <div className="text-xs text-on-surface-variant text-right">{s.exchange}</div>
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {error && (
                <div className="p-3 rounded-xl bg-tertiary/10 border border-tertiary/20 text-sm text-tertiary font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4">
                <span onClick={() => fetchPrediction('AAPL')} className="bg-surface text-[10px] font-bold px-3 py-1 rounded-full text-on-surface-variant cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">AAPL</span>
                <span onClick={() => fetchPrediction('TSLA')} className="bg-surface text-[10px] font-bold px-3 py-1 rounded-full text-on-surface-variant cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">TSLA</span>
                <span onClick={() => fetchPrediction('MSFT')} className="bg-surface text-[10px] font-bold px-3 py-1 rounded-full text-on-surface-variant cursor-pointer hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">MSFT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chart and History Section */}
      {history.length > 0 && (
        <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-sm">
          <h3 className="font-headline text-3xl font-bold text-on-surface mb-8">Historical Convergence</h3>
          <StockChart data={history} ticker={ticker} />
        </section>
      )}

      {/* Secondary: Dynamic Lists & Explainer */}
      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7">
          <RecentSearches
            recentTickers={recentTickers}
            onTickerSelect={(t) => fetchPrediction(t)}
            onClear={clearRecent}
          />
        </div>

        <div className="col-span-12 md:col-span-5 space-y-6">
          <h3 className="text-2xl font-headline font-bold px-2 text-on-surface">Editorial Sentiment</h3>
          <div className="bg-surface-container-low rounded-3xl overflow-hidden flex flex-col border border-white/5 shadow-sm">
            <div className="h-48 w-full relative">
              <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Financial abstract" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="bg-primary/20 text-primary-container text-[10px] font-bold px-3 py-1 rounded-lg border border-primary/20 backdrop-blur-md">TREND ANALYSIS</span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h4 className="text-xl font-headline font-bold text-on-surface">The Quiet Bull: Why Semiconductors Defy Expectations</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Our latest algorithmic deep-dive suggests that current resistance levels in the chip sector are illusory. Expect a pivot toward high-density memory providers by Thursday morning...</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
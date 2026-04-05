import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/config";

interface StockChartProps {
  data: Array<{ name: string; price: number }>;
  ticker: string;
}

export function StockChart({ data, ticker }: StockChartProps) {
  const formatTooltip = (value: any, name: string) => {
    return [`${APP_CONFIG.currencySymbol}${Number(value).toFixed(2)}`, 'Price'];
  };

  const formatDate = (tickItem: string) => {
    // Assuming the name is in YYYY-MM-DD format, show only MM-DD
    if (tickItem.includes('-')) {
      return tickItem.slice(5); // Remove YYYY- part
    }
    return tickItem;
  };

  return (
    <div className="w-full flex-1">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-normal text-on-surface-variant font-body">
          Ticker ({ticker})
        </span>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--on-surface-variant)" }}
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              stroke="var(--outline)"
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 12, fill: "var(--on-surface-variant)" }}
              tickFormatter={(value) => `${APP_CONFIG.currencySymbol}${value.toFixed(0)}`}
              stroke="var(--outline)"
            />
            <Tooltip
              formatter={formatTooltip}
              labelStyle={{ color: 'var(--on-background)' }}
              contentStyle={{
                backgroundColor: 'var(--surface-container-high)',
                border: '1px solid var(--outline)',
                borderRadius: '12px',
                color: 'var(--on-surface)'
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--surface)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
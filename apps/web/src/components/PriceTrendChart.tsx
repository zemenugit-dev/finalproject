
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface PriceTrend {
  date: string;
  price: number;
}

interface PriceTrendChartProps {
  data?: PriceTrend[];
  title?: string;
}

const sampleData: PriceTrend[] = [
  { date: 'Oct 14', price: 45 },
  { date: 'Oct 15', price: 48 },
  { date: 'Oct 16', price: 46 },
  { date: 'Oct 17', price: 52 },
  { date: 'Oct 18', price: 55 },
  { date: 'Oct 19', price: 53 },
  { date: 'Oct 20', price: 60 },
];

export default function PriceTrendChart({
  data = sampleData,
  title = 'Market Price Trend',
}: PriceTrendChartProps) {
  return (
    <section
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
      }}
    >
      <h2
        style={{
          margin: '0 0 20px',
          color: '#111827',
          fontSize: '20px',
          fontWeight: 600,
        }}
      >
        {title}
      </h2>

      {data.length === 0 ? (
        <p style={{ color: '#6b7280' }}>
          No market price data available.
        </p>
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={false}
              />

              <YAxis
                width={75}
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `${value} ETB`}
              />

              <Tooltip
                formatter={(value) => [
                  `${value} ETB`,
                  'Price per unit',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                name="Market Price"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4, fill: '#16a34a' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={{ marginBottom: 0, color: '#6b7280', fontSize: '12px' }}>
        Prices are displayed in Ethiopian Birr (ETB).
      </p>
    </section>
  );
}

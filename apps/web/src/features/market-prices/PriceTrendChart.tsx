
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceTrend {
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
    <div
      style={{
        width: '100%',
        padding: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: '20px' }}>
        {title}
      </h2>

      {data.length === 0 ? (
        <p>No price data available.</p>
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value: number) => `${value} ETB`}
              />
              <Tooltip
                formatter={(value) => [`${value} ETB`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                name="Market Price"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

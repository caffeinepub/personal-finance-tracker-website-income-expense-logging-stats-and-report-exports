import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionType } from '../../backend';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface MonthlyTrendChartProps {
  transactions: Transaction[];
}

export default function MonthlyTrendChart({ transactions }: MonthlyTrendChartProps) {
  // Group transactions by month
  const monthlyData = new Map<string, { income: number; expense: number }>();

  transactions.forEach(t => {
    const date = new Date(Number(t.date / BigInt(1_000_000)));
    const monthKey = format(date, 'yyyy-MM');
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { income: 0, expense: 0 });
    }
    
    const data = monthlyData.get(monthKey)!;
    if (t.transactionType === TransactionType.income) {
      data.income += Number(t.amount) / 100;
    } else {
      data.expense += Number(t.amount) / 100;
    }
  });

  // Convert to array and sort by date
  const chartData = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month: format(new Date(month + '-01'), 'MMM yyyy'),
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No data available for the selected date range
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => formatINR(value)}
            />
            <Legend />
            <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" />
            <Bar dataKey="expense" fill="hsl(var(--chart-1))" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

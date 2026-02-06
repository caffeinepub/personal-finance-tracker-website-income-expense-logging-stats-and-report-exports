import { useState } from 'react';
import { useGetUserTransactions } from '../../hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import MonthlyTrendChart from './MonthlyTrendChart';
import CategoryBreakdownPanel from './CategoryBreakdownPanel';
import { formatCurrency } from '../../utils/formatters';
import { startOfDay, endOfDay, subMonths } from 'date-fns';
import { TransactionType } from '../../backend';

export default function DashboardPage() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  
  // Default to last 6 months
  const defaultStart = subMonths(new Date(), 6);
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter transactions by date range
  const startTime = BigInt(startOfDay(new Date(startDate)).getTime()) * BigInt(1_000_000);
  const endTime = BigInt(endOfDay(new Date(endDate)).getTime()) * BigInt(1_000_000);
  
  const filteredTransactions = transactions.filter(
    t => t.date >= startTime && t.date <= endTime
  );

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.transactionType === TransactionType.income)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.transactionType === TransactionType.expense)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your financial activity</p>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">
              {formatCurrency(BigInt(totalIncome))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {formatCurrency(BigInt(totalExpenses))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-chart-2' : 'text-chart-1'}`}>
              {netAmount >= 0 ? '+' : '−'}
              {formatCurrency(BigInt(Math.abs(netAmount)))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <MonthlyTrendChart transactions={filteredTransactions} />

      {/* Category Breakdown */}
      <CategoryBreakdownPanel transactions={filteredTransactions} />
    </div>
  );
}

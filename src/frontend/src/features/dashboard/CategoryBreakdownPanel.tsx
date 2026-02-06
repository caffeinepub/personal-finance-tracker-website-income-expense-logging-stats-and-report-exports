import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Category, TransactionType } from '../../backend';
import { formatCurrency, formatCategory } from '../../utils/formatters';
import { Progress } from '@/components/ui/progress';

interface CategoryBreakdownPanelProps {
  transactions: Transaction[];
}

export default function CategoryBreakdownPanel({ transactions }: CategoryBreakdownPanelProps) {
  // Calculate category totals for expenses
  const categoryTotals = new Map<Category, number>();
  let totalExpenses = 0;

  transactions
    .filter(t => t.transactionType === TransactionType.expense)
    .forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      const amount = Number(t.amount);
      categoryTotals.set(t.category, current + amount);
      totalExpenses += amount;
    });

  // Convert to array and sort by amount
  const categoryData = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No expense data available for the selected date range
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map(({ category, amount, percentage }) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{formatCategory(category)}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(BigInt(amount))} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

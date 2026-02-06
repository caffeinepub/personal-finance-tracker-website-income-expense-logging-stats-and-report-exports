import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction, TransactionType } from '../../backend';
import { formatCurrency, formatCategory, formatDate } from '../../utils/formatters';
import { format } from 'date-fns';

interface PrintableReportProps {
  transactions: Transaction[];
  startDate: string;
  endDate: string;
}

export default function PrintableReport({ transactions, startDate, endDate }: PrintableReportProps) {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.transactionType === TransactionType.income)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.transactionType === TransactionType.expense)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => Number(b.date - a.date));

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No transactions found for the selected date range
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Report Header */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-2xl print:text-xl">Financial Report</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(startDate), 'MMM d, yyyy')} - {format(new Date(endDate), 'MMM d, yyyy')}
          </p>
        </CardHeader>
      </Card>

      {/* Summary Section */}
      <Card className="print:shadow-none print:border">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-chart-2 print:text-xl">
                {formatCurrency(BigInt(totalIncome))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-chart-1 print:text-xl">
                {formatCurrency(BigInt(totalExpenses))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Amount</p>
              <p className={`text-2xl font-bold print:text-xl ${netAmount >= 0 ? 'text-chart-2' : 'text-chart-1'}`}>
                {netAmount >= 0 ? '+' : '−'}
                {formatCurrency(BigInt(Math.abs(netAmount)))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="print:shadow-none print:border">
        <CardHeader className="print:pb-2">
          <CardTitle className="text-lg">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border print:border-gray-300">
            <Table>
              <TableHeader>
                <TableRow className="print:border-gray-300">
                  <TableHead className="print:text-xs">Date</TableHead>
                  <TableHead className="print:text-xs">Type</TableHead>
                  <TableHead className="print:text-xs">Category</TableHead>
                  <TableHead className="print:text-xs">Description</TableHead>
                  <TableHead className="text-right print:text-xs">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.transactionId.toString()} className="print:border-gray-300">
                    <TableCell className="print:text-xs print:py-1">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="print:text-xs print:py-1">
                      {transaction.transactionType}
                    </TableCell>
                    <TableCell className="print:text-xs print:py-1">
                      {formatCategory(transaction.category)}
                    </TableCell>
                    <TableCell className="print:text-xs print:py-1">
                      {transaction.description || '—'}
                    </TableCell>
                    <TableCell className="text-right print:text-xs print:py-1">
                      <span className={transaction.transactionType === TransactionType.income ? 'text-chart-2' : 'text-foreground'}>
                        {transaction.transactionType === TransactionType.income ? '+' : '−'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

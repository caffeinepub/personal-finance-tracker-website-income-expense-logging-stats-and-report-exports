import { useState } from 'react';
import { useDeleteTransaction } from '../../hooks/useTransactions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction, TransactionType } from '../../backend';
import { formatCurrency, formatCategory, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionsTable({ transactions, onEdit }: TransactionsTableProps) {
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteTransaction.mutateAsync(deleteId);
      toast.success('Transaction deleted successfully!');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete transaction. Please try again.');
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionId.toString()}>
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.transactionType === TransactionType.income ? 'default' : 'secondary'}>
                    {transaction.transactionType}
                  </Badge>
                </TableCell>
                <TableCell>{formatCategory(transaction.category)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description || '—'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className={transaction.transactionType === TransactionType.income ? 'text-chart-2' : 'text-foreground'}>
                    {transaction.transactionType === TransactionType.income ? '+' : '−'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(transaction.transactionId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

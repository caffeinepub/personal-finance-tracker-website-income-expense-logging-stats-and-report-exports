import { useState } from 'react';
import { useGetUserTransactions } from '../../hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import TransactionFormDialog from './TransactionFormDialog';
import TransactionsTable from './TransactionsTable';
import TransactionFilters from './TransactionFilters';
import { Transaction, TransactionType, Category } from '../../backend';
import { startOfDay, endOfDay } from 'date-fns';

export default function TransactionsPage() {
  const { data: transactions = [], isLoading, error } = useGetUserTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Apply filters
  let filteredTransactions = [...transactions];

  if (typeFilter !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.transactionType === typeFilter);
  }

  if (categoryFilter !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
  }

  if (startDate) {
    const startTime = BigInt(startOfDay(new Date(startDate)).getTime()) * BigInt(1_000_000);
    filteredTransactions = filteredTransactions.filter(t => t.date >= startTime);
  }

  if (endDate) {
    const endTime = BigInt(endOfDay(new Date(endDate)).getTime()) * BigInt(1_000_000);
    filteredTransactions = filteredTransactions.filter(t => t.date <= endTime);
  }

  // Apply sorting
  filteredTransactions.sort((a, b) => {
    if (sortBy === 'date') {
      const diff = Number(a.date - b.date);
      return sortOrder === 'asc' ? diff : -diff;
    } else {
      const diff = Number(a.amount - b.amount);
      return sortOrder === 'asc' ? diff : -diff;
    }
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Manage your income and expenses</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {showFilters && (
        <TransactionFilters
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          startDate={startDate}
          endDate={endDate}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onTypeFilterChange={setTypeFilter}
          onCategoryFilterChange={setCategoryFilter}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <p className="text-muted-foreground mb-4">
            {transactions.length === 0 
              ? 'No transactions yet. Add your first transaction to get started!'
              : 'No transactions match your filters.'}
          </p>
          {transactions.length === 0 && (
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          )}
        </div>
      ) : (
        <TransactionsTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
        />
      )}

      <TransactionFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        transaction={editingTransaction}
      />
    </div>
  );
}

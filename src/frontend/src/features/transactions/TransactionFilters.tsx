import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TransactionType, Category } from '../../backend';
import { Card } from '@/components/ui/card';

interface TransactionFiltersProps {
  typeFilter: TransactionType | 'all';
  categoryFilter: Category | 'all';
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onTypeFilterChange: (value: TransactionType | 'all') => void;
  onCategoryFilterChange: (value: Category | 'all') => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSortByChange: (value: 'date' | 'amount') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export default function TransactionFilters({
  typeFilter,
  categoryFilter,
  startDate,
  endDate,
  sortBy,
  sortOrder,
  onTypeFilterChange,
  onCategoryFilterChange,
  onStartDateChange,
  onEndDateChange,
  onSortByChange,
  onSortOrderChange,
}: TransactionFiltersProps) {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={TransactionType.income}>Income</SelectItem>
              <SelectItem value={TransactionType.expense}>Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value={Category.food}>Food</SelectItem>
              <SelectItem value={Category.transport}>Transport</SelectItem>
              <SelectItem value={Category.salary}>Salary</SelectItem>
              <SelectItem value={Category.utilities}>Utilities</SelectItem>
              <SelectItem value={Category.entertainment}>Entertainment</SelectItem>
              <SelectItem value={Category.other}>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Order</Label>
          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

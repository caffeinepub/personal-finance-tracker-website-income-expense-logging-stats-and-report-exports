import { useState, useEffect } from 'react';
import { useAddTransaction, useUpdateTransaction } from '../../hooks/useTransactions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Transaction, TransactionType, Category } from '../../backend';
import { formatDateForInput, parseInputDate } from '../../utils/financeTime';

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'EUR', name: 'Euro (€)', symbol: '€' },
  { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham (د.إ)', symbol: 'د.إ' },
];

export default function TransactionFormDialog({ open, onClose, transaction }: TransactionFormDialogProps) {
  const [date, setDate] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.expense);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [customCurrencyCode, setCustomCurrencyCode] = useState('');
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [category, setCategory] = useState<Category>(Category.other);
  const [description, setDescription] = useState('');

  const addTransaction = useAddTransaction();
  const updateTransaction = useUpdateTransaction();

  useEffect(() => {
    if (transaction) {
      setDate(formatDateForInput(transaction.date));
      setType(transaction.transactionType);
      setAmount((Number(transaction.amount) / 100).toFixed(2));
      setCurrency('INR'); // Stored transactions are always in INR
      setCustomCurrencyCode('');
      setCustomCurrencySymbol('');
      setExchangeRate('');
      setCategory(transaction.category);
      setDescription(transaction.description);
    } else {
      setDate(formatDateForInput(BigInt(Date.now()) * BigInt(1_000_000)));
      setType(TransactionType.expense);
      setAmount('');
      setCurrency('INR');
      setCustomCurrencyCode('');
      setCustomCurrencySymbol('');
      setExchangeRate('');
      setCategory(Category.other);
      setDescription('');
    }
  }, [transaction, open]);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    // Clear exchange rate when switching to INR
    if (newCurrency === 'INR') {
      setExchangeRate('');
    }
    // Clear custom currency fields when switching away from Custom
    if (newCurrency !== 'CUSTOM') {
      setCustomCurrencyCode('');
      setCustomCurrencySymbol('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    // Validate custom currency fields if Custom is selected
    if (currency === 'CUSTOM') {
      if (!customCurrencyCode.trim()) {
        toast.error('Please enter a currency code or name');
        return;
      }
    }

    // Validate exchange rate if currency is not INR
    if (currency !== 'INR') {
      const rateNum = parseFloat(exchangeRate);
      if (isNaN(rateNum) || rateNum <= 0) {
        toast.error('Please enter a valid exchange rate greater than 0');
        return;
      }
    }

    try {
      // Convert to INR if needed
      let amountInINR = amountNum;
      if (currency !== 'INR') {
        const rateNum = parseFloat(exchangeRate);
        amountInINR = amountNum * rateNum;
      }

      const amountInPaise = BigInt(Math.round(amountInINR * 100));
      const dateTime = parseInputDate(date);

      const transactionData = {
        amount: amountInPaise,
        date: dateTime,
        transactionType: type,
        category,
        description,
      };

      if (transaction) {
        await updateTransaction.mutateAsync({
          transactionId: transaction.transactionId,
          data: transactionData,
        });
        toast.success('Transaction updated successfully!');
      } else {
        await addTransaction.mutateAsync(transactionData);
        toast.success('Transaction added successfully!');
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to save transaction. ${errorMessage}`);
      console.error('Transaction save error:', error);
    }
  };

  const isCustomCurrency = currency === 'CUSTOM';
  const selectedCurrency = isCustomCurrency 
    ? { code: customCurrencyCode || 'Custom', symbol: customCurrencySymbol || '' }
    : CURRENCIES.find(c => c.code === currency);
  const showExchangeRate = currency !== 'INR';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Update the transaction details below.' : 'Enter the transaction details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionType.income}>Income</SelectItem>
                <SelectItem value={TransactionType.expense}>Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name}
                  </SelectItem>
                ))}
                <SelectItem value="CUSTOM">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustomCurrency && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customCurrencyCode">Currency Code/Name</Label>
                <Input
                  id="customCurrencyCode"
                  type="text"
                  placeholder="e.g., SGD or Singapore Dollar"
                  value={customCurrencyCode}
                  onChange={(e) => setCustomCurrencyCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCurrencySymbol">Currency Symbol (Optional)</Label>
                <Input
                  id="customCurrencySymbol"
                  type="text"
                  placeholder="e.g., S$"
                  value={customCurrencySymbol}
                  onChange={(e) => setCustomCurrencySymbol(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount {selectedCurrency && selectedCurrency.symbol && `(${selectedCurrency.symbol})`}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {showExchangeRate && (
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">
                Exchange Rate (1 {isCustomCurrency ? (customCurrencyCode || 'unit') : currency} = ? INR)
              </Label>
              <Input
                id="exchangeRate"
                type="number"
                step="0.0001"
                min="0.0001"
                placeholder="e.g., 83.50"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                required
              />
              {amount && exchangeRate && parseFloat(amount) > 0 && parseFloat(exchangeRate) > 0 && (
                <p className="text-sm text-muted-foreground">
                  ≈ ₹{(parseFloat(amount) * parseFloat(exchangeRate)).toFixed(2)} INR
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addTransaction.isPending || updateTransaction.isPending}>
              {addTransaction.isPending || updateTransaction.isPending
                ? 'Saving...'
                : transaction
                ? 'Update'
                : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

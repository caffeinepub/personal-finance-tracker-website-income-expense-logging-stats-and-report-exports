import { Category } from '../backend';
import { format } from 'date-fns';

/**
 * Format amount (in paise) as INR currency
 */
export function formatCurrency(amount: bigint): string {
  const rupees = Number(amount) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(rupees);
}

/**
 * Format category enum as readable string
 */
export function formatCategory(category: Category): string {
  const categoryMap: Record<Category, string> = {
    food: 'Food',
    transport: 'Transport',
    salary: 'Salary',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    other: 'Other',
  };
  return categoryMap[category] || category;
}

/**
 * Format backend Time (nanoseconds) as readable date
 */
export function formatDate(time: bigint): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return format(date, 'MMM d, yyyy');
}

/**
 * Format backend Time (nanoseconds) as readable date and time
 */
export function formatDateTime(time: bigint): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return format(date, 'MMM d, yyyy h:mm a');
}

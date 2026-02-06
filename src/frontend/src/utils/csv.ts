import { Transaction } from '../backend';
import { formatDate, formatCategory } from './formatters';

/**
 * Generate CSV content from transactions
 * Column order: Date, Type, Amount (INR), Category, Description
 */
export function generateCSV(transactions: Transaction[]): string {
  // CSV header with INR label
  const header = 'Date,Type,Amount (INR),Category,Description\n';
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => Number(b.date - a.date));
  
  // Generate rows
  const rows = sortedTransactions.map(t => {
    const date = formatDate(t.date);
    const type = t.transactionType;
    const amount = (Number(t.amount) / 100).toFixed(2);
    const category = formatCategory(t.category);
    const description = escapeCSV(t.description);
    
    return `${date},${type},${amount},${category},${description}`;
  }).join('\n');
  
  return header + rows;
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSV(field: string): string {
  if (!field) return '';
  
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  
  return field;
}

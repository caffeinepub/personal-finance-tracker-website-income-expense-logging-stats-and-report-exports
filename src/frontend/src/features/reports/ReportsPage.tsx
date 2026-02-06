import { useState } from 'react';
import { useGetUserTransactions } from '../../hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Printer, Download } from 'lucide-react';
import PrintableReport from './PrintableReport';
import { generateCSV } from '../../utils/csv';
import { toast } from 'sonner';
import { startOfDay, endOfDay, subMonths } from 'date-fns';

export default function ReportsPage() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  
  // Default to last month
  const defaultStart = subMonths(new Date(), 1);
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter transactions by date range
  const startTime = BigInt(startOfDay(new Date(startDate)).getTime()) * BigInt(1_000_000);
  const endTime = BigInt(endOfDay(new Date(endDate)).getTime()) * BigInt(1_000_000);
  
  const filteredTransactions = transactions.filter(
    t => t.date >= startTime && t.date <= endTime
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    try {
      const csv = generateCSV(filteredTransactions);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_${startDate}_to_${endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">Generate and export financial reports</p>
      </div>

      {/* Date Range Selector */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-start-date">Start Date</Label>
                <Input
                  id="report-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-end-date">End Date</Label>
                <Input
                  id="report-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handlePrint} disabled={filteredTransactions.length === 0}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                disabled={filteredTransactions.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Printable Report */}
      <PrintableReport
        transactions={filteredTransactions}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

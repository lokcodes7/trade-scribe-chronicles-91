
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrade } from '@/contexts/TradeContext';
import { formatCurrency } from '@/lib/formatters';

interface DailyTradesSummaryProps {
  date: Date;
}

const DailyTradesSummary: React.FC<DailyTradesSummaryProps> = ({ date }) => {
  const { getDailySummary } = useTrade();
  const summary = getDailySummary(date);

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No trades recorded for this date</p>
        </CardContent>
      </Card>
    );
  }

  const { totalTrades, pnl, winRate } = summary;

  return (
    <Card className="animate-fade-in-down">
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-md bg-muted flex flex-col items-center">
            <span className="text-sm font-medium text-muted-foreground">Total Trades</span>
            <span className="text-2xl font-bold">{totalTrades}</span>
          </div>
          
          <div className={`p-4 rounded-md ${pnl >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'} flex flex-col items-center`}>
            <span className="text-sm font-medium text-muted-foreground">Daily P&L</span>
            <span className={`text-2xl font-bold ${pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(pnl)}
            </span>
          </div>
          
          <div className="p-4 rounded-md bg-muted flex flex-col items-center">
            <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
            <span className="text-2xl font-bold">{winRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTradesSummary;

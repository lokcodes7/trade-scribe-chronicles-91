
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTrade } from '@/contexts/TradeContext';
import { Button } from '@/components/ui/button';

interface MonthGridProps {
  selectedYear: number;
  onSelectMonth: (month: number) => void;
}

const MonthGrid: React.FC<MonthGridProps> = ({ selectedYear, onSelectMonth }) => {
  const { getMonthsWithTradesForYear } = useTrade();
  const monthsWithTrades = getMonthsWithTradesForYear(selectedYear);
  
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div className="animate-fade-in-down">
      <h3 className="text-lg font-medium mb-4">Select Month for {selectedYear}</h3>
      <div className="month-grid">
        {months.map((month, index) => (
          <Card 
            key={month}
            className={`cursor-pointer transform transition-all hover:scale-105 ${
              monthsWithTrades.includes(index) ? 'border-trader-accent' : ''
            }`}
            onClick={() => onSelectMonth(index)}
          >
            <CardContent className="p-4 flex items-center justify-center">
              <span className="text-lg">{month}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonthGrid;

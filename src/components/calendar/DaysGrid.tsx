
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTrade } from '@/contexts/TradeContext';
import { Badge } from '@/components/ui/badge';

interface DaysGridProps {
  selectedYear: number;
  selectedMonth: number;
  onSelectDay: (day: number) => void;
  onBack: () => void;
}

const DaysGrid: React.FC<DaysGridProps> = ({ 
  selectedYear, 
  selectedMonth, 
  onSelectDay,
  onBack
}) => {
  const { getDaysWithTradesForMonth } = useTrade();
  const daysWithTrades = getDaysWithTradesForMonth(selectedYear, selectedMonth);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-4 animate-fade-in-down">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {months[selectedMonth]} {selectedYear}
        </h3>
        <Button variant="outline" onClick={onBack}>
          Back to Months
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayLabels.map(day => (
          <div key={day} className="text-center font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <Card 
            key={index} 
            className={`${!day ? 'invisible' : 'cursor-pointer hover:bg-muted'} ${
              daysWithTrades.includes(day as number) ? 'border-trader-accent' : ''
            }`}
            onClick={() => day && onSelectDay(day)}
          >
            <CardContent className="p-2 text-center relative">
              {day}
              {daysWithTrades.includes(day as number) && (
                <Badge className="absolute -top-2 -right-2 bg-trader-accent">
                  •
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DaysGrid;

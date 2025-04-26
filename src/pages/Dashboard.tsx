
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import YearSelector from '@/components/calendar/YearSelector';
import MonthGrid from '@/components/calendar/MonthGrid';
import DaysGrid from '@/components/calendar/DaysGrid';
import DailyTradesSummary from '@/components/trading/DailyTradesSummary';
import TradesList from '@/components/trading/TradesList';
import TradeDetails from '@/components/trading/TradeDetails';
import AddTradeForm from '@/components/trading/AddTradeForm';
import { Trade } from '@/models/trade';
import { formatDate } from '@/lib/formatters';

enum View {
  YearSelection,
  MonthSelection,
  DaySelection,
  DayDetails
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [view, setView] = useState<View>(View.YearSelection);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [showAddTradeForm, setShowAddTradeForm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showTradeDetails, setShowTradeDetails] = useState(false);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setView(View.MonthSelection);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setView(View.DaySelection);
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setSelectedDate(new Date(selectedYear, selectedMonth, day));
    setView(View.DayDetails);
  };

  const handleBackToYears = () => {
    setView(View.YearSelection);
  };

  const handleBackToMonths = () => {
    setView(View.MonthSelection);
  };

  const handleAddTrade = () => {
    setShowAddTradeForm(true);
  };

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowTradeDetails(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-trader-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Trade Scribe Chronicles</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Hi, {user?.name}</span>
            <Button variant="outline" className="text-white hover:text-trader-primary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground">How is your day! Track the trades done today</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            {view === View.YearSelection && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Track my trades</h3>
                <YearSelector onSelectYear={handleYearSelect} />
              </div>
            )}

            {view === View.MonthSelection && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Track my trades</h3>
                  <Button variant="outline" onClick={handleBackToYears}>
                    Back to Years
                  </Button>
                </div>
                <MonthGrid selectedYear={selectedYear} onSelectMonth={handleMonthSelect} />
              </div>
            )}

            {view === View.DaySelection && (
              <div>
                <DaysGrid 
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                  onSelectDay={handleDaySelect}
                  onBack={handleBackToMonths}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {view === View.DayDetails && selectedDate && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">{formatDate(selectedDate)}</h3>
              <Button variant="outline" onClick={handleBackToMonths}>
                Back to Calendar
              </Button>
            </div>
            
            <DailyTradesSummary date={selectedDate} />
            
            <TradesList 
              date={selectedDate} 
              onAddTrade={handleAddTrade} 
              onViewTradeDetails={handleTradeClick}
            />
            
            {showAddTradeForm && (
              <AddTradeForm 
                date={selectedDate} 
                open={showAddTradeForm}
                onClose={() => setShowAddTradeForm(false)} 
              />
            )}
            
            {selectedTrade && (
              <TradeDetails 
                trade={selectedTrade}
                open={showTradeDetails}
                onClose={() => setShowTradeDetails(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

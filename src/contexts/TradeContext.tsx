
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade, DailyTradesSummary } from '@/models/trade';

interface TradeContextType {
  trades: Trade[];
  isLoading: boolean;
  addTrade: (trade: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  getTradesByDate: (date: Date) => Trade[];
  getDailySummary: (date: Date) => DailyTradesSummary | null;
  getDaysWithTradesForMonth: (year: number, month: number) => number[];
  getMonthsWithTradesForYear: (year: number) => number[];
  getYearsWithTrades: () => number[];
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved trade data
    const savedTrades = localStorage.getItem('tradeJournalTrades');
    if (savedTrades) {
      const parsedTrades: Trade[] = JSON.parse(savedTrades).map((trade: any) => ({
        ...trade,
        date: new Date(trade.date),
        createdAt: new Date(trade.createdAt),
        updatedAt: new Date(trade.updatedAt)
      }));
      setTrades(parsedTrades);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save trades to localStorage whenever it changes
    if (trades.length > 0) {
      localStorage.setItem('tradeJournalTrades', JSON.stringify(trades));
    }
  }, [trades]);

  const addTrade = (trade: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTrade: Trade = {
      ...trade,
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: 'user-123', // Replace with actual user ID
      createdAt: now,
      updatedAt: now
    };

    setTrades(prevTrades => [...prevTrades, newTrade]);
  };

  const updateTrade = (id: string, tradeUpdates: Partial<Trade>) => {
    setTrades(prevTrades => 
      prevTrades.map(trade => 
        trade.id === id 
          ? { ...trade, ...tradeUpdates, updatedAt: new Date() } 
          : trade
      )
    );
  };

  const deleteTrade = (id: string) => {
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
  };

  const getTradesByDate = (date: Date): Trade[] => {
    return trades.filter(trade => 
      trade.date.getFullYear() === date.getFullYear() &&
      trade.date.getMonth() === date.getMonth() &&
      trade.date.getDate() === date.getDate()
    );
  };

  const getDailySummary = (date: Date): DailyTradesSummary | null => {
    const dayTrades = getTradesByDate(date);
    
    if (dayTrades.length === 0) return null;

    const totalTrades = dayTrades.length;
    let pnl = 0;
    let winCount = 0;

    dayTrades.forEach(trade => {
      if (trade.exitPrice) {
        const tradePnl = trade.quantity * (trade.exitPrice - trade.entryPrice);
        pnl += tradePnl;
        
        if (tradePnl > 0) {
          winCount++;
        }
      }
    });

    return {
      date,
      totalTrades,
      pnl,
      winRate: totalTrades > 0 ? (winCount / totalTrades) * 100 : 0
    };
  };

  const getDaysWithTradesForMonth = (year: number, month: number): number[] => {
    const daysWithTrades = new Set<number>();
    
    trades.forEach(trade => {
      const tradeDate = trade.date;
      if (tradeDate.getFullYear() === year && tradeDate.getMonth() === month) {
        daysWithTrades.add(tradeDate.getDate());
      }
    });
    
    return Array.from(daysWithTrades).sort((a, b) => a - b);
  };

  const getMonthsWithTradesForYear = (year: number): number[] => {
    const monthsWithTrades = new Set<number>();
    
    trades.forEach(trade => {
      const tradeDate = trade.date;
      if (tradeDate.getFullYear() === year) {
        monthsWithTrades.add(tradeDate.getMonth());
      }
    });
    
    return Array.from(monthsWithTrades).sort((a, b) => a - b);
  };

  const getYearsWithTrades = (): number[] => {
    const yearsWithTrades = new Set<number>();
    
    trades.forEach(trade => {
      yearsWithTrades.add(trade.date.getFullYear());
    });
    
    if (yearsWithTrades.size === 0) {
      // If no trades, add current year
      yearsWithTrades.add(new Date().getFullYear());
    }
    
    return Array.from(yearsWithTrades).sort((a, b) => a - b);
  };

  return (
    <TradeContext.Provider value={{ 
      trades, 
      isLoading, 
      addTrade, 
      updateTrade, 
      deleteTrade,
      getTradesByDate,
      getDailySummary,
      getDaysWithTradesForMonth,
      getMonthsWithTradesForYear,
      getYearsWithTrades
    }}>
      {children}
    </TradeContext.Provider>
  );
};

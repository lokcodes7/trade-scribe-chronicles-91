import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade, DailyTradesSummary, formatTradeForStorage, parseTradeFromStorage } from '@/models/trade';
import { useToast } from '@/hooks/use-toast';

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
  saveTrades: () => void;
}

const STORAGE_KEY = 'tradeJournalTrades';

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
  const { toast } = useToast();

  useEffect(() => {
    const loadTrades = () => {
      try {
        const savedTrades = localStorage.getItem(STORAGE_KEY);
        if (savedTrades) {
          const parsedTrades: Trade[] = JSON.parse(savedTrades).map(parseTradeFromStorage);
          setTrades(parsedTrades);
        }
      } catch (error) {
        console.error("Error loading trades from localStorage:", error);
        toast({
          title: "Error",
          description: "Failed to load your trades",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTrades();
  }, []);

  useEffect(() => {
    if (trades.length > 0) {
      saveTrades();
    }
  }, [trades]);

  const saveTrades = () => {
    try {
      const formattedTrades = trades.map(formatTradeForStorage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedTrades));
      return true;
    } catch (error) {
      console.error("Error saving trades to localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to save your trades",
        variant: "destructive",
      });
      return false;
    }
  };

  const addTrade = (trade: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      const newTrade: Trade = {
        ...trade,
        id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'user-123', // Replace with actual user ID when authentication is implemented
        createdAt: now,
        updatedAt: now
      };

      setTrades(prevTrades => [...prevTrades, newTrade]);
      toast({
        title: "Success",
        description: "Trade added successfully",
      });
      return true;
    } catch (error) {
      console.error("Error adding trade:", error);
      toast({
        title: "Error",
        description: "Failed to add trade",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTrade = (id: string, tradeUpdates: Partial<Trade>) => {
    try {
      setTrades(prevTrades => 
        prevTrades.map(trade => 
          trade.id === id 
            ? { ...trade, ...tradeUpdates, updatedAt: new Date() } 
            : trade
        )
      );
      toast({
        title: "Success",
        description: "Trade updated successfully",
      });
      return true;
    } catch (error) {
      console.error("Error updating trade:", error);
      toast({
        title: "Error",
        description: "Failed to update trade",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTrade = (id: string) => {
    try {
      setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
      toast({
        title: "Success",
        description: "Trade deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
      return false;
    }
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
      getYearsWithTrades,
      saveTrades
    }}>
      {children}
    </TradeContext.Provider>
  );
};

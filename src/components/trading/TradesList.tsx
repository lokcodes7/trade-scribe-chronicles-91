
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTrade } from '@/contexts/TradeContext';
import { formatCurrency } from '@/lib/formatters';
import { Trade, calculateRealizedPnL } from '@/models/trade';

interface TradesListProps {
  date: Date;
  onAddTrade: () => void;
  onViewTradeDetails: (trade: Trade) => void;
}

const TradesList: React.FC<TradesListProps> = ({ date, onAddTrade, onViewTradeDetails }) => {
  const { getTradesByDate } = useTrade();
  const trades = getTradesByDate(date);

  return (
    <Card className="mt-4 animate-fade-in-down">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trades</CardTitle>
        <Button onClick={onAddTrade} variant="default">Add Trade</Button>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No trades recorded for this date</p>
            <Button onClick={onAddTrade} variant="outline">Record Your First Trade</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trades.map((trade) => {
              const pnl = trade.exitPrice 
                ? calculateRealizedPnL(trade.quantity, trade.entryPrice, trade.exitPrice) 
                : null;
              
              return (
                <div 
                  key={trade.id} 
                  className="p-4 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onViewTradeDetails(trade)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{trade.stockName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {trade.quantity} • Entry: {formatCurrency(trade.entryPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      {pnl !== null && (
                        <span className={`font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(pnl)}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground">Strategy: {trade.strategy}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradesList;

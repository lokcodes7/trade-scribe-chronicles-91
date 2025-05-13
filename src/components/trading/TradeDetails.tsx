
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trade, calculateSLAmount, calculateRewardAmount, calculateRiskRewardRatio, calculateRealizedPnL } from '@/models/trade';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrade } from '@/contexts/TradeContext';
import { useToast } from '@/hooks/use-toast';
import { Check, Save } from 'lucide-react';

interface TradeDetailsProps {
  trade: Trade | null;
  open: boolean;
  onClose: () => void;
}

const TradeDetails: React.FC<TradeDetailsProps> = ({ trade, open, onClose }) => {
  const { deleteTrade, updateTrade } = useTrade();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTrade, setEditedTrade] = useState<Trade | null>(null);

  // Initialize editedTrade when trade changes
  React.useEffect(() => {
    if (trade) {
      setEditedTrade({...trade});
    }
  }, [trade]);

  if (!trade || !editedTrade) return null;

  const slAmount = calculateSLAmount(trade.quantity, trade.entryPrice, trade.slPrice);
  const rewardAmount = calculateRewardAmount(trade.quantity, trade.entryPrice, trade.targetPrice);
  const riskReward = calculateRiskRewardRatio(slAmount, rewardAmount);
  
  const pnl = trade.exitPrice 
    ? calculateRealizedPnL(trade.quantity, trade.entryPrice, trade.exitPrice)
    : null;

  const handleDelete = () => {
    if (!trade) return;
    
    setIsDeleting(true);
    try {
      const success = deleteTrade(trade.id);
      if (success === true) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = () => {
    if (!editedTrade) return;
    
    setIsSaving(true);
    try {
      const success = updateTrade(editedTrade.id, editedTrade);
      if (success === true) {
        toast({
          title: "Success",
          description: "Trade saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving trade:", error);
      toast({
        title: "Error",
        description: "Failed to save trade",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{trade.stockName}</span>
            {pnl !== null && (
              <Badge className={`${pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                {formatCurrency(pnl)}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Trade details for {trade.date.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Quantity</p>
            <p className="font-medium">{trade.quantity}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Entry Price</p>
            <p className="font-medium">{formatCurrency(trade.entryPrice)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
            <p className="font-medium">{formatCurrency(trade.slPrice)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Target</p>
            <p className="font-medium">{formatCurrency(trade.targetPrice)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">SL Amount</p>
            <p className="font-medium text-red-600">{formatCurrency(slAmount)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Reward Amount</p>
            <p className="font-medium text-green-600">{formatCurrency(rewardAmount)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Risk:Reward</p>
            <p className="font-medium">1:{riskReward.toFixed(2)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Strategy</p>
            <p className="font-medium">{trade.strategy}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Exit Price</p>
            <p className={`font-medium ${trade.exitPrice ? (trade.exitPrice > trade.entryPrice ? 'text-green-600' : 'text-red-600') : ''}`}>
              {trade.exitPrice ? formatCurrency(trade.exitPrice) : 'Not exited'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Outcome</p>
            <p className="font-medium">
              {trade.slHit ? 'SL Hit' : trade.trailedSL ? 'Trailed SL' : trade.exitPrice ? 'Target Hit' : 'Trade Open'}
            </p>
          </div>
        </div>
        
        {trade.imageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Trade Image</p>
            <img 
              src={trade.imageUrl} 
              alt="Trade Chart" 
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}
        
        {trade.notes && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="text-sm mt-1">{trade.notes}</p>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-between">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Trade"}
          </Button>

          <Button
            variant="default"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                Save Trade
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDetails;

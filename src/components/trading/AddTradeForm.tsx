
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trade, calculateSLAmount, calculateRewardAmount, calculateRiskRewardRatio } from '@/models/trade';
import { useTrade } from '@/contexts/TradeContext';
import { useToast } from '@/hooks/use-toast';

interface AddTradeFormProps {
  date: Date;
  open: boolean;
  onClose: () => void;
}

const AddTradeForm: React.FC<AddTradeFormProps> = ({ date, open, onClose }) => {
  const [stockName, setStockName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [strategy, setStrategy] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [trailedSL, setTrailedSL] = useState(false);
  const [slHit, setSlHit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addTrade } = useTrade();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stockName || !quantity || !entryPrice || !slPrice || !targetPrice || !strategy) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const newTrade: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      date: new Date(date),
      stockName,
      quantity: Number(quantity),
      entryPrice: Number(entryPrice),
      slPrice: Number(slPrice),
      targetPrice: Number(targetPrice),
      exitPrice: exitPrice ? Number(exitPrice) : undefined,
      trailedSL,
      slHit,
      strategy,
      imageUrl: imageUrl || undefined,
      notes: notes || undefined,
    };
    
    try {
      addTrade(newTrade);
      toast({
        title: "Success",
        description: "Trade added successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setStockName('');
    setQuantity('');
    setEntryPrice('');
    setSlPrice('');
    setTargetPrice('');
    setExitPrice('');
    setStrategy('');
    setImageUrl('');
    setNotes('');
    setTrailedSL(false);
    setSlHit(false);
  };
  
  const calculateMetrics = () => {
    if (!quantity || !entryPrice || !slPrice || !targetPrice) return null;
    
    const qty = Number(quantity);
    const entry = Number(entryPrice);
    const sl = Number(slPrice);
    const target = Number(targetPrice);
    
    const slAmount = calculateSLAmount(qty, entry, sl);
    const rewardAmount = calculateRewardAmount(qty, entry, target);
    const riskReward = calculateRiskRewardRatio(slAmount, rewardAmount);
    
    return { slAmount, rewardAmount, riskReward };
  };
  
  const metrics = calculateMetrics();

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset();
      onClose();
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
            <DialogDescription>
              Record your trade details for {date.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockName">Stock/Option Name*</Label>
                <Input
                  id="stockName"
                  value={stockName}
                  onChange={(e) => setStockName(e.target.value)}
                  placeholder="e.g. AAPL"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity*</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 10"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price*</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="e.g. 150.50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slPrice">Stop Loss Price*</Label>
                <Input
                  id="slPrice"
                  type="number"
                  step="0.01"
                  value={slPrice}
                  onChange={(e) => setSlPrice(e.target.value)}
                  placeholder="e.g. 148.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price*</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g. 155.00"
                  required
                />
              </div>
            </div>
            
            {metrics && (
              <div className="grid grid-cols-3 gap-4 bg-muted p-2 rounded-md">
                <div>
                  <Label className="text-xs text-muted-foreground">SL Amount</Label>
                  <p className="text-sm font-medium">${metrics.slAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Reward Amount</Label>
                  <p className="text-sm font-medium">${metrics.rewardAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Risk:Reward</Label>
                  <p className="text-sm font-medium">1:{metrics.riskReward.toFixed(2)}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy*</Label>
              <Input
                id="strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="e.g. Breakout, Reversal, Swing"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price (if trade is closed)</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="Leave blank if trade is still open"
              />
            </div>
            
            {exitPrice && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trailedSL"
                    checked={trailedSL}
                    onCheckedChange={setTrailedSL}
                    disabled={slHit}
                  />
                  <Label htmlFor="trailedSL">Trailed Stop Loss</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="slHit"
                    checked={slHit}
                    onCheckedChange={(checked) => {
                      setSlHit(checked);
                      if (checked) setTrailedSL(false);
                    }}
                    disabled={trailedSL}
                  />
                  <Label htmlFor="slHit">Stop Loss Hit</Label>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Chart Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/chart.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details about this trade"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Trade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTradeForm;


import React, { useState, useRef } from 'react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [trailedSL, setTrailedSL] = useState(false);
  const [slHit, setSlHit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addTrade } = useTrade();
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image.*')) {
        setImageFile(file);
        
        // Create a preview URL for the image
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    let imageUrl = undefined;
    
    // In a real app, we would upload the image to a server and get a URL
    // For now, we'll just use the file name as a placeholder
    if (imageFile) {
      imageUrl = `local://${imageFile.name}`;
    }
    
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
      imageUrl,
      notes: notes || undefined,
    };
    
    try {
      const success = addTrade(newTrade);
      
      if (success === true) {
        handleReset();
        onClose();
      }
    } catch (error) {
      console.error("Error in trade submission:", error);
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
    setImageFile(null);
    setImagePreview(null);
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
            <DialogTitle>
              <span className="text-red-600">Per</span>
              <span className="text-green-600">fect</span> New Trade
            </DialogTitle>
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
              <div className="grid grid-cols-3 gap-4 bg-orange-100 p-2 rounded-md">
                <div>
                  <Label className="text-xs text-cream-100">SL Amount</Label>
                  <p className="text-sm font-medium text-red-600">${metrics.slAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-cream-100">Reward Amount</Label>
                  <p className="text-sm font-medium text-green-600">${metrics.rewardAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-cream-100">Risk:Reward</Label>
                  <p className="text-sm font-medium text-cream-100">1:{metrics.riskReward.toFixed(2)}</p>
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
                  <Label htmlFor="trailedSL" className="text-cream-100">Trailed Stop Loss</Label>
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
                  <Label htmlFor="slHit" className="text-cream-100">Stop Loss Hit</Label>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="imageFile">Chart Image (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <span className="text-sm text-cream-100">
                  {imageFile ? imageFile.name : "No file selected"}
                </span>
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Chart Preview" 
                    className="max-h-40 rounded border border-border" 
                  />
                </div>
              )}
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

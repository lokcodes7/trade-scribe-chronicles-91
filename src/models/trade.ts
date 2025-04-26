
export interface Trade {
  id: string;
  userId: string;
  date: Date;
  stockName: string;
  quantity: number;
  entryPrice: number;
  slPrice: number;
  targetPrice: number;
  exitPrice?: number;
  trailedSL: boolean;
  slHit: boolean;
  strategy: string;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyTradesSummary {
  date: Date;
  totalTrades: number;
  pnl: number;
  winRate: number;
}

export const calculateSLAmount = (quantity: number, entryPrice: number, slPrice: number): number => {
  return quantity * Math.abs(entryPrice - slPrice);
};

export const calculateRewardAmount = (quantity: number, entryPrice: number, targetPrice: number): number => {
  return quantity * Math.abs(targetPrice - entryPrice);
};

export const calculateRiskRewardRatio = (slAmount: number, rewardAmount: number): number => {
  if (slAmount === 0) return 0;
  return rewardAmount / slAmount;
};

export const calculateRealizedPnL = (quantity: number, entryPrice: number, exitPrice: number): number => {
  return quantity * (exitPrice - entryPrice);
};

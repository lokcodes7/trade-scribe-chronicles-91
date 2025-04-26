
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTrade } from '@/contexts/TradeContext';
import { ChevronDown } from 'lucide-react';

interface YearSelectorProps {
  onSelectYear: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ onSelectYear }) => {
  const { getYearsWithTrades } = useTrade();
  const years = getYearsWithTrades();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-between">
          <span>Select Year</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 animate-fade-in-down">
        <DropdownMenuLabel>Available Years</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {years.map((year) => (
          <DropdownMenuItem
            key={year}
            className="cursor-pointer"
            onClick={() => onSelectYear(year)}
          >
            {year}
          </DropdownMenuItem>
        ))}
        {years.length === 0 && (
          <DropdownMenuItem disabled>No data available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default YearSelector;

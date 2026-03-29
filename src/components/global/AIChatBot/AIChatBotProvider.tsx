"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Cars } from "@/store/Cars/types";

interface AIChatBotContextType {
  isOpen: boolean;
  onToggle: () => void;
  hasComparison: boolean;
  comparisonData?: any;
  cars?: Cars[];
  setComparisonData: (data: any) => void;
  setHasComparison: (hasComparison: boolean) => void;
}

const AIChatBotContext = createContext<AIChatBotContextType | undefined>(
  undefined,
);

export function AIChatBotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasComparison, setHasComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [cars, setCars] = useState<Cars[]>([]);

  const onToggle = () => setIsOpen(!isOpen);

  const value: AIChatBotContextType = {
    isOpen,
    onToggle,
    hasComparison,
    comparisonData,
    cars,
    setComparisonData,
    setHasComparison,
  };

  return (
    <AIChatBotContext.Provider value={value}>
      {children}
    </AIChatBotContext.Provider>
  );
}

export function useAIChatBot() {
  const context = useContext(AIChatBotContext);
  if (context === undefined) {
    // Fallback values for SSR/build time
    return {
      isOpen: false,
      onToggle: () => {},
      hasComparison: false,
      comparisonData: null,
      cars: [],
      setComparisonData: () => {},
      setHasComparison: () => {},
    };
  }
  return context;
}

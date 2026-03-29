"use client";

import { useAIChatBot } from "@/components/global/AIChatBot";
import { ChatBotToggle, AIChatBot } from "@/components/global/AIChatBot";

export function GlobalAIChatBot() {
  const { isOpen, onToggle, hasComparison, comparisonData, cars } = useAIChatBot();

  return (
    <>
      <ChatBotToggle
        isOpen={isOpen}
        onToggle={onToggle}
        hasComparison={hasComparison}
      />
      <AIChatBot
        isOpen={isOpen}
        onToggle={onToggle}
        hasComparison={hasComparison}
        comparisonData={comparisonData}
        cars={cars}
      />
    </>
  );
}

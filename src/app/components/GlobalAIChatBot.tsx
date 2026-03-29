"use client";

import { useAIChatBot } from "@/components/global/AIChatBot";
import { ChatBotToggle, AIChatBot } from "@/components/global/AIChatBot";
import { usePageDetection } from "@/hooks/usePageDetection";
import { useEffect, useState } from "react";

export function GlobalAIChatBot() {
  const { isOpen, onToggle, hasComparison, comparisonData, cars } = useAIChatBot();
  const { isComparePage } = usePageDetection();
  const [position, setPosition] = useState(() => {
    return localStorage.getItem("chatbotPosition") || "bottom-right";
  });

  useEffect(() => {
    if (!isComparePage) {
      localStorage.setItem("chatbotPosition", position);
    }
  }, [position, isComparePage]);

  if (isComparePage) {
    return null;
  }

  return (
    <div className={`chatbot-icon ${position}`} draggable onDragEnd={(e) => {
      const quadrant = e.clientX < window.innerWidth / 2
        ? e.clientY < window.innerHeight / 2
          ? "top-left"
          : "bottom-left"
        : e.clientY < window.innerHeight / 2
        ? "top-right"
        : "bottom-right";
      setPosition(quadrant);
    }}>
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { usePageDetection } from "@/hooks/usePageDetection";

interface ChatBotToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  hasComparison: boolean;
}

export function ChatBotToggle({
  isOpen,
  onToggle,
  hasComparison,
}: ChatBotToggleProps) {
  const { isComparePage } = usePageDetection();

  // Hide completely on compare page
  if (isComparePage) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <Button
            onClick={() => onToggle()}
            className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ${
              hasComparison
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            size="icon"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <Button
            onClick={onToggle}
            className="rounded-full w-10 h-10 shadow-lg bg-gray-600 hover:bg-gray-700 hover:scale-110 active:scale-95"
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

interface ChatBotToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  hasComparison: boolean;
}

export function ChatBotToggle({ isOpen, onToggle, hasComparison }: ChatBotToggleProps) {
  return (
    <>
      {!isOpen && (
        <Button
          onClick={onToggle}
          className={`fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
            hasComparison 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              : "bg-gray-400 hover:bg-gray-500"
          }`}
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <Button
          onClick={onToggle}
          className="fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 shadow-lg bg-gray-600 hover:bg-gray-700"
          size="icon"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useDraggablePosition } from "@/hooks/useDraggablePosition";
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
  const {
    isDragging,
    elementRef,
    getPositionClasses,
    handleMouseDown,
    handleTouchStart,
  } = useDraggablePosition();

  // Hide completely on compare page
  if (isComparePage) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div
          ref={elementRef}
          className={getPositionClasses()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <Button
            onClick={(e) => {
              // Prevent click if we just finished dragging
              if (!isDragging) {
                e.stopPropagation();
                onToggle();
              }
            }}
            className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
              hasComparison
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            size="icon"
            disabled={isDragging}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      )}

      {isOpen && (
        <div
          ref={elementRef}
          className={getPositionClasses()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <Button
            onClick={(e) => {
              if (!isDragging) {
                e.stopPropagation();
                onToggle();
              }
            }}
            className="rounded-full w-10 h-10 shadow-lg bg-gray-600 hover:bg-gray-700 hover:scale-110 active:scale-95"
            size="icon"
            disabled={isDragging}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
}

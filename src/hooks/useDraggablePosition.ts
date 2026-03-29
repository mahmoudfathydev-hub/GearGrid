"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type CornerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = "chatbot-position";

const CORNER_POSITIONS: Record<CornerPosition, Position> = {
  "top-left": { x: 16, y: 16 },
  "top-right": { x: 16, y: 16 },
  "bottom-left": { x: 16, y: 16 },
  "bottom-right": { x: 16, y: 16 },
};

export const useDraggablePosition = () => {
  const [position, setPosition] = useState<CornerPosition>("bottom-right");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage on mount
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem(STORAGE_KEY) as CornerPosition;
      if (
        savedPosition &&
        Object.keys(CORNER_POSITIONS).includes(savedPosition)
      ) {
        // Use setTimeout to defer state update and avoid synchronous setState in useEffect
        setTimeout(() => setPosition(savedPosition), 0);
      }
    } catch (error) {
      console.warn("Failed to load chatbot position from localStorage:", error);
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, position);
    } catch (error) {
      console.warn("Failed to save chatbot position to localStorage:", error);
    }
  }, [position]);

  const getCornerFromPosition = useCallback(
    (clientX: number, clientY: number): CornerPosition => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const midX = screenWidth / 2;
      const midY = screenHeight / 2;

      if (clientX < midX && clientY < midY) return "top-left";
      if (clientX >= midX && clientY < midY) return "top-right";
      if (clientX < midX && clientY >= midY) return "bottom-left";
      return "bottom-right";
    },
    [],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);

    // Prevent text selection during drag
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !elementRef.current) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    },
    [isDragging, dragOffset],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      setIsDragging(false);

      // Determine which corner to snap to
      const corner = getCornerFromPosition(e.clientX, e.clientY);
      setPosition(corner);

      // Reset the transform to use corner classes
      if (elementRef.current) {
        elementRef.current.style.transform = "";
      }
    },
    [isDragging, getCornerFromPosition],
  );

  // Touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!elementRef.current) return;

      const touch = e.touches[0];
      const rect = elementRef.current.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;

      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);

      e.preventDefault();
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !elementRef.current) return;

      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;

      elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    },
    [isDragging, dragOffset],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;

      setIsDragging(false);

      // Use the last touch position to determine corner
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const corner = getCornerFromPosition(touch.clientX, touch.clientY);
        setPosition(corner);
      }

      // Reset the transform
      if (elementRef.current) {
        elementRef.current.style.transform = "";
      }
    },
    [isDragging, getCornerFromPosition],
  );

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      // Add cursor style to body
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);

        // Reset cursor style
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const getPositionClasses = useCallback(() => {
    const baseClasses = "fixed z-50 transition-all duration-300 ease-out";
    const positionClasses = {
      "top-left": "top-4 left-4",
      "top-right": "top-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
    };

    return `${baseClasses} ${positionClasses[position]}`;
  }, [position]);

  return {
    position,
    isDragging,
    elementRef,
    getPositionClasses,
    handleMouseDown,
    handleTouchStart,
  };
};

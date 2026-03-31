"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { usePageDetection } from "@/hooks/usePageDetection";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface AIChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  hasComparison: boolean;
  comparisonData?: any;
  cars?: any[];
}

export function AIChatBot({
  isOpen,
  onToggle,
  hasComparison,
  comparisonData,
  cars,
}: AIChatBotProps) {
  const { isComparePage } = usePageDetection();


  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: hasComparison
        ? "Hi! I can see you're comparing cars. I can help you analyze them, answer questions about features, or provide recommendations. What would you like to know?"
        : "Hi! I'm your AI car assistant. I can help you with car recommendations, answer questions about features, or provide general automotive advice. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hide completely on compare page
  if (isComparePage) {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

  const generateContext = () => {
    if (!comparisonData || !cars) {
      return "No cars are currently being compared. Provide general car advice and recommendations.";
    }

    let context = "Currently comparing these cars:\n\n";

    cars.forEach((car, index) => {
      context += `Car ${index + 1}: ${car.brand} ${car.name}\n`;
      context += `- Price: $${car.price.toLocaleString()}\n`;
      context += `- Year: ${car.year_of_manufacture}\n`;
      context += `- Engine: ${car.engine}\n`;
      context += `- Horsepower: ${car.horse_power} HP\n`;
      context += `- Transmission: ${car.transmission}\n`;
      context += `- Fuel Type: ${car.fuel_type}\n`;
      context += `- Mileage: ${car.miles.toLocaleString()} miles\n`;
      context += `- Car Type: ${car.car_type}\n`;
      context += `- Color: ${car.color}\n`;
      if (car.description) {
        context += `- Description: ${car.description}\n`;
      }
      context += "\n";
    });

    if (comparisonData.comparison) {
      context += "\nComparison Analysis:\n";
      comparisonData.comparison.forEach((comp: any, index: number) => {
        context += `\n${cars[index].brand} ${cars[index].name}:\n`;
        context += `- Performance Rating: ${comp.performance.horsepower} HP\n`;
        context += `- Fuel Efficiency: ${comp.fuelEfficiency.fuelType} (${comp.fuelEfficiency.mileage} miles)\n`;
        context += `- Pros: ${comp.pros.join(", ")}\n`;
        context += `- Cons: ${comp.cons.join(", ")}\n`;
      });
    }

    return context;
  };

  const callHuggingFaceAPI = async (userMessage: string) => {
    try {
      const context = generateContext();
      const prompt = `You are a knowledgeable car expert. Use the following information to answer the user's question accurately and helpfully.

${context}

User Question: ${userMessage}

Provide a detailed, helpful response based on the car data above. If no specific cars are being compared, provide general car advice. If cars are being compared, focus on the comparison data. Be conversational and friendly.`;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 500,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.9,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return (
        data[0]?.generated_text ||
        "I'm sorry, I couldn't generate a response. Please try again."
      );
    } catch (error) {
      console.error("AI API Error:", error);
      return "I'm having trouble connecting to my AI services right now. Please try again later or ask me a simpler question.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await callHuggingFaceAPI(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = hasComparison
    ? [
        "Which car has the best performance?",
        "What's the most fuel-efficient option?",
        "Which car offers the best value?",
        "Recommend a car for city driving",
        "Compare maintenance costs",
      ]
    : [
        "What's the best family car?",
        "Which SUV has good fuel economy?",
        "Recommend a reliable used car",
        "Electric vs hybrid - which is better?",
        "What's good for first-time buyers?",
      ];

  return (
    <>
      {isOpen && (
        <div
        >
          <Card className="w-96 h-150 flex flex-col shadow-lg border-2 border-blue-200 z-40">
            <CardHeader className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                AI Car Assistant
                {hasComparison && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-white/20 text-white border-none"
                  >
                    {cars?.length || 0} cars
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {messages.map((message, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="p-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(question)}
                        className="text-xs h-auto py-1 px-2"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      hasComparison
                        ? "Ask about the cars you're comparing..."
                        : "Ask me anything about cars..."
                    }
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

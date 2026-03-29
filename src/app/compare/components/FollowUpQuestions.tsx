"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";

interface FollowUpQuestionsProps {
  onAskQuestion: (question: string) => void;
  answer: string;
}

export function FollowUpQuestions({
  onAskQuestion,
  answer,
}: FollowUpQuestionsProps) {
  const [followUpQuestion, setFollowUpQuestion] = useState("");

  const handleAskQuestion = () => {
    if (followUpQuestion.trim()) {
      onAskQuestion(followUpQuestion);
      setFollowUpQuestion(""); // Clear the textarea after submission
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const predefinedQuestions = [
    "Which car is better for city driving?",
    "Which car has lower maintenance costs?",
    "Which is more suitable for long trips?",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Ask Follow-up Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {predefinedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setFollowUpQuestion(question)}
                className="text-left h-auto p-3"
              >
                <p className="text-sm">{question}</p>
              </Button>
            ))}
          </div>

          <Separator />

          <div className="flex gap-3">
            <Textarea
              placeholder="Type your own question about the compared cars... (Press Enter to send)"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              rows={3}
            />
            <Button
              onClick={handleAskQuestion}
              disabled={!followUpQuestion.trim()}
            >
              Ask
            </Button>
          </div>

          {answer && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

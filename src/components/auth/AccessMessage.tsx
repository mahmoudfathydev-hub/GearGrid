"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Home, LayoutDashboard } from "lucide-react";

interface AccessMessageProps {
  onRedirect?: () => void;
}

export function AccessMessage({ onRedirect }: AccessMessageProps) {
  const [message, setMessage] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const msg = searchParams.get("message");

    if (error && msg) {
      setErrorType(error);
      setMessage(msg);
    }
  }, [searchParams]);

  const getIcon = () => {
    switch (errorType) {
      case "admin_only":
        return <Shield className="w-8 h-8 text-red-500" />;
      case "user_only":
        return <Home className="w-8 h-8 text-blue-500" />;
      case "authentication_required":
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getRedirectButton = () => {
    switch (errorType) {
      case "admin_only":
        return (
          <Button
            onClick={() => router.push("/signup")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In as Admin
          </Button>
        );
      case "user_only":
        return (
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
        );
      case "authentication_required":
        return (
          <Button
            onClick={() => router.push("/signup")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Go Home
          </Button>
        );
    }
  };

  if (!message) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">{getIcon()}</div>
          <CardTitle className="text-xl text-gray-900">
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          <div className="space-y-2">
            {getRedirectButton()}
            
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Back to Safety
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Error Code: {errorType}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

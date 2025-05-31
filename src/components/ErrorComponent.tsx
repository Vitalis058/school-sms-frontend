import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
        
        {showRetry && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;

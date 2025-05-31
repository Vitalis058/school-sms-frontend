import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingComponentProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ 
  message = "Loading...", 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingComponent;

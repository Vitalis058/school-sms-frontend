import React from "react";
import { GraduationCap } from "lucide-react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="bg-primary text-primary-foreground rounded-lg flex items-center justify-center"
        style={{ width, height }}
      >
        <GraduationCap className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Logo;

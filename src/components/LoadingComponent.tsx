import { Loader2 } from "lucide-react";

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-blue-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="font-medium">Loading...</p>
    </div>
  );
}

export default LoadingComponent;

import { AlertTriangle } from "lucide-react";

function ErrorComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-red-500">
      <AlertTriangle className="h-6 w-6 animate-pulse" />
      <p className="text-base font-semibold">Something went wrong.</p>
      <p className="text-muted-foreground text-sm">
        We couldn’t load the data. Please try again later.
      </p>
    </div>
  );
}

export default ErrorComponent;

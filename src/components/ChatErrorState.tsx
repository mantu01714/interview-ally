import { AlertTriangle, RefreshCw } from "lucide-react";

interface ChatErrorStateProps {
  onRetry: () => void;
}

const ChatErrorState = ({ onRetry }: ChatErrorStateProps) => {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Something went wrong.</span>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 font-medium underline underline-offset-2 hover:opacity-80"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      </div>
    </div>
  );
};

export default ChatErrorState;

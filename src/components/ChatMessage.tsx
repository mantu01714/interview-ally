import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
  isLoading?: boolean;
}

const ChatMessage = ({ message, isLast, onRegenerate, isLoading }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`group relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-chat-bot text-chat-bot-foreground"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-chat-bot-foreground prose-headings:text-chat-bot-foreground prose-strong:text-chat-bot-foreground prose-code:bg-background/50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-pre:bg-background/50 prose-pre:rounded-lg">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {!isUser && message.content && (
          <div className="absolute -bottom-8 right-0 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <><Check className="h-3 w-3" /> Copied</>
              ) : (
                <><Copy className="h-3 w-3" /> Copy</>
              )}
            </button>
            {isLast && onRegenerate && !isLoading && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" /> Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;

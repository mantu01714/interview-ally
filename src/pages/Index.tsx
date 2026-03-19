import { useState, useRef, useEffect, useCallback } from "react";
import { RotateCcw, Moon, Sun } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import type { InterviewMode } from "@/components/WelcomeScreen";
import ModeSwitcher from "@/components/ModeSwitcher";
import ChatMessage, { Message } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import ChatErrorState from "@/components/ChatErrorState";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastUserMsg, setLastUserMsg] = useState("");
  const [mode, setMode] = useState<InterviewMode>("dsa");
  const [darkMode, setDarkMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const streamResponse = useCallback(
    async (apiMessages: { role: string; content: string }[]) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages, mode }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setIsLoading(false);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              const snap = assistantContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: snap } : m
                )
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    },
    [mode]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      setError(false);
      setLastUserMsg(content);

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        await streamResponse(apiMessages);
      } catch (e) {
        console.error("Chat error:", e);
        setIsLoading(false);
        setError(true);
      }
    },
    [messages, streamResponse]
  );

  const handleRegenerate = useCallback(async () => {
    // Remove the last assistant message, then re-send
    setMessages((prev) => {
      const withoutLast = prev.slice(0, -1);
      return withoutLast;
    });
    setIsLoading(true);
    setError(false);

    try {
      // Use messages without the last assistant msg
      const msgsWithoutLastAssistant = messages.filter(
        (_, i) => i < messages.length - 1
      );
      const apiMessages = msgsWithoutLastAssistant.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // We need to set messages first then stream
      setMessages(msgsWithoutLastAssistant);
      await streamResponse(apiMessages);
    } catch (e) {
      console.error("Regenerate error:", e);
      setIsLoading(false);
      setError(true);
    }
  }, [messages, streamResponse]);

  const handleRetry = () => {
    if (lastUserMsg) {
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastUserMsg);
    }
  };

  const handleModeChange = (newMode: InterviewMode) => {
    setMode(newMode);
    setMessages([]);
    setError(false);
  };

  const isEmpty = messages.length === 0;
  const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf("assistant");

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">IC</span>
          </div>
          <span className="hidden font-semibold text-foreground sm:inline">
            Interview Copilot
          </span>
        </div>

        <ModeSwitcher mode={mode} onModeChange={handleModeChange} disabled={isLoading} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                setError(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto">
        {isEmpty ? (
          <WelcomeScreen mode={mode} onSuggestionClick={sendMessage} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 pb-2">
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isLast={i === lastAssistantIdx}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            ))}
            {isLoading && <TypingIndicator />}
            {error && <ChatErrorState onRetry={handleRetry} />}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;

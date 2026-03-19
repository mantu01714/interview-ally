import { Code2, Users, FileText } from "lucide-react";
import type { InterviewMode } from "./WelcomeScreen";

interface ModeSwitcherProps {
  mode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
  disabled?: boolean;
}

const modes = [
  { id: "dsa" as const, icon: Code2, label: "DSA", emoji: "🧠" },
  { id: "hr" as const, icon: Users, label: "HR", emoji: "💼" },
  { id: "resume" as const, icon: FileText, label: "Resume", emoji: "📄" },
];

const ModeSwitcher = ({ mode, onModeChange, disabled }: ModeSwitcherProps) => {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          disabled={disabled}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            mode === m.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          } disabled:opacity-50`}
        >
          <span>{m.emoji}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSwitcher;

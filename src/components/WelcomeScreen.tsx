import { motion, AnimatePresence } from "framer-motion";
import { Code2, Users, FileText, Sparkles } from "lucide-react";

export type InterviewMode = "dsa" | "hr" | "resume";

interface WelcomeScreenProps {
  mode: InterviewMode;
  onSuggestionClick: (text: string) => void;
}

const modeConfig = {
  dsa: {
    icon: Code2,
    title: "DSA Practice Mode",
    subtitle: "Sharpen your problem-solving skills with guided practice",
    prompts: [
      "Explain the Two Sum problem and guide me through it",
      "Give me a linked list problem — medium difficulty",
      "Help me understand dynamic programming with an example",
      "Ask me a binary tree question and give hints only",
    ],
  },
  hr: {
    icon: Users,
    title: "HR Interview Mode",
    subtitle: "Practice behavioral questions with structured feedback",
    prompts: [
      "Ask me 'Tell me about yourself'",
      "Simulate a conflict resolution question",
      "Help me answer 'What is your biggest weakness?'",
      "Practice a leadership experience question using STAR",
    ],
  },
  resume: {
    icon: FileText,
    title: "Resume Review Mode",
    subtitle: "Get actionable feedback to make your resume stand out",
    prompts: [
      "Review my resume — I'll paste it below",
      "How do I quantify impact on my resume?",
      "Improve this bullet: 'Worked on backend APIs'",
      "What should a fresher's resume include?",
    ],
  },
};

const WelcomeScreen = ({ mode, onSuggestionClick }: WelcomeScreenProps) => {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {config.title}
          </h1>
          <p className="mb-8 text-muted-foreground text-lg">
            {config.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode + "-prompts"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-xl space-y-2.5"
        >
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Quick start
          </p>
          {config.prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSuggestionClick(prompt)}
              className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm text-card-foreground transition-all hover:border-accent hover:shadow-md hover:shadow-accent/10"
            >
              <span className="flex-1">{prompt}</span>
              <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Send →
              </span>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WelcomeScreen;

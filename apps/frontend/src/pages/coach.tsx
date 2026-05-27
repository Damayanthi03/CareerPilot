import { Bot, Send, Sparkles, BookOpen, Target, TrendingUp, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const starterPrompts = [
  { icon: Target, label: "Career Switch", prompt: "I'm a software developer wanting to move into product management. What skills do I need?" },
  { icon: TrendingUp, label: "Salary Negotiation", prompt: "Help me negotiate a 20% salary increase at my next performance review." },
  { icon: BookOpen, label: "Learning Path", prompt: "Create a 6-month learning plan for becoming a data scientist." },
  { icon: Lightbulb, label: "Interview Prep", prompt: "Give me the top 5 behavioral interview questions and how to answer them." },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Career Coach. I'm here to help you navigate your career journey — whether that's planning your next move, preparing for interviews, improving your resume, or developing new skills.\n\nWhat would you like to work on today?",
  },
];

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `You asked: "${input}"
            Here are some career suggestions related to your query:
            1. Practice consistently
            2. Build real-world projects
            3. Improve communication skills
            4. Learn industry tools
             Keep improving step by step '`
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/25">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Career Coach</h1>
          <p className="text-xs text-muted-foreground">Personalized guidance powered by AI</p>
        </div>
        <Badge variant="secondary" className="ml-auto gap-1">
          <Sparkles className="h-3 w-3" /> Online
        </Badge>
      </div>

      {/* Starter prompts (only show if no user message yet) */}
      {messages.length === 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {starterPrompts.map((sp) => (
            <button
              key={sp.label}
              onClick={() => handleSend(sp.prompt)}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-border hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-left transition-all duration-150 group"
            >
              <sp.icon className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">{sp.label}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">{sp.prompt}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0 mt-0.5">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <Card
              className={cn(
                "max-w-[80%] shadow-sm",
                msg.role === "user"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-card"
              )}
            >
              <CardContent className="px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
                {msg.content}
              </CardContent>
            </Card>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shrink-0 mt-0.5">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card className="bg-card shadow-sm">
              <CardContent className="px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask your career coach anything..."
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

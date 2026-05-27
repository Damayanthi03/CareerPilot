import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Sparkles, TrendingUp, Target, Brain } from "lucide-react";

const MESSAGES = [
  "Hi there! I'm CareerPilot AI.",
  "I use machine learning to analyze your skills and academic profile.",
  "Then I predict your ideal career path and placement readiness.",
  "Ready to discover exactly where your future is headed?",
];

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onDone, 700);
      }
    }, 26);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse" />
    </span>
  );
}

const FEATURE_PILLS = [
  { icon: TrendingUp, label: "Performance Prediction" },
  { icon: Target, label: "Placement Eligibility" },
  { icon: Brain, label: "AI Career Guidance" },
];

export default function Welcome() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  function handleMessageDone() {
    const nextStep = step + 1;
    if (nextStep < MESSAGES.length) {
      setVisibleMessages((prev) => [...prev, MESSAGES[step]]);
      setStep(nextStep);
    } else {
      setVisibleMessages((prev) => [...prev, MESSAGES[step]]);
      setStep(MESSAGES.length);
      setTimeout(() => setShowButton(true), 400);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative animate-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <Compass className="h-10 w-10 text-white" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
            CareerPilot <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">An Intelligent Career Guidance & Placement Prediction System</p>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-3 mb-8 min-h-[200px]">
          {visibleMessages.map((msg, i) => (
            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Compass className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-3 max-w-sm shadow-xl">
                <p className="text-sm leading-relaxed text-slate-100">{msg}</p>
              </div>
            </div>
          ))}

          {step < MESSAGES.length && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Compass className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-3 max-w-sm shadow-xl">
                <p className="text-sm leading-relaxed text-slate-100">
                  <TypewriterText key={step} text={MESSAGES[step]} onDone={handleMessageDone} />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Feature pills */}
        {showButton && (
          <div className="flex flex-wrap justify-center gap-2 mb-7 animate-in fade-in duration-500">
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-full">
                <Icon className="h-3.5 w-3.5 text-indigo-400" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-500 ${
            showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Button
            size="lg"
            className="gap-2 h-13 px-10 text-base rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-500/40 font-semibold"
            onClick={() => navigate("/analyze")}
          >
            Start My Career Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
          <button
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => navigate("/")}
          >
            Browse overview first →
          </button>
        </div>
      </div>
    </div>
  );
}

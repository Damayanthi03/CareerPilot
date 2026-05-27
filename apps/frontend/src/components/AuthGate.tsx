import { Compass, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthGate() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Compass className="h-10 w-10 text-white" />
            </div>

            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3 font-display">
            Welcome to CareerPilot{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              AI
            </span>
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Discover personalized career guidance, AI-powered insights,
            skill analysis, and future career recommendations tailored
            to your goals.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          {[
            {
              icon: TrendingUp,
              text: "AI-powered career growth predictions",
            },
            {
              icon: Shield,
              text: "Secure and modern assessment platform",
            },
            {
              icon: Sparkles,
              text: "Personalized AI career recommendations",
            },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>

              <span className="text-foreground font-medium">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-12 gap-2 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Start Career Assessment
          </Button>

          <p className="text-xs text-muted-foreground">
            AI-powered career guidance platform built for students and professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
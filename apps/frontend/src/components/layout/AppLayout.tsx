import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  ClipboardCheck,
  Bot,
  Briefcase,
  History,
  FlaskConical,
  Rocket,
  Moon,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/analyze", label: "Assessment", icon: ClipboardCheck },
    { href: "/tests", label: "Tests", icon: FlaskConical },
    { href: "/coach", label: "AI Coach", icon: Bot },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/assessments", label: "History", icon: History },
    { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 backdrop-blur-xl shadow-sm">
        
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* LOGO */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md">
                <Rocket className="h-5 w-5 text-white" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-extrabold tracking-tight text-base text-foreground">
                  CareerPilot{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    AI
                  </span>
                </span>

                <span className="text-[10px] text-muted-foreground">
                  Intelligent Career Guidance
                </span>
              </div>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-150 text-sm whitespace-nowrap",
                    active
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">
            
            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* DASHBOARD BUTTON */}
            <Link href="/welcome">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 container px-4 md:px-6 py-6 md:py-10">
        {children}
      </main>
    </div>
  );
}
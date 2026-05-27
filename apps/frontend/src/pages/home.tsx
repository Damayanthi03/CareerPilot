import { Link } from "wouter";
import { ArrowRight, BarChart3, Brain, Target, TrendingUp, Users, Zap} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCareerStats } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: TrendingUp,
    title: "Performance Prediction",
    description: "Linear regression models analyze your academic and skill data to generate a precise performance score.",
    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Target,
    title: "Placement Readiness",
    description: "Logistic regression predicts your placement eligibility based on a multi-factor skill assessment.",
    color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Brain,
    title: "Career Domain Match",
    description: "Support Vector Machine classifies your optimal career domain from 12 high-demand technology fields.",
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    title: "Skill Level Grouping",
    description: "K-Means clustering groups you with peers at your proficiency level for targeted improvement strategies.",
    color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Zap,
    title: "AI Career Guidance",
    description: "Generative AI synthesizes your unique profile into personalized, actionable career improvement steps.",
    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track assessments over time and visualize skill distributions and career domain trends.",
    color: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
  },
];

const domains = [
  "Web Development", "Data Analytics", "AI / Machine Learning",
  "Cyber Security", "Cloud Computing", "App Development",
  "Blockchain", "DevOps", "Game Development",
  "UI/UX Design", "IoT & Embedded", "AR/VR Development",
];
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-violet-400/20 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur shadow-xl shadow-indigo-500/10 p-5 space-y-3">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground">CareerPilot AI Analysis</span>
          </div>
          <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-700">
            Live Preview
          </Badge>
        </div>

        {/* Performance score */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
          <p className="text-xs font-medium opacity-80 mb-1">Predicted Performance Score</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold">84</span>
            <span className="text-lg opacity-70 mb-0.5">/ 100</span>
            <span className="ml-auto text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">Strong Profile</span>
          </div>
          <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/90 rounded-full" style={{ width: "84%" }} />
          </div>
        </div>

        {/* Prediction cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-muted/50 border border-border/60 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Placement</p>
            <p className="text-sm font-bold text-emerald-600">Eligible ✓</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border/60 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Domain</p>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">AI / ML</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border/60 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Skill Level</p>
            <p className="text-sm font-bold text-blue-600">Advanced</p>
          </div>
        </div>

        {/* AI Suggestions preview */}
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-3">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            AI Career Suggestions
          </p>
          <div className="space-y-1.5">
            {["Build a portfolio with 3 ML projects on GitHub", "Earn AWS Cloud Practitioner certification", "Practice 2 LeetCode problems daily"].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs font-bold text-indigo-500 mt-0.5 shrink-0">{i + 1}.</span>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: stats } = useGetCareerStats();

  return (
    <div className="space-y-24">
      {/* Hero — two column */}
      <section className="pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text + CTAs */}
          <div>
            <Badge
              variant="secondary"
              className="mb-5 font-mono text-xs tracking-wider uppercase bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
            >
              ✦ AI-Powered Career Intelligence
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 text-foreground font-display">
              Know exactly where{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                your career
              </span>{" "}
              is headed
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Enter your academic profile and get ML-backed predictions on performance, placement eligibility, and ideal career domain — plus personalized AI guidance to close the gap.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="gap-2 h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 font-semibold"
                >
                  Start Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold border-2">
                  View Analytics
                </Button>
              </Link>
            </div>

            {/* Live stats */}
            {stats && stats.totalAssessments > 0 && (
              <div className="mt-10 flex flex-wrap gap-4">
                {[
                  { value: stats.totalAssessments, label: "Assessments run", color: "text-indigo-600 dark:text-indigo-400" },
                  { value: `${stats.placementEligibleRate}%`, label: "Placement rate", color: "text-emerald-600" },
                  { value: stats.averagePerformanceScore, label: "Avg score", color: "text-indigo-600 dark:text-indigo-400" },
                ].map(({ value, label, color }) => (
                  <div key={label} className="rounded-xl border bg-card px-5 py-3 shadow-sm">
                    <div className={cn("text-2xl font-extrabold tabular-nums", color)}>{value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: illustration */}
          <div className="hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 font-display">How the system works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Five machine learning models working together to give you a complete career picture.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="border bg-card card-shadow hover:card-shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <CardContent className="pt-6">
                <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-xl", feature.color)}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Career domains */}
      <section className="text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 font-display">12 Career domains covered</h2>
          <p className="text-muted-foreground text-lg">The system recommends from 12 high-demand technology specializations.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {domains.map((domain) => (
            <Badge
              key={domain}
              variant="outline"
              className="text-sm py-2 px-4 rounded-xl font-medium bg-card hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-default card-shadow"
            >
              {domain}
            </Badge>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-10 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-display">Ready to pilot your career?</h2>
            <p className="text-indigo-200 leading-relaxed max-w-md">Takes under 2 minutes. Get ML predictions + AI-generated guidance tailored precisely to your profile.</p>
          </div>
          <Link href="/analyze">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 h-12 px-8 shrink-0 bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-xl"
            >
              Begin Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

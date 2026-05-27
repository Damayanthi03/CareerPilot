import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAnalyzeStudent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Github, Linkedin, Link2, RefreshCw, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  { value: "web_development", label: "Web Development" },
  { value: "data_analytics", label: "Data Analytics" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "cyber_security", label: "Cyber Security" },
  { value: "cloud_computing", label: "Cloud Computing" },
  { value: "app_development", label: "App Development" },
  { value: "blockchain", label: "Blockchain Development" },
  { value: "devops", label: "DevOps & Site Reliability" },
  { value: "game_development", label: "Game Development" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "iot", label: "IoT & Embedded Systems" },
  { value: "ar_vr", label: "AR/VR Development" },
];

export const RETAKE_BASELINE_KEY = "careerpilot-retake-baseline";

type CompareBaseline = {
  studentName: string;
  performanceScore: number;
  placementEligible: boolean;
  recommendedDomain: string;
  skillGroup: string;
  date: string;
};

type FormData = {
  name: string;
  attendance: number;
  codingSkill: number;
  aptitudeScore: number;
  communicationSkill: number;
  academicScore: number;
  technicalInterest: string;
  githubUrl: string;
  linkedinUrl: string;
};

function ScoreField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const levelColor = value >= 70 ? "text-emerald-600 dark:text-emerald-400" : value >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-500";
  const levelLabel = value >= 70 ? "Strong" : value >= 40 ? "Moderate" : "Needs work";
  const trackColor = value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">{label}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={(e) => {
              const v = Math.min(100, Math.max(0, Number(e.target.value)));
              onChange(v);
            }}
            className="w-16 h-8 text-center text-sm font-bold"
          />
          <span className="text-xs text-muted-foreground w-6">/ 100</span>
        </div>
      </div>
      <div className="relative">
        <Slider
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">0</span>
        <span className={cn("font-semibold", levelColor)}>{levelLabel} ({value})</span>
        <span className="text-muted-foreground">100</span>
      </div>
    </div>
  );
}

export default function Analyze() {
  const [, navigate] = useLocation();
  const mutation = useAnalyzeStudent();
  const [compareBaseline, setCompareBaseline] = useState<CompareBaseline | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    attendance: 75,
    codingSkill: 60,
    aptitudeScore: 65,
    communicationSkill: 60,
    academicScore: 70,
    technicalInterest: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem(RETAKE_BASELINE_KEY);
    if (stored) {
      try {
        const baseline = JSON.parse(stored) as CompareBaseline;
        setCompareBaseline(baseline);
        if (baseline.studentName) {
          setForm((prev) => ({ ...prev, name: baseline.studentName }));
        }
      } catch {
        sessionStorage.removeItem(RETAKE_BASELINE_KEY);
      }
    }
  }, []);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.technicalInterest) newErrors.technicalInterest = "Please select a technical interest";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    mutation.mutate(
      {
        data: {
          ...form,
          githubUrl: form.githubUrl.trim() || undefined,
          linkedinUrl: form.linkedinUrl.trim() || undefined,
        },
      },
      {
        onSuccess: (assessment) => {
          const isRetake = !!compareBaseline;
          navigate(`/results/${assessment.id}${isRetake ? "?compare=true" : ""}`);
        },
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-display">
          {compareBaseline ? "Retake Assessment" : "Student Assessment"}
        </h1>
        <p className="text-muted-foreground">
          Enter your academic and skill scores accurately. The ML models use these inputs to generate your predictions.
        </p>
      </div>

      {/* Retake comparison banner */}
      {compareBaseline && (
        <div className="mb-6 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Comparing with previous assessment
            </p>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-0.5">
              Baseline from {compareBaseline.date} — Score: <strong>{compareBaseline.performanceScore}</strong> · {compareBaseline.recommendedDomain} · {compareBaseline.skillGroup}
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(RETAKE_BASELINE_KEY);
              setCompareBaseline(null);
            }}
            className="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 underline shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <Card className="border card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-display">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={cn("h-10", errors.name ? "border-destructive" : "")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Technical Interest</Label>
              <Select value={form.technicalInterest} onValueChange={(v) => set("technicalInterest", v)}>
                <SelectTrigger className={cn("h-10", errors.technicalInterest ? "border-destructive" : "")}>
                  <SelectValue placeholder="Select your primary technical interest" />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.technicalInterest && <p className="text-xs text-destructive">{errors.technicalInterest}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-display flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              Social Profiles
              <Badge variant="secondary" className="text-xs font-normal">optional</Badge>
            </CardTitle>
            <CardDescription>
              Adding your profiles helps the AI give more targeted recommendations for your public portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub Profile
              </Label>
              <Input
                id="github"
                placeholder="https://github.com/yourusername"
                value={form.githubUrl}
                onChange={(e) => set("githubUrl", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourusername"
                value={form.linkedinUrl}
                onChange={(e) => set("linkedinUrl", e.target.value)}
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Scores */}
        <Card className="border card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-display flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Academic & Skill Scores
            </CardTitle>
            <CardDescription>Rate each area from 0 (no proficiency) to 100 (expert level).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ScoreField
              label="Attendance"
              description="Your percentage of classes/sessions attended"
              value={form.attendance}
              onChange={(v) => set("attendance", v)}
            />
            <ScoreField
              label="Coding Skill"
              description="Programming ability across languages and problem-solving"
              value={form.codingSkill}
              onChange={(v) => set("codingSkill", v)}
            />
            <ScoreField
              label="Aptitude Score"
              description="Logical reasoning, quantitative ability, and analytical thinking"
              value={form.aptitudeScore}
              onChange={(v) => set("aptitudeScore", v)}
            />
            <ScoreField
              label="Communication Skill"
              description="Verbal, written, and interpersonal communication ability"
              value={form.communicationSkill}
              onChange={(v) => set("communicationSkill", v)}
            />
            <ScoreField
              label="Academic Score"
              description="Overall academic performance (CGPA / percentage)"
              value={form.academicScore}
              onChange={(v) => set("academicScore", v)}
            />
          </CardContent>
        </Card>

        {mutation.error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20">
            Something went wrong. Please try again.
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 gap-2 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 font-semibold"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your profile...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {compareBaseline ? "Generate Comparison Analysis" : "Generate Career Analysis"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useParams, useSearch } from "wouter";
import { useGetAssessment } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { PageLoader} from "@/components/ui/pageloader";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  TrendingUp,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Cpu,
  Zap,
  Code2,
  BookOpen,
  MessageSquare,
  CalendarCheck,
  Network,
} from "lucide-react";

import { RETAKE_BASELINE_KEY } from "./analyze";
import { cn } from "@/lib/utils";

type CompareBaseline = {
  studentName: string;
  performanceScore: number;
  placementEligible: boolean;
  recommendedDomain: string;
  skillGroup: string;
  date: string;
};

function PerformanceGauge({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));

  const color =
    pct >= 70
      ? "text-emerald-600"
      : pct >= 50
      ? "text-amber-500"
      : "text-red-500";

  const barColor =
    pct >= 70
      ? "from-emerald-500 to-emerald-400"
      : pct >= 50
      ? "from-indigo-500 to-indigo-400"
      : "from-red-500 to-red-400";

  const label =
    pct >= 70 ? "Strong" : pct >= 50 ? "Moderate" : "Developing";

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <span
          className={cn(
            "text-6xl font-extrabold tracking-tight",
            color
          )}
        >
          {pct}
        </span>

        <span className="text-2xl text-muted-foreground mb-2">
          / 100
        </span>

        <Badge
          className={cn(
            "mb-2 ml-2 text-sm font-semibold",
            pct >= 70
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : pct >= 50
              ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-red-100 text-red-700 border-red-200"
          )}
        >
          {label} Profile
        </Badge>
      </div>

      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000",
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="border-t border-border/40 pt-3 mt-1">
        <AlgoBadge
          icon={Brain}
          label="ML Model: Linear Regression"
        />
      </div>
    </div>
  );
}

function AlgoBadge({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-200/60 bg-indigo-50/60 text-[11px] font-medium text-indigo-500">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function SkillBar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  const color =
    value >= 70
      ? "from-emerald-500 to-emerald-400"
      : value >= 50
      ? "from-indigo-500 to-indigo-400"
      : "from-amber-500 to-amber-400";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm items-center">
        <span className="text-foreground font-medium flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {label}
        </span>

        <span className="font-bold">{value}</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700",
            color
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DiffBadge({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const diff = current - previous;

  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 font-bold">
        <ArrowUp className="h-3 w-3" />+{diff}
      </span>
    );

  if (diff < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-500 font-bold">
        <ArrowDown className="h-3 w-3" />
        {diff}
      </span>
    );

  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground font-bold">
      <Minus className="h-3 w-3" />0
    </span>
  );
}

const SKILL_GROUP_ORDER = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const SKILL_GROUP_CONFIG = {
  Beginner: {
    color:
      "bg-amber-100 text-amber-800 border-amber-200",
  },

  Intermediate: {
    color:
      "bg-blue-100 text-blue-800 border-blue-200",
  },

  Advanced: {
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export default function Results() {
  const params = useParams<{ id: string }>();

  const search = useSearch();

  const id = Number(params.id);

  const isCompare = search.includes("compare=true");

  const { data: assessment, isLoading, error } = useGetAssessment(id);

  const [baseline, setBaseline] =
    useState<CompareBaseline | null>(null);

  useEffect(() => {
    if (isCompare) {
      const stored = sessionStorage.getItem(
        RETAKE_BASELINE_KEY
      );

      if (stored) {
        try {
          setBaseline(JSON.parse(stored));
        } catch {}
      }
    }
  }, [isCompare]);

  function handleRetake() {
    if (!assessment) return;

    sessionStorage.setItem(
      RETAKE_BASELINE_KEY,
      JSON.stringify({
        studentName: assessment.studentName,
        performanceScore: assessment.performanceScore,
        placementEligible: assessment.placementEligible,
        recommendedDomain: assessment.recommendedDomain,
        skillGroup: assessment.skillGroup,
        date: new Date(
          assessment.createdAt
        ).toLocaleDateString(),
      })
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <PageLoader className="h-8 w-48" />
        <PageLoader className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">
          Assessment not found.
        </p>

        <Link href="/assessments">
          <Button variant="outline">
            View Assessments
          </Button>
        </Link>
      </div>
    );
  }

  const skillGroupConfig =
    SKILL_GROUP_CONFIG[
      assessment.skillGroup as keyof typeof SKILL_GROUP_CONFIG
    ] ?? SKILL_GROUP_CONFIG.Intermediate;

  const scoreDiff = baseline
    ? assessment.performanceScore -
      baseline.performanceScore
    : null;

  const skillImproved = baseline
    ? (SKILL_GROUP_ORDER[
        assessment.skillGroup as keyof typeof SKILL_GROUP_ORDER
      ] ?? 0) >
      (SKILL_GROUP_ORDER[
        baseline.skillGroup as keyof typeof SKILL_GROUP_ORDER
      ] ?? 0)
    : false;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/assessments">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 -ml-2 mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Button>
          </Link>

          <h1 className="text-3xl font-extrabold">
            Career Analysis
          </h1>

          <p className="text-muted-foreground mt-1">
            {assessment.studentName}
          </p>
        </div>

        <Link href="/analyze" onClick={handleRetake}>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake
          </Button>
        </Link>
      </div>

      {/* COMPARISON */}
      {baseline && (
        <Card>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Score
                </p>

                <p className="text-2xl font-bold">
                  {assessment.performanceScore}

                  {scoreDiff !== null && (
                    <DiffBadge
                      current={assessment.performanceScore}
                      previous={baseline.performanceScore}
                    />
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Previous Score
                </p>

                <p className="text-2xl font-bold">
                  {baseline.performanceScore}
                </p>
              </div>
            </div>

            {skillImproved && (
              <p className="mt-3 text-emerald-600 font-semibold">
                Skill Group Improved!
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* PERFORMANCE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Performance Score
          </CardTitle>
        </CardHeader>

        <CardContent>
          <PerformanceGauge
            score={assessment.performanceScore}
          />
        </CardContent>
      </Card>

      {/* PREDICTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-3">
              Placement
            </p>

            <div className="flex items-center gap-2">
              {assessment.placementEligible ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}

              <span className="font-bold">
                {assessment.placementEligible
                  ? "Eligible"
                  : "Not Eligible"}
              </span>
            </div>

            <div className="mt-4">
              <AlgoBadge
                icon={Network}
                label="Logistic Regression"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-3">
              Recommended Domain
            </p>

            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />

              <span className="font-bold">
                {assessment.recommendedDomain}
              </span>
            </div>

            <div className="mt-4">
              <AlgoBadge icon={Cpu} label="SVM" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-3">
              Skill Group
            </p>

            <Badge
              className={cn(
                "font-bold border",
                skillGroupConfig.color
              )}
            >
              {assessment.skillGroup}
            </Badge>

            <div className="mt-4">
              <AlgoBadge
                icon={Zap}
                label="K-Means"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SKILLS */}
      <Card>
        <CardHeader>
          <CardTitle>Input Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <SkillBar
            label="Attendance"
            value={assessment.attendance}
            icon={CalendarCheck}
          />

          <SkillBar
            label="Coding Skill"
            value={assessment.codingSkill}
            icon={Code2}
          />

          <SkillBar
            label="Aptitude Score"
            value={assessment.aptitudeScore}
            icon={Brain}
          />

          <SkillBar
            label="Communication"
            value={assessment.communicationSkill}
            icon={MessageSquare}
          />

          <SkillBar
            label="Academic Score"
            value={assessment.academicScore}
            icon={BookOpen}
          />
        </CardContent>
      </Card>

      {/* AI GUIDANCE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-indigo-600" />
            AI Career Guidance
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ol className="space-y-4">
            {assessment.aiSuggestions.map(
              (suggestion: string, i: number) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                    {i + 1}
                  </span>

                  <p className="text-sm leading-relaxed">
                    {suggestion}
                  </p>
                </li>
              )
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
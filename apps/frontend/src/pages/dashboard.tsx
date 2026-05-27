import { Link } from "wouter";
import { useGetCareerStats, useListCareerDomains } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/pageloader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { ArrowRight, CheckCircle2, TrendingUp, Users2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAIN_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#14b8a6", "#a855f7", "#6366f1"];
const SKILL_GROUP_COLORS: Record<string, string> = {
  Beginner: "#f59e0b",
  Intermediate: "#3b82f6",
  Advanced: "#10b981",
};

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={cn("border", className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-bold tabular-nums">{value}</p>
            {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetCareerStats();
  const { data: domains } = useListCareerDomains();

  const skillData = stats
    ? [
        { name: "Beginner", value: stats.skillGroupCounts.Beginner },
        { name: "Intermediate", value: stats.skillGroupCounts.Intermediate },
        { name: "Advanced", value: stats.skillGroupCounts.Advanced },
      ]
    : [];

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <PageLoader className="h-10 w-56" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <PageLoader key={i} className="h-32 rounded-xl" />)}
        </div>
        <PageLoader className="h-64 rounded-xl" />
        <PageLoader className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  const isEmpty = stats.totalAssessments === 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-muted-foreground mt-1">Aggregate analytics across all career assessments.</p>
        </div>
        <Link href="/analyze">
          <Button className="gap-2">
            New Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No data yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Run some assessments to populate the dashboard.</p>
          <Link href="/analyze">
            <Button>Start first assessment</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Assessments"
              value={stats.totalAssessments}
              sub="students analyzed"
              icon={Users2}
            />
            <StatCard
              title="Avg Performance"
              value={`${stats.averagePerformanceScore}`}
              sub="out of 100"
              icon={TrendingUp}
            />
            <StatCard
              title="Placement Eligible"
              value={`${stats.placementEligibleRate}%`}
              sub={`${stats.placementEligibleCount} students`}
              icon={CheckCircle2}
            />
            <StatCard
              title="Skill Distribution"
              value={`${stats.skillGroupCounts.Advanced} advanced`}
              sub={`${stats.skillGroupCounts.Intermediate} intermediate`}
              icon={BarChart3}
            />
          </div>

          {/* Domain distribution - full width */}
          {stats.domainDistribution.length > 0 && (
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Career Domain Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Recommended domains across all assessments</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.domainDistribution} margin={{ top: 4, right: 4, bottom: 24, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="domain"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ border: "1px solid hsl(var(--border))", borderRadius: "8px", background: "hsl(var(--card))" }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
                      {stats.domainDistribution.map((_, index) => (
                        <Cell key={index} fill={DOMAIN_COLORS[index % DOMAIN_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Skill level breakdown - full width, below domain chart */}
          {skillData.some((d) => d.value > 0) && (
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Skill Level Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">K-Means clustering classification results</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-10">
                  <ResponsiveContainer width="40%" height={240}>
                    <PieChart>
                      <Pie
                        data={skillData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {skillData.map((entry, index) => (
                          <Cell key={index} fill={SKILL_GROUP_COLORS[entry.name] ?? "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ border: "1px solid hsl(var(--border))", borderRadius: "8px", background: "hsl(var(--card))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-5">
                    {skillData.map((d) => {
                      const total = skillData.reduce((sum, s) => sum + s.value, 0);
                      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                      return (
                        <div key={d.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-sm"
                                style={{ background: SKILL_GROUP_COLORS[d.name] ?? "#94a3b8" }}
                              />
                              <span className="text-sm font-medium">{d.name}</span>
                            </div>
                            <span className="font-bold tabular-nums text-sm">{d.value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: SKILL_GROUP_COLORS[d.name] ?? "#94a3b8" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent assessments */}
          {stats.recentAssessments.length > 0 && (
            <Card className="border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Assessments</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Latest 5 student analyses</p>
                </div>
                <Link href="/assessments">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {stats.recentAssessments.map((a) => (
                  <Link key={a.id} href={`/results/${a.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {a.studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{a.studentName}</p>
                          <p className="text-xs text-muted-foreground">{a.recommendedDomain}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-sm font-semibold tabular-nums", a.performanceScore >= 70 ? "text-emerald-600" : a.performanceScore >= 50 ? "text-amber-600" : "text-red-500")}>
                          {a.performanceScore}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("text-xs border", {
                            "bg-amber-100 text-amber-800 border-amber-200": a.skillGroup === "Beginner",
                            "bg-blue-100 text-blue-800 border-blue-200": a.skillGroup === "Intermediate",
                            "bg-emerald-100 text-emerald-800 border-emerald-200": a.skillGroup === "Advanced",
                          })}
                        >
                          {a.skillGroup}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Domain reference cards */}
          {domains && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Career Domain Reference</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.map((domain) => (
                  <Card key={domain.id} className="border">
                    <CardContent className="pt-5">
                      <h3 className="font-semibold text-sm mb-1">{domain.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{domain.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {domain.keySkills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">{skill}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{domain.avgSalaryRange} / year</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { Link } from "wouter";
import { useListAssessments, useDeleteAssessment, getListAssessmentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/pageloader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/confirmation";
import { CheckCircle2, XCircle, ExternalLink, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SKILL_GROUP_COLORS: Record<string, string> = {
  Beginner: "bg-amber-100 text-amber-800 border-amber-200",
  Intermediate: "bg-blue-100 text-blue-800 border-blue-200",
  Advanced: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500";
  return <span className={cn("font-semibold tabular-nums", color)}>{score}</span>;
}

export default function Assessments() {
  const { data: assessments, isLoading } = useListAssessments();
  const deleteMutation = useDeleteAssessment();
  const queryClient = useQueryClient();

  function handleDelete(id: number) {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAssessmentsQueryKey() });
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment History</h1>
          <p className="text-muted-foreground mt-1">All career assessments run through the system.</p>
        </div>
        <Link href="/analyze">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PageLoader key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !assessments || assessments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No assessments yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">Run your first career assessment to see predictions and AI-generated guidance here.</p>
            <Link href="/analyze">
              <Button>Start your first assessment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Placement</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Skill Group</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{a.studentName}</TableCell>
                  <TableCell>
                    <ScoreBadge score={a.performanceScore} />
                  </TableCell>
                  <TableCell>
                    {a.placementEligible ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Eligible</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Not eligible</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.recommendedDomain}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-medium border", SKILL_GROUP_COLORS[a.skillGroup] ?? "")}
                    >
                      {a.skillGroup}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/results/${a.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete assessment?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {a.studentName}&apos;s assessment. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(a.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

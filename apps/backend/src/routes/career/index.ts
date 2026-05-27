import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, assessmentsTable } from "@workspace/db";
import {
  AnalyzeStudentBody,
  GetAssessmentParams,
  DeleteAssessmentParams,
  GetAssessmentResponse,
  ListAssessmentsResponse,
  GetCareerStatsResponse,
  ListCareerDomainsResponse,
} from "@workspace/api-zod";
import { openai } from "@workspace/ai-server";
import { runMLPredictions } from "../../lib/ml-predictions";
import { CAREER_DOMAINS } from "../../lib/career-domains";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

async function generateAISuggestions(
  studentData: {
    name: string;
    attendance: number;
    codingSkill: number;
    aptitudeScore: number;
    communicationSkill: number;
    academicScore: number;
    technicalInterest: string;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
  },
  predictions: {
    performanceScore: number;
    placementEligible: boolean;
    recommendedDomain: string;
    skillGroup: string;
  },
): Promise<string[]> {
  const profileLines = [
    `- Name: ${studentData.name}`,
    `- Attendance: ${studentData.attendance}%`,
    `- Coding Skill: ${studentData.codingSkill}/100`,
    `- Aptitude Score: ${studentData.aptitudeScore}/100`,
    `- Communication Skill: ${studentData.communicationSkill}/100`,
    `- Academic Score: ${studentData.academicScore}/100`,
    `- Technical Interest: ${studentData.technicalInterest.replace(/_/g, " ")}`,
  ];
  if (studentData.githubUrl) profileLines.push(`- GitHub: ${studentData.githubUrl}`);
  if (studentData.linkedinUrl) profileLines.push(`- LinkedIn: ${studentData.linkedinUrl}`);

  const prompt = `You are a career guidance expert. Based on the following student profile, generate exactly 6 highly specific, actionable career improvement suggestions. Each suggestion should be 1-2 sentences and directly reference the student's data.

Student Profile:
${profileLines.join("\n")}

Predicted Outcomes:
- Performance Score: ${predictions.performanceScore}/100
- Placement Eligible: ${predictions.placementEligible ? "Yes" : "No"}
- Recommended Career Domain: ${predictions.recommendedDomain}
- Skill Group: ${predictions.skillGroup}

Return ONLY a JSON array of exactly 6 strings. No other text. Example format:
["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5", "suggestion 6"]`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content ?? "[]";
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === "string")) {
      return parsed.slice(0, 6);
    }
  } catch {
    logger.warn({ content }, "Failed to parse AI suggestions JSON");
  }

  return [
    `Focus on improving your ${predictions.skillGroup === "Beginner" ? "foundational coding and problem-solving skills" : "advanced technical projects"} to boost placement readiness.`,
    `Practice aptitude tests and logical reasoning daily to strengthen your analytical capabilities.`,
    `Build 2-3 real-world projects in ${predictions.recommendedDomain} to demonstrate hands-on experience to employers.`,
    `Improve communication skills through group discussions, mock interviews, and technical presentations.`,
    `Pursue a recognized certification in ${predictions.recommendedDomain} to validate your expertise.`,
    `Maintain consistent attendance and engagement to signal reliability and commitment to potential employers.`,
  ];
}

router.post("/career/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const predictions = runMLPredictions(data);

  let aiSuggestions: string[];
  try {
    aiSuggestions = await generateAISuggestions(data, predictions);
  } catch (err) {
    req.log.error({ err }, "Failed to generate AI suggestions, using fallback");
    aiSuggestions = [
      `Build practical projects in ${predictions.recommendedDomain} to strengthen your portfolio.`,
      `Practice data structures and algorithms to improve problem-solving speed.`,
      `Take an online certification course relevant to ${predictions.recommendedDomain}.`,
      "Participate in coding competitions or hackathons to gain experience under pressure.",
      "Develop communication skills through technical blog posts and peer presentations.",
      "Set a study schedule with clear weekly goals to systematically improve weaker areas.",
    ];
  }

  const userId = req.isAuthenticated() ? req.user?.id ?? null : null;

  const [assessment] = await db
    .insert(assessmentsTable)
    .values({
      userId,
      studentName: data.name,
      attendance: data.attendance,
      codingSkill: data.codingSkill,
      aptitudeScore: data.aptitudeScore,
      communicationSkill: data.communicationSkill,
      academicScore: data.academicScore,
      technicalInterest: data.technicalInterest,
      githubUrl: data.githubUrl ?? null,
      linkedinUrl: data.linkedinUrl ?? null,
      performanceScore: predictions.performanceScore,
      placementEligible: predictions.placementEligible,
      recommendedDomain: predictions.recommendedDomain,
      skillGroup: predictions.skillGroup,
      aiSuggestions,
    })
    .returning();

  res.status(201).json(GetAssessmentResponse.parse(assessment));
});

router.get("/career/assessments", async (_req, res): Promise<void> => {
  const assessments = await db
    .select()
    .from(assessmentsTable)
    .orderBy(desc(assessmentsTable.createdAt));
  res.json(ListAssessmentsResponse.parse(assessments));
});

router.get("/career/assessments/:id", async (req, res): Promise<void> => {
  const params = GetAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [assessment] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id));

  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  res.json(GetAssessmentResponse.parse(assessment));
});

router.delete("/career/assessments/:id", async (req, res): Promise<void> => {
  const params = DeleteAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/career/stats", async (_req, res): Promise<void> => {
  const assessments = await db
    .select()
    .from(assessmentsTable)
    .orderBy(desc(assessmentsTable.createdAt));

  const total = assessments.length;
  const eligible = assessments.filter((a) => a.placementEligible).length;
  const avgScore =
    total > 0
      ? Math.round((assessments.reduce((sum, a) => sum + a.performanceScore, 0) / total) * 10) / 10
      : 0;

  const skillCounts = { Beginner: 0, Intermediate: 0, Advanced: 0 };
  for (const a of assessments) {
    const g = a.skillGroup as keyof typeof skillCounts;
    if (g in skillCounts) skillCounts[g]++;
  }

  const domainMap: Record<string, number> = {};
  for (const a of assessments) {
    domainMap[a.recommendedDomain] = (domainMap[a.recommendedDomain] ?? 0) + 1;
  }
  const domainDistribution = Object.entries(domainMap).map(([domain, count]) => ({ domain, count }));

  const recentAssessments = assessments.slice(0, 5);

  res.json(
    GetCareerStatsResponse.parse({
      totalAssessments: total,
      placementEligibleCount: eligible,
      placementEligibleRate: total > 0 ? Math.round((eligible / total) * 1000) / 10 : 0,
      averagePerformanceScore: avgScore,
      skillGroupCounts: skillCounts,
      domainDistribution,
      recentAssessments,
    }),
  );
});

router.get("/career/domains", async (_req, res): Promise<void> => {
  res.json(ListCareerDomainsResponse.parse(CAREER_DOMAINS));
});

export default router;

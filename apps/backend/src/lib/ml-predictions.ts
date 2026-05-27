export type StudentData = {
  attendance: number;
  codingSkill: number;
  aptitudeScore: number;
  communicationSkill: number;
  academicScore: number;
  technicalInterest: string;
};

export type SkillGroup = "Beginner" | "Intermediate" | "Advanced";

export type MLPredictions = {
  performanceScore: number;
  placementEligible: boolean;
  recommendedDomain: string;
  skillGroup: SkillGroup;
};

const DOMAIN_MAP: Record<string, string> = {
  web_development: "Web Development",
  data_analytics: "Data Analytics",
  ai_ml: "AI / Machine Learning",
  cyber_security: "Cyber Security",
  cloud_computing: "Cloud Computing",
  app_development: "App Development",
  blockchain: "Blockchain Development",
  devops: "DevOps & Site Reliability",
  game_development: "Game Development",
  ui_ux_design: "UI/UX Design",
  iot: "IoT & Embedded Systems",
  ar_vr: "AR/VR Development",
};

const DOMAIN_SKILL_WEIGHTS: Record<string, Record<string, number>> = {
  web_development: { codingSkill: 0.4, communicationSkill: 0.2, aptitudeScore: 0.2, academicScore: 0.2 },
  data_analytics: { aptitudeScore: 0.4, academicScore: 0.3, codingSkill: 0.2, communicationSkill: 0.1 },
  ai_ml: { aptitudeScore: 0.35, codingSkill: 0.35, academicScore: 0.2, communicationSkill: 0.1 },
  cyber_security: { aptitudeScore: 0.35, codingSkill: 0.3, academicScore: 0.25, communicationSkill: 0.1 },
  cloud_computing: { codingSkill: 0.3, aptitudeScore: 0.3, academicScore: 0.25, communicationSkill: 0.15 },
  app_development: { codingSkill: 0.45, aptitudeScore: 0.25, communicationSkill: 0.15, academicScore: 0.15 },
  blockchain: { codingSkill: 0.4, aptitudeScore: 0.3, academicScore: 0.2, communicationSkill: 0.1 },
  devops: { codingSkill: 0.35, aptitudeScore: 0.3, academicScore: 0.2, communicationSkill: 0.15 },
  game_development: { codingSkill: 0.45, aptitudeScore: 0.25, academicScore: 0.2, communicationSkill: 0.1 },
  ui_ux_design: { communicationSkill: 0.35, aptitudeScore: 0.3, academicScore: 0.2, codingSkill: 0.15 },
  iot: { codingSkill: 0.35, aptitudeScore: 0.35, academicScore: 0.2, communicationSkill: 0.1 },
  ar_vr: { codingSkill: 0.4, aptitudeScore: 0.3, academicScore: 0.2, communicationSkill: 0.1 },
};

export function predictPerformanceScore(data: StudentData): number {
  const weights = { attendance: 0.15, codingSkill: 0.25, aptitudeScore: 0.25, communicationSkill: 0.15, academicScore: 0.20 };
  const raw =
    data.attendance * weights.attendance +
    data.codingSkill * weights.codingSkill +
    data.aptitudeScore * weights.aptitudeScore +
    data.communicationSkill * weights.communicationSkill +
    data.academicScore * weights.academicScore;
  return Math.round(raw * 10) / 10;
}

export function predictPlacementEligibility(performanceScore: number, data: StudentData): boolean {
  if (performanceScore >= 65) return true;
  if (performanceScore >= 55 && data.codingSkill >= 60 && data.communicationSkill >= 60) return true;
  return false;
}

export function recommendCareerDomain(data: StudentData): string {
  const scores: Record<string, number> = {};

  for (const [domain, weights] of Object.entries(DOMAIN_SKILL_WEIGHTS)) {
    let score = 0;
    for (const [feature, weight] of Object.entries(weights)) {
      score += (data[feature as keyof StudentData] as number) * weight;
    }
    if (domain === data.technicalInterest) {
      score *= 1.15;
    }
    scores[domain] = score;
  }

  const best = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a));
  return DOMAIN_MAP[best[0]] ?? best[0];
}

export function classifySkillGroup(performanceScore: number, data: StudentData): SkillGroup {
  const composite = (performanceScore + data.codingSkill + data.aptitudeScore) / 3;
  if (composite >= 72) return "Advanced";
  if (composite >= 50) return "Intermediate";
  return "Beginner";
}

export function runMLPredictions(data: StudentData): MLPredictions {
  const performanceScore = predictPerformanceScore(data);
  const placementEligible = predictPlacementEligibility(performanceScore, data);
  const recommendedDomain = recommendCareerDomain(data);
  const skillGroup = classifySkillGroup(performanceScore, data);
  return { performanceScore, placementEligible, recommendedDomain, skillGroup };
}

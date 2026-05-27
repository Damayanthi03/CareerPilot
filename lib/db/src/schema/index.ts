import { pgTable, serial, text, integer, real, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export const sessionsTable = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull().$type<Record<string, unknown>>(),
  expire: timestamp("expire").notNull(),
});

export type Session = typeof sessionsTable.$inferSelect;

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  studentName: text("student_name").notNull(),
  attendance: real("attendance").notNull(),
  codingSkill: real("coding_skill").notNull(),
  aptitudeScore: real("aptitude_score").notNull(),
  communicationSkill: real("communication_skill").notNull(),
  academicScore: real("academic_score").notNull(),
  technicalInterest: text("technical_interest").notNull(),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  performanceScore: real("performance_score").notNull(),
  placementEligible: boolean("placement_eligible").notNull(),
  recommendedDomain: text("recommended_domain").notNull(),
  skillGroup: text("skill_group").notNull(),
  aiSuggestions: jsonb("ai_suggestions").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Assessment = typeof assessmentsTable.$inferSelect;
export type InsertAssessment = typeof assessmentsTable.$inferInsert;

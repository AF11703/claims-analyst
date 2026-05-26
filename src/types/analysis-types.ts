import { z } from "zod";

export const SourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
  credibilityScore: z.number().max(1).min(0).optional()
});

export const ClaimAnalysisSchema = z.object({
  claim: z.string(),
  questions: z.array(z.string()).optional(),
  summary: z.string(),
  confidenceScore: z.number().max(1).min(0),
  verdict: z.enum(['likely_true', 'uncertain', 'likely_untrue']),
  supportingSources: z.array(SourceSchema),
  contradictingSources: z.array(SourceSchema),
  allSources: z.array(SourceSchema),
  reasoning: z.string(),
  answersToQuestions: z.array(z.string()).optional()
});

export type SourceType = z.infer<typeof SourceSchema>;
export type ClaimAnalysisType = z.infer<typeof ClaimAnalysisSchema>;



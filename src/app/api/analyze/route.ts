// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ClaimAnalysisSchema } from "@/types/analysis-types";
import { createAgent } from "langchain";
import { ChatGoogle } from "@langchain/google";
import { analyzeSourcesForClaim } from "@/agent/tools/analyzeSources";
import { fetchSourcesForClaim } from "@/agent/tools/collectSources";
import { optimizeQuery } from "@/agent/tools/optimizeQuery";
import { MemorySaver } from "@langchain/langgraph";
import { SYSTEM_PROMPT } from "@/agent/prompt";

const inputSchema = z.object({
  claim: z.string(),
  questions: z.array(z.string()).optional()
});

export async function POST(req: NextRequest) {
  const result = inputSchema.safeParse(await req.json());
  if (!result.success) {
    return NextResponse.json({ success: false, error: 'Invalid input: Claim must be a non-empty string' }, { status: 400 });
  }
  console.log('parsed input');

  const { claim, questions } = result.data;

  console.log(`got claim: ${claim}`);
  console.log(`Questions: ${questions}`);
  try {
    const agent = createAgent({
      model: new ChatGoogle({
        model: 'gemini-3.1-flash-lite',
        apiKey: process.env.GOOGLE_API_KEY,
        maxOutputTokens: 20000
      }),
      checkpointer: new MemorySaver(),
      tools: [analyzeSourcesForClaim, fetchSourcesForClaim, optimizeQuery],
      systemPrompt: SYSTEM_PROMPT,
      responseFormat: ClaimAnalysisSchema
    });

    console.log('created agent');

    const agentResult = await agent.invoke({ 
      messages: [{ role: "human", content: `Claim: ${claim}, Questions: ${questions}` }]}, { configurable: { thread_id: "claim_analysis" } 
    });

    console.log('invoked agent');

    const validated = ClaimAnalysisSchema.safeParse(agentResult.structuredResponse);

    console.log('got validated response');
    
    if (!validated.success) {
      throw new Error('Invalid agent response format');
    }

    console.log(validated.data);
    return NextResponse.json({ success: true, data: validated.data }, { status: 200 });
  }
  catch (e) {
    console.error(`An error occurred: ${e}`);
    console.log(e);

    return NextResponse.json({ success: false, error: 'Failed to analyze claim' }, { status: 500 });
  }
}
import { createAgent, tool } from "langchain";
import { ChatGoogle } from "@langchain/google";
import { z } from "zod";

const optimizeQuery = tool(
  async ({ claim }: { claim: string }): Promise<{ optimizedQuery: string }> => {
    const agent = createAgent({
      model: new ChatGoogle({
        model: 'gemini-3.1-flash-lite-preview',
        apiKey: process.env.GOOGLE_API_KEY,
        maxOutputTokens: 100
      }),
      systemPrompt: `
        You are a search query optimizer sub-agent. 
        Take a given user query and turn it into a string to be used 
        in a Google search to fetch relevant information pertaining to said claim.\n

        Transform the original, complex query into a simple string containing relevant keywords.\n

        Avoid using years when referring to time and use simple, relative, search friendly search terms such as "recent", "current", etc.
      `,
      responseFormat: z.object({ optimizedQuery: z.string() })
    });

    console.log(`created sub-agent`);


    const agentResult = await agent.invoke({
      messages: [{ role: "human", content: `Claim: ${claim}` }]}, { configurable: { thread_id: "query_optimization" } 
    });

    console.log(`optimized query: ${agentResult.structuredResponse.optimizedQuery}`);

    return agentResult.structuredResponse;
  },
  {
    name: "optimize_query",
    description: "Optimize a given query for maximum news source retrieval using a sub-agent.",
    schema: z.object({ claim: z.string() }),
  }
);

export { optimizeQuery };
import { NewsAPIResponseType } from "@/types/news-response-types";
import { tool } from "langchain";
import { z } from "zod";
import apiEndpoint from "@/lib/news-api/apiEndpoint";

const fetchSourcesForClaim = tool(
  async ({ optimizedQuery }: { optimizedQuery: string }): Promise<NewsAPIResponseType | string> => {
    const endpoint = apiEndpoint({ endpoint: 'everything', q: optimizedQuery, apiKey: process.env.NEWS_API_KEY });
    try {
      console.log(`Fetching sources with following query: ${optimizedQuery}`);
      const res = await fetch(endpoint, {method: 'GET'});

      if (!res.ok) {
        return `Fetch failed: HTTP ${res.status} | ${res.statusText}`;
      }

      return await res.json() as NewsAPIResponseType;
    }
    catch (e) {
      console.error(e);
      return `Unknown error occurred when fetching sources: ${e}`;
    }
  },
  {
    name: "fetch_sources_for_claim",
    description: "Fetch news sources for a given claim after calling the \`optimize_query\` tool",
    schema: z.object({ optimizedQuery: z.string() }),
  }
);

export { fetchSourcesForClaim };

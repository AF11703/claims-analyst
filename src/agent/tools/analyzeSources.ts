import { SourceType } from "@/types/analysis-types";
import { NewsAPIResponseSchema, NewsAPIResponseType } from "@/types/news-response-types";
import { tool } from "langchain";
import { calculateCredibilityScore } from "@/lib/news-api/credibleSources";

const analyzeSourcesForClaim = tool(
  async ({ articles }: NewsAPIResponseType): Promise<SourceType[]> => {
    return Promise.all(
      articles.map(async article => {
        const calcResult = await calculateCredibilityScore(article);
        return <SourceType>{
          title: article.title,
          url: article.url,
          snippet: article.description,
          credibilityScore: calcResult.success ? calcResult.score : undefined
        };
      })
    );
  },
  {
    name: "analyze_sources_for_claim",
    description: "Analyze news sources for a given claim",
    schema: NewsAPIResponseSchema,
  }
);

export { analyzeSourcesForClaim };
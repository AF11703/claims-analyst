import { z } from "zod";


export const NewsAPIArticleSchema = z.object({
  source: z.object({ id: z.union([z.string(), z.null()]), name: z.string() }),
  author: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  urlToImage: z.string(),
  publishedAt: z.string(),
  content: z.string()
});

export const NewsAPIResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  code: z.string().optional(),
  message: z.string().optional(),
  totalResults: z.number(),
  articles: z.array(NewsAPIArticleSchema)
});

export type NewsAPIArticleType = z.infer<typeof NewsAPIArticleSchema>;
export type NewsAPIResponseType = z.infer<typeof NewsAPIResponseSchema>;

import apiEndpoint from "@/lib/news-api/apiEndpoint";
import { NewsAPIArticleType } from "@/types/news-response-types";

interface ReputableSourcesCache {
  sources: { id: string; name: string; description: string; url: string; category: string; language: string; country: string; }[] | null;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let sourcesCache: ReputableSourcesCache = { sources: null, timestamp: 0 };

const getReputableSources = async (): Promise<{ id: string; name: string; description: string; url: string; category: string; language: string; country: string; }[] | null> => {
  const now = Date.now();
  
  // Return cached sources if still valid
  if (sourcesCache.sources !== null && (now - sourcesCache.timestamp) < CACHE_DURATION) {
    return sourcesCache.sources;
  }

  const reputableSourcesEndpoint = apiEndpoint({endpoint: 'top-headlines/sources', apiKey: process.env.NEWS_API_KEY});
  
  try {
    const res = await fetch(reputableSourcesEndpoint, { method: 'GET' });
    if (!res.ok) {
      return null;
    }

    const reputableSourcesObj = await res.json() as { status: string; sources: { id: string; name: string; description: string; url: string; category: string; language: string; country: string; }[] };
    
    if (reputableSourcesObj && reputableSourcesObj.sources) {
      sourcesCache = { sources: reputableSourcesObj.sources, timestamp: now };
      return reputableSourcesObj.sources;
    }
    return null;
  } catch (e) {
    console.error('Error fetching reputable sources:', e);
    return null;
  }
};

const calculateCredibilityScore = async (article: NewsAPIArticleType): Promise<{ success: boolean; score?: number; error?: string }> => {
  try {
    let score = 50;

    if (article.content && article.content.length >= 500) score += 15;
    if (article.description && article.description.length >= 150) score += 10;
  
    const reputableSources = await getReputableSources();

    if (reputableSources) {
      const sourceName = article.source.name;

      if (reputableSources.some(source => sourceName.includes(source.name))) {
        score += 20;
      }
    }

    const publishDate = new Date(article.publishedAt);
    const hoursOld = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 2) score -= 5;

    return { success: true, score: Math.max(0, Math.min(100, score)) };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Unknown error occurred' }  ;
  }
}

export { calculateCredibilityScore };
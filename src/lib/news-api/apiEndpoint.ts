export default function apiEndpoint(config: ({ endpoint: 'everything'; q: string; apiKey: string | undefined;} | { endpoint: 'top-headlines'; apiKey: string | undefined;} | { endpoint: 'top-headlines/sources'; apiKey: string | undefined; })): string {
  
  if (!config.apiKey) {
    const errorMessage = 'NewsAPI key was not initialized';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const endpoint = config.endpoint;
  let qParams: string;
  
  switch (endpoint) {
    case 'everything':
      qParams = `q=${config.q}`;
      break;
    case 'top-headlines':
      qParams = `country=us`;
      break;
    case 'top-headlines/sources':
      qParams = `country=us&language=en`
  }
  

  return encodeURI(`https://newsapi.org/v2/${endpoint}?${qParams}&apiKey=${config.apiKey}&pageSize=50`);
}
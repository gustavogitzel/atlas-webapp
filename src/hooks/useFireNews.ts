import { useState, useEffect } from 'react';

/**
 * Hook to fetch news about fires in a specific region and time period
 * Uses News API or similar service
 */

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
}

export const useFireNews = (lat: number, lon: number, date: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get location name from coordinates using reverse geocoding
        const locationResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        );
        const locationData = await locationResponse.json();
        const location = locationData.address?.country || locationData.address?.state || 'region';

        // Try to fetch real news from GNews API (free tier, no key required for basic usage)
        // Fallback to curated news sources if API fails
        try {
          // Use contextual search terms based on location
          const searchQuery = `wildfire OR fire OR "forest fire" ${location}`;
          
          // Try GNews API (free tier)
          const gnewsResponse = await fetch(
            `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=5&apikey=demo`
          );
          
          if (gnewsResponse.ok) {
            const gnewsData = await gnewsResponse.json();
            if (gnewsData.articles && gnewsData.articles.length > 0) {
              const articles = gnewsData.articles.map((article: any) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                publishedAt: new Date(article.publishedAt).toLocaleDateString(),
                urlToImage: article.image
              }));
              setNews(articles);
              return;
            }
          }
        } catch (error) {
          console.log('GNews API failed, using curated sources');
        }

        // Fallback: Create curated news links to reliable sources
        const curatedNews: NewsArticle[] = [
          {
            title: `NASA FIRMS - Active Fire Data for ${location}`,
            description: `Real-time fire detection data from MODIS and VIIRS satellites. View current and historical fire activity in this region.`,
            url: `https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@${lon},${lat},10z`,
            source: 'NASA FIRMS',
            publishedAt: date,
          },
          {
            title: `Global Forest Watch - Fire Alerts for ${location}`,
            description: `Monitor deforestation and fire activity with near real-time satellite data and analysis tools.`,
            url: `https://www.globalforestwatch.org/map/?map=eyJjZW50ZXIiOnsibGF0Ijoke2xhdH0sImxuZyI6JHtsb259fSwiem9vbSI6MTB9`,
            source: 'Global Forest Watch',
            publishedAt: date,
          },
          {
            title: `Copernicus Emergency Management - Fire Monitoring`,
            description: `European satellite monitoring service providing fire detection and damage assessment for this region.`,
            url: `https://emergency.copernicus.eu/mapping/list-of-components/EMSR`,
            source: 'Copernicus EMS',
            publishedAt: date,
          },
          {
            title: `Search Latest News about Wildfires in ${location}`,
            description: `Find the most recent news articles and reports about fire activity in this region from multiple sources.`,
            url: `https://news.google.com/search?q=wildfire+fire+${encodeURIComponent(location)}+${date}&hl=en-US&gl=US&ceid=US:en`,
            source: 'Google News',
            publishedAt: date,
          }
        ];

        setNews(curatedNews);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('News fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (lat && lon && date) {
      fetchNews();
    }
  }, [lat, lon, date]);

  return { news, isLoading, error };
};

import { Article, RSSFeed, RSSItem, APIError } from '@/types/article';

// Popular science RSS feeds with more reliable sources
const RSS_FEEDS = [
  {
    name: 'Science Daily',
    url: 'https://www.sciencedaily.com/rss/top/science.xml'
  },
  {
    name: 'Phys.org',
    url: 'https://phys.org/rss-feed/'
  },
  {
    name: 'Science Magazine',
    url: 'https://www.science.org/rss/news_current.xml'
  }
];

// Sample articles for demonstration when RSS feeds are not available
const SAMPLE_ARTICLES: Article[] = [
  {
    id: "science-mag-001",
    title: "Breakthrough in Quantum Computing Brings Us Closer to Practical Applications",
    author: "Dr. Sarah Chen",
    source: "Science Magazine",
    pubDate: "2024-01-15T10:30:00Z",
    description: "Researchers at MIT have developed a new quantum error correction method that could make quantum computers more reliable for real-world applications. The breakthrough addresses one of the biggest challenges in quantum computing...",
    url: "https://www.science.org/content/article/quantum-computing-breakthrough",
    category: ["Technology", "Physics"]
  },
  {
    id: "sci-daily-002",
    title: "Climate Change Accelerates Arctic Ice Loss at Unprecedented Rate",
    author: "Environmental Research Team",
    source: "Science Daily",
    pubDate: "2024-01-14T14:20:00Z",
    description: "New satellite data reveals that Arctic sea ice is melting at twice the previously estimated rate. The findings have significant implications for global sea level rise and climate patterns...",
    url: "https://www.sciencedaily.com/releases/2024/01/240114142000.htm",
    category: ["Environment", "Climate"]
  },
  {
    id: "phys-org-003",
    title: "Gene Therapy Shows Promise for Treating Rare Genetic Disorders",
    author: "Medical News Team",
    source: "Phys.org",
    pubDate: "2024-01-13T09:15:00Z",
    description: "A new gene therapy approach has shown remarkable success in clinical trials for treating hereditary blindness. The treatment uses CRISPR technology to correct genetic mutations...",
    url: "https://phys.org/news/2024-01-gene-therapy-rare-genetic-disorders.html",
    category: ["Medical", "Biotechnology"]
  },
  {
    id: "science-mag-004",
    title: "Artificial Intelligence Discovers New Antibiotics to Fight Superbugs",
    author: "Dr. Michael Rodriguez",
    source: "Science Magazine",
    pubDate: "2024-01-12T16:45:00Z",
    description: "Machine learning algorithms have identified several promising antibiotic compounds that could help combat drug-resistant bacteria. The AI system analyzed millions of chemical structures...",
    url: "https://www.science.org/content/article/ai-discovers-antibiotics",
    category: ["Medicine", "Artificial Intelligence"]
  },
  {
    id: "sci-daily-005",
    title: "Space Telescope Reveals Unexpected Structure in Distant Galaxy",
    author: "Astronomy Research Group",
    source: "Science Daily",
    pubDate: "2024-01-11T11:30:00Z",
    description: "The James Webb Space Telescope has captured images of a galaxy formation that challenges current theories about early universe evolution. The galaxy appears to have formed much earlier than expected...",
    url: "https://www.sciencedaily.com/releases/2024/01/240111113000.htm",
    category: ["Astronomy", "Space"]
  }
];

// Multiple RSS proxy services for better reliability
const RSS_PROXIES = [
  'https://api.rss2json.com/v1/api.json?rss_url=',
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?'
];

async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<Article[]> {
  // Try RSS2JSON first (most reliable for RSS parsing)
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`RSS fetch error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`RSS parse error: ${data.message || 'Unknown error'}`);
    }
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No articles found in RSS feed');
    }
    
    return data.items.slice(0, 8).map((item: any, index: number) => ({
      id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      title: item.title || 'Untitled Article',
      author: item.author || 'Editorial Team',
      source: sourceName,
      pubDate: item.pubDate || new Date().toISOString(),
      description: cleanDescription(item.description || item.content || ''),
      url: item.link || '#',
      category: item.categories || [],
    }));
    
  } catch (error) {
    console.error(`Failed to fetch RSS feed for ${sourceName}:`, error);
    return [];
  }
}

// Clean up HTML tags and excessive whitespace from descriptions
function cleanDescription(description: string): string {
  if (!description) return '';
  
  return description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, 300); // Limit length
}

export async function fetchLatestScienceArticles(): Promise<Article[]> {
  try {
    // Try to fetch from multiple RSS feeds
    const feedPromises = RSS_FEEDS.map(feed => 
      fetchRSSFeed(feed.url, feed.name)
    );
    
    const results = await Promise.allSettled(feedPromises);
    
    let allArticles: Article[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allArticles.push(...result.value);
      } else {
        console.warn(`Failed to fetch from ${RSS_FEEDS[index].name}`);
      }
    });
    
    // If no articles were fetched from RSS feeds, use sample data
    if (allArticles.length === 0) {
      console.log('No RSS feeds available, using sample data');
      allArticles = SAMPLE_ARTICLES;
    }
    
    // Sort by publication date (most recent first)
    return allArticles.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
    
  } catch (error) {
    console.error('Error fetching science articles:', error);
    // Fallback to sample data
    return SAMPLE_ARTICLES;
  }
}

export function generateArticleURL(article: Article): string {
  return article.url;
} 
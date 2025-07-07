import { Article, RSSFeed, RSSItem, APIError, JournalSource, JournalCategory, FilterOptions } from '@/types/article';

// Comprehensive journal sources organized by category
const JOURNAL_SOURCES: JournalSource[] = [
  // General Science (Top multidisciplinary journals)
  {
    name: 'Science Magazine',
    url: 'https://feeds.science.org/rss/science.xml',
    category: 'general-science',
    description: 'Latest research from Science Magazine',
    reliability: 'high'
  },
  {
    name: 'Science Daily',
    url: 'https://www.sciencedaily.com/rss/top/science.xml',
    category: 'general-science',
    description: 'Breaking science news',
    reliability: 'high'
  },
  {
    name: 'Phys.org',
    url: 'https://phys.org/rss-feed/',
    category: 'general-science',
    description: 'Physics, technology, and science news',
    reliability: 'high'
  },
  {
    name: 'EurekAlert!',
    url: 'https://www.eurekalert.org/rss.xml',
    category: 'general-science',
    description: 'Science news releases from major research institutions',
    reliability: 'high'
  },
  {
    name: 'SciTechDaily',
    url: 'https://scitechdaily.com/feed/',
    category: 'general-science',
    description: 'Science and technology news',
    reliability: 'medium'
  },
  
  // Medicine & Health
  {
    name: 'Science Daily - Health',
    url: 'https://www.sciencedaily.com/rss/health_medicine.xml',
    category: 'medicine',
    description: 'Health and medical research news',
    reliability: 'high'
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss',
    category: 'medicine',
    description: 'Medical news and health information',
    reliability: 'medium'
  },
  {
    name: 'Health News',
    url: 'https://feeds.feedburner.com/healthnews',
    category: 'medicine',
    description: 'Health and medical news updates',
    reliability: 'medium'
  },
  {
    name: 'Medscape',
    url: 'https://www.medscape.com/rss/news',
    category: 'medicine',
    description: 'Medical news for healthcare professionals',
    reliability: 'high'
  },
  {
    name: 'STAT News',
    url: 'https://www.statnews.com/feed/',
    category: 'medicine',
    description: 'Medicine, biotechnology, and life sciences news',
    reliability: 'medium'
  },
  
  // Biology & Life Sciences
  {
    name: 'Science Daily - Biology',
    url: 'https://www.sciencedaily.com/rss/plants_animals.xml',
    category: 'biology',
    description: 'Plant and animal biology research',
    reliability: 'high'
  },
  {
    name: 'Nature News',
    url: 'https://www.nature.com/nature.rss',
    category: 'biology',
    description: 'Biology and life sciences research news',
    reliability: 'high'
  },
  {
    name: 'BioWorld',
    url: 'https://www.bioworld.com/rss/topic/3473',
    category: 'biology',
    description: 'Biotechnology and life sciences news',
    reliability: 'medium'
  },
  {
    name: 'Lab Manager',
    url: 'https://www.labmanager.com/rss-feeds',
    category: 'biology',
    description: 'Laboratory and life sciences news',
    reliability: 'medium'
  },
  {
    name: 'GenomeWeb',
    url: 'https://www.genomeweb.com/rss.xml',
    category: 'biology',
    description: 'Genomics and molecular biology news',
    reliability: 'medium'
  },
  
  // Physics & Astronomy
  {
    name: 'Phys.org - Physics',
    url: 'https://phys.org/rss-feed/physics-news/',
    category: 'physics',
    description: 'Physics research and applications',
    reliability: 'high'
  },
  {
    name: 'Physics World',
    url: 'https://physicsworld.com/feed/',
    category: 'physics',
    description: 'Physics news and research from IOP Publishing',
    reliability: 'high'
  },
  {
    name: 'Phys.org - Space',
    url: 'https://phys.org/rss-feed/space-news/',
    category: 'physics',
    description: 'Space and astronomy news',
    reliability: 'high'
  },
  {
    name: 'Space News',
    url: 'https://spacenews.com/feed/',
    category: 'physics',
    description: 'Space industry and astronomy news',
    reliability: 'medium'
  },
  {
    name: 'Ars Technica Science',
    url: 'https://feeds.arstechnica.com/arstechnica/science',
    category: 'physics',
    description: 'Science and technology reporting',
    reliability: 'medium'
  },
  {
    name: 'Astronomy Magazine',
    url: 'https://www.astronomy.com/rss/all/',
    category: 'physics',
    description: 'Astronomy and space science news',
    reliability: 'medium'
  },
  
  // Chemistry
  {
    name: 'Chemistry World',
    url: 'https://www.chemistryworld.com/rss',
    category: 'chemistry',
    description: 'Chemistry news and research',
    reliability: 'medium'
  },
  {
    name: 'Chemical & Engineering News',
    url: 'https://cen.acs.org/content/cen/feeds/news.rss',
    category: 'chemistry',
    description: 'Chemical sciences and engineering news',
    reliability: 'medium'
  },
  
  // Earth & Environmental Sciences
  {
    name: 'Science Daily - Earth Sciences',
    url: 'https://www.sciencedaily.com/rss/earth_climate.xml',
    category: 'earth-sciences',
    description: 'Earth and climate sciences',
    reliability: 'high'
  },
  {
    name: 'Phys.org - Earth Sciences',
    url: 'https://phys.org/rss-feed/earth-news/',
    category: 'earth-sciences',
    description: 'Earth sciences and environmental news',
    reliability: 'high'
  },
  {
    name: 'Environmental Science News',
    url: 'https://www.environmentalscience.org/news/rss',
    category: 'earth-sciences',
    description: 'Environmental science research',
    reliability: 'medium'
  },
  
  // Technology & Engineering
  {
    name: 'Phys.org - Technology',
    url: 'https://phys.org/rss-feed/technology-news/',
    category: 'technology',
    description: 'Technology and innovation news',
    reliability: 'high'
  },
  {
    name: 'Science Daily - Technology',
    url: 'https://www.sciencedaily.com/rss/computers_math/technology.xml',
    category: 'technology',
    description: 'Technology and engineering advances',
    reliability: 'high'
  },
  {
    name: 'IEEE Spectrum',
    url: 'https://spectrum.ieee.org/rss/fulltext',
    category: 'technology',
    description: 'Engineering and technology insights',
    reliability: 'medium'
  }
];

// Legacy RSS feeds array for backward compatibility
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
    url: 'https://feeds.science.org/rss/science.xml'
  }
];

// Multiple RSS proxy services for better reliability
const RSS_PROXIES = [
  'https://api.rss2json.com/v1/api.json?rss_url=',
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?'
];

// Cache for API responses to prevent duplicate requests
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

async function fetchRSSFeed(feedUrl: string, sourceName: string, category?: JournalCategory): Promise<Article[]> {
  // Check cache first
  const cacheKey = `${sourceName}-${category}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${sourceName}`);
    return cached.data;
  }

  // Try RSS2JSON
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`RSS service error: ${data.message || 'Unknown parsing error'}`);
    }
    
    if (!data.items || data.items.length === 0) {
      console.warn(`No articles found in RSS feed for ${sourceName}`);
      return [];
    }
    
    const articles = data.items.slice(0, 8).map((item: any, index: number) => ({
      id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      title: item.title || 'Untitled Article',
      author: item.author || 'Editorial Team',
      source: sourceName,
      pubDate: item.pubDate || new Date().toISOString(),
      description: cleanDescription(item.description || item.content || ''),
      url: item.link || '#',
      category: item.categories || [],
      journalCategory: category || 'general-science',
    }));
    
    // Cache the successful response
    apiCache.set(cacheKey, { data: articles, timestamp: Date.now() });
    
    return articles;
    
  } catch (error) {
    console.warn(`Failed to fetch RSS feed for ${sourceName}:`, error instanceof Error ? error.message : error);
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

export async function fetchLatestScienceArticles(filterOptions?: FilterOptions): Promise<Article[]> {
  try {
    let sourcesToFetch = JOURNAL_SOURCES;
    
    // Apply category filter
    if (filterOptions?.category && filterOptions.category !== 'all') {
      sourcesToFetch = JOURNAL_SOURCES.filter(source => source.category === filterOptions.category);
    }
    
    // Apply source filter
    if (filterOptions?.sources && filterOptions.sources.length > 0) {
      sourcesToFetch = sourcesToFetch.filter(source => 
        filterOptions.sources!.includes(source.name)
      );
    }
    
    // Group sources by domain to ensure diversity and avoid overloading single domains
    const sourcesByDomain = new Map<string, JournalSource[]>();
    sourcesToFetch.forEach(source => {
      try {
        const domain = new URL(source.url).hostname;
        if (!sourcesByDomain.has(domain)) {
          sourcesByDomain.set(domain, []);
        }
        sourcesByDomain.get(domain)!.push(source);
      } catch (error) {
        // If URL parsing fails, treat as unique domain
        sourcesByDomain.set(source.url, [source]);
      }
    });
    
    // Limit sources per domain to prevent rate limiting (max 2 per domain)
    const maxSourcesPerDomain = 2;
    const diversifiedSources: JournalSource[] = [];
    
    sourcesByDomain.forEach((domainSources, domain) => {
      // Sort by reliability within each domain
      const sortedDomainSources = domainSources.sort((a, b) => {
        const reliabilityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return reliabilityOrder[a.reliability] - reliabilityOrder[b.reliability];
      });
      
      // Take up to maxSourcesPerDomain from each domain
      diversifiedSources.push(...sortedDomainSources.slice(0, maxSourcesPerDomain));
    });
    
    sourcesToFetch = diversifiedSources;
    
    // Limit total number of sources to prevent overwhelming requests
    const maxSources = 6; // Reasonable limit for performance
    if (sourcesToFetch.length > maxSources) {
      // Final sort by reliability across all sources
      sourcesToFetch = sourcesToFetch
        .sort((a, b) => {
          const reliabilityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
          return reliabilityOrder[a.reliability] - reliabilityOrder[b.reliability];
        })
        .slice(0, maxSources);
    }
    
    if (sourcesToFetch.length === 0) {
      console.warn('No sources available to fetch from');
      return [];
    }
    
    // Log domain distribution for debugging
    const domainCounts = new Map<string, number>();
    sourcesToFetch.forEach(source => {
      try {
        const domain = new URL(source.url).hostname;
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      } catch (error) {
        domainCounts.set('unknown', (domainCounts.get('unknown') || 0) + 1);
      }
    });
    
    console.log(`Fetching from ${sourcesToFetch.length} journal sources across ${domainCounts.size} domains:`);
    console.log('Sources:', sourcesToFetch.map(s => s.name).join(', '));
    
    if (domainCounts.size > 1) {
      const domainInfo = Array.from(domainCounts.entries())
        .map(([domain, count]) => `${domain}(${count})`)
        .join(', ');
      console.log('Domain distribution:', domainInfo);
    }
    
    // Fetch from selected sources
    const feedPromises = sourcesToFetch.map(source => 
      fetchRSSFeed(source.url, source.name, source.category)
    );
    
    const results = await Promise.allSettled(feedPromises);
    
    let allArticles: Article[] = [];
    let successfulSources = 0;
    let failedSources = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allArticles.push(...result.value);
        successfulSources++;
      } else {
        failedSources++;
        if (result.status === 'rejected') {
          console.warn(`Failed to fetch from ${sourcesToFetch[index].name}: ${result.reason}`);
        } else {
          console.warn(`No articles from ${sourcesToFetch[index].name}`);
        }
      }
    });
    
    console.log(`Successfully fetched from ${successfulSources}/${sourcesToFetch.length} sources`);
    
    // If no articles were fetched, return empty array with helpful message
    if (allArticles.length === 0) {
      console.warn('No articles available from any RSS feeds. This might be a temporary issue.');
      return [];
    }
    
    // Sort by publication date (most recent first)
    const sortedArticles = allArticles.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
    
    // Apply limit
    const limit = filterOptions?.limit || 50;
    const finalArticles = sortedArticles.slice(0, limit);
    
    console.log(`Returning ${finalArticles.length} articles from ${successfulSources} sources`);
    return finalArticles;
    
  } catch (error) {
    console.error('Error fetching science articles:', error);
    return [];
  }
}

// Clear cache function for explicit refresh actions
export function clearApiCache(): void {
  apiCache.clear();
  console.log('API cache cleared');
}

export function getAvailableJournalSources(): JournalSource[] {
  return JOURNAL_SOURCES;
}

export function getJournalSourcesByCategory(category: JournalCategory): JournalSource[] {
  if (category === 'all') {
    return JOURNAL_SOURCES;
  }
  return JOURNAL_SOURCES.filter(source => source.category === category);
}

export function generateArticleURL(article: Article): string {
  return article.url;
} 
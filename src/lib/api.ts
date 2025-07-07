import { Article, ADSResponse, APIError } from '@/types/article';

const ADS_API_BASE = 'https://api.adsabs.harvard.edu/v1/search/query';

// Since ADS API requires authentication, we'll implement a fallback approach
// with sample data for demonstration and try RSS feeds as backup

// Sample articles for demonstration when API is not available
const SAMPLE_ARTICLES: Article[] = [
  {
    bibcode: "2024ApJ...962..123S",
    title: ["Stellar Evolution in the Era of JWST: New Insights into Massive Star Formation"],
    author: ["Smith, J. A.", "Johnson, B. C.", "Brown, K. L."],
    pub: "The Astrophysical Journal",
    pubdate: "2024-01-15",
    abstract: "We present new observations from the James Webb Space Telescope revealing unprecedented details about massive star formation in nearby galaxies...",
    doi: ["10.3847/1538-4357/abc123"],
    doctype: "article",
    citations: 45,
    reads: 234
  },
  {
    bibcode: "2024ApJ...962..124T",
    title: ["Exoplanet Atmospheres: Chemical Composition and Temperature Profiles"],
    author: ["Taylor, M. R.", "Davis, L. K.", "Wilson, A. J."],
    pub: "The Astrophysical Journal",
    pubdate: "2024-01-14",
    abstract: "Analysis of spectroscopic data from multiple exoplanets reveals significant variations in atmospheric composition and thermal structure...",
    doi: ["10.3847/1538-4357/abc124"],
    doctype: "article",
    citations: 32,
    reads: 187
  },
  {
    bibcode: "2024ApJ...962..125K",
    title: ["Dark Matter Halos and Galaxy Formation: A Multi-Scale Approach"],
    author: ["Kim, S. H.", "Garcia, R. M.", "Thompson, E. L."],
    pub: "The Astrophysical Journal",
    pubdate: "2024-01-13",
    abstract: "We develop a new multi-scale simulation framework to study the relationship between dark matter halo properties and galaxy formation efficiency...",
    doi: ["10.3847/1538-4357/abc125"],
    doctype: "article",
    citations: 28,
    reads: 156
  },
  {
    bibcode: "2024ApJ...962..126L",
    title: ["Gravitational Wave Astronomy: Recent Discoveries and Future Prospects"],
    author: ["Lopez, C. A.", "Martinez, F. G.", "Chen, Y. W."],
    pub: "The Astrophysical Journal",
    pubdate: "2024-01-12",
    abstract: "Recent gravitational wave detections have opened new windows into the universe, providing insights into black hole mergers and neutron star collisions...",
    doi: ["10.3847/1538-4357/abc126"],
    doctype: "article",
    citations: 67,
    reads: 312
  },
  {
    bibcode: "2024ApJ...962..127A",
    title: ["Solar Coronal Heating: Magnetic Reconnection and Wave Dissipation"],
    author: ["Anderson, P. K.", "White, M. L.", "Black, N. R."],
    pub: "The Astrophysical Journal",
    pubdate: "2024-01-11",
    abstract: "New high-resolution observations of the solar corona reveal the complex interplay between magnetic reconnection events and Alfvén wave dissipation...",
    doi: ["10.3847/1538-4357/abc127"],
    doctype: "article",
    citations: 23,
    reads: 134
  }
];

async function fetchFromADS(query: string): Promise<Article[]> {
  try {
    // Note: Real ADS API requires authentication token
    // For demonstration, we'll use sample data
    // In production, you would need to:
    // 1. Get API token from https://ui.adsabs.harvard.edu/user/settings/token
    // 2. Add it to environment variables
    // 3. Include in Authorization header
    
    const API_TOKEN = process.env.ADS_API_TOKEN;
    
    if (!API_TOKEN) {
      console.log('ADS API token not available, using sample data');
      return SAMPLE_ARTICLES;
    }

    const response = await fetch(`${ADS_API_BASE}?q=${encodeURIComponent(query)}&fl=bibcode,title,author,pub,pubdate,abstract,doi,doctype,citation_count,read_count&rows=20&sort=pubdate desc`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ADS API error: ${response.status}`);
    }

    const data: ADSResponse = await response.json();
    return data.response.docs;
  } catch (error) {
    console.error('Failed to fetch from ADS API:', error);
    // Fallback to sample data
    return SAMPLE_ARTICLES;
  }
}

export async function fetchLatestAstrophysicsArticles(): Promise<Article[]> {
  try {
    // Query for recent articles from The Astrophysical Journal and related publications
    const query = 'pub:"The Astrophysical Journal" OR pub:"Astrophysical Journal" OR pub:"ApJ" year:2024';
    const articles = await fetchFromADS(query);

    console.log(articles);
    
    // Sort by publication date (most recent first)
    return articles.sort((a, b) => new Date(b.pubdate).getTime() - new Date(a.pubdate).getTime());
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch latest articles');
  }
}

export function generateArticleURL(article: Article): string {
  // Generate URL to the article - typically through ADS or publisher
  if (article.doi && article.doi.length > 0) {
    return `https://doi.org/${article.doi[0]}`;
  }
  
  // Fallback to ADS abstract page
  return `https://ui.adsabs.harvard.edu/abs/${article.bibcode}/abstract`;
} 
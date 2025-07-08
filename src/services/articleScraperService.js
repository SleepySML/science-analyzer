const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

class ArticleScraperService {
  constructor() {
    this.turndownService = new TurndownService();
    this.requestConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    };
  }

  async fetchArticleContent(url) {
    try {
      console.log(`📄 Fetching article content from: ${url}`);
      
      const response = await axios.get(url, this.requestConfig);
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract content based on common article selectors
      const content = this.extractContent($, url);
      
      if (content && content.length > 100) {
        console.log(`✅ Successfully extracted ${content.length} characters from article`);
        return content;
      } else {
        console.log(`⚠️ Article content too short or empty for: ${url}`);
        return 'Content not available';
      }
    } catch (error) {
      console.error(`❌ Error fetching article content from ${url}:`, error.message);
      return 'Content not available';
    }
  }

  extractContent($, url) {
    let content = '';
    
    // Try different selectors based on the journal/website
    if (url.includes('nature.com')) {
      content = this.extractNatureContent($);
    } else if (url.includes('science.org')) {
      content = this.extractScienceContent($);
    } else if (url.includes('pnas.org')) {
      content = this.extractPNASContent($);
    } else if (url.includes('cell.com')) {
      content = this.extractCellContent($);
    } else if (url.includes('thelancet.com')) {
      content = this.extractLancetContent($);
    } else if (url.includes('nejm.org')) {
      content = this.extractNEJMContent($);
    } else if (url.includes('journals.plos.org')) {
      content = this.extractPLOSContent($);
    } else if (url.includes('pubs.acs.org')) {
      content = this.extractACSContent($);
    } else if (url.includes('ieeexplore.ieee.org')) {
      content = this.extractIEEEContent($);
    } else {
      // Generic content extraction
      content = this.extractGenericContent($);
    }
    
    return this.cleanContent(content);
  }

  extractNatureContent($) {
    // Nature articles content selectors
    const selectors = [
      'div[data-test="article-body"]',
      '.c-article-body',
      '.article-body',
      'div.content',
      'main article',
      '.main-content'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractScienceContent($) {
    // Science.org content selectors
    const selectors = [
      '.article-fulltext',
      '.article-content',
      '.article-body',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractPNASContent($) {
    // PNAS content selectors
    const selectors = [
      '.article-fulltext',
      '.article-content',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractCellContent($) {
    // Cell content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractLancetContent($) {
    // The Lancet content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractNEJMContent($) {
    // NEJM content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractPLOSContent($) {
    // PLOS content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractACSContent($) {
    // ACS content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractIEEEContent($) {
    // IEEE content selectors
    const selectors = [
      '.article-content',
      '.article-body',
      '.fulltext-view',
      'div.content',
      'main article'
    ];
    
    return this.trySelectors($, selectors);
  }

  extractGenericContent($) {
    // Generic content selectors for unknown sites
    const selectors = [
      'article',
      '.article-content',
      '.article-body',
      '.post-content',
      '.content',
      '.main-content',
      'main',
      '.entry-content',
      '.post-text',
      '.text-content'
    ];
    
    return this.trySelectors($, selectors);
  }

  trySelectors($, selectors) {
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > 100) {
          return text;
        }
      }
    }
    
    // If no specific selector works, try to get all paragraphs
    const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
    return paragraphs.join('\n\n');
  }

  cleanContent(content) {
    if (!content) return '';
    
    return content
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n')  // Clean up multiple newlines
      .replace(/^\s+|\s+$/g, '')  // Trim whitespace
      .replace(/\t/g, ' ')  // Replace tabs with spaces
      .substring(0, 10000);  // Limit content length to prevent database bloat
  }

  async batchFetchArticles(articles) {
    const results = [];
    const batchSize = 3; // Process 3 articles at a time to avoid overwhelming servers
    
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      const batchPromises = batch.map(async (article) => {
        const content = await this.fetchArticleContent(article.link);
        return {
          ...article,
          content
        };
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to be respectful to servers
      if (i + batchSize < articles.length) {
        await this.delay(1000);
      }
    }
    
    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new ArticleScraperService(); 
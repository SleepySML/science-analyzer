const RSSParser = require('rss-parser');
const axios = require('axios');
const { getAllJournals, getJournalsByArea, getAllAreas } = require('../config/journals');

class JournalService {
  constructor() {
    this.parser = new RSSParser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Science-Analyzer-Backend/1.0'
      }
    });
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  async fetchArticlesFromJournal(journal) {
    try {
      console.log(`Fetching articles from ${journal.name}...`);
      
      // Check cache first
      const cacheKey = `${journal.name}_articles`;
      const cachedData = this.cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log(`Using cached data for ${journal.name}`);
        return cachedData.articles;
      }

      const feed = await this.parser.parseURL(journal.rssUrl);
      
      const articles = feed.items.slice(0, 10).map(item => ({
        id: item.guid || item.link,
        title: item.title,
        link: item.link,
        description: item.contentSnippet || item.content || item.description,
        publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(item.isoDate),
        author: item.creator || item.author || 'Unknown',
        journal: journal.name,
        journalUrl: journal.url,
        area: journal.area,
        impact: journal.impact
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        articles,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${articles.length} articles from ${journal.name}`);
      return articles;
    } catch (error) {
      console.error(`Error fetching articles from ${journal.name}:`, error.message);
      return [];
    }
  }

  async fetchArticlesByArea(area) {
    const journals = getJournalsByArea(area);
    
    if (journals.length === 0) {
      throw new Error(`No journals found for area: ${area}`);
    }

    const articlePromises = journals.map(journal => this.fetchArticlesFromJournal(journal));
    const articlesArrays = await Promise.all(articlePromises);
    
    // Flatten and sort by published date
    const allArticles = articlesArrays
      .flat()
      .filter(article => article.publishedDate)
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return {
      area,
      totalArticles: allArticles.length,
      journals: journals.map(j => j.name),
      articles: allArticles
    };
  }

  async fetchAllArticles() {
    const areas = getAllAreas();
    const areaPromises = areas.map(area => this.fetchArticlesByArea(area));
    const areaResults = await Promise.all(areaPromises);
    
    const allArticles = areaResults
      .map(result => result.articles)
      .flat()
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return {
      totalArticles: allArticles.length,
      areas: areas.length,
      journals: getAllJournals().length,
      results: areaResults,
      latestArticles: allArticles.slice(0, 50) // Return top 50 most recent
    };
  }

  async getJournalStatus() {
    const journals = getAllJournals();
    const statusPromises = journals.map(async (journal) => {
      try {
        const articles = await this.fetchArticlesFromJournal(journal);
        return {
          name: journal.name,
          area: journal.area,
          status: 'online',
          articleCount: articles.length,
          lastUpdated: articles.length > 0 ? articles[0].publishedDate : null
        };
      } catch (error) {
        return {
          name: journal.name,
          area: journal.area,
          status: 'offline',
          error: error.message,
          articleCount: 0,
          lastUpdated: null
        };
      }
    });

    const statuses = await Promise.all(statusPromises);
    return {
      totalJournals: journals.length,
      onlineJournals: statuses.filter(s => s.status === 'online').length,
      offlineJournals: statuses.filter(s => s.status === 'offline').length,
      journals: statuses
    };
  }

  clearCache() {
    this.cache.clear();
    console.log('Cache cleared');
  }
}

module.exports = new JournalService(); 
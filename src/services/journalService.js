const RSSParser = require('rss-parser');
const axios = require('axios');
const { getAllJournals, getJournalsByArea, getAllAreas } = require('../config/journals');
const databaseService = require('./databaseService');
const articleScraperService = require('./articleScraperService');
const telegramService = require('./telegramService');

class JournalService {
  constructor() {
    this.parser = new RSSParser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Science-Analyzer-Backend/1.0'
      }
    });
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
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

      // Filter articles that are not in the database
      const newArticles = [];
      for (const article of articles) {
        const exists = await databaseService.articleExists(article.link);
        if (!exists) {
          newArticles.push(article);
        }
      }

      console.log(`Found ${newArticles.length} new articles out of ${articles.length} from ${journal.name}`);

      // Fetch content for new articles and store in database
      if (newArticles.length > 0) {
        const articlesWithContent = await articleScraperService.batchFetchArticles(newArticles);
        const successfullyInsertedArticles = [];
        
        for (const article of articlesWithContent) {
          try {
            await databaseService.insertArticle(article);
            successfullyInsertedArticles.push(article);
          } catch (error) {
            console.error(`Error inserting article: ${article.title}`, error.message);
          }
        }

        // Send new articles to Telegram channel
        if (successfullyInsertedArticles.length > 0) {
          try {
            await telegramService.sendBatchArticlesToChannel(successfullyInsertedArticles);
          } catch (error) {
            console.error('Error sending articles to Telegram:', error.message);
          }
        }
      }

      // Get all articles from database for this journal
      const dbArticles = await databaseService.getArticlesByJournal(journal.name, 10);
      
      // Cache the results
      this.cache.set(cacheKey, {
        articles: dbArticles,
        timestamp: Date.now()
      });

      console.log(`Successfully processed ${articles.length} articles from ${journal.name} (${newArticles.length} new)`);
      return dbArticles;
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

    // First, fetch articles from all journals in this area (this will process new articles)
    const articlePromises = journals.map(journal => this.fetchArticlesFromJournal(journal));
    await Promise.all(articlePromises);
    
    // Then get articles from database for this area
    const allArticles = await databaseService.getArticlesByArea(area, 50);

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
    
    // Get all articles from database
    const allArticles = await databaseService.getAllArticles(100);
    const stats = await databaseService.getStatistics();

    return {
      totalArticles: stats.total_articles || 0,
      areas: areas.length,
      journals: getAllJournals().length,
      results: areaResults,
      latestArticles: allArticles.slice(0, 50), // Return top 50 most recent
      statistics: stats
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
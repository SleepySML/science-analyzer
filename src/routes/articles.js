const express = require('express');
const router = express.Router();
const journalService = require('../services/journalService');
const databaseService = require('../services/databaseService');
const telegramService = require('../services/telegramService');
const openaiService = require('../services/openaiService');
const { getAllAreas } = require('../config/journals');

// Get all articles from all journals
router.get('/', async (req, res) => {
  try {
    const result = await journalService.fetchAllArticles();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching all articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
      message: error.message
    });
  }
});

// Get articles by specific area
router.get('/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const validAreas = getAllAreas();
    
    if (!validAreas.includes(area)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid area',
        message: `Area must be one of: ${validAreas.join(', ')}`
      });
    }

    const result = await journalService.fetchArticlesByArea(area);
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error fetching articles for area ${req.params.area}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles for area',
      message: error.message
    });
  }
});

// Get available areas
router.get('/areas', (req, res) => {
  try {
    const areas = getAllAreas();
    res.json({
      success: true,
      data: {
        areas: areas.map(area => ({
          id: area,
          name: area.charAt(0).toUpperCase() + area.slice(1).replace(/([A-Z])/g, ' $1')
        })),
        totalAreas: areas.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching areas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch areas',
      message: error.message
    });
  }
});

// Get journal status
router.get('/status', async (req, res) => {
  try {
    const result = await journalService.getJournalStatus();
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching journal status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journal status',
      message: error.message
    });
  }
});

// Clear cache
router.post('/cache/clear', (req, res) => {
  try {
    journalService.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache',
      message: error.message
    });
  }
});

// Get latest articles (limited number)
router.get('/latest/:count?', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 20;
    
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid count',
        message: 'Count must be between 1 and 100'
      });
    }

    const result = await journalService.fetchAllArticles();
    const latestArticles = result.latestArticles.slice(0, count);
    
    res.json({
      success: true,
      data: {
        articles: latestArticles,
        totalArticles: latestArticles.length,
        requestedCount: count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest articles',
      message: error.message
    });
  }
});

// Process new articles and store in database
router.post('/process', async (req, res) => {
  try {
    console.log('🚀 Manual article processing triggered...');
    const articlesData = await journalService.fetchAllArticles();
    
    res.json({
      success: true,
      message: 'Articles processed successfully',
      data: {
        totalArticles: articlesData.totalArticles,
        areas: articlesData.areas,
        journals: articlesData.journals,
        statistics: articlesData.statistics
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process articles',
      message: error.message
    });
  }
});

// Get articles from database
router.get('/database', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const articles = await databaseService.getAllArticles(limit);
    const stats = await databaseService.getStatistics();
    
    res.json({
      success: true,
      data: {
        articles,
        statistics: stats,
        count: articles.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching articles from database:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles from database',
      message: error.message
    });
  }
});

// Search articles in database
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const limit = parseInt(req.query.limit) || 20;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required',
        message: 'Please provide a search term using the "q" parameter'
      });
    }
    
    const articles = await databaseService.searchArticles(searchTerm, limit);
    
    res.json({
      success: true,
      data: {
        articles,
        searchTerm,
        count: articles.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search articles',
      message: error.message
    });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await databaseService.getStatistics();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Clear database
router.delete('/database', async (req, res) => {
  try {
    await databaseService.clearDatabase();
    
    res.json({
      success: true,
      message: 'Database cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear database',
      message: error.message
    });
  }
});

// Get Telegram bot configuration
router.get('/telegram/config', (req, res) => {
  try {
    const config = telegramService.getConfig();
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting Telegram config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Telegram configuration',
      message: error.message
    });
  }
});

// Test Telegram bot connection
router.post('/telegram/test', async (req, res) => {
  try {
    const result = await telegramService.testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Telegram bot connection successful',
        data: {
          botInfo: result.botInfo,
          chatInfo: result.chatInfo
        },
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error testing Telegram connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test Telegram connection',
      message: error.message
    });
  }
});

// Send summary message to Telegram channel
router.post('/telegram/send-summary', async (req, res) => {
  try {
    const stats = await databaseService.getStatistics();
    const areas = getAllAreas();
    
    const result = await telegramService.sendSummaryMessage(
      stats.total_articles || 0,
      stats.articles_today || 0,
      areas.length,
      stats.total_journals || 0
    );
    
    if (result) {
      res.json({
        success: true,
        message: 'Summary sent to Telegram channel',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to send summary message',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error sending Telegram summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send summary to Telegram',
      message: error.message
    });
  }
});

// Get OpenAI service configuration
router.get('/openai/config', (req, res) => {
  try {
    const config = openaiService.getConfig();
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting OpenAI config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get OpenAI configuration',
      message: error.message
    });
  }
});

// Test OpenAI service with sample article
router.post('/openai/test', async (req, res) => {
  try {
    const testArticle = {
      title: 'Test Article for AI Analysis',
      journal: 'Nature',
      area: 'General Science',
      author: 'Test Author',
      published_date: new Date().toISOString(),
      content: 'This is a test article to verify that the OpenAI service is working correctly. It contains sample scientific content that should be analyzed by the AI model to generate a summary with key findings, scientific impact, and industry applications.'
    };
    
    const analysis = await openaiService.analyzeArticle(testArticle);
    
    res.json({
      success: true,
      message: 'OpenAI test successful',
      data: {
        testArticle: testArticle,
        analysis: analysis
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing OpenAI service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test OpenAI service',
      message: error.message
    });
  }
});

module.exports = router; 
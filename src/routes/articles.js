const express = require('express');
const router = express.Router();
const journalService = require('../services/journalService');
const htmlGeneratorService = require('../services/htmlGeneratorService');
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

// Generate HTML file with articles
router.post('/generate-html', async (req, res) => {
  try {
    console.log('🚀 Manual HTML generation triggered...');
    const articlesData = await journalService.fetchAllArticles();
    await htmlGeneratorService.writeHtmlFile(articlesData);
    
    res.json({
      success: true,
      message: 'HTML file generated successfully',
      data: {
        totalArticles: articlesData.totalArticles,
        areas: articlesData.areas,
        journals: articlesData.journals
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating HTML:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate HTML file',
      message: error.message
    });
  }
});

module.exports = router; 
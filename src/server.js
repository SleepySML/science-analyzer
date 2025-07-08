const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const articlesRoutes = require('./routes/articles');
const journalService = require('./services/journalService');
const databaseService = require('./services/databaseService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articlesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Function to process articles and store in database
async function processArticles() {
  try {
    console.log('🚀 Starting article processing...');
    const articlesData = await journalService.fetchAllArticles();
    const stats = await databaseService.getStatistics();
    console.log('✅ Article processing completed!');
    console.log(`📊 Database contains ${stats.total_articles} articles from ${stats.total_journals} journals`);
  } catch (error) {
    console.error('❌ Error processing articles:', error);
  }
}

app.listen(PORT, async () => {
  console.log(`Science Analyzer Backend running on port ${PORT}`);
  
  // Process articles on startup
  await processArticles();
  
  // Optional: Process articles every 6 hours (comment out if not needed)
  // setInterval(processArticles, 6 * 60 * 60 * 1000);
});

module.exports = app; 
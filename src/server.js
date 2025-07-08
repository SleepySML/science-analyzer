const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const articlesRoutes = require('./routes/articles');
const journalService = require('./services/journalService');
const htmlGeneratorService = require('./services/htmlGeneratorService');

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

// Function to generate HTML file with articles
async function generateHtmlFile() {
  try {
    console.log('🚀 Starting article fetching and HTML generation...');
    const articlesData = await journalService.fetchAllArticles();
    await htmlGeneratorService.writeHtmlFile(articlesData);
    console.log('✅ HTML file generation completed!');
  } catch (error) {
    console.error('❌ Error generating HTML file:', error);
  }
}

app.listen(PORT, async () => {
  console.log(`Science Analyzer Backend running on port ${PORT}`);
  
  // Generate HTML file on startup
  await generateHtmlFile();
  
  // Regenerate HTML file every hour
  setInterval(generateHtmlFile, 60 * 60 * 1000);
});

module.exports = app; 
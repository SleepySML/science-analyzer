const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

class OpenAIService {
  constructor() {
    this.apiToken = process.env.OPEN_ROUTER_API_TOKEN;
    this.baseURL = process.env.OPEN_ROUTER_BASE_URL;
    this.model = process.env.OPEN_ROUTER_MODEL || 'gpt-4o-mini';
    this.client = null;
    this.isEnabled = false;
    
    this.initializeClient();
  }

  initializeClient() {
    if (!this.apiToken || !this.baseURL) {
      console.log('⚠️ OpenAI service not configured - missing OPEN_ROUTER_API_TOKEN or OPEN_ROUTER_BASE_URL in .env');
      this.isEnabled = false;
      return;
    }

    try {
      this.client = new OpenAI({
        apiKey: this.apiToken,
        baseURL: this.baseURL
      });
      this.isEnabled = true;
      console.log('✅ OpenAI service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing OpenAI service:', error.message);
      this.isEnabled = false;
    }
  }

  async analyzeArticle(article) {
    if (!this.isEnabled) {
      console.log('⚠️ OpenAI service not enabled, skipping article analysis');
      return this.getFallbackSummary(article);
    }

    // Skip analysis if content is not available or behind paywall
    if (!article.content || 
        article.content === 'Content not available' || 
        article.content.includes('subscription to access')) {
      return this.getFallbackSummary(article);
    }

    try {
      const prompt = this.createAnalysisPrompt(article);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert scientific analyst. Analyze research articles and provide concise, informative summaries for a Telegram channel focused on scientific breakthroughs. Be professional, accurate, and highlight practical applications.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const analysis = response.choices[0].message.content;
      console.log(`✅ Article analysis generated for: "${article.title}"`);
      return analysis;

    } catch (error) {
      console.error('❌ Error generating article analysis:', error.message);
      return this.getFallbackSummary(article);
    }
  }

  createAnalysisPrompt(article) {
    return `
Analyze this scientific article and provide a concise summary formatted for Telegram:

**Article Details:**
- Title: ${article.title}
- Journal: ${article.journal}
- Scientific Area: ${article.area}
- Author: ${article.author}
- Published: ${article.published_date ? new Date(article.published_date).toLocaleDateString() : 'Unknown'}

**Article Content:**
${article.content.substring(0, 3000)}...

**Please provide a structured analysis in the following format:**

📊 **Summary:**
[2-3 sentences explaining what this research is about and its key findings]

🔬 **Scientific Impact:**
[1-2 sentences about which scientific fields this could influence]

🏭 **Industry Applications:**
[1-2 sentences about companies or industries that could benefit from this research]

🌟 **Key Takeaway:**
[1 sentence highlighting the most important aspect for general audience]

Keep the response under 400 characters and use emojis appropriately for Telegram formatting.
`;
  }

  getFallbackSummary(article) {
    const description = article.description || 'No description available';
    const preview = description.length > 200 ? description.substring(0, 200) + '...' : description;
    
    return `📖 **Research Summary:**
${preview}

🔬 **Field:** ${article.area}
📑 **Published in:** ${article.journal}

🔗 Read the full study to learn more about this research.`;
  }

  async batchAnalyzeArticles(articles) {
    if (!this.isEnabled) {
      console.log('⚠️ OpenAI service not enabled, using fallback summaries');
      return articles.map(article => ({
        ...article,
        aiSummary: this.getFallbackSummary(article)
      }));
    }

    console.log(`🤖 Analyzing ${articles.length} articles with AI...`);
    
    const analyzedArticles = [];
    const batchSize = 3; // Process 3 articles at once to avoid rate limits
    
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      const promises = batch.map(async (article) => {
        const analysis = await this.analyzeArticle(article);
        return {
          ...article,
          aiSummary: analysis
        };
      });
      
      const batchResults = await Promise.allSettled(promises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          analyzedArticles.push(result.value);
        } else {
          console.error(`❌ Failed to analyze article: ${batch[index].title}`);
          analyzedArticles.push({
            ...batch[index],
            aiSummary: this.getFallbackSummary(batch[index])
          });
        }
      });
      
      // Add delay between batches to be respectful of rate limits
      if (i + batchSize < articles.length) {
        await this.delay(2000); // 2 second delay
      }
    }
    
    console.log(`✅ Completed AI analysis for ${analyzedArticles.length} articles`);
    return analyzedArticles;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isReady() {
    return this.isEnabled;
  }

  getConfig() {
    return {
      enabled: this.isEnabled,
      hasApiToken: !!this.apiToken,
      hasBaseURL: !!this.baseURL,
      model: this.model,
      baseURL: this.baseURL
    };
  }
}

module.exports = new OpenAIService(); 
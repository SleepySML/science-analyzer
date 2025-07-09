const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

dotenv.config();

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.channelId = process.env.CHANNEL_ID;
    this.bot = null;
    this.isEnabled = false;
    
    this.initializeBot();
  }

  initializeBot() {
    if (!this.botToken || !this.channelId) {
      console.log('⚠️ Telegram bot not configured - missing TELEGRAM_BOT_TOKEN or CHANNEL_ID in .env');
      this.isEnabled = false;
      return;
    }

    try {
      this.bot = new TelegramBot(this.botToken, { polling: false });
      this.isEnabled = true;
      console.log('✅ Telegram bot initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Telegram bot:', error.message);
      this.isEnabled = false;
    }
  }

  formatArticleMessage(article) {
    // Create a nicely formatted message for Telegram
    const title = this.escapeMarkdown(article.title);
    const journal = this.escapeMarkdown(article.journal);
    const area = this.escapeMarkdown(article.area);
    const author = this.escapeMarkdown(article.author || 'Unknown');
    const link = article.link;

    // Get a preview of the article content (first 200 characters)
    let preview = '';
    if (article.content && article.content.length > 50) {
      // Check if content is behind paywall
      if (article.content.includes('subscription to access')) {
        preview = '🔒 Premium Content - Subscription Required';
      } else if (article.content === 'Content not available') {
        preview = '⚠️ Content not available';
      } else {
        preview = article.content.substring(0, 200).trim();
        if (preview.length === 200) {
          preview += '...';
        }
        preview = this.escapeMarkdown(preview);
      }
    }

    // Format the date
    const publishedDate = article.published_date ? 
      new Date(article.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Unknown date';

    // Create the message with Markdown formatting
    let message = `🔬 *New Scientific Article*\n\n`;
    message += `📄 *${title}*\n\n`;
    message += `📊 *Journal:* ${journal}\n`;
    message += `🧪 *Area:* ${area}\n`;
    message += `👤 *Author:* ${author}\n`;
    message += `📅 *Published:* ${publishedDate}\n\n`;
    
    if (preview) {
      message += `📝 *Preview:*\n${preview}\n\n`;
    }
    
    message += `🔗 [Read Full Article](${link})`;

    return message;
  }

  escapeMarkdown(text) {
    if (!text) return '';
    // Escape special Markdown characters for Telegram
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
  }

  async sendArticleToChannel(article) {
    if (!this.isEnabled) {
      console.log('⚠️ Telegram bot not enabled, skipping message send');
      return false;
    }

    try {
      const message = this.formatArticleMessage(article);
            
      // Send message to channel
      const result = await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        disable_notification: false
      });

      console.log(`✅ Article sent to Telegram channel: "${article.title}"`);
      return result;
    } catch (error) {
      console.error(`❌ Error sending article to Telegram:`, error.message);
      
      // Try sending without Markdown if formatting failed
      if (error.message.includes('parse')) {
        try {
          const simpleMessage = `🔬 New Scientific Article\n\n${article.title}\n\nJournal: ${article.journal}\nArea: ${article.area}\nAuthor: ${article.author || 'Unknown'}\n\nRead more: ${article.link}`;
          
          const result = await this.bot.sendMessage(this.channelId, simpleMessage, {
            disable_web_page_preview: false,
            disable_notification: false
          });
          
          console.log(`✅ Article sent to Telegram channel (simplified format): "${article.title}"`);
          return result;
        } catch (secondError) {
          console.error(`❌ Failed to send simplified message:`, secondError.message);
          return false;
        }
      }
      
      return false;
    }
  }

  async sendBatchArticlesToChannel(articles) {
    if (!this.isEnabled) {
      console.log('⚠️ Telegram bot not enabled, skipping batch send');
      return { sent: 0, failed: 0 };
    }

    if (!articles || articles.length === 0) {
      console.log('ℹ️ No articles to send to Telegram');
      return { sent: 0, failed: 0 };
    }

    console.log(`📤 Sending ${articles.length} new articles to Telegram channel...`);
    
    let sent = 0;
    let failed = 0;
    
    for (const article of articles) {
      const result = await this.sendArticleToChannel(article);
      
      if (result) {
        sent++;
      } else {
        failed++;
      }
      
      // Add a small delay between messages to avoid rate limiting
      if (articles.length > 1) {
        await this.delay(1000); // 1 second delay
      }
    }

    console.log(`📊 Telegram batch send completed: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }

  async sendSummaryMessage(totalArticles, newArticles, areas, journals) {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const message = `📊 *Science Analyzer Update*\n\n` +
        `🔬 Total articles in database: ${totalArticles}\n` +
        `🆕 New articles processed: ${newArticles}\n` +
        `📚 Scientific areas: ${areas}\n` +
        `📖 Active journals: ${journals}\n\n` +
        `🤖 Automated by Science Analyzer Bot`;

      const result = await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'Markdown',
        disable_notification: true // Summary messages are less urgent
      });

      console.log('✅ Summary message sent to Telegram channel');
      return result;
    } catch (error) {
      console.error('❌ Error sending summary to Telegram:', error.message);
      return false;
    }
  }

  async testConnection() {
    if (!this.isEnabled) {
      return { success: false, error: 'Bot not configured' };
    }

    try {
      const me = await this.bot.getMe();
      console.log(`✅ Telegram bot test successful: @${me.username}`);
      
      // Try to get chat info
      const chat = await this.bot.getChat(this.channelId);
      console.log(`✅ Channel access confirmed: ${chat.title || chat.username || this.channelId}`);
      
      return { 
        success: true, 
        botInfo: me, 
        chatInfo: chat 
      };
    } catch (error) {
      console.error('❌ Telegram bot test failed:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
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
      hasToken: !!this.botToken,
      hasChannelId: !!this.channelId,
      channelId: this.channelId
    };
  }
}

module.exports = new TelegramService(); 
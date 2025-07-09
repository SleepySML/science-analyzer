# Science Analyzer Backend

A Node.js backend service that fetches the latest articles from top science journals, filters them by database content, and stores full article text in SQLite database.

## Features

- Fetches articles from top 3 journals in each scientific area
- **SQLite Database Integration**: Stores articles with full content in local database
- **Smart Filtering**: Only processes articles that are not already in the database
- **Full Article Content**: Extracts and stores article text without HTML tags
- **Paywall Detection**: Identifies subscription-required content and provides appropriate messages
- **Database Access**: Compatible with DBeaver for database management
- Supports 7 scientific areas: General Science, Physics, Biology, Chemistry, Medicine, Engineering, and Environmental Science
- Built-in caching to reduce API calls and improve performance
- RESTful API endpoints for easy integration
- **Full-text Search**: Search articles by title, content, or description
- Journal status monitoring
- Error handling and logging

## Scientific Areas and Journals

### General Science
- Nature
- Science
- PNAS

### Physics
- Physical Review Letters
- Nature Physics
- Physical Review X

### Biology
- Cell
- Nature Biotechnology
- PLOS Biology

### Chemistry
- Nature Chemistry
- Journal of the American Chemical Society
- Chemical Science

### Medicine
- The Lancet
- New England Journal of Medicine
- Nature Medicine

### Engineering
- Nature Engineering
- Science Robotics
- IEEE Transactions on Pattern Analysis and Machine Intelligence

### Environmental Science
- Nature Climate Change
- Environmental Science & Technology
- Global Environmental Change

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_PATH=./database/articles.db

# Telegram Bot Configuration (Optional)
# Get your bot token from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Telegram Channel ID where articles will be sent
# For channels, use format: @channel_username or -100xxxxxxxxxx (for private channels)
# For groups, use the group ID (usually starts with -)
CHANNEL_ID=@your_channel_username_here
```

3. **Setup Telegram Bot (Optional):**

   If you want to automatically send new articles to a Telegram channel:

   a. **Create a Telegram Bot:**
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` command
   - Choose a name and username for your bot
   - Copy the bot token provided

   b. **Setup Channel:**
   - Create a Telegram channel or use an existing one
   - Add your bot as an administrator to the channel
   - Get the channel username (e.g., `@science_articles`) or channel ID

   c. **Configure Environment:**
   - Add `TELEGRAM_BOT_TOKEN` with your bot token
   - Add `CHANNEL_ID` with your channel username or ID

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database

The system uses SQLite database to store articles with full content. The database file is located at `database/articles.db`.

### Database Schema

```sql
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  link TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT,
  journal TEXT NOT NULL,
  journal_url TEXT,
  area TEXT NOT NULL,
  impact TEXT,
  published_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Using DBeaver to View Database

1. **Download DBeaver**: Download from [dbeaver.io](https://dbeaver.io/)
2. **Install DBeaver**: Follow the installation instructions
3. **Create New Connection**:
   - Click "New Database Connection"
   - Select "SQLite" from the list
   - Click "Next"
4. **Configure Connection**:
   - Path: Browse to your project folder and select `database/articles.db`
   - Click "Test Connection" to verify
   - Click "Finish"
5. **Browse Data**:
   - Expand the connection in the Database Navigator
   - Navigate to: `articles.db` → `main` → `Tables` → `articles`
   - Right-click on `articles` table and select "Open Data"

### Database Operations

The system automatically:
- **Filters articles**: Only processes articles not already in database
- **Fetches content**: Downloads full article text from web pages
- **Paywall Detection**: Identifies subscription-required content and provides appropriate messages
- **Stores data**: Saves articles with clean text content (no HTML tags)
- **Maintains uniqueness**: Uses article link as unique identifier

### Paywall Detection

The system includes intelligent paywall detection that identifies when article content is behind a subscription paywall:

**Detection Methods:**
- **Keyword Analysis**: Scans for common paywall phrases like "subscription required", "sign in to read", "premium content"
- **CSS Selectors**: Detects paywall-specific HTML elements like `.paywall`, `.subscription-required`, `.premium-content`
- **Journal-Specific**: Custom detection for major journals (Nature, Science, Cell, Lancet, NEJM, etc.)
- **Content Analysis**: Evaluates extracted content for subscription indicators

**Paywall Message:**
When content is behind a paywall, the system stores:
```
"This article content is not freely available and requires a subscription to access. Please visit the journal website to read the full article."
```

**Benefits:**
- Clear indication when content is not freely available
- Prevents misleading partial content extraction
- Maintains consistent data quality
- Provides guidance to users on where to access full content

## API Endpoints

### GET /api/articles
Fetch all articles from all journals across all areas (processes new articles).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalArticles": 150,
    "areas": 7,
    "journals": 21,
    "results": [...],
    "latestArticles": [...],
    "statistics": {
      "total_articles": 150,
      "total_journals": 12,
      "total_areas": 7,
      "last_updated": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/articles/database
Get articles directly from the database (no processing).

**Parameters:**
- `limit` (optional): Number of articles to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Article Title",
        "link": "https://...",
        "content": "Full article content...",
        "author": "Author Name",
        "journal": "Journal Name",
        "area": "Scientific Area",
        "published_date": "2024-01-15T10:00:00.000Z",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "statistics": {...},
    "count": 20
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/articles/search
Search articles by title, content, or description.

**Parameters:**
- `q` (required): Search term
- `limit` (optional): Number of results (default: 20)

**Example:**
```bash
curl "http://localhost:3001/api/articles/search?q=climate&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "searchTerm": "climate",
    "count": 5
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/articles/stats
Get database statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_articles": 150,
    "total_journals": 12,
    "total_areas": 7,
    "last_updated": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/articles/area/:area
Fetch articles from a specific scientific area.

**Parameters:**
- `area`: One of `generalScience`, `physics`, `biology`, `chemistry`, `medicine`, `engineering`, `environmental`

**Example:**
```bash
curl http://localhost:3001/api/articles/area/physics
```

### GET /api/articles/areas
Get all available scientific areas.

**Response:**
```json
{
  "success": true,
  "data": {
    "areas": [
      {"id": "generalScience", "name": "General Science"},
      {"id": "physics", "name": "Physics"},
      ...
    ],
    "totalAreas": 7
  }
}
```

### GET /api/articles/latest/:count
Fetch the latest N articles across all journals.

**Parameters:**
- `count`: Number of articles to return (1-100, default: 20)

**Example:**
```bash
curl http://localhost:3001/api/articles/latest/10
```

### GET /api/articles/status
Get the status of all journals (online/offline).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJournals": 21,
    "onlineJournals": 20,
    "offlineJournals": 1,
    "journals": [...]
  }
}
```

### POST /api/articles/process
Manually trigger article processing (fetch new articles and store in database).

**Response:**
```json
{
  "success": true,
  "message": "Articles processed successfully",
  "data": {
    "totalArticles": 150,
    "areas": 7,
    "journals": 21,
    "statistics": {...}
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/articles/cache/clear
Clear the article cache.

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

### DELETE /api/articles/database
Clear all articles from the database.

**Response:**
```json
{
  "success": true,
  "message": "Database cleared successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Telegram Bot API

The following endpoints are available for Telegram bot integration:

### GET /api/articles/telegram/config
Get current Telegram bot configuration status.

**Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "hasToken": true,
    "hasChannelId": true,
    "channelId": "@science_articles"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/articles/telegram/test
Test Telegram bot connection and channel access.

**Response:**
```json
{
  "success": true,
  "message": "Telegram bot connection successful",
  "data": {
    "botInfo": {
      "id": 123456789,
      "first_name": "Science Bot",
      "username": "science_analyzer_bot"
    },
    "chatInfo": {
      "id": -1001234567890,
      "title": "Science Articles Channel",
      "type": "channel"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/articles/telegram/send-summary
Send a summary message to the Telegram channel with current statistics.

**Response:**
```json
{
  "success": true,
  "message": "Summary sent to Telegram channel",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Automatic Telegram Features

When Telegram bot is configured and enabled:

- **New Article Notifications**: Automatically sends new articles to the channel when they are processed and stored in the database
- **Rich Formatting**: Articles are formatted with titles, journal info, authors, publication dates, and content previews
- **Rate Limiting**: Built-in delays between messages to avoid Telegram rate limits
- **Error Handling**: Fallback to simplified formatting if Markdown parsing fails
- **Batch Processing**: Efficiently handles multiple new articles at once

### Telegram Message Format

New articles are sent to the channel with the following format:

```
🔬 **New Scientific Article**

📄 **Article Title Here**

📊 **Journal:** Journal Name
🧪 **Area:** Scientific Area
👤 **Author:** Author Name
📅 **Published:** Jan 15, 2024

📝 **Preview:**
First 200 characters of article content...
OR
🔒 Premium Content - Subscription Required

🔗 [Read Full Article](https://journal.com/article-url)
```

## Article Data Structure

Each article in the database contains the following fields:

```json
{
  "id": 1,
  "title": "Article Title",
  "link": "https://journal.com/article-url",
  "description": "Article abstract or description",
  "content": "Full article text content without HTML tags...",
  "author": "Author Name",
  "journal": "Journal Name",
  "journal_url": "https://journal.com",
  "area": "Scientific Area",
  "impact": "High",
  "published_date": "2024-01-15T10:00:00.000Z",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### Key Features:
- **Unique Links**: Each article link is unique in the database
- **Full Content**: Complete article text without HTML tags
- **Automatic Timestamps**: Created and updated timestamps
- **Rich Metadata**: Journal, area, author, and publication information

## Caching

The backend implements intelligent caching to reduce load on journal servers:
- Articles are cached for 30 minutes
- Cache can be manually cleared via API
- Each journal is cached separately

## Error Handling

The API provides comprehensive error handling:
- Graceful degradation when journals are unavailable
- Detailed error messages in responses
- Server logging for debugging

## Development

### Project Structure
```
src/
├── config/
│   └── journals.js          # Journal configuration
├── routes/
│   └── articles.js          # API routes
├── services/
│   └── journalService.js    # Core service logic
└── server.js                # Main application file
```

### Code Quality
- Clean, readable code structure
- High cohesion and low coupling
- Comprehensive error handling
- Proper separation of concerns

## License

ISC 
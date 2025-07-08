# Science Analyzer Backend

A Node.js backend service that fetches the latest articles from top science journals across different scientific areas.

## Features

- Fetches articles from top 3 journals in each scientific area
- Supports 7 scientific areas: General Science, Physics, Biology, Chemistry, Medicine, Engineering, and Environmental Science
- Built-in caching to reduce API calls and improve performance
- RESTful API endpoints for easy integration
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

2. Create a `.env` file in the root directory (optional):
```
PORT=3001
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### GET /api/articles
Fetch all articles from all journals across all areas.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalArticles": 150,
    "areas": 7,
    "journals": 21,
    "results": [...],
    "latestArticles": [...]
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

### POST /api/articles/cache/clear
Clear the article cache.

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
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

## Article Data Structure

Each article contains the following fields:

```json
{
  "id": "unique-article-id",
  "title": "Article Title",
  "link": "https://journal.com/article-url",
  "description": "Article abstract or description",
  "publishedDate": "2024-01-15T10:00:00.000Z",
  "author": "Author Name",
  "journal": "Journal Name",
  "journalUrl": "https://journal.com",
  "area": "Scientific Area",
  "impact": "High"
}
```

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
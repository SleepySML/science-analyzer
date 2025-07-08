const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/articles.db');
    this.db = null;
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      // Create database directory if it doesn't exist
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Connect to database
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Error connecting to SQLite database:', err);
        } else {
          console.log('✅ Connected to SQLite database:', this.dbPath);
        }
      });

      // Create articles table
      await this.createTables();
    } catch (error) {
      console.error('❌ Error initializing database:', error);
    }
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS articles (
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
        )
      `;

      this.db.run(createTableQuery, (err) => {
        if (err) {
          console.error('❌ Error creating articles table:', err);
          reject(err);
        } else {
          console.log('✅ Articles table created/verified');
          resolve();
        }
      });
    });
  }

  async articleExists(link) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM articles WHERE link = ?';
      
      this.db.get(query, [link], (err, row) => {
        if (err) {
          console.error('❌ Error checking if article exists:', err);
          reject(err);
        } else {
          resolve(row.count > 0);
        }
      });
    });
  }

  async insertArticle(article) {
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO articles (
          title, link, description, content, author, journal, 
          journal_url, area, impact, published_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        article.title,
        article.link,
        article.description,
        article.content,
        article.author,
        article.journal,
        article.journalUrl,
        article.area,
        article.impact,
        article.publishedDate
      ];

      this.db.run(insertQuery, values, function(err) {
        if (err) {
          console.error('❌ Error inserting article:', err);
          reject(err);
        } else {
          console.log(`✅ Article inserted with ID: ${this.lastID}`);
          resolve(this.lastID);
        }
      });
    });
  }

  async getAllArticles(limit = 100) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM articles 
        ORDER BY published_date DESC 
        LIMIT ?
      `;

      this.db.all(query, [limit], (err, rows) => {
        if (err) {
          console.error('❌ Error fetching articles:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getArticlesByArea(area, limit = 50) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM articles 
        WHERE area LIKE ? 
        ORDER BY published_date DESC 
        LIMIT ?
      `;

      this.db.all(query, [`%${area}%`, limit], (err, rows) => {
        if (err) {
          console.error('❌ Error fetching articles by area:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getArticlesByJournal(journal, limit = 50) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM articles 
        WHERE journal = ? 
        ORDER BY published_date DESC 
        LIMIT ?
      `;

      this.db.all(query, [journal, limit], (err, rows) => {
        if (err) {
          console.error('❌ Error fetching articles by journal:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getStatistics() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as total_articles,
          COUNT(DISTINCT journal) as total_journals,
          COUNT(DISTINCT area) as total_areas,
          MAX(created_at) as last_updated
        FROM articles
      `;

      this.db.get(query, (err, row) => {
        if (err) {
          console.error('❌ Error fetching statistics:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async searchArticles(searchTerm, limit = 50) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM articles 
        WHERE title LIKE ? OR content LIKE ? OR description LIKE ?
        ORDER BY published_date DESC 
        LIMIT ?
      `;

      const searchPattern = `%${searchTerm}%`;
      this.db.all(query, [searchPattern, searchPattern, searchPattern, limit], (err, rows) => {
        if (err) {
          console.error('❌ Error searching articles:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async clearDatabase() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM articles';
      
      this.db.run(query, (err) => {
        if (err) {
          console.error('❌ Error clearing database:', err);
          reject(err);
        } else {
          console.log('✅ Database cleared');
          resolve();
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err);
        } else {
          console.log('✅ Database connection closed');
        }
      });
    }
  }
}

module.exports = new DatabaseService(); 
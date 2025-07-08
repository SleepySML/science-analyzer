const fs = require('fs').promises;
const path = require('path');

class HtmlGeneratorService {
  constructor() {
    this.templatePath = path.join(__dirname, '../../templates/index-template.html');
    this.outputPath = path.join(__dirname, '../../index.html');
  }

  generateArticleHTML(articles) {
    return articles.map(article => `
      <div class="article-card">
        <h3 class="article-title">
          <a href="${article.link}" target="_blank">${this.escapeHtml(article.title)}</a>
        </h3>
        <div class="article-meta">
          <span class="journal-tag">${this.escapeHtml(article.journal)}</span>
          <span class="area-tag">${this.escapeHtml(article.area)}</span>
        </div>
        <p class="article-description">${this.escapeHtml(article.description || 'No description available')}</p>
        <div class="article-footer">
          <span class="published-date">${this.formatDate(article.publishedDate)}</span>
          <span class="author">by ${this.escapeHtml(article.author)}</span>
        </div>
      </div>
    `).join('');
  }

  generateStatsHTML(data) {
    return `
      <div class="stat-item">
        <div class="stat-number">${data.totalArticles}</div>
        <div class="stat-label">Total Articles</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${data.journals}</div>
        <div class="stat-label">Journals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${data.areas}</div>
        <div class="stat-label">Scientific Areas</div>
      </div>
    `;
  }

  generateFilteredSections(data) {
    const sections = [];
    
    // All articles section
    sections.push(`
      <div class="section" id="all-articles">
        <h2>All Articles (${data.latestArticles.length})</h2>
        <div class="articles-grid">
          ${this.generateArticleHTML(data.latestArticles)}
        </div>
      </div>
    `);

    // Sections by area
    data.results.forEach(result => {
      if (result.articles.length > 0) {
        const areaName = this.formatAreaName(result.area);
        sections.push(`
          <div class="section" id="${result.area}">
            <h2>${areaName} (${result.articles.length} articles)</h2>
            <div class="articles-grid">
              ${this.generateArticleHTML(result.articles)}
            </div>
          </div>
        `);
      }
    });

    return sections.join('');
  }

  async generateCompleteHTML(data) {
    const statsHTML = this.generateStatsHTML(data);
    const sectionsHTML = this.generateFilteredSections(data);
    const lastUpdated = new Date().toLocaleString();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Science Analyzer - Latest Articles</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
            border-radius: 10px;
            text-align: center;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .last-updated {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 1rem;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }

        .navigation {
            background: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .nav-links {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .nav-link {
            color: #667eea;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .nav-link:hover {
            background: #f0f0f0;
        }

        .section {
            margin-bottom: 3rem;
        }

        .section h2 {
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }

        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .article-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .article-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .article-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #2d3748;
        }

        .article-title a {
            color: inherit;
            text-decoration: none;
        }

        .article-title a:hover {
            color: #667eea;
        }

        .article-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.85rem;
            color: #666;
        }

        .journal-tag {
            background: #667eea;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 15px;
            font-size: 0.8rem;
        }

        .area-tag {
            background: #48bb78;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 15px;
            font-size: 0.8rem;
        }

        .article-description {
            color: #4a5568;
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .article-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: #666;
        }

        .published-date {
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-links {
                flex-direction: column;
            }
            
            .articles-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Science Analyzer</h1>
            <p class="subtitle">Latest Articles from Top Science Journals</p>
            <p class="last-updated">Last updated: ${lastUpdated}</p>
        </header>

        <div class="stats">
            ${statsHTML}
        </div>

        <div class="navigation">
            <div class="nav-links">
                <a href="#all-articles" class="nav-link">All Articles</a>
                <a href="#generalScience" class="nav-link">General Science</a>
                <a href="#physics" class="nav-link">Physics</a>
                <a href="#biology" class="nav-link">Biology</a>
                <a href="#chemistry" class="nav-link">Chemistry</a>
                <a href="#medicine" class="nav-link">Medicine</a>
                <a href="#engineering" class="nav-link">Engineering</a>
                <a href="#environmental" class="nav-link">Environmental</a>
            </div>
        </div>

        ${sectionsHTML}
    </div>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  async writeHtmlFile(data) {
    try {
      const htmlContent = await this.generateCompleteHTML(data);
      await fs.writeFile(this.outputPath, htmlContent, 'utf8');
      console.log(`✅ HTML file generated successfully: ${this.outputPath}`);
      console.log(`📊 Generated ${data.totalArticles} articles across ${data.areas} areas`);
    } catch (error) {
      console.error('❌ Error writing HTML file:', error);
      throw error;
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatAreaName(area) {
    const areaNames = {
      'generalScience': 'General Science',
      'physics': 'Physics',
      'biology': 'Biology',
      'chemistry': 'Chemistry',
      'medicine': 'Medicine',
      'engineering': 'Engineering',
      'environmental': 'Environmental Science'
    };
    return areaNames[area] || area.charAt(0).toUpperCase() + area.slice(1);
  }

  escapeHtml(text) {
    const div = { innerHTML: text };
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

module.exports = new HtmlGeneratorService(); 
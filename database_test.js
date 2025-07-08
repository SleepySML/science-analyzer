/**
 * Simple database connectivity test
 * Run this with: node database_test.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/articles.db');

console.log('🔍 Testing SQLite Database Connectivity...');
console.log(`📁 Database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database');
  
  // Test basic queries
  runTests();
});

function runTests() {
  console.log('\n📊 Running database tests...\n');
  
  // Test 1: Check if articles table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'", (err, row) => {
    if (err) {
      console.error('❌ Error checking table existence:', err.message);
      return;
    }
    
    if (row) {
      console.log('✅ Articles table exists');
      
      // Test 2: Get table schema
      db.all("PRAGMA table_info(articles)", (err, rows) => {
        if (err) {
          console.error('❌ Error getting table schema:', err.message);
          return;
        }
        
        console.log('📋 Table schema:');
        rows.forEach(column => {
          console.log(`   ${column.name}: ${column.type}${column.pk ? ' (PRIMARY KEY)' : ''}`);
        });
        
        // Test 3: Count articles
        db.get("SELECT COUNT(*) as count FROM articles", (err, row) => {
          if (err) {
            console.error('❌ Error counting articles:', err.message);
            return;
          }
          
          console.log(`\n📈 Total articles in database: ${row.count}`);
          
          // Test 4: Get sample articles
          if (row.count > 0) {
            db.all("SELECT id, title, journal, area, published_date FROM articles ORDER BY published_date DESC LIMIT 5", (err, rows) => {
              if (err) {
                console.error('❌ Error fetching sample articles:', err.message);
                return;
              }
              
              console.log('\n📰 Sample articles:');
              rows.forEach((article, index) => {
                console.log(`${index + 1}. ${article.title}`);
                console.log(`   Journal: ${article.journal} | Area: ${article.area}`);
                console.log(`   Published: ${article.published_date}\n`);
              });
              
              // Test 5: Get journal statistics
              db.all("SELECT journal, COUNT(*) as count FROM articles GROUP BY journal ORDER BY count DESC", (err, rows) => {
                if (err) {
                  console.error('❌ Error getting journal statistics:', err.message);
                  return;
                }
                
                console.log('📊 Articles by journal:');
                rows.forEach(stat => {
                  console.log(`   ${stat.journal}: ${stat.count} articles`);
                });
                
                // Test 6: Get area statistics
                db.all("SELECT area, COUNT(*) as count FROM articles GROUP BY area ORDER BY count DESC", (err, rows) => {
                  if (err) {
                    console.error('❌ Error getting area statistics:', err.message);
                    return;
                  }
                  
                  console.log('\n🔬 Articles by scientific area:');
                  rows.forEach(stat => {
                    console.log(`   ${stat.area}: ${stat.count} articles`);
                  });
                  
                  console.log('\n✅ Database tests completed successfully!');
                  console.log('\n💡 To view the database with DBeaver:');
                  console.log('   1. Open DBeaver');
                  console.log('   2. Create new SQLite connection');
                  console.log(`   3. Point to database file: ${dbPath}`);
                  console.log('   4. Browse the "articles" table');
                  
                  closeDatabase();
                });
              });
            });
          } else {
            console.log('ℹ️ No articles in database yet. Start the server to populate it.');
            closeDatabase();
          }
        });
      });
    } else {
      console.log('❌ Articles table does not exist');
      closeDatabase();
    }
  });
}

function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('\n🔒 Database connection closed');
    }
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down...');
  closeDatabase();
  process.exit(0);
}); 
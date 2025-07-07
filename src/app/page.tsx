'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article, JournalCategory } from '@/types/article';
import { fetchLatestScienceArticles, clearApiCache } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import JournalFilter from '@/components/JournalFilter';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<JournalCategory>('all');
  
  // Ref to track if a request is currently in progress
  const isRequestInProgress = useRef(false);
  // Ref to track the last request to prevent duplicate calls
  const lastRequestRef = useRef<string>('');

  const fetchArticles = useCallback(async (category: JournalCategory = selectedCategory, force: boolean = false) => {
    // Create a unique key for this request
    const requestKey = `${category}-${Date.now()}`;
    
    // Prevent concurrent requests unless forced
    if (isRequestInProgress.current && !force) {
      console.log('Request already in progress, skipping...');
      return;
    }

    // Prevent duplicate requests (within 1 second)
    if (lastRequestRef.current === category && !force) {
      console.log('Duplicate request detected, skipping...');
      return;
    }

    try {
      isRequestInProgress.current = true;
      lastRequestRef.current = category;
      setLoading(true);
      setError(null);
      
      console.log(`Fetching articles for category: ${category}`);
      const data = await fetchLatestScienceArticles({ 
        category,
        limit: 30 
      });
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  }, [selectedCategory]);

  const handleCategoryChange = useCallback((category: JournalCategory) => {
    setSelectedCategory(category);
    fetchArticles(category, true); // Force the request for category changes
  }, [fetchArticles]);

  const handleRefresh = useCallback(() => {
    clearApiCache(); // Clear cache to ensure fresh data
    fetchArticles(selectedCategory, true); // Force the request for manual refresh
  }, [fetchArticles, selectedCategory]);

  useEffect(() => {
    // Debounce the initial fetch to prevent React strict mode duplicate calls
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchArticles]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Science Analyzer
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Latest Articles from Top Scientific Journals
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Explore breakthrough research across multiple scientific disciplines
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Journal Filter */}
        <div className="mb-8">
          <JournalFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={handleRefresh}
          />
        )}
        
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No articles are available for the selected journal category. Please try a different category or check back later.
              </p>
            </div>
          </div>
        )}
        
        {!loading && !error && articles.length > 0 && (
          <div className="space-y-6">
            {/* Results header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Publications
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {articles.length} articles found
                  {selectedCategory !== 'all' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {selectedCategory.replace('-', ' ')}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            
            {/* Articles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Data sourced from Nature, Science, Cell, and other leading scientific journals
            </p>
            <p className="mt-1">
              Featuring articles from top medical, biological, physical, and earth science publications
            </p>
            <p className="mt-1">
              Built with Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
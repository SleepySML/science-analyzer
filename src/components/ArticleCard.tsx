import { Article } from '@/types/article';
import { generateArticleURL } from '@/lib/api';
import { JOURNAL_CATEGORIES } from '@/types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const articleURL = generateArticleURL(article);
  
  // Format the publication date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get journal category display name
  const getJournalCategoryDisplay = (category?: string) => {
    if (!category) return null;
    const categoryInfo = JOURNAL_CATEGORIES.find(c => c.value === category);
    return categoryInfo?.label || category.replace('-', ' ');
  };

  // Get category color scheme
  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      'general-science': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'medicine': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      'biology': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'physics': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      'chemistry': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      'earth-sciences': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200',
      'technology': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
    };
    return colorMap[category || ''] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        {/* Journal Category Badge */}
        {article.journalCategory && (
          <div className="flex justify-between items-start">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.journalCategory)}`}>
              {getJournalCategoryDisplay(article.journalCategory)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(article.pubDate)}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
          <a 
            href={articleURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {article.title}
          </a>
        </h2>

        {/* Author and Source */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
          {article.author && article.author !== 'Editorial Team' && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">{article.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="font-medium">{article.source}</span>
          </div>
        </div>

        {/* Publication date and article categories */}
        {!article.journalCategory && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.pubDate)}</span>
            </div>
            {article.category && article.category.length > 0 && (
              <div className="flex gap-1">
                {article.category.slice(0, 2).map((cat, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description excerpt */}
        {article.description && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="line-clamp-3">
              {article.description.length > 200 
                ? `${article.description.substring(0, 200)}...` 
                : article.description
              }
            </p>
          </div>
        )}

        {/* Read Article Button */}
        <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
          <a
            href={articleURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200 gap-1"
          >
            Read Full Article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 
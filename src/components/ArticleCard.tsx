import { Article } from '@/types/article';
import { generateArticleURL } from '@/lib/api';

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
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
          {article.author && (
            <div>
              <span className="font-medium">Author: </span>
              {article.author}
            </div>
          )}
          <div>
            <span className="font-medium">Source: </span>
            {article.source}
          </div>
        </div>

        {/* Publication date and categories */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium">Published: </span>
            {formatDate(article.pubDate)}
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
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
} 
import { Article } from '@/types/article';
import { generateArticleURL } from '@/lib/api';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const articleURL = generateArticleURL(article);
  const primaryTitle = Array.isArray(article.title) ? article.title[0] : article.title;
  const authors = Array.isArray(article.author) ? article.author : [article.author];
  
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
            {primaryTitle}
          </a>
        </h2>

        {/* Authors */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Authors: </span>
          {authors.slice(0, 3).join(', ')}
          {authors.length > 3 && <span className="text-gray-500"> et al.</span>}
        </div>

        {/* Publication info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium">Journal: </span>
            {article.pub}
          </div>
          <div>
            <span className="font-medium">Published: </span>
            {formatDate(article.pubdate)}
          </div>
        </div>

        {/* Abstract excerpt */}
        {article.abstract && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="line-clamp-3">
              {article.abstract.length > 200 
                ? `${article.abstract.substring(0, 200)}...` 
                : article.abstract
              }
            </p>
          </div>
        )}

        {/* Metrics */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            {article.citations !== undefined && (
              <span>📖 {article.citations} citations</span>
            )}
            {article.reads !== undefined && (
              <span>👁️ {article.reads} reads</span>
            )}
          </div>
          
          <a
            href={articleURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Read Article →
          </a>
        </div>
      </div>
    </div>
  );
} 
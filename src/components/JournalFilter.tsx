'use client';

import React from 'react';
import { JournalCategory, JOURNAL_CATEGORIES } from '@/types/article';

interface JournalFilterProps {
  selectedCategory: JournalCategory;
  onCategoryChange: (category: JournalCategory) => void;
  className?: string;
}

const JournalFilter: React.FC<JournalFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Filter by Research Area
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {JOURNAL_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value as JournalCategory)}
              className={`
                text-left p-3 rounded-lg border transition-all duration-200 text-sm
                ${selectedCategory === category.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }
              `}
              title={category.description}
            >
              <div className="font-medium">{category.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {category.description}
              </div>
            </button>
          ))}
        </div>
        
        {/* Selected category info */}
        {selectedCategory !== 'all' && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-800 dark:text-blue-200">
                Showing articles from: {JOURNAL_CATEGORIES.find(c => c.value === selectedCategory)?.label}
              </span>
            </div>
            <button
              onClick={() => onCategoryChange('all')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalFilter; 
export interface Article {
  id: string;
  title: string;
  author?: string;
  source: string;
  pubDate: string;
  description?: string;
  url: string;
  category?: string[];
  imageUrl?: string;
  journalCategory?: JournalCategory;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string[];
  author?: string;
  guid?: string;
}

export interface APIError {
  message: string;
  status?: number;
}

export type JournalCategory = 
  | 'general-science'
  | 'medicine'
  | 'biology'
  | 'physics'
  | 'chemistry'
  | 'earth-sciences'
  | 'technology'
  | 'all';

export interface JournalSource {
  name: string;
  url: string;
  category: JournalCategory;
  description: string;
  reliability: 'high' | 'medium' | 'low';
}

export interface FilterOptions {
  category: JournalCategory;
  sources?: string[];
  limit?: number;
}

export const JOURNAL_CATEGORIES = [
  { value: 'all', label: 'All Sciences', description: 'All scientific disciplines' },
  { value: 'general-science', label: 'General Science', description: 'Multidisciplinary scientific publications' },
  { value: 'medicine', label: 'Medicine & Health', description: 'Medical research and health sciences' },
  { value: 'biology', label: 'Biology & Life Sciences', description: 'Biological and life sciences research' },
  { value: 'physics', label: 'Physics & Astronomy', description: 'Physics, astronomy, and space sciences' },
  { value: 'chemistry', label: 'Chemistry', description: 'Chemical sciences and materials' },
  { value: 'earth-sciences', label: 'Earth & Environmental Sciences', description: 'Earth sciences, climate, and environment' },
  { value: 'technology', label: 'Technology & Engineering', description: 'Engineering and technology research' },
] as const; 
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
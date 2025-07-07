export interface Article {
  bibcode: string;
  title: string[];
  author: string[];
  pub: string;
  pubdate: string;
  abstract?: string;
  doi?: string[];
  url?: string;
  keyword?: string[];
  doctype: string;
  citations?: number;
  reads?: number;
}

export interface ADSResponse {
  response: {
    numFound: number;
    start: number;
    docs: Article[];
  };
}

export interface APIError {
  message: string;
  status?: number;
} 
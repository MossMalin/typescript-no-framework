export interface ArticleHit {
  created_at_i: number;
  title: string;
  url: string;
}

export interface ArticleList {
  nbPages: number;
  page: number;
  query: string;
  hits: ArticleHit[];
}

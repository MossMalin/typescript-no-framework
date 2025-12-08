export interface ArticleHit {
  created_at_i: number;
  title: string;
  url: string;
  story_text: string | null;
  objectID: string;
  points: number;
}

export interface ArticleList {
  nbPages: number;
  page: number;
  query: string;
  hits: ArticleHit[];
}

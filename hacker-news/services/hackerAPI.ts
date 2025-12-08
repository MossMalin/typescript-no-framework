import axios from 'axios';
import type { ArticleList } from './hackerApi.types.ts';

const hackerApiUrl = 'https://hn.algolia.com/api/v1/';

let articleList: ArticleList;

export const getArticles = async (
  query?: string,
  page?: number,
  sortBy?: 'date' | 'points'
): Promise<ArticleList> => {
  const search = sortBy === 'points' ? 'search' : 'search_by_date';
  const pageQuery = page ? `&page=${page}` : '';
  const response = await axios.get<ArticleList>(
    `${hackerApiUrl}${search}?tags=story&query=${query}${pageQuery}`
  );
  articleList = response.data;
  return articleList;
};

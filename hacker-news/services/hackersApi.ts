import axios from 'axios';
import type { ArticleList } from './hackersApi.types.ts';

const BASE_URL = import.meta.env.VITE_API_BASEURL;

let articleList: ArticleList;

export const getArticles = async (
  query?: string,
  page?: number,
  sortBy?: 'date' | 'points'
): Promise<ArticleList> => {
  const search = sortBy === 'points' ? 'search' : 'search_by_date';
  const pageQuery = page ? `&page=${page}` : '';
  const response = await axios.get<ArticleList>(
    `${BASE_URL}${search}?tags=story&query=${query}${pageQuery}`
  );
  articleList = response.data;
  return articleList;
};

import axios from 'axios';
import type { ArticleList } from './hackerApi.types.ts';

const hackerApiUrl = 'https://hn.algolia.com/api/v1/search_by_date';

let articleList: ArticleList;

export const getArticles = async (
  query?: string,
  page?: number
): Promise<ArticleList> => {
  const pageQuery = page ? `&page=${page}` : '';
  const response = await axios.get<ArticleList>(
    `${hackerApiUrl}?tags=story&query=${query}${pageQuery}`
  );
  articleList = response.data;
  return articleList;
};

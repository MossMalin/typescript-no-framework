import { getArticles } from '../../services/hackerAPI';
import type { ArticleHit } from '../../services/hackerApi.types';
import { setupToggleHandlers } from '../handlers/eventHandler';
import { setupPagination } from '../handlers/paginationHandler';
import { searchField, articleListEl, pagesEl } from '../utils/dom';
import { getQueryParam, addOrUpdateQueryParam } from '../utils/url';

export const renderArticles = async (
  query?: string,
  page?: number,
  popstate?: boolean
) => {
  try {
    searchField.focus();

    const queryParam = getQueryParam('query');
    const pageParam = getQueryParam('page');
    const queryValue = query || queryParam;
    const pageValue = page || pageParam;
    let caption = 'Latest news articles';
    let toggleArray: ArticleHit[] = [];

    const listOfArticles = await getArticles(
      queryValue ? queryValue : '',
      pageValue ? Number(pageValue) : 0
    );

    if (!popstate) {
      if (query || queryParam) {
        addOrUpdateQueryParam('query', queryValue ? queryValue : '');
      }

      addOrUpdateQueryParam('page', pageValue ? pageValue.toString() : '0');
    }

    if (queryValue) {
      caption = `Search results for "${queryValue}"`;
    }

    // Clear previous results
    articleListEl.innerHTML = `
      <caption>${caption}</caption>
      <tr>
        <th>Date</th>
        <th>Title</th>
      </tr>
    `;

    listOfArticles.hits.map((article) => {
      if (!article.title || !article.url) console.log(article);
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td');
      const tdArticle = document.createElement('td');
      tdDate.innerHTML = new Date(
        article.created_at_i * 1000
      ).toLocaleDateString();
      if (!article.url && article.story_text) {
        toggleArray.push(article);
        tdArticle.innerHTML = `<a href="#" data-toggle="toggle" aria-expanded="false" id="toggle-${article.objectID}">${article.title}</a>
                                <div id="panel-${article.objectID}" class="hacker-news__toggle" aria-labelledby="toggle-${article.objectID}">${article.story_text}</div>`;
      } else {
        tdArticle.innerHTML = `<a href="${article.url}">${article.title}</a>`;
      }
      tr.appendChild(tdDate);
      tr.appendChild(tdArticle);
      articleListEl.appendChild(tr);
    });

    pagesEl.innerHTML = `Page ${listOfArticles.page + 1} of ${
      listOfArticles.nbPages
    }`;

    setupPagination(listOfArticles.page, listOfArticles.nbPages);
    setupToggleHandlers(toggleArray);
  } catch (error) {
    console.log('An error occurred' + error);
  }
};

import { renderArticles } from '../ui/articleRenderer';
import {
  errormessageEl,
  paginationEl,
  searchField,
  searchForm,
} from '../utils/dom';
import { addOrUpdateQueryParam, getQueryParam } from '../utils/url';

export const setupSearchHandlers = () => {
  searchField.addEventListener('input', () => {
    if (searchField.classList.contains('hacker-news__input--error')) {
      searchField.classList.remove('hacker-news__input--error');
      errormessageEl.classList.remove('hacker-news__errormessage--visible');
    }
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchField.value;
    if (!query) {
      searchField.focus();
      searchField.classList.add('hacker-news__input--error');
      errormessageEl.classList.add('hacker-news__errormessage--visible');
      return;
    }
    addOrUpdateQueryParam('page', '0');

    renderArticles(query);
  });

  paginationEl.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.tagName !== 'A') return;

    const gotoPage = target.dataset.page;
    console.log(gotoPage);

    const currentPageParam = getQueryParam('page');
    const currentPage = currentPageParam ? Number(currentPageParam) : 0;

    if (gotoPage === 'prevPage' && currentPage > 0) {
      renderArticles(undefined, currentPage - 1);
    } else if (gotoPage === 'nextPage') {
      renderArticles(undefined, currentPage + 1);
    } else {
      const pageNumber = Number(gotoPage);
      renderArticles(undefined, currentPage + pageNumber);
    }
  });

  window.addEventListener('popstate', function () {
    renderArticles(undefined, undefined, true);
  });
};

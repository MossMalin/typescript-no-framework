import type { ArticleHit } from '../../services/hackerApi.types';
import { renderArticles } from '../ui/articleRenderer';
import {
  errormessageEl,
  paginationEl,
  searchField,
  searchForm,
} from '../utils/dom';
import { addOrUpdateQueryParam, getQueryParam } from '../utils/url';

export const setupEventHandlers = () => {
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
    if (!target.dataset.page) return;

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

export const setupToggleHandlers = (toggleArray: ArticleHit[]) => {
  toggleArray.forEach((element) => {
    const elementEl = document.getElementById(`toggle-${element.objectID}`);
    const panelEl = document.getElementById(`panel-${element.objectID}`);
    if (!elementEl) return;
    elementEl.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const expanded =
        target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
      target.setAttribute('aria-expanded', expanded);
      if (panelEl) {
        panelEl.classList.toggle('hacker-news__toggle--visible');
      }
    });
  });
};

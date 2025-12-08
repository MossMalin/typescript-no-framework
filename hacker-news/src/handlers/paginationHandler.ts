import { paginationEl } from '../utils/dom';

export const setupPagination = (currentPage: number, pageCount: number) => {
  paginationEl.innerHTML = '';
  if (currentPage > 0) {
    const liPrev = document.createElement('li');

    liPrev.innerHTML = `<a href="" data-page="prevPage">
            <span aria-hidden="true" data-page="prevPage">&laquo;</span>
            <span class="hacker-news__visuallyhidden">previous page</span>
          </a>`;
    paginationEl.appendChild(liPrev);
  }

  // Add four page numbers after current page
  for (let i = 1; i <= 4; i++) {
    const pageNumber = currentPage + i;
    if (pageNumber <= pageCount) {
      const liPage = document.createElement('li');
      if (i === 1) {
        liPage.setAttribute('aria-current', 'page');
      }
      liPage.innerHTML = `<a href="" data-page="${i - 1}"><span class="hacker-news__visuallyhidden">page </span>${pageNumber}</a>`;
      paginationEl.appendChild(liPage);
    }
  }

  if (currentPage < pageCount - 1) {
    const liNext = document.createElement('li');
    liNext.innerHTML = `<a href="" data-page="nextPage">
            <span aria-hidden="true" data-page="nextPage">&raquo;</span>
            <span class="hacker-news__visuallyhidden">next page</span>
          </a>`;
    paginationEl.appendChild(liNext);
  }
};

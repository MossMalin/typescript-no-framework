import './assets/scss/app.scss';
import { getArticles } from '../services/HackerApi.ts';

const articleListEl = document.querySelector<HTMLTableElement>('#articleList')!;
const searchForm = document.querySelector<HTMLFormElement>('#searchForm')!;
const searchField = document.querySelector<HTMLInputElement>('#searchField')!;
const pagesEl = document.querySelector<HTMLDivElement>('#pages')!;
const errormessageEl = document.querySelector<HTMLDivElement>('#errormessage')!;
const paginationEl = document.querySelector<HTMLUListElement>('#pagination')!;

const renderArticles = async (
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

    // Clear previous results
    articleListEl.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Title</th>
      </tr>
    `;

    listOfArticles.hits.map((article) => {
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td');
      const tdArticle = document.createElement('td');
      tdDate.innerHTML = new Date(
        article.created_at_i * 1000
      ).toLocaleDateString();
      tdArticle.innerHTML = `<a href="${article.url}">${article.title}</a>`;
      tr.appendChild(tdDate);
      tr.appendChild(tdArticle);
      articleListEl.appendChild(tr);
    });

    pagesEl.innerHTML = `Page ${listOfArticles.page + 1} of ${
      listOfArticles.nbPages
    }`;

    setupPagination(listOfArticles.page, listOfArticles.nbPages);
  } catch (error) {
    console.log('An error occurred' + error);
  }
};

const addOrUpdateQueryParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
};

const getQueryParam = (key: string): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
};

const setupPagination = (currentPage: number, pageCount: number) => {
  paginationEl.innerHTML = '';

  if (currentPage > 0) {
    const liPrev = document.createElement('li');

    liPrev.innerHTML = `<a href="" data-page="prevPage">
            <span aria-hidden="true">&laquo;</span>
            <span class="hacker-news__visuallyhidden">previous set of pages</span>
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
            <span aria-hidden="true">&raquo;</span>
            <span class="hacker-news__visuallyhidden">next set of pages</span>
          </a>`;
    paginationEl.appendChild(liNext);
  }
};

// remove error class on input when user starts typing
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

renderArticles();

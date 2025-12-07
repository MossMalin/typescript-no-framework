import './assets/scss/app.scss';
import { renderArticles } from './ui/articleRenderer';
import { setupSearchHandlers } from './handlers/searchHandler';

setupSearchHandlers();
window.addEventListener('popstate', () =>
  renderArticles(undefined, undefined, true)
);

renderArticles();

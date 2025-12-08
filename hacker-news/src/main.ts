import './assets/scss/app.scss';
import { renderArticles } from './ui/articleRenderer';
import { setupEventHandlers } from './handlers/eventHandler';

window.addEventListener('popstate', () =>
  renderArticles(undefined, undefined, true)
);

renderArticles();

import { app } from './state.mjs';
import { packages } from '../domain.mjs';

let restoring = false;
export function route() {
  if (app.view === 'detail') return '/package/' + app.detailId;
  if (app.view === 'plan') return '/plan/' + (app.state.complete ? 'complete' : app.state.section);
  if (app.view === 'hire') return '/hire/' + (app.rentalPrepared ? 'complete' : app.rental.step);
  if (app.view === 'home') return app.homeMode === 'rentals' ? '/equipment' : '/';
  return '/' + app.view;
}
function apply(path) {
  const [, view, step] = path.split('/');
  if (view === 'package' && packages.some((p) => p.id === step)) {
    app.view = 'detail';
    app.detailId = step;
  } else if (view === 'plan') {
    app.view = 'plan';
    // Completion is authoritative persisted state, never granted by a URL.
    if (
      !app.state.complete &&
      ['project', 'shoot', 'equipment', 'delivery', 'review'].includes(step)
    )
      app.state.section = step;
  } else if (view === 'hire') {
    app.view = 'hire';
    if (!app.rentalPrepared && ['kit', 'dates', 'review'].includes(step)) app.rental.step = step;
  } else if (['saved', 'studio', 'brief'].includes(view)) app.view = view;
  else {
    app.view = 'home';
    app.homeMode = view === 'equipment' ? 'rentals' : 'packages';
  }
}
export function initNavigation() {
  history.scrollRestoration = 'manual';
  apply(location.pathname);
  history.replaceState({ vh: true, y: 0 }, '', route());
  addEventListener(
    'scroll',
    () => {
      if (!restoring) history.replaceState({ ...history.state, y: scrollY }, '');
    },
    { passive: true },
  );
  addEventListener('popstate', (event) => {
    restoring = true;
    apply(location.pathname);
    app.render();
    requestAnimationFrame(() => {
      scrollTo(0, event.state?.y || 0);
      restoring = false;
    });
  });
}
export function syncNavigation() {
  const next = route();
  if (!restoring && next !== location.pathname) history.pushState({ vh: true, y: 0 }, '', next);
}

import { app } from './state.mjs';
import { packages } from '../domain.mjs';
import { button, heading, icon } from './shared.mjs';
import { packageCard } from './home.mjs';

export function savedPage() {
  const items = packages.filter((p) => app.saved.includes(p.id));
  return /* HTML */ `<section class="home-page">
    ${heading('Saved packages', 'Packages you marked with the heart.')}
    ${
      items.length
        ? /* HTML */ `<div class="package-grid">${items.map(packageCard).join('')}</div>`
        : /* HTML */ `<div class="empty-state">
            ${icon('heart')}
            <p>Nothing saved yet. Tap the heart on a package to keep it here.</p>
            ${button('Browse packages', 'data-view="home"')}
          </div>`
    }
  </section>`;
}

import { app } from './state.mjs';
import { icon, money } from './shared.mjs';
import { rentalCatalogue } from './rentals.mjs';
import { packages } from '../domain.mjs';
import { briefEntry } from './brief.mjs';

export function packageCard(p) {
  return /* HTML */ `<article class="package-card icon-package">
    <button class="package-open" data-package="${p.id}">
      <span class="package-service-icon">${icon(p.icon)}</span
      ><span class="package-text"><strong>${p.title}</strong><small>${p.label}</small></span
      ><span class="package-price"><small>From</small><strong>${money(p.price)}</strong></span
      >${icon('chevron-right')}</button
    ><button
      class="save-button ${app.saved.includes(p.id) ? 'is-saved' : ''}"
      data-save="${p.id}"
      aria-label="${app.saved.includes(p.id) ? 'Unsave' : 'Save'} ${p.title}"
      aria-pressed="${app.saved.includes(p.id)}"
    >
      ${icon('heart')}
    </button>
  </article>`;
}

export function home() {
  if (app.homeMode === 'rentals') return rentalCatalogue();
  const list = packages.filter((p) => app.filter === 'All' || p.service === app.filter);
  return /* HTML */ `<section class="home-page">
    ${modeSwitch()}
    <div class="discovery-intro">
      <div>
        <span class="eyebrow">VISIONHAUS MEDIA</span>
        <h1>Find your<br />next <mark>production.</mark></h1>
        <p>Film, photos and everything in between.</p>
      </div>
      <span class="intro-symbol" aria-hidden="true">${icon('aperture')}</span>
    </div>
    <nav class="filter-chips service-pills" aria-label="Package categories">
      ${[
        ['All', 'All packages', 'grid-2x2'],
        ['Video', 'Video', 'video'],
        ['Photo', 'Photo', 'camera'],
        ['Editing', 'Editing', 'scissors'],
      ]
        .map(
          ([v, l, i]) =>
            /* HTML */ `<button
              data-filter="${v}"
              class="${app.filter === v ? 'active' : ''}"
              aria-pressed="${app.filter === v}"
            >
              ${icon(i)}${l}
            </button>`,
        )
        .join('')}
    </nav>
    ${briefEntry()}
    <div class="home-section-label">
      <h2>Popular packages</h2>
      <span>${list.length} packages</span>
    </div>
    <div class="package-grid">${list.map(packageCard).join('')}</div>
    <p class="price-footnote">
      Reels, music videos & podcasts: tax inclusive. Other rates: ex VAT.
    </p>
    <button class="custom-link" data-custom>
      ${icon('sliders-horizontal')}<span
        >Need a different setup?<strong>Build your plan</strong></span
      >${icon('arrow-right')}
    </button>
  </section>`;
}

export function modeSwitch() {
  return /* HTML */ `<nav class="home-mode" aria-label="Browse packages or equipment">
    <button
      data-mode="packages"
      class="${app.homeMode === 'packages' ? 'selected' : ''}"
      aria-pressed="${app.homeMode === 'packages'}"
    >
      ${icon('clapperboard')}Packages</button
    ><button
      data-mode="rentals"
      class="${app.homeMode === 'rentals' ? 'selected' : ''}"
      aria-pressed="${app.homeMode === 'rentals'}"
    >
      ${icon('camera')}Rentals
    </button>
  </nav>`;
}

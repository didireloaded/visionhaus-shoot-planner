import { app } from './state.mjs';
import { icon, money } from './shared.mjs';
import { rentalCatalogue } from './rentals.mjs';
import { packages } from '../domain.mjs';
import { briefEntry } from './brief.mjs';

export const workPhotos = {
  reels: ['reels', 'Presenter laughing in a kitchen, Remona x NOLA campaign', 534, 167],
  photo: ['photo', 'Portrait of a young girl in warm window light', 393, 640],
  music: [
    'music',
    'Woman in a yellow dress in a grass field, Yeezir Wanaheda music video',
    351,
    238,
  ],
  podcast: ['podcast', 'Man in glasses speaking during a filmed interview', 317, 170],
  editing: ['editing', 'Colour curve and timeline in the edit suite', 547, 173],
  event: ['event', 'DJ facing the crowd with flame effects, Sound of Summer', 1100, 438],
};

export const workPhoto = (id, cls) => {
  const [file, alt, width, height] = workPhotos[id];
  return `<img class="${cls}" src="/work/${file}.jpg" alt="${alt}" width="${width}" height="${height}" loading="lazy">`;
};

export const basis = (p) => (p.taxInclusive ? 'incl. VAT' : 'ex VAT');

export function packageCard(p) {
  return /* HTML */ `<article class="package-card">
    <button class="package-open" data-package="${p.id}">
      ${workPhoto(p.id, 'package-photo')}<span class="package-text"
        ><strong>${p.title}</strong><small>${p.label}</small></span
      ><span class="package-price"
        ><small>From</small><strong>${money(p.price)}</strong><small>${basis(p)}</small></span
      ></button
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
  return /* HTML */ `<section class="home-page production-home">
    <div class="home-hero">
      <div class="hero-copy">
        <h1>Stories worth watching.<span>Work built to be remembered.</span></h1>
        <p>
          Choose a package, plan a custom shoot or hire kit. VisionHaus reviews every request and
          replies with a quotation.
        </p>
      </div>
    </div>
    ${modeSwitch()}
    <nav class="filter-chips" aria-label="Package categories">
      ${[
        ['All', 'All'],
        ['Video', 'Video'],
        ['Photo', 'Photo'],
        ['Editing', 'Editing'],
      ]
        .map(
          ([v, l]) =>
            /* HTML */ `<button
              data-filter="${v}"
              class="${app.filter === v ? 'active' : ''}"
              aria-pressed="${app.filter === v}"
            >
              ${l}
            </button>`,
        )
        .join('')}
    </nav>
    <div class="package-grid">${list.map(packageCard).join('')}</div>
    <figure class="hero-photo">
      <img
        src="/work/hero.jpg"
        alt="Worker in a hard hat under power lines at golden hour, from a VisionHaus brand film"
        width="1203"
        height="864"
      />
      <figcaption>Visual production for brands, people and culture · Windhoek</figcaption>
    </figure>
    <div class="home-actions">
      ${briefEntry()}<button class="brief-entry" data-custom>
        <strong>Need a different setup?</strong
        ><small>Build a custom plan: crew, kit, extras and dates.</small>
      </button>
    </div>
  </section>`;
}

export function modeSwitch() {
  return /* HTML */ `<nav class="home-mode" aria-label="Browse packages or equipment">
    <button
      data-mode="packages"
      class="${app.homeMode === 'packages' ? 'selected' : ''}"
      aria-pressed="${app.homeMode === 'packages'}"
    >
      Production packages</button
    ><button
      data-mode="rentals"
      class="${app.homeMode === 'rentals' ? 'selected' : ''}"
      aria-pressed="${app.homeMode === 'rentals'}"
    >
      Equipment hire
    </button>
  </nav>`;
}

import { confirmAction } from './ui/dialog.mjs';
import { bindDatePicker } from './ui/date-picker.mjs';
import { app } from './ui/state.mjs';
import { rentalInitial, restoreRental } from './rentals.mjs';
import { newRequestToken } from './request-id.mjs';
import {
  briefText,
  change,
  initial,
  packages,
  pendingExtras,
  projects,
  quoteOnly,
  restore,
  startPackage,
  taxLabel,
  total,
} from './domain.mjs';
import { DRAFT, persist } from './ui/storage.mjs';
import { $, button, icon, money, motion } from './ui/shared.mjs';
import { bindRentals, rentalCheckout, rentalControls } from './ui/rentals.mjs';
import { choose, custom, next, plan, sections, summaryContent } from './ui/plan.mjs';
import { home } from './ui/home.mjs';
import { detail } from './ui/detail.mjs';
import { bindBrief, briefScreen, clearBrief } from './ui/brief.mjs';
import { savedPage } from './ui/saved.mjs';
import { studio } from './ui/studio.mjs';
import { sendRequest } from './submission.mjs';

app.rental = { ...rentalInitial(), requestToken: newRequestToken() };
app.homeMode = 'packages';
app.rentalCategory = 'All';
app.rentalMessage = '';
app.rentalPrepared = false;

try {
  const d = JSON.parse(localStorage.getItem('vh-rental-draft'));
  if (d && Date.now() - d.savedAt < 7 * 86400000) app.rental = restoreRental(d.state);
} catch {}

app.briefTextInput = '';
app.briefProject = 'Video';
app.briefChoice = '';
app.briefError = '';
app.briefFile = '';
app.briefLoading = false;
app.briefOriginal = '';
app.briefAnalysis = null;
app.briefAnalyzedText = '';

try {
  const b = JSON.parse(localStorage.getItem('vh-brief') || 'null');
  if (b && Date.now() - b.savedAt < 7 * 86400000) {
    app.briefTextInput = String(b.text || '').slice(0, 50000);
    app.briefOriginal = String(b.original || '').slice(0, 50000);
    app.briefProject = Object.hasOwn(projects, b.service) ? b.service : 'Video';
    app.briefChoice = projects[app.briefProject].includes(b.project) ? b.project : '';
    app.briefAnalyzedText = String(b.analyzedText || '').slice(0, 50000);
    app.briefFile = String(b.file || '').slice(0, 200);
  }
} catch {}

app.submitting = false;
app.submissionError = '';
app.submissionReference = '';

app.previewRequestIds = new Map();

app.state = { ...initial(), requestToken: newRequestToken() };
app.view = 'home';
app.filter = 'All';
app.detailId = 'reels';
app.variantId = '';
app.summaryOpen = false;
app.lastScene = '';
app.saved = [];

try {
  const d = JSON.parse(localStorage.getItem(DRAFT));
  if (d && Date.now() - d.savedAt < 7 * 86400000) app.state = restore(d.state);
  app.saved = JSON.parse(localStorage.getItem('vh-package-favourites')) || [];
  if (!Array.isArray(app.saved)) app.saved = [];
} catch {}

app.persistedValues = new Map();

app.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

app.renderedRegions = new Map();

function mountRegion(selector, markup, force = false) {
  // Keep stable navigation/header nodes and regenerate icons only in changed regions.
  const cacheKey = String(app.submitting) + markup;
  if (!force && app.renderedRegions.get(selector) === cacheKey) return;
  const root = $(selector);
  root.innerHTML = markup;
  app.renderedRegions.set(selector, cacheKey);
}

function header() {
  return /* HTML */ `<div class="topbar">
    <button class="brand" data-view="home" aria-label="VisionHaus home">
      <img src="/visionhaus-logo.png" alt="" width="1736" height="704" />
    </button>
    <nav id="tab-bar" aria-label="Main navigation">${tabBar()}</nav>
  </div>`;
}

function tabBar() {
  return [
    ['home', 'clapperboard', 'Packages'],
    ['plan', 'sliders-horizontal', 'My Plan'],
    ['saved', 'heart', 'Saved'],
    ['studio', 'info', 'Studio'],
  ]
    .map(
      ([v, i, t]) =>
        /* HTML */ `<button data-view="${v}" ${navSelected() === v ? 'aria-current="page"' : ''}>
          ${icon(i)}<span>${t}</span>
        </button>`,
    )
    .join('');
}

const navSelected = () =>
  ['detail', 'brief'].includes(app.view) ? 'home' : app.view === 'hire' ? 'plan' : app.view;

function controls() {
  if (app.view === 'hire' || (app.view === 'home' && app.homeMode === 'rentals'))
    return rentalControls();
  if (app.view === 'detail') {
    const p = packages.find((p) => p.id === app.detailId),
      v = p.variants.find((v) => v.id === app.variantId) || p.variants[0];
    return /* HTML */ `<div class="detail-dock">
      <span
        ><small>${taxLabel(startPackage(p.id, v.id))}</small
        ><strong>${money(v.price)}</strong></span
      >${button('Choose package', 'id="book-package"')}
    </div>`;
  }
  if (
    app.view !== 'plan' ||
    !app.state.project ||
    app.state.section === 'project' ||
    app.state.complete
  )
    return '';
  return /* HTML */ `<div class="mobile-plan-controls">
    <details class="mobile-disclosure" ${app.summaryOpen ? 'open' : ''}>
      <summary id="summary-toggle" aria-label="Expand production summary">
        <span>${app.state.mode === 'package' ? 'Package estimate' : 'Priced so far'}</span
        ><strong class="${quoteOnly(app.state) ? 'quote-price' : ''}"
          >${quoteOnly(app.state) ? 'Quote required' : money(total(app.state))}${icon('chevron-up')}</strong
        ><small
          >${taxLabel(app.state)} ·
          ${pendingExtras(app.state).length ? 'excludes price-pending extras' : 'final quote follows'}</small
        >
      </summary>
      <div class="mobile-summary">${summaryContent()}</div>
    </details>
    ${button(app.state.section === 'review' ? 'Submit' : 'Continue', 'data-next', 'primary dock-next')}
  </div>`;
}

function render() {
  persist();
  const scene =
    app.view === 'home'
      ? `${app.view}:${app.homeMode}:${app.filter}:${app.rentalCategory}`
      : app.view === 'detail'
        ? `${app.view}:${app.detailId}`
        : app.view === 'hire'
          ? `${app.view}:${app.rental.step}:${app.rentalPrepared}`
          : app.view === 'plan'
            ? `${app.view}:${app.state.project}:${app.state.section}:${app.state.complete}`
            : app.view;
  mountRegion('#app-header', header());
  mountRegion(
    '#app',
    { home, detail, plan, hire: rentalCheckout, brief: briefScreen, saved: savedPage, studio }[
      app.view
    ](),
    true,
  );
  mountRegion('#control-surface', controls());
  document.body.dataset.view = app.view;
  bind();
  if (scene !== app.lastScene) {
    const target =
      app.view === 'plan'
        ? $('#task') || $('#app')
        : app.view === 'home' && app.lastScene.startsWith('home:')
          ? $('.package-grid') || $('.rental-list') || $('#app')
          : $('#app');
    motion(
      target,
      [
        { opacity: 0.35, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      220,
    );
  }
  app.lastScene = scene;
  if (app.submitting) {
    document.querySelectorAll('button,input,textarea,select').forEach((el) => (el.disabled = true));
    document.querySelectorAll('[data-next],[data-rental-next]').forEach((el) => {
      el.textContent = 'Submitting…';
      el.setAttribute('aria-busy', 'true');
    });
  }
}

function navigate(v) {
  app.view = v;
  app.summaryOpen = false;
  render();
  scrollTo({ top: 0 });
  focusTitle();
}

function focusTitle() {
  const h = $('#task h1') || $('h1');
  if (h) {
    h.tabIndex = -1;
    h.focus({ preventScroll: true });
  }
}

async function submitRequest(type, payload) {
  if (app.submitting) return false;
  app.submitting = true;
  app.submissionError = '';
  render();
  try {
    const copy = { ...payload };
    delete copy.complete;
    const bytes = new TextEncoder().encode(JSON.stringify({ type, state: copy }));
    let digest;
    if (crypto.subtle) digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    else {
      const fingerprint = new TextDecoder().decode(bytes);
      if (!app.previewRequestIds.has(fingerprint))
        app.previewRequestIds.set(fingerprint, crypto.getRandomValues(new Uint8Array(32)));
      digest = app.previewRequestIds.get(fingerprint);
    }
    const requestId = 'vh-' + [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
    app.submissionReference = await sendRequest({ type, state: copy, requestId });
    return true;
  } catch (error) {
    app.submissionError =
      error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'We could not confirm submission. Your draft is saved. Please try Submit again.'
        : error.userMessage ||
          'We could not confirm submission. Your draft is saved. Please try again.';
    return false;
  } finally {
    app.submitting = false;
  }
}

function bind() {
  bindDatePicker();
  bindBrief();
  bindRentals();
  document
    .querySelectorAll('button[data-view]')
    .forEach((b) => (b.onclick = () => navigate(b.dataset.view)));
  document.querySelectorAll('[data-filter]').forEach(
    (b) =>
      (b.onclick = () => {
        app.filter = b.dataset.filter;
        render();
        document.querySelector(`[data-filter="${app.filter}"]`)?.focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll('[data-package]').forEach(
    (b) =>
      (b.onclick = () => {
        app.detailId = b.dataset.package;
        app.variantId = '';
        navigate('detail');
      }),
  );
  document.querySelectorAll('[data-variant]').forEach(
    (b) =>
      (b.onclick = () => {
        app.variantId = b.dataset.variant;
        render();
        document.querySelector(`[data-variant="${app.variantId}"]`)?.focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll('[data-save]').forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.save;
        app.saved = app.saved.includes(id) ? app.saved.filter((x) => x !== id) : [...app.saved, id];
        render();
      }),
  );
  document.querySelectorAll('[data-custom]').forEach((b) => (b.onclick = () => custom()));
  document
    .querySelectorAll('[data-custom-service]')
    .forEach((b) => (b.onclick = () => custom(b.dataset.customService, b.dataset.project)));
  document.querySelectorAll('[data-service]').forEach(
    (b) =>
      (b.onclick = () => {
        app.state = change(app.state, 'service', b.dataset.service);
        render();
      }),
  );
  document.querySelectorAll('.project-list [data-project]').forEach(
    (b) =>
      (b.onclick = () => {
        if (!app.state.service) app.state = change(app.state, 'service', 'Video');
        const notes = app.state.notes;
        app.state = change(app.state, 'project', b.dataset.project);
        app.state.notes = notes;
        render();
        scrollTo({ top: 0 });
        focusTitle();
      }),
  );
  if ($('#book-package'))
    $('#book-package').onclick = () => {
      const contact = {
        name: app.state.name,
        company: app.state.company,
        billingAddress: app.state.billingAddress,
        email: app.state.email,
        phone: app.state.phone,
      };
      app.state = {
        ...startPackage(app.detailId, app.variantId),
        ...contact,
        requestToken: newRequestToken(),
      };
      navigate('plan');
    };
  document.querySelectorAll('[data-key]').forEach(
    (b) =>
      (b.onclick = () => {
        const key = b.dataset.key;
        const numeric =
          [
            'clipCount',
            'retouchCount',
            'crewCount',
            'subjects',
            'people',
            'episodes',
            'perDay',
            'episodeMinutes',
            'cameras',
            'hours',
          ].includes(key) && b.dataset.value !== 'Full day';
        const label = b.getAttribute('aria-label');
        choose(key, numeric ? Number(b.dataset.value) : b.dataset.value);
        [...document.querySelectorAll('[data-key]')]
          .find((e) =>
            label
              ? e.getAttribute('aria-label') === label
              : e.dataset.key === key && e.dataset.value === b.dataset.value,
          )
          ?.focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll('[data-toggle]').forEach(
    (b) =>
      (b.onclick = () => {
        const k = b.dataset.toggle;
        choose(k, !app.state[k]);
        document.querySelector(`[data-toggle="${k}"]`)?.focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll('[data-extra]').forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.extra;
        choose(
          'extras',
          app.state.extras.includes(id)
            ? app.state.extras.filter((x) => x !== id)
            : [
                ...app.state.extras.filter(
                  (x) =>
                    !((id === 'sameDay' && x === 'rush') || (id === 'rush' && x === 'sameDay')),
                ),
                id,
              ],
        );
        motion(
          document.querySelector(`[data-extra="${id}"] .radio-mark`),
          [{ transform: 'scale(.82)' }, { transform: 'scale(1)' }],
          160,
        );
        document.querySelector(`[data-extra="${id}"]`)?.focus({ preventScroll: true });
      }),
  );
  document.querySelectorAll('[data-section]').forEach(
    (b) =>
      (b.onclick = () => {
        app.state.section = b.dataset.section;
        app.summaryOpen = false;
        render();
        scrollTo({ top: 0 });
        focusTitle();
      }),
  );
  for (const id of ['location', 'date'])
    if ($('#' + id))
      $('#' + id).onchange = (e) => {
        choose(id, e.target.value);
        $('#' + id)?.focus({ preventScroll: true });
      };
  for (const id of ['name', 'company', 'billingAddress', 'email', 'phone', 'notes', 'venue'])
    if ($('#' + id))
      $('#' + id).oninput = (e) => {
        app.state[id] = e.target.value;
        persist();
      };
  document.querySelectorAll('[data-next]').forEach((b) => (b.onclick = next));
  if ($('.mobile-disclosure'))
    $('.mobile-disclosure').ontoggle = (e) => {
      if (e.target.isConnected) app.summaryOpen = e.target.open;
    };
  if ($('#contact'))
    $('#contact').onsubmit = (e) => {
      e.preventDefault();
      next();
    };
  if ($('#plan-back'))
    $('#plan-back').onclick = () => {
      const list = sections().map(([id]) => id),
        idx = list.indexOf(app.state.section);
      if (idx > 0) {
        app.state.section = list[idx - 1];
        render();
        scrollTo({ top: 0 });
      } else if (app.state.mode === 'package') {
        app.detailId = app.state.packageId;
        app.variantId = app.state.variantId;
        navigate('detail');
      } else {
        app.state.section = 'project';
        render();
      }
    };
  if ($('#change-service'))
    $('#change-service').onclick = async () => {
      if (
        await confirmAction({
          title: 'Choose a different service?',
          message:
            'This replaces your package, dates, setup, extras and notes. Your contact details and saved brief text are kept.',
          action: 'Change service',
        })
      )
        custom();
    };
  if ($('#edit-plan'))
    $('#edit-plan').onclick = () => {
      app.state.complete = false;
      app.state.requestToken = newRequestToken();
      app.state.section = 'review';
      app.submissionError = '';
      render();
    };

  if ($('#download'))
    $('#download').onclick = () => {
      const url = URL.createObjectURL(new Blob([briefText(app.state)], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VisionHaus-Production-Request.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
  if ($('#reset'))
    $('#reset').onclick = async () => {
      if (
        await confirmAction({
          title: 'Clear drafts on this device?',
          message:
            'This removes your production plan, equipment selection, contact details and saved brief text. Saved packages and requests already submitted to VisionHaus are kept.',
          action: 'Clear drafts',
          cancel: 'Keep drafts',
        })
      ) {
        app.state = { ...initial(), requestToken: newRequestToken() };
        app.rental = { ...rentalInitial(), requestToken: newRequestToken() };
        app.rentalPrepared = false;
        clearBrief();
        navigate('home');
      }
    };
}

Object.assign(app, {
  mountRegion,
  header,
  tabBar,
  controls,
  render,
  navigate,
  focusTitle,
  submitRequest,
  bind,
});

render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

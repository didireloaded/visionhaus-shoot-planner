import morphdom from 'morphdom';
import { initNavigation, syncNavigation } from './ui/navigation.mjs';
import { initPwa, haptic } from './ui/pwa.mjs';
import { bindDatePicker } from './ui/date-picker.mjs';
import { confirmAction, showSummary } from './ui/dialog.mjs';
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
import { choose, custom, next, plan, sections, summaryContent } from './ui/plan.mjs';
import { bindRentals, rentalCheckout, rentalControls } from './ui/rentals.mjs';
import { home } from './ui/home.mjs';
import { detail } from './ui/detail.mjs';
import { bindBrief, briefScreen, clearBrief } from './ui/brief.mjs';
import { savedPage } from './ui/saved.mjs';
import { studio } from './ui/studio.mjs';
import { sendRequest } from './submission.mjs';

app.productionReference = '';
app.rentalReference = '';

app.rental = { ...rentalInitial(), requestToken: newRequestToken() };
app.homeMode = 'packages';
app.rentalCategory = 'All';
app.rentalMessage = '';
app.rentalPrepared = false;

try {
  const d = JSON.parse(localStorage.getItem('vh-rental-draft'));
  if (d && Date.now() - d.savedAt < 7 * 86400000) {
    app.rental = restoreRental(d.state);
    app.rentalPrepared = d.submitted === true;
    app.rentalReference = String(d.reference || '').slice(0, 120);
  }
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
  if (d && Date.now() - d.savedAt < 7 * 86400000) {
    app.state = restore(d.state);
    app.state.complete = d.submitted === true || d.state?.complete === true;
    app.productionReference = String(d.reference || '').slice(0, 120);
  }
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
  if (force || !root.firstChild) root.innerHTML = markup;
  else {
    const next = root.cloneNode(false);
    next.innerHTML = markup;
    morphdom(root, next, {
      childrenOnly: true,
      onBeforeElUpdated(from, to) {
        if (from === document.activeElement && /^(INPUT|TEXTAREA)$/.test(from.tagName))
          return false;
        return !from.isEqualNode(to);
      },
    });
  }
  app.renderedRegions.set(selector, cacheKey);
}

function header() {
  return /* HTML */ `<div class="topbar">
    <button class="brand-avatar" data-view="studio" aria-label="About VisionHaus">
      <picture
        ><source srcset="/visionhaus-logo.webp" type="image/webp" />
        <img src="/visionhaus-logo.png" alt="" width="1736" height="704"
      /></picture></button
    ><button class="greeting-brand" data-view="home">
      <strong>Hi, creator</strong><small>Let's make your next production</small></button
    ><button class="icon-button" id="find-package" aria-label="Find a package">
      ${icon('search')}</button
    ><button class="icon-button" data-view="plan" aria-label="Build a custom production">
      ${icon('sliders-horizontal')}
    </button>
  </div>`;
}

function tabBar() {
  return [
    ['home', 'house', 'Home'],
    ['plan', 'sliders-horizontal', 'My Plan'],
    ['saved', 'heart', 'Saved'],
    ['studio', 'circle-user-round', 'Studio'],
  ]
    .map(
      ([v, i, t]) =>
        /* HTML */ `<button
          data-view="${v}"
          aria-label="${t}"
          ${app.view === v || (v === 'home' && ['detail', 'brief'].includes(app.view)) || (v === 'plan' && app.view === 'hire') ? 'aria-current="page"' : ''}
        >
          ${icon(i)}<span>${t}</span>
        </button>`,
    )
    .join('');
}

app.activeNavTab = '';

function updateTabBar() {
  const nav = $('#tab-bar');
  const first = !nav.querySelector('.nav-highlight');
  if (first) {
    nav.innerHTML = '<span class="nav-highlight" aria-hidden="true"></span>' + tabBar();
  }
  const buttons = [...nav.querySelectorAll('button[data-view]')];
  buttons.forEach((b) => (b.disabled = app.submitting));
  const selected = ['detail', 'brief'].includes(app.view)
    ? 'home'
    : app.view === 'hire'
      ? 'plan'
      : app.view;
  if (!first && selected === app.activeNavTab) return;
  const pill = nav.querySelector('.nav-highlight'),
    navRect = nav.getBoundingClientRect(),
    oldPill = pill.getBoundingClientRect();
  const previous = buttons.map((b) => b.getBoundingClientRect());
  buttons.forEach((b) => {
    b.getAnimations().forEach((a) => a.cancel());
    if (b.dataset.view === selected) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  const target = buttons.find((b) => b.dataset.view === selected) || buttons[0];
  const x = target.offsetLeft,
    width = target.offsetWidth;
  pill.getAnimations().forEach((a) => a.cancel());
  Object.assign(pill.style, {
    top: target.offsetTop + 'px',
    height: target.offsetHeight + 'px',
    width: width + 'px',
    transform: `translateX(${x}px)`,
  });
  if (!first && !app.reducedMotion.matches) {
    // Begin from the visible position, so rapid tab presses do not queue slides.
    motion(
      pill,
      [
        { transform: `translateX(${oldPill.left - navRect.left}px)`, width: oldPill.width + 'px' },
        { transform: `translateX(${x}px)`, width: width + 'px' },
      ],
      300,
    );
    buttons.forEach((b, i) => {
      const next = b.getBoundingClientRect();
      motion(
        b,
        [
          { transform: `translateX(${previous[i].left - next.left}px)` },
          { transform: 'translateX(0)' },
        ],
        240,
      );
    });
  }
  app.activeNavTab = selected;
}

const navResize = new ResizeObserver(() => {
  const nav = $('#tab-bar'),
    target = nav.querySelector('button[aria-current]'),
    pill = nav.querySelector('.nav-highlight');
  if (!target || !pill) return;
  pill.getAnimations().forEach((a) => a.cancel());
  Object.assign(pill.style, {
    top: target.offsetTop + 'px',
    height: target.offsetHeight + 'px',
    width: target.offsetWidth + 'px',
    transform: `translateX(${target.offsetLeft}px)`,
  });
});

navResize.observe($('#tab-bar'));

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
  syncNavigation();
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
    scene !== app.lastScene,
  );
  mountRegion('#control-surface', controls());
  updateTabBar();
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
  const update = () => {
    app.view = v;
    app.summaryOpen = false;
    render();
    scrollTo({ top: 0 });
    focusTitle();
  };
  document.documentElement.dataset.transition = ['detail', 'plan', 'hire'].includes(v)
    ? 'drill'
    : 'tab';
  if (document.startViewTransition && !app.reducedMotion.matches)
    document.startViewTransition(update);
  else update();
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
    if (!navigator.onLine) {
      const error = new Error('Offline');
      error.userMessage =
        "You're offline. Your request is saved and you can submit when you're back online.";
      throw error;
    }
    const reference = await sendRequest({ type, state: copy, requestId });
    haptic();
    if (type === 'rental') app.rentalReference = reference;
    else app.productionReference = reference;
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
  if ($('#find-package'))
    $('#find-package').onclick = () => {
      app.homeMode = 'packages';
      app.filter = 'All';
      navigate('home');
      setTimeout(() => {
        $('.home-section-label')?.scrollIntoView({ block: 'start' });
        $('.package-open')?.focus({ preventScroll: true });
      }, 250);
    };
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
  if ($('#summary-toggle'))
    $('#summary-toggle').onclick = (event) => {
      event.preventDefault();
      showSummary(summaryContent());
    };
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
      app.productionReference = '';
      app.submissionError = '';
      clearBrief();
      custom();
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
  updateTabBar,
  controls,
  render,
  navigate,
  focusTitle,
  submitRequest,
  bind,
});

initNavigation();
render();
initPwa();

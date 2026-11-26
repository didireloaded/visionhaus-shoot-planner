import { haptic } from './pwa.mjs';
import { app } from './state.mjs';
import {
  includedBy,
  rentalBrief,
  rentalDays,
  rentalErrors,
  rentalInitial,
  rentalItems,
  rentalLines,
  rentalTotal,
  rentalUnits,
  setRentalQty,
} from '../rentals.mjs';
import { $, button, esc, heading, icon, money, submissionFeedback } from './shared.mjs';
import { modeSwitch } from './home.mjs';
import { windhoekToday } from '../dates.mjs';
import { newRequestToken } from '../request-id.mjs';
import { persist } from './storage.mjs';

export function rentalPeriodLabel() {
  return app.rental.period === 'half' ? 'half day' : app.rental.period === 'week' ? 'week' : 'day';
}

export function rentalPeriodSelector() {
  return /* HTML */ `<div class="segments rental-period" aria-label="Rental rate basis">
    ${[
      ['half', 'Half day'],
      ['day', 'Daily'],
      ['week', 'Weekly'],
    ]
      .map(
        ([value, label]) =>
          /* HTML */ `<button
            data-rental-period="${value}"
            class="${app.rental.period === value ? 'selected' : ''}"
            aria-pressed="${app.rental.period === value}"
          >
            ${label}
          </button>`,
      )
      .join('')}
  </div>`;
}

export function rentalCount() {
  return rentalLines(app.rental).reduce((sum, l) => sum + l.qty, 0);
}

export function rentalEstimate() {
  return rentalUnits(app.rental)
    ? rentalTotal(app.rental)
    : rentalLines(app.rental).reduce((sum, l) => sum + l.qty * l.rate, 0);
}

export function rentalCounter(item) {
  const qty = app.rental.items[item.id] || 0,
    parent = includedBy(app.rental, item.id);
  return /* HTML */ `<div class="rental-counter">
    <button
      data-rental-item="${item.id}"
      data-qty="${qty - 1}"
      aria-label="Remove one ${esc(item.title)}"
      ${qty === 0 || parent ? 'disabled' : ''}
    >
      ${icon('minus')}</button
    ><output aria-label="Quantity of ${esc(item.title)}">${qty}</output
    ><button
      data-rental-item="${item.id}"
      data-qty="${qty + 1}"
      aria-label="Add one ${esc(item.title)}"
      ${qty >= item.qty || parent ? 'disabled' : ''}
    >
      ${icon('plus')}
    </button>
  </div>`;
}

export function rentalRow(item) {
  const parent = includedBy(app.rental, item.id);
  return /* HTML */ `<article class="rental-row ${parent ? 'bundle-included' : ''}">
    <span class="rental-item-icon">${icon(item.icon)}</span>
    <div class="rental-item-copy">
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <div class="rental-item-rate">
        ${parent ? `Included in ${rentalItems.find((i) => i.id === parent).title}` : /* HTML */ `<strong>${money(item[app.rental.period])}</strong><small>/ ${rentalPeriodLabel()} · max ${item.qty}</small>`}
      </div>
    </div>
    ${rentalCounter(item)}
  </article>`;
}

export function rentalCatalogue() {
  const list = rentalItems.filter(
    (i) => app.rentalCategory === 'All' || i.category === app.rentalCategory,
  );
  return /* HTML */ `<section class="home-page rental-catalogue">
    ${modeSwitch()}${heading('The kit for your next shoot.', 'Equipment hire, without the guesswork.')}
    ${rentalPeriodSelector()}
    <nav class="filter-chips rental-categories" aria-label="Equipment categories">
      ${['All', 'Cameras', 'Lenses', 'Audio', 'Modifiers', 'GoPros', 'Accessories'].map((c) => /* HTML */ `<button data-rental-category="${c}" class="${app.rentalCategory === c ? 'active' : ''}" aria-pressed="${app.rentalCategory === c}">${c}</button>`).join('')}
    </nav>
    <p class="rental-rate-note">
      ${app.rental.period === 'half' ? 'Up to 4 hours · same-day return' : app.rental.period === 'week' ? '5–7 days per weekly block' : 'Per calendar hire day'}
      · Ex VAT
    </p>
    ${app.rentalMessage ? /* HTML */ `<p class="rental-feedback" role="status">${esc(app.rentalMessage)}</p>` : ''}
    <div class="rental-list">${list.map(rentalRow).join('')}</div>
    <details class="rental-terms">
      <summary>Before you hire ${icon('chevron-down')}</summary>
      <p>
        Equipment is hired to approved freelancers and production companies. Insurance or a security
        deposit is required. Availability is confirmed after review.
      </p>
      <p>
        Lighting modifiers are supplied without fixtures. The inventory shown is the published
        rate-card quantity, not live availability.
      </p>
    </details>
  </section>`;
}

export function rentalSelectedKit() {
  return /* HTML */ `<section>
    ${heading('Your rental kit', 'Check your selection before choosing dates.')}
    <div class="rental-list">
      ${rentalItems
        .filter((i) => app.rental.items[i.id] > 0 && !includedBy(app.rental, i.id))
        .map(rentalRow)
        .join('')}
    </div>
    <button class="text-button" data-rental-browse>${icon('plus')}Add more equipment</button
    >${!rentalCount() ? '<p class="field-hint">Your kit is empty. Add equipment to continue.</p>' : ''}
  </section>`;
}

export function rentalDates() {
  return /* HTML */ `${heading('When do you need it?', 'Choose dates and how you’ll receive the kit.')}
    ${rentalPeriodSelector()}
    <form id="rental-dates" class="rental-date-form">
      <label class="text-field"
        >Start date<input
          id="rental-start"
          type="date"
          min="${rentalToday()}"
          value="${esc(app.rental.start)}"
          required /></label
      ><label class="text-field"
        >Return date<input
          id="rental-end"
          type="date"
          min="${app.rental.start || rentalToday()}"
          value="${esc(app.rental.end)}"
          required
      /></label>
    </form>
    <p class="field-hint">
      ${app.rental.period === 'half' ? 'Half-day hire is up to 4 hours, with collection and return on the same date.' : app.rental.period === 'week' ? 'Weekly hire covers 5–7 days. Longer hires use full seven-day blocks, including a part-used final block.' : 'Start and return dates both count as calendar hire days.'}
    </p>
    <h2 class="question">Collection or delivery?</h2>
    <div class="segments">
      ${['Collection', 'Delivery'].map((v) => /* HTML */ `<button data-rental-fulfilment="${v}" class="${app.rental.fulfilment === v ? 'selected' : ''}" aria-pressed="${app.rental.fulfilment === v}">${icon(v === 'Collection' ? 'map-pin' : 'truck')}${v}</button>`).join('')}
    </div>
    ${
      app.rental.fulfilment === 'Delivery'
        ? /* HTML */ `<label class="text-field rental-address"
              >Delivery town or address<input
                id="rental-address"
                value="${esc(app.rental.address)}"
                maxlength="200"
                placeholder="Where should we deliver?"
            /></label>
            <p class="field-hint">Delivery is quoted separately.</p>`
        : '<p class="field-hint">Collection in Windhoek. Exact times are arranged after approval.</p>'
    }
    <div class="rental-duration" aria-live="polite">
      ${rentalDays(app.rental) ? `${rentalDays(app.rental)} calendar day${rentalDays(app.rental) === 1 ? '' : 's'} · ${rentalUnits(app.rental)} ${rentalPeriodLabel()} rate unit${rentalUnits(app.rental) === 1 ? '' : 's'}` : 'Choose both dates to calculate hire.'}
    </div>`;
}

export function rentalReview() {
  return /* HTML */ `${heading('Review your rental', 'Everything going into your request.')}
    <section class="review-sheet">
      <div class="review-title">
        ${icon('package')}
        <h2>Equipment hire</h2>
        <span class="included-tag">Request</span>
      </div>
      <dl class="summary-rows">
        <div>
          <dt>Dates</dt>
          <dd>${esc(app.rental.start)} to ${esc(app.rental.end)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>${rentalDays(app.rental)} calendar days</dd>
        </div>
        <div>
          <dt>Rate</dt>
          <dd>${rentalUnits(app.rental)} × ${rentalPeriodLabel()}</dd>
        </div>
        <div>
          <dt>Handover</dt>
          <dd>
            ${app.rental.fulfilment}${app.rental.fulfilment === 'Delivery' && app.rental.address ? /* HTML */ `<small>${esc(app.rental.address)}</small>` : ''}
          </dd>
        </div>
      </dl>
      <div class="rental-price-lines">
        ${rentalLines(app.rental)
          .map(
            (l) =>
              /* HTML */ `<div>
                <span
                  >${l.title}<small
                    >${l.qty} × ${money(l.rate)} × ${l.units} ${rentalPeriodLabel()}</small
                  ></span
                ><strong>${money(l.amount)}</strong>
              </div>`,
          )
          .join('')}
      </div>
      <div class="estimate">
        <span>Equipment estimate<small>Ex VAT · subject to approval</small></span
        ><strong>${money(rentalTotal(app.rental))}</strong>
      </div>
      <p class="field-hint">
        Delivery, insurance and any refundable security deposit are excluded.
      </p>
    </section>
    <form id="rental-contact">
      <h2 class="question">Your details</h2>
      ${[
        ['name', 'Full name', 'text', 'name'],
        ['company', 'Company (optional)', 'text', 'organization'],
        ['billingAddress', 'Billing address (optional)', 'text', 'street-address'],
        ['email', 'Email', 'email', 'email'],
        ['phone', 'Phone (optional)', 'tel', 'tel'],
      ]
        .map(
          ([id, label, type, auto]) =>
            /* HTML */ `<label class="text-field"
              >${label}<input
                id="hire-${id}"
                type="${type}"
                autocomplete="${auto}"
                value="${esc(app.rental[id])}"
                maxlength="150"
                ${['name', 'email'].includes(id) ? 'required' : ''}
            /></label>`,
        )
        .join('')}<label class="text-field"
        >Notes or preferred collection time<textarea id="hire-notes" rows="3" maxlength="1500">
${esc(app.rental.notes)}</textarea></label
      ><label class="rental-ack"
        ><input type="checkbox" id="rental-ack" ${app.rental.ack ? 'checked' : ''} required /><span
          >I understand this is a request. Availability, eligibility and insurance or deposit
          requirements need confirmation.</span
        ></label
      >
    </form>
    <p class="email-note">
      ${icon('send')}Submit your request to VisionHaus. We’ll review it and reply with a quotation.
    </p>
    ${submissionFeedback()}`;
}

export function rentalToday() {
  return windhoekToday();
}

export function rentalCheckout() {
  if (app.rentalPrepared)
    return /* HTML */ `<section class="completion">
      <span class="completion-icon">${icon('check')}</span
      >${heading('Rental request submitted', 'VisionHaus will review availability and reply with a quotation.')}
      <p class="request-reference">${esc(app.rentalReference)}</p>
      <button class="secondary" id="rental-download">${icon('download')}Download request</button
      ><button class="text-button" id="rental-edit">Start a new request</button>
      <p class="field-hint">This is not a confirmed equipment reservation.</p>
    </section>`;
  return /* HTML */ `<section class="rental-checkout">
    <div class="plan-topline">
      <button class="icon-button" id="rental-back" aria-label="Previous rental step">
        ${icon('arrow-left')}</button
      ><span>Your rental request</span
      ><button class="text-button" data-rental-browse>Equipment</button>
    </div>
    <nav class="plan-sections" aria-label="Rental steps">
      ${[
        ['kit', 'Your kit'],
        ['dates', 'Dates'],
        ['review', 'Review'],
      ]
        .map(
          ([v, t]) =>
            /* HTML */ `<button
              data-rental-step="${v}"
              ${app.rental.step === v ? 'aria-current="step"' : ''}
            >
              ${t}
            </button>`,
        )
        .join('')}
    </nav>
    ${app.rentalMessage ? /* HTML */ `<p class="rental-feedback" role="alert">${esc(app.rentalMessage)}</p>` : ''}${{ kit: rentalSelectedKit, dates: rentalDates, review: rentalReview }[app.rental.step]()}
  </section>`;
}

export function rentalControls() {
  if ((app.rentalPrepared && app.view === 'hire') || (app.view === 'home' && !rentalCount()))
    return '';
  return /* HTML */ `<div class="detail-dock rental-dock">
    <span
      ><small
        >${rentalUnits(app.rental) ? 'Equipment estimate' : `Selected kit / ${rentalPeriodLabel()}`}</small
      ><strong>${money(rentalEstimate())}</strong
      ><small>${rentalCount()} item${rentalCount() === 1 ? '' : 's'} · Ex VAT</small></span
    >${button(app.view === 'home' ? 'Review kit' : app.rental.step === 'review' ? 'Submit' : 'Continue', app.view === 'home' ? 'data-rental-cart' : 'data-rental-next')}
  </div>`;
}

export async function rentalNext() {
  if (app.submitting) return;
  app.rentalMessage = '';
  app.submissionError = '';
  if (!rentalCount()) {
    app.rentalMessage = 'Choose at least one item.';
    app.render();
    return;
  }
  if (app.rental.step === 'kit') {
    app.rental.step = 'dates';
  } else if (app.rental.step === 'dates') {
    if (!$('#rental-dates').reportValidity()) return;
    const errors = rentalErrors(app.rental, rentalToday());
    if (errors.length) {
      app.rentalMessage = errors.join(' ');
      app.render();
      return;
    }
    app.rental.step = 'review';
  } else {
    const errors = rentalErrors(app.rental, rentalToday());
    if (errors.length) {
      app.rentalMessage = errors.join(' ');
      app.rental.step = 'dates';
      app.render();
      return;
    }
    if (!$('#rental-contact').reportValidity()) return;
    const success = await app.submitRequest('rental', app.rental);
    if (success) app.rentalPrepared = true;
    app.render();
    if (success) {
      scrollTo({ top: 0 });
      app.focusTitle();
    } else $('.submission-error')?.scrollIntoView({ block: 'center' });
    return;
  }
  app.render();
  scrollTo({ top: 0 });
  app.focusTitle();
}

export function bindRentals() {
  document.querySelectorAll('[data-mode]').forEach(
    (b) =>
      (b.onclick = () => {
        app.homeMode = b.dataset.mode;
        app.rentalMessage = '';
        app.render();
      }),
  );
  document.querySelectorAll('[data-rental-period]').forEach(
    (b) =>
      (b.onclick = () => {
        app.rental.period = b.dataset.rentalPeriod;
        app.rentalMessage = '';
        app.render();
      }),
  );
  document.querySelectorAll('[data-rental-category]').forEach(
    (b) =>
      (b.onclick = () => {
        app.rentalCategory = b.dataset.rentalCategory;
        app.render();
      }),
  );
  document.querySelectorAll('[data-rental-item]').forEach(
    (b) =>
      (b.onclick = () => {
        if (app.rentalPrepared) app.rental.requestToken = newRequestToken();
        const id = b.dataset.rentalItem,
          qty = Number(b.dataset.qty);
        const oldQty = app.rental.items[id] || 0;
        const old = Object.keys(app.rental.items);
        app.rental = setRentalQty(app.rental, id, qty);
        if ((app.rental.items[id] || 0) > oldQty) haptic();
        const removed = old.filter((x) => !app.rental.items[x]);
        app.rentalMessage =
          removed.length && qty > 0
            ? 'Bundle selected. Separately selected included items were removed.'
            : '';
        app.rentalPrepared = false;
        app.render();
        document
          .querySelector(`[data-rental-item="${id}"][data-qty="${qty + 1}"]`)
          ?.focus({ preventScroll: true });
        $('#price-announcement').textContent =
          `Equipment estimate ${money(rentalEstimate())} ex VAT.`;
      }),
  );
  document.querySelectorAll('[data-rental-browse]').forEach(
    (b) =>
      (b.onclick = () => {
        app.homeMode = 'rentals';
        app.rentalMessage = '';
        app.navigate('home');
      }),
  );
  document.querySelectorAll('[data-rental-cart]').forEach(
    (b) =>
      (b.onclick = () => {
        if (app.rentalPrepared) app.rental.requestToken = newRequestToken();
        app.rentalPrepared = false;
        app.rental.step = 'kit';
        app.rentalMessage = '';
        app.navigate('hire');
      }),
  );
  document.querySelectorAll('[data-rental-next]').forEach((b) => (b.onclick = rentalNext));
  document.querySelectorAll('[data-rental-step]').forEach(
    (b) =>
      (b.onclick = () => {
        const target = b.dataset.rentalStep;
        if (target === 'review') {
          const errors = rentalErrors(app.rental, rentalToday());
          if (errors.length) {
            app.rentalMessage = errors.join(' ');
            app.rental.step = 'dates';
            app.render();
            return;
          }
        }
        app.rental.step = target;
        app.rentalMessage = '';
        app.render();
        scrollTo({ top: 0 });
      }),
  );
  document.querySelectorAll('[data-rental-fulfilment]').forEach(
    (b) =>
      (b.onclick = () => {
        app.rental.fulfilment = b.dataset.rentalFulfilment;
        app.rentalMessage = '';
        app.render();
      }),
  );
  for (const key of ['start', 'end'])
    if ($('#rental-' + key))
      $('#rental-' + key).onchange = (e) => {
        app.rental[key] = e.target.value;
        if (key === 'start' && app.rental.period === 'half') app.rental.end = e.target.value;
        app.rentalMessage = '';
        app.render();
      };
  if ($('#rental-address'))
    $('#rental-address').oninput = (e) => {
      app.rental.address = e.target.value;
      persist();
    };
  for (const key of ['name', 'company', 'billingAddress', 'email', 'phone', 'notes'])
    if ($('#hire-' + key))
      $('#hire-' + key).oninput = (e) => {
        app.rental[key] = e.target.value;
        persist();
      };
  if ($('#rental-ack'))
    $('#rental-ack').onchange = (e) => {
      app.rental.ack = e.target.checked;
      persist();
    };
  if ($('#rental-contact'))
    $('#rental-contact').onsubmit = (e) => {
      e.preventDefault();
      rentalNext();
    };
  if ($('#rental-back'))
    $('#rental-back').onclick = () => {
      app.rentalMessage = '';
      if (app.rental.step === 'kit') {
        app.homeMode = 'rentals';
        app.navigate('home');
      } else {
        app.rental.step = app.rental.step === 'review' ? 'dates' : 'kit';
        app.render();
        scrollTo({ top: 0 });
      }
    };

  if ($('#rental-edit'))
    $('#rental-edit').onclick = () => {
      const contact = {
        name: app.rental.name,
        company: app.rental.company,
        billingAddress: app.rental.billingAddress,
        email: app.rental.email,
        phone: app.rental.phone,
      };
      app.rental = { ...rentalInitial(), ...contact, requestToken: newRequestToken() };
      app.rentalPrepared = false;
      app.rentalReference = '';
      app.submissionError = '';
      app.rentalMessage = '';
      app.homeMode = 'rentals';
      app.navigate('home');
    };
  if ($('#rental-download'))
    $('#rental-download').onclick = () => {
      const url = URL.createObjectURL(new Blob([rentalBrief(app.rental)], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VisionHaus-Rental-Request.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
}

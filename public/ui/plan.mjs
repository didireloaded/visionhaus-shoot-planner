import { whatsapp } from './contact.mjs';
import { dateField, displayDate } from './date-picker.mjs';
import { app } from './state.mjs';
import {
  availableExtras,
  change,
  equipment,
  initial,
  isEditing,
  isEvent,
  isFinishing,
  isPhoto,
  isPodcast,
  isRetainer,
  locations,
  narrative,
  packageFor,
  packageInclusions,
  pendingExtras,
  priceLines,
  priceTotals,
  productionErrors,
  projects,
  quoteOnly,
  retainerFor,
  retainers,
  reviewItems,
  shootDays,
  taxLabel,
  total,
  variantFor,
} from '../domain.mjs';
import { $, button, esc, heading, icon, money, motion, submissionFeedback } from './shared.mjs';
import { briefEntry, clearBrief } from './brief.mjs';
import { windhoekToday } from '../dates.mjs';
import { newRequestToken } from '../request-id.mjs';

export const services = [
  ['Video', 'video', 'Videography', 'Films, events & content'],
  ['Photo', 'camera', 'Photography', 'People, products & events'],
  ['Photo + video', 'layers', 'Photo + video', 'One joined-up production'],
  ['Editing', 'scissors', 'Editing', 'Finish what you’ve started'],
];

export const serviceIcon = (p) =>
  p === 'Podcast'
    ? 'mic'
    : p.includes('reel')
      ? 'smartphone'
      : p.includes('Music')
        ? 'music-2'
        : p.includes('Event') || p === 'Conference'
          ? 'calendar-range'
          : p.includes('Interview') || p === 'Testimonial'
            ? 'messages-square'
            : p === 'Commercial'
              ? 'clapperboard'
              : 'video';

export function projectChooser() {
  const selected = app.state.service || 'Video';
  const choices = projects[selected];
  return /* HTML */ `<section class="project-chooser">
    ${heading('Let’s build your plan', 'Choose the kind of project you have in mind.')}
    <div class="service-switch" aria-label="Production type">
      ${services.map(([v, i, t]) => /* HTML */ `<button data-service="${v}" class="${selected === v ? 'selected' : ''}" aria-pressed="${selected === v}">${icon(i)}<span>${t}</span></button>`).join('')}
    </div>
    <h2 class="question">
      ${selected === 'Editing' ? 'What needs finishing?' : 'What are we creating?'}
    </h2>
    <div class="project-list project-grid">
      ${choices
        .slice(0, 8)
        .map((p) => projectTile(p))
        .join('')}
    </div>
    ${
      choices.length > 8
        ? /* HTML */ `<details class="more-projects">
            <summary>
              More ${selected === 'Editing' ? 'editing' : 'project'} options ${icon('chevron-down')}
            </summary>
            <div class="project-list project-grid">
              ${choices
                .slice(8)
                .map((p) => projectTile(p))
                .join('')}
            </div>
          </details>`
        : ''
    }${briefEntry()}
  </section>`;
}

export function projectTile(p) {
  return /* HTML */ `<button data-project="${esc(p)}">
    <span class="project-icon">${icon(serviceIcon(p))}</span
    ><span>${p}</span>${icon('chevron-right')}
  </button>`;
}

export function chips(key, values) {
  return /* HTML */ `<div class="segments">
    ${values
      .map((v) => {
        const value = Array.isArray(v) ? v[0] : v,
          label = Array.isArray(v) ? v[1] : v;
        return /* HTML */ `<button
          data-key="${key}"
          data-value="${esc(value)}"
          class="${app.state[key] === value ? 'selected' : ''}"
          aria-pressed="${app.state[key] === value}"
        >
          ${label}
        </button>`;
      })
      .join('')}
  </div>`;
}

export function counter(key, label, min, max, sub = '') {
  return /* HTML */ `<div class="counter-row">
    <span>${label}${sub ? /* HTML */ `<small>${sub}</small>` : ''}</span>
    <div class="counter">
      <button
        data-key="${key}"
        data-value="${app.state[key] - 1}"
        aria-label="Fewer ${label.toLowerCase()}"
        ${app.state[key] <= min ? 'disabled' : ''}
      >
        ${icon('minus')}</button
      ><output aria-label="${label}">${app.state[key]}</output
      ><button
        data-key="${key}"
        data-value="${app.state[key] + 1}"
        aria-label="More ${label.toLowerCase()}"
        ${app.state[key] >= max ? 'disabled' : ''}
      >
        ${icon('plus')}
      </button>
    </div>
  </div>`;
}

export function choice(key, value, label, sub, ic) {
  return /* HTML */ `<button
    class="choice ${app.state[key] === value ? 'selected' : ''}"
    data-key="${key}"
    data-value="${esc(value)}"
    aria-pressed="${app.state[key] === value}"
  >
    <span class="choice-icon">${icon(ic)}</span
    ><span><strong>${label}</strong><small>${sub}</small></span
    ><b class="radio-mark">${app.state[key] === value ? icon('check') : ''}</b>
  </button>`;
}

export function toggle(key, title, sub, ic) {
  return /* HTML */ `<button
    class="toggle-row"
    data-toggle="${key}"
    aria-pressed="${app.state[key]}"
  >
    <span class="choice-icon">${icon(ic)}</span
    ><span><strong>${title}</strong><small>${sub}</small></span
    ><span class="switch ${app.state[key] ? 'on' : ''}"><b></b></span>
  </button>`;
}

export function question(title, content, sub = '') {
  return /* HTML */ `<section class="question-group">
    <h2 class="question">${title}</h2>
    ${sub ? /* HTML */ `<p class="field-hint">${sub}</p>` : ''}${content}
  </section>`;
}

export function dateStrip() {
  const today = new Date(`${windhoekToday()}T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Windhoek',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return /* HTML */ /* HTML */ `<div
    class="date-strip"
    aria-label="Preferred date in the next two weeks"
  >
    ${Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() + i);
      const value = fmt.format(d);
      return /* HTML */ /* HTML */ `<button
        data-key="date"
        data-value="${value}"
        class="${app.state.date === value ? 'selected' : ''}"
        aria-pressed="${app.state.date === value}"
        aria-label="${displayDate(value)}"
      >
        <small
          >${d.toLocaleDateString('en', { weekday: 'short', timeZone: 'Africa/Windhoek' })}</small
        ><strong
          >${d.toLocaleDateString('en', { day: 'numeric', timeZone: 'Africa/Windhoek' })}</strong
        >
      </button>`;
    }).join('')}
  </div>`;
}

export function dateLocation() {
  return /* HTML */ /* HTML */ `<section class="date-choice">
      <h2 class="question">
        ${isEditing(app.state) ? 'Preferred delivery date' : 'Preferred shoot date'}
      </h2>
      ${dateStrip()}${dateField(app.state.date)}
      <p class="field-hint">Flexible? Leave the date open.</p>
    </section>
    <section class="input-group">
      ${
        !isEditing(app.state)
          ? /* HTML */ /* HTML */ `<label class="icon-field"
                >${icon('map-pin')}<span
                  >Where’s the shoot?<select id="location">
                    ${locations.map((l) => /* HTML */ /* HTML */ `<option ${l === app.state.location ? 'selected' : ''}>${l}</option>`).join('')}
                  </select></span
                ></label
              ><label class="icon-field"
                >${icon('building-2')}<span
                  >Venue or town<input
                    id="venue"
                    placeholder="Optional"
                    value="${esc(app.state.venue)}"
                    maxlength="150" /></span
              ></label>`
          : ''
      }
    </section>`;
}

export function podcastScope() {
  return /* HTML */ `${app.state.mode === 'custom' ? question('Who’s on the podcast?', /* HTML */ `<div class="choice-list">${choice('framing', 'Direct to camera', 'Solo', 'One person, direct to camera', 'user-round')}${choice('framing', 'Conversation', 'Conversation', 'Two to four people', 'messages-square')}${choice('framing', 'Full coverage', 'Full coverage', 'Multiple angles, two to four people', 'video')}</div>`) : ''}
    <div class="grouped-rows">
      ${
        app.state.framing === 'Direct to camera'
          ? /* HTML */ `<div class="fixed-row">
              ${icon('user-round')}<span>1 speaker<small>Solo format</small></span
              ><span class="included-tag">Fixed</span>
            </div>`
          : counter('people', 'People', 2, 4)
      }${counter('episodes', 'Episodes', 1, 17, 'Up to 17 in one plan')}
    </div>
    ${question(
      'Plan your recording days',
      /* HTML */ `<div class="grouped-rows">
          ${counter('perDay', 'Episodes per day', 1, app.state.episodes)}
        </div>
        <div class="schedule-strip">
          ${icon('calendar-range')}<span
            >${shootDays(app.state)} recording day${shootDays(app.state) === 1 ? '' : 's'}<small
              >${app.state.episodes} episode${app.state.episodes === 1 ? '' : 's'} · up to
              ${app.state.perDay} per day</small
            ></span
          >
        </div>`,
    )}${question(
      'Length of each episode',
      chips('episodeMinutes', [
        [30, '30 min'],
        [45, '45 min'],
        [60, '60 min'],
        [90, '90 min'],
      ]),
    )}${question(
      'Time on set, per day',
      chips('hours', [
        [2, '2 hrs'],
        [4, '4 hrs'],
        [6, '6 hrs'],
        [8, '8 hrs'],
        ['Full day', 'Full day'],
      ]),
    )}${reviewItems(app.state).some((t) => t.startsWith('Recording schedule')) ? /* HTML */ `<p class="schedule-note">${icon('clock')}Allow more time or fewer episodes per day for setup and breaks.</p>` : ''}`;
}

export function retainerScope() {
  const r = retainerFor(app.state);
  return /* HTML */ `${heading('Monthly content', 'Choose the production capacity your business needs.')}${question('Monthly retainer', /* HTML */ `<div class="choice-list">${retainers.map((t) => choice('retainerTier', t.id, t.title, `${money(t.price)} / month ex VAT · ${t.hours} production hours`, 'calendar-range')).join('')}</div>`)}
    <div class="review-sheet">
      <h2>${r.title}</h2>
      <p>Up to ${r.hours} production hours per month. Editing capacity is included separately.</p>
      <ul class="review-list">
        <li>Video capacity: up to ${r.videos} short-form edits</li>
        <li>Photo capacity: up to ${r.photos} edited images</li>
        <li>
          ${r.events ? `Up to ${r.events} event booking${r.events === 1 ? '' : 's'} within monthly hours${r.id === 'growth' ? ' · normally up to 4 hours' : ''}` : 'Event coverage quoted separately'}
        </li>
        <li>
          Up to ${r.revisions} revision
          rounds${r.id === 'essential' || r.id === 'professional' ? ' per approved video deliverable' : ''}
        </li>
      </ul>
      <p class="field-hint">
        Capacity guides, not a promise of every maximum together. Your monthly mix is agreed before
        booking.
      </p>
      <p class="field-hint">
        Minimum 3 months · monthly payment in advance · ex VAT. Third-party costs and major
        productions are quoted separately.
      </p>
      <a
        class="text-button"
        href="/monthly-content-retainers-2026.pdf"
        target="_blank"
        rel="noopener"
        >Read full retainer details and terms</a
      >
    </div>
    ${dateLocation()}`;
}

export function finishingScope() {
  return /* HTML */ `${heading(app.state.project, 'Choose the billing scope for your supplied footage.')}${question(
      'Project format',
      chips('finishingFormat', [
        ['once', 'Once-off / film'],
        ['series', 'Series / episodes'],
      ]),
    )}${app.state.finishingFormat === 'series' ? /* HTML */ `<div class="grouped-rows">${counter('episodes', 'Episodes', 1, 17)}</div>` : ''}
    <p class="field-hint">
      ${app.state.project === 'Colour grading' ? 'N$12,000 once-off, or N$7,000 per episode' : 'N$5,000 once-off, or N$7,000 per episode'}
      · ex VAT. Final scope and revision allowance confirmed.
    </p>
    ${dateLocation()}`;
}

export function shoot() {
  if (isRetainer(app.state)) return retainerScope();
  if (isFinishing(app.state)) return finishingScope();
  if (app.state.project === 'Crew hire')
    return /* HTML */ `${heading('Plan your crew', 'Choose the role, team size and time needed.')}${question('Which role?', chips('crewRole', ['Camera operator', 'Photographer', 'Editor', 'Sound operator', 'Production assistant']))}
      <div class="grouped-rows">${counter('crewCount', 'Crew members', 1, 10)}</div>
      ${question(
        'Time needed',
        chips('hours', [
          [2, '2 hrs'],
          [4, '4 hrs'],
          [6, '6 hrs'],
          [8, '8 hrs'],
          ['Full day', 'Full day'],
        ]),
      )}${dateLocation()}`;
  const p = packageFor(app.state),
    v = variantFor(app.state);
  return `${heading(app.state.mode === 'package' ? 'Make it a date' : 'Shape your shoot', app.state.mode === 'package' ? `${p.title} · ${v.label}` : app.state.project)}${
    app.state.mode === 'package' && !isPodcast(app.state)
      ? /* HTML */ `<div class="package-inclusions">
          <span class="eyebrow">YOUR PACKAGE</span>
          <ul class="included-list">
            ${v.features.map((f) => /* HTML */ `<li>${icon('check')}${f}</li>`).join('')}
          </ul>
        </div>`
      : isPodcast(app.state)
        ? podcastScope()
        : isEditing(app.state)
          ? `${question(
              'Editing time allowance',
              chips('hours', [
                [2, '2 hrs'],
                [4, '4 hrs'],
                [8, 'Full day'],
              ]),
            )}${question('Your finished video', chips('editLength', ['30 seconds', '60 seconds', '3 minutes', 'Long-form']))}`
          : `${
              isEvent(app.state) && !isPhoto(app.state)
                ? question(
                    'What should we deliver?',
                    /* HTML */ `<div class="choice-list">
                        ${choice('eventOutput', 'highlight', 'Event highlights', 'The best moments, in one short film', 'clapperboard')}${choice('eventOutput', 'full', 'Full event recording', 'Speeches, sessions & key moments', 'video')}
                      </div>
                      ${app.state.eventOutput === 'highlight' ? chips('editLength', ['30 seconds', '60 seconds', '3 minutes']) : ''}`,
                  )
                : ''
            }${isPhoto(app.state) && !isEvent(app.state) ? /* HTML */ `<div class="grouped-rows">${counter('subjects', app.state.project === 'Product photography' ? 'Products' : 'People', app.state.project === 'Headshots' ? 8 : 1, 200)}</div>` : ''}${question(
              'Time on location',
              chips('hours', [
                [2, '2 hrs'],
                [4, '4 hrs'],
                [6, '6 hrs'],
                [8, '8 hrs'],
                ['Full day', 'Full day'],
              ]),
            )}${!isPhoto(app.state) && !isEvent(app.state) ? `${question('Where are we filming?', chips('shootStyle', ['Indoor', 'Outdoor', 'Both']))}${question('Finished video length', chips('editLength', ['30 seconds', '60 seconds', '3 minutes', 'Long-form']))}` : ''}`
  }${dateLocation()}`;
}

export function equipmentScreen() {
  if (app.state.project === 'Crew hire')
    return /* HTML */ `${heading('Your crew request', 'Equipment is arranged separately.')}
      <div class="equipment-receipt">
        <h2>
          ${icon('users')}${app.state.crewCount}
          ${app.state.crewRole}${app.state.crewCount > 1 ? 's' : ''}
        </h2>
        <p class="field-hint">
          Dates, hours, experience and any equipment requirements are confirmed in the quote.
        </p>
      </div>`;
  return /* HTML */ `${heading('Build your setup', 'Choose what the shoot needs.')}
    ${
      !isPhoto(app.state) && !isEditing(app.state)
        ? question(
            'Camera coverage',
            chips('cameras', [
              [1, '1 camera'],
              [2, '2 cameras'],
              [3, '3 cameras'],
            ]),
          )
        : ''
    }
    <div class="equipment-receipt">
      <h2>${icon('package-check')}Your setup includes</h2>
      <div class="kit-grid">
        ${equipment(app.state)
          .map(
            (e, i) =>
              /* HTML */ `<span
                >${icon(i === 0 ? 'camera' : i === 1 ? 'users' : i === 2 ? 'triangle' : 'check')}${e}</span
              >`,
          )
          .join('')}
      </div>
    </div>
    ${!isEditing(app.state) ? /* HTML */ `<div class="toggle-list">${toggle('lighting', 'Lighting', 'Fixtures & modifiers', 'lightbulb')}${toggle('extraLighting', 'Additional lighting', 'Beyond included setup · N$1,800 per shoot ex VAT', 'lightbulb')}${!isPhoto(app.state) ? toggle('extraSound', 'Additional sound support', 'Beyond included setup · N$1,800 per shoot ex VAT', 'mic') : ''}${app.state.service === 'Photo + video' ? toggle('extraPhotographer', 'Another photographer', 'Beyond included photography · N$1,800 per shoot ex VAT', 'camera') : ''}${!isPhoto(app.state) ? toggle('sound', 'Sound recording', isPodcast(app.state) ? 'Microphones for every speaker' : 'Speeches, interviews & atmosphere', 'mic') : ''}${!isPhoto(app.state) && isEvent(app.state) ? toggle('liveEdits', 'Live edits', 'On-site editor & workstation', 'laptop') : ''}${!isPhoto(app.state) ? toggle('gimbal', 'Gimbal', 'Smooth moving shots', 'move-3d') : ''}${toggle('drone', 'Drone coverage', 'Pilot & permits need review', 'plane')}${['Interview', 'Testimonial', 'Corporate video', 'Commercial'].includes(app.state.project) ? toggle('teleprompter', 'Teleprompter', 'For scripted delivery', 'text-cursor-input') : ''}</div>` : ''}
    <p class="field-hint">
      This is your requested setup. Extra kit and crew are confirmed in the quote.
    </p>
    <details class="equipment-inventory">
      <summary>Available production kit ${icon('chevron-down')}</summary>
      <p>
        Sony FX3, Sigma 24–70mm & 85mm, Sirui anamorphic, RØDE Wireless Pro, Zoom H5, GoPro HERO13,
        tripods, softboxes, ND filters & matte box.
      </p>
      <small
        >Multiple cameras, fixtures, gimbals and specialist kit may be sourced. Availability is
        confirmed per shoot.</small
      >
    </details>`;
}

export function delivery() {
  const p = packageFor(app.state);
  return /* HTML */ `${heading('The finishing touches', 'Add only what you need.')}
    <div class="choice-list extras-list">
      ${availableExtras(app.state)
        .map((e) => {
          const included =
            app.state.mode === 'package' &&
            p.id === 'event' &&
            app.state.variantId === 'premium' &&
            e.id === 'clips';
          return /* HTML */ `<button
            class="choice ${app.state.extras.includes(e.id) || included ? 'selected' : ''}"
            data-extra="${e.id}"
            aria-pressed="${app.state.extras.includes(e.id) || included}"
            ${included ? 'disabled' : ''}
          >
            <span class="choice-icon">${icon(e.icon)}</span
            ><span
              ><strong>${e.title}</strong
              ><small
                >${included ? 'Included in your package' : app.state.extras.includes(e.id) && e.price === null ? e.quoteNote || 'Requested. VisionHaus will discuss your project and confirm a separate price. Not included in this estimate.' : e.description}</small
              ></span
            ><span class="extra-status"
              >${included ? 'Included' : e.price ? `+ ${money(e.price)}${isPodcast(app.state) && e.id === 'rush' ? ' / ep · tax incl.' : e.id === 'clips' ? ' / cut · ex VAT' : e.id === 'retouch' ? ' / image · ex VAT' : ' · ex VAT'}` : app.state.extras.includes(e.id) ? 'Price pending' : 'Price on review'}</span
            ><b class="radio-mark"
              >${app.state.extras.includes(e.id) || included ? icon('check') : ''}</b
            >
          </button>`;
        })
        .join('')}
    </div>
    ${app.state.extras.includes('clips') && app.state.project === 'Conference' ? /* HTML */ `<div class="grouped-rows">${counter('clipCount', 'Vertical cutdowns', 1, 30)}</div>` : ''}${app.state.extras.includes('retouch') ? /* HTML */ `<div class="grouped-rows">${counter('retouchCount', 'Retouched images', 1, 200)}</div>` : ''}<label
      class="text-field"
      >Anything else?<textarea
        id="notes"
        rows="3"
        maxlength="6000"
        placeholder="A reference, deadline or detail we should know…"
      >
${esc(app.state.notes)}</textarea>
    </label>
    <p class="field-hint">
      Priced extras update your estimate. Selecting a price-on-review extra saves your request;
      VisionHaus will discuss it with you and confirm the additional cost.
    </p>`;
}

export function summaryRows() {
  return /* HTML */ `<dl class="summary-rows">
    <div>
      <dt>Service</dt>
      <dd>${esc(app.state.project)}</dd>
    </div>
    <div>
      <dt>Plan</dt>
      <dd>
        ${app.state.mode === 'package' ? `${packageFor(app.state).title} · ${variantFor(app.state).label}` : 'Custom production'}
      </dd>
    </div>
    ${
      !isEditing(app.state)
        ? /* HTML */ `<div>
            <dt>Location</dt>
            <dd>
              ${esc(app.state.location)}${app.state.venue ? /* HTML */ `<small>${esc(app.state.venue)}</small>` : ''}
            </dd>
          </div>`
        : ''
    }
    <div>
      <dt>${isEditing(app.state) ? 'Delivery date' : 'Shoot date'}</dt>
      <dd>${displayDate(app.state.date) || 'Flexible'}</dd>
    </div>
    <div>
      <dt>
        ${isPodcast(app.state) ? 'Time per day' : isEditing(app.state) ? 'Edit allowance' : 'Shoot time'}
      </dt>
      <dd>
        ${isRetainer(app.state) ? `${retainerFor(app.state).hours} hours per month` : isFinishing(app.state) ? (app.state.finishingFormat === 'series' ? `${app.state.episodes} episodes` : 'Once-off project') : `${app.state.hours}${typeof app.state.hours === 'number' ? ' hours' : ''}`}
      </dd>
    </div>
    ${
      isPodcast(app.state)
        ? /* HTML */ `<div>
              <dt>Podcast</dt>
              <dd>
                ${app.state.people} speaker${app.state.people === 1 ? '' : 's'} ·
                ${app.state.episodes} episodes
              </dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>
                ${shootDays(app.state)} day${shootDays(app.state) === 1 ? '' : 's'} · up to
                ${app.state.perDay} episodes/day<small
                  >${app.state.episodeMinutes} min per episode</small
                >
              </dd>
            </div>`
        : ''
    }${
      isEvent(app.state) && !isPhoto(app.state)
        ? /* HTML */ `<div>
            <dt>Deliverable</dt>
            <dd>
              ${app.state.eventOutput === 'full' ? 'Full event recording' : `${app.state.editLength} highlight`}
            </dd>
          </div>`
        : ''
    }${
      isPhoto(app.state) && !isEvent(app.state)
        ? /* HTML */ `<div>
            <dt>${app.state.project === 'Product photography' ? 'Products' : 'People'}</dt>
            <dd>${app.state.subjects}</dd>
          </div>`
        : ''
    }${
      isEditing(app.state)
        ? /* HTML */ `<div>
            <dt>Finished runtime</dt>
            <dd>${esc(app.state.editLength)}</dd>
          </div>`
        : ''
    }${
      !isPhoto(app.state) &&
      !isEvent(app.state) &&
      !isPodcast(app.state) &&
      !isEditing(app.state) &&
      !isRetainer(app.state) &&
      app.state.project !== 'Crew hire'
        ? /* HTML */ `<div>
              <dt>Setting</dt>
              <dd>${esc(app.state.shootStyle)}</dd>
            </div>
            ${
              app.state.mode === 'custom'
                ? /* HTML */ `<div>
                    <dt>Finished runtime</dt>
                    <dd>${esc(app.state.editLength)}</dd>
                  </div>`
                : ''
            }`
        : ''
    }
  </dl>`;
}

export function estimate() {
  if (quoteOnly(app.state))
    return '<div class="estimate"><span>Final scope and rate confirmed by VisionHaus</span><strong class="quote-price">Quote required</strong></div>';
  return /* HTML */ `<div class="estimate">
      <span
        >${app.state.mode === 'package' ? 'Package estimate' : 'Priced so far'}<small
          >${taxLabel(app.state)} · final quote follows</small
        ></span
      ><strong>${money(total(app.state))}</strong>
    </div>
    <p class="field-hint">
      VAT (15%): ${money(priceTotals(app.state).vat)} · Total including VAT:
      ${money(priceTotals(app.state).gross)}${isRetainer(app.state) ? ' per month' : ''}
    </p>
    ${
      pendingExtras(app.state).length
        ? /* HTML */ `<p class="field-hint pending-extra-note" role="status">
            ${pendingExtras(app.state)
              .map((e) => esc(e.title))
              .join(', ')}:
            requested, price pending. These extras are not included in the total. VisionHaus will
            discuss the job with you before confirming their cost.
          </p>`
        : ''
    }`;
}

export function review() {
  return /* HTML */ `${heading('Everything in one place', 'Check your plan before requesting a quote.')}
    <section class="review-sheet">
      <div class="review-title">
        ${icon(serviceIcon(app.state.project))}
        <h2>${app.state.project}</h2>
        <span class="included-tag">${app.state.mode === 'package' ? 'Package' : 'Custom'}</span>
      </div>
      ${summaryRows()}${
        app.state.mode === 'package'
          ? /* HTML */ `<h3 class="package-review-label">Package includes</h3>
              <ul class="review-list">
                ${packageInclusions(app.state)
                  .map((f) => /* HTML */ `<li>${icon('check')}${f}</li>`)
                  .join('')}
              </ul>`
          : ''
      }
      <div class="review-subtitle">
        <h3>Requested setup</h3>
        <button
          class="text-button"
          data-section="${app.state.mode === 'package' || isRetainer(app.state) || isEditing(app.state) ? 'shoot' : 'equipment'}"
        >
          Edit
        </button>
      </div>
      <ul class="review-list">
        ${equipment(app.state)
          .map((e) => /* HTML */ `<li>${icon('check')}${e}</li>`)
          .join('')}
      </ul>
      <div class="review-subtitle">
        <h3>Extras</h3>
        <button class="text-button" data-section="delivery">Edit</button>
      </div>
      <ul class="review-list">
        ${
          availableExtras(app.state)
            .filter((e) => app.state.extras.includes(e.id))
            .map(
              (e) =>
                /* HTML */ `<li>
                  ${icon('check')}${e.title}${e.price === null ? ' — requested, price to be agreed separately (not included in total)' : ''}
                </li>`,
            )
            .join('') || '<li class="muted">No extras selected</li>'
        }
      </ul>
      ${app.state.notes ? /* HTML */ `<p class="client-note">${esc(app.state.notes)}</p>` : ''}${estimate()}
      <details class="price-details">
        <summary>Priced items ${icon('chevron-down')}</summary>
        ${priceLines(app.state)
          .map(
            (l) =>
              /* HTML */ `<div>
                <span>${l.label}</span
                ><b>${money(l.amount)}<small>${l.taxInclusive ? 'Tax incl.' : 'Ex VAT'}</small></b>
              </div>`,
          )
          .join('')}
      </details>
    </section>
    ${reviewFlags()}
    <form id="contact">
      <h2 class="question">Where can we reach you?</h2>
      <label class="text-field"
        >Full name<input
          id="name"
          autocomplete="name"
          value="${esc(app.state.name)}"
          placeholder="Your name"
          maxlength="100"
          required /></label
      ><label class="text-field"
        >Company <span class="muted">(optional)</span
        ><input
          id="company"
          autocomplete="organization"
          value="${esc(app.state.company)}"
          maxlength="100"
          placeholder="Leave blank for a personal request" /></label
      ><label class="text-field"
        >Billing address <span class="muted">(optional)</span
        ><input
          id="billingAddress"
          autocomplete="street-address"
          value="${esc(app.state.billingAddress)}"
          maxlength="150"
          placeholder="Company or personal billing address" /></label
      ><label class="text-field"
        >Email<input
          id="email"
          autocomplete="email"
          type="email"
          value="${esc(app.state.email)}"
          placeholder="you@example.com"
          maxlength="100"
          required /></label
      ><label class="text-field"
        >Phone <span class="muted">(optional)</span
        ><input
          id="phone"
          autocomplete="tel"
          type="tel"
          value="${esc(app.state.phone)}"
          placeholder="+264"
          maxlength="40"
      /></label>
    </form>
    <p class="email-note">
      ${icon('send')}Submit your request to VisionHaus. We’ll review it and reply with a quotation.
    </p>
    ${submissionFeedback()}`;
}

export function reviewFlags() {
  const items = reviewItems(app.state);
  return items.length
    ? /* HTML */ `<details class="review-flags">
        <summary>
          ${icon('circle-dashed')}To confirm in your quote
          <span>${items.length}</span>${icon('chevron-down')}
        </summary>
        <ul>
          ${items.map((i) => /* HTML */ `<li>${esc(i)}</li>`).join('')}
        </ul>
      </details>`
    : '';
}

export function summaryContent() {
  return /* HTML */ `<span class="eyebrow">YOUR PRODUCTION</span>
    <h2>${app.state.project}</h2>
    <p class="summary-narrative">${narrative(app.state)}</p>
    ${estimate()}${reviewFlags()}`;
}

export function sections() {
  return app.state.mode === 'package' || isEditing(app.state) || isRetainer(app.state)
    ? [
        ['shoot', 'Details'],
        ['delivery', 'Extras'],
        ['review', 'Review'],
      ]
    : [
        ['shoot', 'Scope'],
        ['equipment', 'Setup'],
        ['delivery', 'Extras'],
        ['review', 'Review'],
      ];
}

export function nextLabel() {
  return app.state.section === 'review' ? 'Submit request' : 'Continue';
}

export function plan() {
  if (!app.state.project || app.state.section === 'project') return projectChooser();
  if (app.state.complete) return completion();
  return /* HTML */ `<div class="plan-layout">
    <div class="plan-main">
      <div class="plan-topline">
        <button class="icon-button" id="plan-back" aria-label="Previous step">
          ${icon('arrow-left')}</button
        ><span>${app.state.mode === 'package' ? 'Your package' : 'Your custom plan'}</span
        ><button class="text-button" id="change-service">Change</button>
      </div>
      <nav class="plan-sections" aria-label="Plan steps">
        ${sections()
          .map(
            ([id, t], i) =>
              /* HTML */ `<button
                data-section="${id}"
                ${app.state.section === id ? 'aria-current="step"' : ''}
              >
                <span>${i + 1}</span>${t}
              </button>`,
          )
          .join('')}
      </nav>
      <section id="task">
        ${{ shoot, equipment: equipmentScreen, delivery, review }[app.state.section]()}${app.state.section !== 'review' ? submissionFeedback() : ''}
      </section>
    </div>
    <aside class="desktop-summary">
      ${summaryContent()}${button(nextLabel(), 'data-next')}${app.state.section === 'review' ? '<small class="dock-caption">Sent directly to VisionHaus</small>' : ''}
    </aside>
  </div>`;
}

export function completion() {
  return /* HTML */ `<section class="completion">
    <span class="completion-icon">${icon('check')}</span
    >${heading('Request submitted', 'VisionHaus will review your brief and reply with a quotation.')}
    <p class="request-reference">${esc(app.productionReference)}</p>
    ${whatsapp(app.state.project || 'my production plan', app.productionReference)}
    <div class="review-sheet">${estimate()}</div>
    <button class="secondary" id="download">${icon('download')}Download your brief</button
    ><button class="text-button" id="edit-plan">Start a new request</button>
    <p class="field-hint">Quote request only. Booking requires approval and a 50% deposit.</p>
  </section>`;
}

export function choose(key, value) {
  const before = total(app.state);
  app.state = change(app.state, key, value);
  app.render();
  if (total(app.state) !== before) {
    $('#price-announcement').textContent =
      `Starting estimate ${money(total(app.state))}. Additional items quoted after review.`;
    document.querySelectorAll('.estimate>strong,#summary-toggle>strong').forEach((e) =>
      motion(
        e,
        [
          { opacity: 0.55, transform: 'translateY(3px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        160,
      ),
    );
  }
}

export function custom(service = '', project = '') {
  const contact = {
    name: app.state.name,
    company: app.state.company,
    billingAddress: app.state.billingAddress,
    email: app.state.email,
    phone: app.state.phone,
  };
  app.state = change(
    { ...initial(), ...contact, requestToken: newRequestToken() },
    'service',
    service,
  );
  if (project) app.state = change(app.state, 'project', project);
  app.navigate('plan');
}

export async function next() {
  if (app.submitting) return;
  const errors = productionErrors(app.state);
  if (errors.length) {
    app.submissionError = errors.join(' ');
    app.render();
    $('.submission-error')?.scrollIntoView({ block: 'center' });
    return;
  }
  if (app.state.section === 'review') {
    if (!$('#contact').reportValidity()) return;
    const success = await app.submitRequest('production', app.state);
    if (success) {
      app.state.complete = true;
      clearBrief();
    }
    app.render();
    if (success) {
      scrollTo({ top: 0 });
      app.focusTitle();
    } else $('.submission-error')?.scrollIntoView({ block: 'center' });
    return;
  }
  const steps = sections().map(([id]) => id);
  app.state.section = steps[steps.indexOf(app.state.section) + 1] || 'review';
  app.summaryOpen = false;
  app.submissionError = '';
  app.render();
  scrollTo({ top: 0 });
  app.focusTitle();
}

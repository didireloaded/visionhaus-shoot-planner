import { whatsapp } from './contact.mjs';
import { app } from './state.mjs';
import { packageOvertime, packages, startPackage, taxLabel } from '../domain.mjs';
import { icon, money } from './shared.mjs';

export function detail() {
  const p = packages.find((p) => p.id === app.detailId),
    v = p.variants.find((v) => v.id === app.variantId) || p.variants[0];
  return /* HTML */ `<section class="detail-page icon-detail">
    <div class="detail-topline">
      <button class="icon-button" data-view="home" aria-label="Back to packages">
        ${icon('arrow-left')}</button
      ><span>VisionHaus package</span
      ><button
        class="icon-button"
        data-save="${p.id}"
        aria-label="${app.saved.includes(p.id) ? 'Unsave' : 'Save'} ${p.title}"
        aria-pressed="${app.saved.includes(p.id)}"
      >
        ${icon('heart')}
      </button>
    </div>
    <div class="detail-content">
      <span class="detail-service-icon">${icon(p.icon)}</span>
      <div class="detail-heading">
        <div>
          <h1>${p.title}</h1>
          <p>${p.label}</p>
        </div>
      </div>
      <div class="variant-pills" aria-label="Package options">
        ${p.variants.map((o) => /* HTML */ `<button data-variant="${o.id}" class="${v.id === o.id ? 'selected' : ''}" aria-pressed="${v.id === o.id}">${o.label}</button>`).join('')}
      </div>
      <div class="package-detail-price">
        ${money(v.price)}<small
          >${p.id === 'podcast' ? 'per episode' : p.id === 'editing' ? 'editing allowance' : 'starting price'}
          · ${taxLabel(startPackage(p.id, v.id))}</small
        >
      </div>
      <ul class="included-list">
        ${v.features.map((f) => /* HTML */ `<li>${icon('check')}${f}</li>`).join('')}
      </ul>
      ${p.id === 'podcast' ? '<p class="field-hint">Standard episode: up to 30 minutes. Longer episodes are quoted separately.</p>' : ''}${packageOvertime(startPackage(p.id, v.id)) ? /* HTML */ `<p class="field-hint">${packageOvertime(startPackage(p.id, v.id))}</p>` : ''}
      ${whatsapp(p.title + ': ' + v.label)}
      <div class="detail-assurance">
        ${icon('calendar-check-2')}Choose your date next. We’ll confirm availability.
      </div>
      <button class="text-button" data-custom-service="${p.service}" data-project="${p.project}">
        Need a different setup? Build a custom plan ${icon('arrow-right')}
      </button>
    </div>
  </section>`;
}

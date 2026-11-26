import { app } from './state.mjs';

export const $ = (s) => document.querySelector(s);

export const esc = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export { icon } from '../icons.mjs';

export const money = (n) => `N$ ${n.toLocaleString('en-NA')}`;

export function motion(element, frames, duration = 200) {
  if (!element || app.reducedMotion.matches || typeof element.animate !== 'function') return;
  element.getAnimations().forEach((a) => a.cancel());
  element.animate(frames, { duration, easing: 'cubic-bezier(.2,0,0,1)' });
}

export function heading(title, sub = '') {
  return /* HTML */ `<div class="page-heading">
    <h1>${title}</h1>
    ${sub ? /* HTML */ `<p>${sub}</p>` : ''}
  </div>`;
}

export function button(label, attr = '', cls = 'primary') {
  return /* HTML */ `<button class="${cls}" ${attr}>${label}</button>`;
}

export function submissionFeedback() {
  return app.submissionError
    ? /* HTML */ `<p class="submission-error" role="alert">${esc(app.submissionError)}</p>`
    : '';
}

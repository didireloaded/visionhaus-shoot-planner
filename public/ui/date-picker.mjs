import { validDate, windhoekToday } from '../dates.mjs';
import { esc } from './shared.mjs';

export function displayDate(value, today = windhoekToday()) {
  if (!validDate(value)) return '';
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Windhoek',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).formatToParts(new Date(value + 'T12:00:00Z'));
  const part = (name) => parts.find((p) => p.type === name).value;
  return `${part('weekday')} ${part('day')} ${part('month')}${value.slice(0, 4) !== today.slice(0, 4) ? ' ' + value.slice(0, 4) : ''}`;
}

export function calendarDays(month) {
  if (!validDate(month + '-01')) throw new Error('Invalid calendar month');
  const start = new Date(month + '-01T12:00:00Z');
  const offset = (start.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  return [
    ...Array(offset).fill(''),
    ...Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`),
  ];
}

export function dateField(value) {
  return `<div class="text-field"><span>Another date</span><input id="date" type="hidden" value="${esc(value)}"><button class="date-picker-button" type="button" data-date-picker aria-haspopup="dialog">${displayDate(value) || 'Choose a date from the calendar'}</button></div>`;
}

export function openDatePicker(input, trigger) {
  if (document.querySelector('dialog[open]')) return;
  const minimum = windhoekToday();
  let month = (validDate(input.value) && input.value >= minimum ? input.value : minimum).slice(
    0,
    7,
  );
  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog calendar-dialog';
  dialog.setAttribute('aria-label', 'Choose a preferred date');
  const fullDate = (value) =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Windhoek',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value + 'T12:00:00Z'));
  function paint(focusMonthControl) {
    const label = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Windhoek',
      month: 'long',
      year: 'numeric',
    }).format(new Date(month + '-01T12:00:00Z'));
    const days = calendarDays(month);
    while (days.length % 7) days.push('');
    dialog.innerHTML = `<div class="calendar-header"><button class="text-button" type="button" data-month="-1" aria-label="Previous month" ${month <= minimum.slice(0, 7) ? 'disabled' : ''}>Previous</button><h2 aria-live="polite">${label}</h2><button class="text-button" type="button" data-month="1" aria-label="Next month">Next</button></div><table class="month-calendar"><caption class="sr-only">${label}</caption><thead><tr>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => `<th scope="col">${d}</th>`).join('')}</tr></thead><tbody>${Array.from(
      { length: days.length / 7 },
      (_, week) =>
        `<tr>${days
          .slice(week * 7, week * 7 + 7)
          .map(
            (value) =>
              `<td>${value ? `<button type="button" data-date="${value}" aria-label="${fullDate(value)}" aria-pressed="${value === input.value}" ${value < minimum ? 'disabled' : ''}>${Number(value.slice(-2))}</button>` : ''}</td>`,
          )
          .join('')}</tr>`,
    ).join(
      '',
    )}</tbody></table><p class="field-hint">Choose a day. Availability is confirmed with your quotation.</p><div class="dialog-actions"><button class="secondary" type="button" data-calendar-cancel>Cancel</button><button class="text-button" type="button" data-calendar-flexible>Keep date flexible</button></div>`;
    dialog.querySelectorAll('[data-month]').forEach(
      (button) =>
        (button.onclick = () => {
          const date = new Date(month + '-01T12:00:00Z');
          date.setUTCMonth(date.getUTCMonth() + Number(button.dataset.month));
          month = date.toISOString().slice(0, 7);
          paint(button.dataset.month);
        }),
    );
    dialog
      .querySelectorAll('[data-date]')
      .forEach((button) => (button.onclick = () => dialog.close(button.dataset.date)));
    dialog.querySelector('[data-calendar-cancel]').onclick = () => dialog.close('cancel');
    dialog.querySelector('[data-calendar-flexible]').onclick = () => dialog.close('flexible');
    if (focusMonthControl) {
      const control =
        dialog.querySelector(`[data-month="${focusMonthControl}"]:not(:disabled)`) ||
        dialog.querySelector('[data-month]:not(:disabled)');
      control?.focus();
    }
  }
  dialog.addEventListener(
    'close',
    () => {
      const value = dialog.returnValue;
      dialog.remove();
      if (value === 'flexible' || (validDate(value) && value >= minimum)) {
        input.value = value === 'flexible' ? '' : value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      (trigger.isConnected ? trigger : document.querySelector('[data-date-picker]'))?.focus({
        preventScroll: true,
      });
    },
    { once: true },
  );
  paint();
  document.body.append(dialog);
  dialog.showModal();
  (
    dialog.querySelector(
      `[data-date="${validDate(input.value) ? input.value : minimum}"]:not(:disabled)`,
    ) || dialog.querySelector('[data-date]:not(:disabled)')
  )?.focus();
}

export function bindDatePicker() {
  const trigger = document.querySelector('[data-date-picker]');
  if (trigger) trigger.onclick = () => openDatePicker(document.querySelector('#date'), trigger);
}

import { esc } from './shared.mjs';

export function confirmAction({ title, message, action, cancel = 'Keep editing' }) {
  if (document.querySelector('dialog[open]')) return Promise.resolve(false);
  const trigger = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog';
  dialog.setAttribute('aria-labelledby', 'confirm-title');
  dialog.setAttribute('aria-describedby', 'confirm-message');
  dialog.innerHTML = /* HTML */ `<button
      type="button"
      class="sheet-handle"
      aria-label="Close dialog"
    ></button>
    <h2 id="confirm-title">${esc(title)}</h2>
    <p id="confirm-message">${esc(message)}</p>
    <form method="dialog" class="dialog-actions">
      <button class="secondary" value="cancel" autofocus>${esc(cancel)}</button
      ><button class="primary" value="confirm">${esc(action)}</button>
    </form>`;
  return new Promise((resolve) => {
    dialog.addEventListener(
      'close',
      () => {
        const confirmed = dialog.returnValue === 'confirm';
        dialog.remove();
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        resolve(confirmed);
      },
      { once: true },
    );
    document.body.append(dialog);
    dialog.showModal();
    bindSheet(dialog);
  });
}

export function bindSheet(dialog) {
  const handle = dialog.querySelector('.sheet-handle');
  let start;
  handle.onclick = () => dialog.close('cancel');
  handle.onpointerdown = (event) => {
    start = event.clientY;
    handle.setPointerCapture(event.pointerId);
  };
  handle.onpointermove = (event) => {
    if (start !== undefined)
      dialog.style.transform = `translateY(${Math.max(0, event.clientY - start)}px)`;
  };
  handle.onpointerup = (event) => {
    if (start !== undefined && event.clientY - start > 70) dialog.close('cancel');
    start = undefined;
    dialog.style.transform = '';
  };
  handle.onpointercancel = () => {
    start = undefined;
    dialog.style.transform = '';
  };
}
export function showSummary(markup) {
  if (document.querySelector('dialog[open]')) return;
  const trigger = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog summary-sheet';
  dialog.setAttribute('aria-label', 'Production summary');
  dialog.innerHTML =
    '<button type="button" class="sheet-handle" aria-label="Close summary"></button><div class="mobile-summary">' +
    markup +
    '</div><form method="dialog"><button class="secondary" autofocus>Close summary</button></form>';
  dialog.addEventListener(
    'close',
    () => {
      dialog.remove();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    },
    { once: true },
  );
  document.body.append(dialog);
  dialog.showModal();
  bindSheet(dialog);
}

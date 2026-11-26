import { esc } from './shared.mjs';

export function confirmAction({ title, message, action, cancel = 'Keep editing' }) {
  if (document.querySelector('dialog[open]')) return Promise.resolve(false);
  const trigger = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'app-dialog';
  dialog.setAttribute('aria-labelledby', 'confirm-title');
  dialog.setAttribute('aria-describedby', 'confirm-message');
  dialog.innerHTML = `<h2 id="confirm-title">${esc(title)}</h2><p id="confirm-message">${esc(message)}</p><form method="dialog" class="dialog-actions"><button class="secondary" value="cancel" autofocus>${esc(cancel)}</button><button class="primary" value="confirm">${esc(action)}</button></form>`;
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
  });
}

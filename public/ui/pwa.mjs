import { app } from './state.mjs';
export function haptic() {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(10);
}
export function initPwa() {
  if ('serviceWorker' in navigator)
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        const offerUpdate = () => {
          if (!reg.waiting || document.querySelector('#pwa-update')) return;
          const banner = document.createElement('aside');
          banner.id = 'pwa-update';
          banner.className = 'pwa-banner';
          banner.innerHTML =
            '<span>A new version is ready</span><button class="secondary">Refresh</button>';
          banner.querySelector('button').onclick = () => {
            navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
              once: true,
            });
            reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
          };
          document.body.append(banner);
        };
        offerUpdate();
        reg.addEventListener('updatefound', () =>
          reg.installing?.addEventListener('statechange', offerUpdate),
        );
      })
      .catch(() => {});
  let prompt;
  const viewed = new Set();
  addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    prompt = event;
  });
  document.addEventListener('click', (event) => {
    const card = event.target.closest('[data-package]');
    if (!card) return;
    viewed.add(card.dataset.package);
    let dismissed = false;
    try {
      dismissed = localStorage.getItem('vh-install-dismissed') === 'yes';
    } catch {}
    if (
      viewed.size < 2 ||
      dismissed ||
      matchMedia('(display-mode: standalone)').matches ||
      document.querySelector('#pwa-install')
    )
      return;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!prompt && !ios) return;
    const banner = document.createElement('aside');
    banner.id = 'pwa-install';
    banner.className = 'pwa-banner';
    banner.innerHTML =
      '<span>Keep your shoot planner on your home screen</span><button class="secondary">Add to home screen</button><button class="text-button" aria-label="Dismiss install suggestion">Dismiss</button>';
    banner.querySelector('.secondary').onclick = async () => {
      if (prompt) {
        await prompt.prompt();
        prompt = null;
      } else
        banner.querySelector('span').textContent = 'In Safari, tap Share, then Add to Home Screen.';
    };
    banner.querySelector('.text-button').onclick = () => {
      try {
        localStorage.setItem('vh-install-dismissed', 'yes');
      } catch {}
      banner.remove();
    };
    document.body.append(banner);
  });
  const viewport = window.visualViewport;
  const updateKeyboard = () => {
    const editing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    document.body.classList.toggle(
      'keyboard-open',
      editing && viewport && innerHeight - viewport.height > 120,
    );
  };
  viewport?.addEventListener('resize', updateKeyboard);
  document.addEventListener('focusin', updateKeyboard);
  document.addEventListener('focusout', updateKeyboard);
}

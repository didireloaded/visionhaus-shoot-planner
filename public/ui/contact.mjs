import { esc } from './shared.mjs';
export function whatsapp(summary, reference = '') {
  const text = `Hi VisionHaus, I'd like to discuss ${summary}.${reference ? ' Request reference: ' + reference + '.' : ''}`;
  return `<a class="secondary whatsapp-link" href="https://wa.me/264857468335?text=${encodeURIComponent(text)}" target="_blank" rel="noopener noreferrer">${esc('Message us on WhatsApp')}</a>`;
}

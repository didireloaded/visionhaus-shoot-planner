import { app } from './state.mjs';

export const DRAFT = 'vh-configurator-v3';

export function persist() {
  for (const [key, value, draft] of [
    ['vh-rental-draft', app.rental, true],
    [DRAFT, app.state, true],
    ['vh-package-favourites', app.saved, false],
  ])
    try {
      const serialized = JSON.stringify(value);
      if (app.persistedValues.get(key) === serialized) continue;
      localStorage.setItem(
        key,
        draft ? JSON.stringify({ savedAt: Date.now(), state: value }) : serialized,
      );
      app.persistedValues.set(key, serialized);
    } catch {}
}

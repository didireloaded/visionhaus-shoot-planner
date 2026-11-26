import { app } from './state.mjs';

export const DRAFT = 'vh-configurator-v3';

export function persist() {
  for (const [key, value, draft] of [
    ['vh-rental-draft', app.rental, true],
    [DRAFT, app.state, true],
    ['vh-package-favourites', app.saved, false],
  ])
    try {
      const record = draft
        ? {
            state: value,
            submitted: key === DRAFT ? app.state.complete : app.rentalPrepared,
            reference: key === DRAFT ? app.productionReference : app.rentalReference,
          }
        : value;
      const serialized = JSON.stringify(record);
      if (app.persistedValues.get(key) === serialized) continue;
      localStorage.setItem(
        key,
        draft ? JSON.stringify({ savedAt: Date.now(), ...record }) : serialized,
      );
      app.persistedValues.set(key, serialized);
    } catch {}
}

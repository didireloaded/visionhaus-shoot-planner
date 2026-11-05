// One identity per enquiry: retries retain it; an explicitly new request renews it.
export const restoreRequestToken=value=>typeof value==='string'&&/^[a-f0-9]{32}$/.test(value)?value:'';
export function newRequestToken(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),byte=>byte.toString(16).padStart(2,'0')).join('')}

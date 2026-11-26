import { app } from './state.mjs';
import { heading, icon } from './shared.mjs';

export function studio() {
  return /* HTML */ `<section class="studio-page">
    ${heading('VisionHaus Media', 'Visual production for brands, people and culture, based in Windhoek.')}
    <dl class="studio-credits">
      <div>
        <dt>Recognition</dt>
        <dd>Ataman: Best Cinematography 2024</dd>
        <dd>Remona x NOLA: two awards, MTC Excellence Awards 2025</dd>
      </div>
      <div>
        <dt>Brands and clients</dt>
        <dd>
          Sanlam, NamPower, Lady Pohamba, Savanna, NOLA, Letshego, Oshikandela, Ogilvy, African CDC
        </dd>
      </div>
      <div>
        <dt>Film and television</dt>
        <dd>
          Ataman, TSEK, Crossover Hearts, The Long Road, Emanya, Speel Aan, Uno &amp; Hatago, B2
          Passage
        </dd>
      </div>
    </dl>
    <div class="studio-info">
      <span>${icon('map-pin')}Windhoek, Namibia</span
      ><a href="mailto:didi@visionhausmedia.com.na">${icon('mail')}didi@visionhausmedia.com.na</a
      ><a href="https://visionhausmedia.com.na/" target="_blank" rel="noopener noreferrer"
        >${icon('globe')}visionhausmedia.com.na</a
      ><span>${icon('shield-check')}No account needed</span>
    </div>
    <p class="field-hint">
      Your draft stays on this device for 7 days. Requests go directly to VisionHaus. Dates are
      confirmed after quote review.
    </p>
    <button class="secondary" id="reset">${icon('rotate-ccw')}Clear draft</button>
  </section>`;
}

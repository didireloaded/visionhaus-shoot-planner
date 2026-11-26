import { confirmAction } from './dialog.mjs';
import { app } from './state.mjs';
import { $, button, esc, heading, icon, money } from './shared.mjs';
import { plan, services } from './plan.mjs';
import { projects, restore } from '../domain.mjs';
import { readBriefPdf } from '../brief.mjs';
import { newRequestToken } from '../request-id.mjs';

export function clearBrief() {
  app.briefTextInput = '';
  app.briefOriginal = '';
  app.briefAnalyzedText = '';
  app.briefFile = '';
  app.briefAnalysis = null;
  app.briefError = '';
  app.briefChoice = '';
  app.briefProject = 'Video';
  persistBrief();
}

export function persistBrief() {
  try {
    localStorage.setItem(
      'vh-brief',
      JSON.stringify({
        text: app.briefTextInput,
        original: app.briefOriginal,
        analyzedText: app.briefAnalyzedText,
        file: app.briefFile,
        service: app.briefProject,
        project: app.briefChoice,
        savedAt: Date.now(),
      }),
    );
  } catch {}
}

export function briefEntry() {
  return /* HTML */ `<button class="brief-entry" data-brief-open>
    ${icon('file-text')}<span
      ><strong>Have a project brief?</strong><small>Bring it into your plan</small></span
    >${icon('arrow-up-right')}
  </button>`;
}

export async function requestBriefAnalysis(text) {
  const response = await fetch('/api/brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, service: app.briefProject, project: app.briefChoice }),
    signal: AbortSignal.timeout(60000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.plan || !result?.summary)
    throw new Error(
      result?.error || 'We could not read this brief. Your text is saved; please try again.',
    );
  return result;
}

export function briefOutline() {
  if (!app.briefAnalysis) return '';
  const a = app.briefAnalysis;
  return /* HTML */ `<section class="review-sheet brief-outline">
    <h2>Your project outline</h2>
    <ul class="review-list">
      ${a.requirements.map((r) => /* HTML */ `<li>${icon('check')}${esc(r)}</li>`).join('')}
    </ul>
    <div class="estimate">
      <span
        >${a.quoteRequired ? 'Service requires a quotation' : a.unpriced.length ? 'Priced elements so far' : 'Starting estimate'}<small
          >Including 15% VAT · subject to review</small
        ></span
      ><strong>${a.quoteRequired ? 'Quote required' : money(a.totals.gross)}</strong>
    </div>
    ${
      a.unpriced.length
        ? /* HTML */ `<p class="field-hint">Not included in this estimate; priced separately:</p>
            <ul class="review-list">
              ${a.unpriced.map((r) => /* HTML */ `<li>${esc(r)}</li>`).join('')}
            </ul>`
        : ''
    }${
      a.questions.length
        ? /* HTML */ `<details class="price-details">
            <summary>Details to confirm ${icon('chevron-down')}</summary>
            <ul class="review-list">
              ${a.questions.map((r) => /* HTML */ `<li>${esc(r)}</li>`).join('')}
            </ul>
          </details>`
        : ''
    }
  </section>`;
}

export function briefScreen() {
  return /* HTML */ `<section class="brief-screen">
    <button class="text-button" data-view="home">${icon('arrow-left')}Back</button
    >${heading('Tell us about your project', 'Describe your idea or upload a PDF for a concise project outline.')}
    <form id="brief-form">
      <label class="text-field"
        >${app.briefAnalysis ? 'Project summary' : 'Project brief'}<textarea
          id="project-brief"
          rows="5"
          maxlength="50000"
          placeholder="What are you making? Include people, location, dates and what you need delivered."
          ${app.briefOriginal ? '' : 'required'}
          ${app.briefLoading ? 'disabled' : ''}
        >
${esc(app.briefTextInput)}</textarea></label
      ><label class="text-field"
        >Upload a PDF brief<input
          id="brief-pdf"
          type="file"
          accept="application/pdf,.pdf"
          ${app.briefLoading ? 'disabled' : ''}
      /></label>
      <p class="field-hint" role="status">
        ${app.briefLoading ? 'Reviewing your brief…' : app.briefFile ? esc(app.briefFile) + (app.briefAnalysis ? ' · readable PDF text reviewed; summary shown above' : ' · PDF text saved; continue to review') : app.briefOriginal ? 'Saved brief text retained · continue to review or start a new brief.' : 'PDF text only · up to 8 MB, 30 pages and 50,000 characters.'}
      </p>
      ${app.briefOriginal || app.briefFile ? /* HTML */ `<button class="text-button" type="button" id="brief-new" ${app.briefLoading ? 'disabled' : ''}>Start a new brief</button>` : ''}<label
        class="text-field"
        >Service<select id="brief-service" ${app.briefLoading ? 'disabled' : ''}>
          ${services.map(([v, , t]) => /* HTML */ `<option value="${v}" ${app.briefProject === v ? 'selected' : ''}>${t}</option>`).join('')}
        </select></label
      ><label class="text-field"
        >Project type<select id="brief-project" ${app.briefLoading ? 'disabled' : ''}>
          <option value="">Suggest from my brief</option>
          ${projects[app.briefProject].map((p) => /* HTML */ `<option ${app.briefChoice === p ? 'selected' : ''}>${esc(p)}</option>`).join('')}
        </select></label
      >${app.briefError ? /* HTML */ `<p class="submission-error" role="alert">${esc(app.briefError)}</p>` : ''}${briefOutline()}
      <p class="field-hint">
        Continuing or uploading a PDF securely processes the brief to prepare your outline. Your
        original brief text is retained with your request. Review the suggested plan before
        submitting; final scope, availability and pricing are confirmed by VisionHaus.
      </p>
      ${button(app.briefLoading ? 'Reviewing brief…' : 'Continue to My Plan', `type="submit" ${app.briefLoading ? 'disabled' : ''}`)}
    </form>
  </section>`;
}

export function bindBrief() {
  if ($('#brief-new'))
    $('#brief-new').onclick = async () => {
      if (
        !app.briefLoading &&
        (await confirmAction({
          title: 'Start a new brief?',
          message:
            'This removes the saved brief text, summary and PDF filename from this device. Your current plan, contact details and submitted requests are kept.',
          action: 'Start a new brief',
          cancel: 'Keep this brief',
        }))
      ) {
        clearBrief();
        app.render();
        $('#project-brief')?.focus();
      }
    };
  document
    .querySelectorAll('[data-brief-open]')
    .forEach((b) => (b.onclick = () => app.navigate('brief')));
  if ($('#project-brief'))
    $('#project-brief').oninput = (e) => {
      app.briefTextInput = e.target.value;
      app.briefAnalysis = null;
      $('.brief-outline')?.remove();
      persistBrief();
    };
  if ($('#brief-service'))
    $('#brief-service').onchange = (e) => {
      app.briefProject = e.target.value;
      app.briefChoice = '';
      app.briefAnalysis = null;
      app.briefError = '';
      persistBrief();
      app.render();
    };
  if ($('#brief-project'))
    $('#brief-project').onchange = (e) => {
      app.briefChoice = e.target.value;
      app.briefAnalysis = null;
      persistBrief();
      app.render();
      $('#brief-project')?.focus({ preventScroll: true });
    };
  if ($('#brief-pdf'))
    $('#brief-pdf').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      app.briefLoading = true;
      app.briefError = '';
      app.briefAnalysis = null;
      app.render();
      try {
        const text = await readBriefPdf(file);
        app.briefOriginal = text;
        app.briefFile = file.name;
        app.briefAnalysis = null;
        app.briefTextInput = '';
        app.briefAnalyzedText = '';
        persistBrief();
        const result = await requestBriefAnalysis(text);
        app.briefAnalysis = result;
        app.briefTextInput = result.summary;
        app.briefAnalyzedText = result.summary;
        persistBrief();
      } catch (error) {
        app.briefError = error.message || 'We could not review this PDF. Please try again.';
      } finally {
        app.briefLoading = false;
        if (app.view === 'brief') app.render();
      }
    };
  if ($('#brief-form'))
    $('#brief-form').onsubmit = async (e) => {
      e.preventDefault();
      if (app.briefLoading || !$('#brief-form').reportValidity()) return;
      if (app.briefTextInput.trim().length < 20 && !app.briefOriginal) {
        app.briefError = 'Add a little more detail about your project.';
        app.render();
        return;
      }
      app.briefLoading = true;
      app.briefError = '';
      persistBrief();
      app.render();
      try {
        const source = app.briefOriginal
          ? app.briefTextInput === app.briefAnalyzedText || !app.briefTextInput
            ? app.briefOriginal
            : app.briefOriginal + '\n\nClient summary or clarification:\n' + app.briefTextInput
          : app.briefTextInput;
        let result =
          app.briefAnalysis && app.briefTextInput === app.briefAnalyzedText
            ? app.briefAnalysis
            : await requestBriefAnalysis(source);
        const contact = {
          name: app.state.name,
          company: app.state.company,
          billingAddress: app.state.billingAddress,
          email: app.state.email,
          phone: app.state.phone,
        };
        app.briefAnalysis = result;
        app.briefOriginal = source;
        app.briefTextInput = result.summary;
        app.briefAnalyzedText = result.summary;
        persistBrief();
        if (app.view === 'brief') {
          app.state = restore({
            ...result.plan,
            ...contact,
            requestToken: app.state.complete ? newRequestToken() : app.state.requestToken,
          });
          app.navigate('plan');
        }
      } catch (error) {
        app.briefError = error.message || 'We could not prepare the plan. Your brief is saved.';
      } finally {
        app.briefLoading = false;
        if (app.view === 'brief') app.render();
      }
    };
}

/* Fluxos complementares: alertas, relatórios editáveis e planejamento registrado. */
const originalDirectionView = directionView;
directionView = function () { return state.page === 'alertas' ? alertsView() : originalDirectionView(); };

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.dataset.page !== 'alertas') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  state.page = 'alertas';
  app.innerHTML = `<div class="shell">${nav()}<main class="content">${alertsView()}</main></div>`;
}, true);

function groupEvaluationsView(groupId) {
  const currentGroup = group(groupId);
  const evaluations = groupEvals(groupId).slice().reverse();
  return `${header(`Avaliações anteriores · ${currentGroup.name}`)}${notice()}<section class="panel"><div class="section-title"><div><h2>${currentGroup.name} · ${data.className}</h2><p class="muted">Histórico de avaliações mensais deste grupo.</p></div><button class="secondary" data-action="evaluate" data-id="${currentGroup.id}">Nova avaliação</button></div>${evaluations.map(item => `<div class="row"><div><b>${item.month}</b><br><small>${item.date} · média geral ${mean(Object.values(item.scores).flat()).toFixed(1)}/4</small><p>${esc(item.note || 'Sem observação geral.')}</p></div><button class="action" data-action="view-eval" data-id="${item.id}">Ver avaliação</button></div>`).join('')}</section>`;
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.dataset.action !== 'group-evals') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  state.group = button.dataset.id;
  app.innerHTML = `<div class="shell">${nav()}<main class="content">${groupEvaluationsView(state.group)}</main></div>`;
}, true);

const removeEvaluationMenu = () => document.querySelectorAll('button[data-page="avaliacoes"]').forEach(button => button.remove());

const decorateGroups = () => {
  removeEvaluationMenu();
  document.querySelectorAll('[data-action="evaluate"]').forEach(button => {
  if (!button.closest('.group-row')) return;
  const parent = button.parentElement;
  if (!parent || parent.querySelector('[data-action="group-evals"]')) return;
  const history = document.createElement('button');
  history.className = 'action';
  history.dataset.action = 'group-evals';
  history.dataset.id = button.dataset.id;
  history.textContent = 'Avaliações anteriores';
  parent.append(history);
  });
};
new MutationObserver(decorateGroups).observe(app, { childList:true, subtree:true });
decorateGroups();

view = function () {
  if (state.stage === 'profile') return profileView();
  if (state.stage === 'login') return loginView();
  let content;
  if (state.role === 'Direção escolar') content = directionView();
  else if (state.page === 'inicio') content = home();
  else if (state.page === 'grupos') content = groupsView();
  else if (state.page === 'group-editor') content = groupsEditor(state.group);
  else if (state.page === 'alunos') content = studentsView();
  else if (state.page === 'student') content = studentView(state.student);
  else if (state.page === 'student-report') content = studentReport(state.student);
  else if (state.page === 'avaliacoes') content = evaluationsView();
  else if (state.page === 'evaluation') content = evalForm(state.group);
  else if (state.page === 'evaluation-detail') content = evaluationDetail(state.evaluation);
  else if (state.page === 'planejamentos') content = plansView();
  else if (state.page === 'alertas') content = alertsView();
  else content = home();
  return `<div class="shell">${nav()}<main class="content">${content}</main></div>`;
};

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action === 'open-alert') { state.group = button.dataset.id; state.page = 'planejamentos'; render(); }
  if (button.dataset.action === 'save-report') {
    const name = button.dataset.id;
    data.studentReports[name] = document.querySelector('#student-report').value;
    data.reportEdits[name] = '23/09/2026';
    button.textContent = 'Alterações salvas ✓';
  }
  if (button.dataset.action === 'print-report') {
    const report = document.querySelector('#student-report').value;
    const printWindow = window.open('', '_blank', 'width=820,height=900');
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><title>Relatório pedagógico</title><style>body{font-family:Arial,sans-serif;color:#243b53;line-height:1.6;margin:42px}h1{color:#24496c;font-size:24px;border-bottom:2px solid #54a77a;padding-bottom:12px}pre{white-space:pre-wrap;font:inherit}.note{color:#617481;font-size:12px;margin-top:28px}</style></head><body><h1>Trilhas Socioemocionais</h1><pre>${report.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre><p class="note">Documento pedagógico confidencial · Gerado em 23/09/2026</p><script>window.onload=()=>window.print()<\/script></body></html>`);
    printWindow.document.close();
  }
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'evaluation-form') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const form = new FormData(event.target), currentGroup = group(event.target.dataset.group), scores = {}, obs = {};
  activeStudents(currentGroup).forEach(name => {
    scores[name] = areas.map((_, index) => Number(form.get(`${name}|${index}`)));
    obs[name] = form.get(`note-${name}`) || '';
  });
  data.evaluations.push({
    id: Date.now(), month: 'Setembro de 2026', date: '23/09/2026', group: currentGroup.id,
    note: form.get('group-note') || '', scores, obs,
    plan: { activity: form.get('plan-activity'), reading: form.get('plan-reading'), competencies: form.get('plan-competencies'), objective: form.get('plan-objective'), result: form.get('plan-result') }
  });
  state.page = 'planejamentos';
  render();
}, true);


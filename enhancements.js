/* Fluxos complementares: alertas, relatórios editáveis e planejamento registrado. */
const originalDirectionView = directionView;
directionView = function () { return state.page === 'alertas' ? alertsView() : originalDirectionView(); };

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
  if (button.dataset.action === 'print-report') window.print();
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


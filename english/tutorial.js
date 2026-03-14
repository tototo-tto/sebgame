// ============================================================
// TUTORIAL
// ============================================================

function makeTutorialLabel(activePhase) {
  const phases = ['Explore', 'Event', 'Eat'];
  const phaseMap = {
    'Explore': 0, 'Explore Result': 0, 'Extra Explore': 0,
    'Event': 1, 'Event Result': 1,
    'Eat': 2, 'Complete': 2,
  };
  const activeIdx = phaseMap[activePhase] ?? -1;
  const flowHtml = phases.map((p, i) => {
    const cls = i === activeIdx ? ' class="active"' : '';
    const sep = i < phases.length - 1 ? '<span class="glid-sep">→</span>' : '';
    return `<span${cls}>${p}</span>${sep}`;
  }).join('');
  return `<div class="phase-label"><span class="day-marker">TUTORIAL</span><div class="glid-label">${flowHtml}</div></div>`;
}


function startTutorial() {
  state.selectedItems = [];
  state.tutorialStep = 'explore';
  state.phase = 'tutorial';
  state._tutorialExtraCount = 0;
  render();
}

function renderTutorialStep() {
  if      (state.tutorialStep === 'explore')        renderTutorialExplore();
  else if (state.tutorialStep === 'explore_result') renderTutorialExploreResult();
  else if (state.tutorialStep === 'event')          renderTutorialEvent();
  else if (state.tutorialStep === 'event_result')   renderTutorialEventResult();
  else if (state.tutorialStep === 'food')           renderTutorialFood();
  else if (state.tutorialStep === 'end')            renderTutorialEnd();
}

function renderTutorialExplore() {
  let locationButtons = '';
  for (const loc of LOCATIONS) {
    locationButtons += `<button class="choice-btn" onclick="doTutorialExplore('${loc.id}')">
      <strong>${loc.name}</strong><br>
      <small style="color:var(--dim)">${loc.desc}</small>
    </button>`;
  }
  const html = `
    ${makeTutorialLabel('Explore')}
    ${renderLines(TUTORIAL_LINES.explore.lines)}
    <hr class="divider">
    <div class="choices">${locationButtons}</div>
  `;
  setPanel(html);
}

function doTutorialExplore(locId) {
  const loc = LOCATIONS.find(l => l.id === locId);
  const range = loc.dropCount || { min: 2, max: 3 };
  const count = pickDropCount(range);
  const gotItems = [];
  for (let i = 0; i < count; i++) {
    const got = weightedDrop(getAvailableDrops(loc.drops));
    gotItems.push(got);
    state.inventory.push(got);
  }
  renderInventory();
  state._tutorialGotItems = gotItems;
  state._tutorialLoc = loc;
  state.tutorialStep = 'explore_result';
  render();
}

function renderTutorialExploreResult() {
  const loc = state._tutorialLoc;
  const itemListHtml = state._tutorialGotItems.map(id => {
    const item = getItem(id);
    return `<span style="color:var(--accent)">${item.emoji} ${item.name}</span>`;
  }).join(', ');
  const extraBtn = state._tutorialExtraCount < 3 ? buildTutorialExtraExploreBtn(loc.id) : '';
  const locLine = TUTORIAL_LINES.explore_result.byLoc?.[loc.id];
  const html = `
    ${makeTutorialLabel('Explore Result')}
    <div class="main-text">Searched <strong>${loc.name}</strong>.<br>Found ${itemListHtml}.</div>
    ${locLine ? renderLines(locLine) : ''}
    ${renderLines(TUTORIAL_LINES.explore_result.lines)}
    <hr class="divider">
    <div class="choices">
      ${extraBtn}
      <button class="choice-btn primary" onclick="startTutorialEvent()">Next →</button>
    </div>
  `;
  setPanel(html);
}

function buildTutorialExtraExploreBtn(locId) {
  const failRates = [30, 50, 80];
  const rate = failRates[state._tutorialExtraCount];
  const label = state._tutorialExtraCount === 0 ? 'Extra Explore' : 'Search Further';
  return `<button class="choice-btn" onclick="doTutorialExtraExplore('${locId}')">
    ◆ ${label} <small style="color:var(--dim)">(Fail Rate ${rate}%)</small>
  </button>`;
}

function doTutorialExtraExplore(locId) {
  const attempt = state._tutorialExtraCount;
  const successRates = [0.70, 0.50, 0.20];
  const success = Math.random() < successRates[attempt];
  state._tutorialExtraCount++;

  const loc = LOCATIONS.find(l => l.id === locId);
  const extraBtn = state._tutorialExtraCount < 3 ? buildTutorialExtraExploreBtn(locId) : '';
  const randalLine = TUTORIAL_LINES.extra_explore[success ? 'success' : 'fail'][attempt];

  if (success) {
    const got = weightedDrop(getAvailableDrops(loc.drops));
    state.inventory.push(got);
    renderInventory();
    const item = getItem(got);
    const html = `
      ${makeTutorialLabel('Extra Explore')}
      <div class="main-text">Searched deeper.<br>
        Found an additional <span style="color:var(--accent)">${item.emoji} ${item.name}</span>.
      </div>
      ${renderLines(randalLine)}
      <hr class="divider">
      <div class="choices">
        ${extraBtn}
        <button class="choice-btn primary" onclick="startTutorialEvent()">Next →</button>
      </div>
    `;
    setPanel(html);
  } else {
    const dmgHp = 15;
    const dmgMp = 10;
    updateStats({ hp: -dmgHp, mp: -dmgMp });
    if (state.hp <= 0 || state.mp <= 0) { gameOver(); return; }
    const html = `
      ${makeTutorialLabel('Extra Explore')}
      <div class="main-text" style="color:var(--danger)">
        Pushed too far.<br>
        HP -${dmgHp} / MP -${dmgMp}
      </div>
      ${renderLines(randalLine)}
      <hr class="divider">
      <div class="choices">
        ${extraBtn}
        <button class="choice-btn primary" onclick="startTutorialEvent()">Next →</button>
      </div>
    `;
    setPanel(html);
  }
}

function startTutorialEvent() {
  state.currentEvent = TUTORIAL_EVENT;
  state.selectedItems = [];
  state.tutorialStep = 'event';
  render();
}

function renderTutorialEvent() {
  const ev = TUTORIAL_EVENT;
  const prob = calcProb(ev, state.selectedItems);
  const probPct = Math.round(prob * 100);
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  const uniqueItems = sortItemIds(Object.keys(counts));
  let itemButtons = uniqueItems.map(id => {
    const item = getItem(id);
    const sel = state.selectedItems.filter(i => i === id).length;
    return `<button class="choice-btn ${sel > 0 ? 'primary' : ''}" onclick="toggleItem('${id}')">
      ${item.emoji} ${item.name} ×${counts[id]}${sel > 0 ? ` [In use: ${sel}]` : ''}
    </button>`;
  }).join('') || '<div style="color:var(--dim);font-size:0.8rem">No items</div>';
  const html = `
    ${makeTutorialLabel('Event')}
    <div class="main-text" style="white-space:pre-line">${ev.desc}</div>
    ${renderLines(TUTORIAL_LINES.event.lines)}
    ${renderLines(ev.sebaEvent)}
    <hr class="divider">
    <div class="use-area">
      <div class="use-hint">Select items to use (multiple allowed)</div>
      <div class="choices" id="item-choices">${itemButtons}</div>
      <div class="prob-display" id="prob-display">Avoidance Rate ${probPct}%</div>
      <div class="prob-bar-wrap"><div class="prob-bar" id="prob-bar" style="width:${probPct}%"></div></div>
      <div class="choices">
        <button class="choice-btn primary" onclick="resolveTutorialEvent()">Deal with it →</button>
      </div>
    </div>
  `;
  setPanel(html);
}

function resolveTutorialEvent() {
  const ev = TUTORIAL_EVENT;
  const prob = calcProb(ev, state.selectedItems);
  const success = Math.random() < prob;
  for (const id of state.selectedItems) {
    const idx = state.inventory.indexOf(id);
    if (idx >= 0) state.inventory.splice(idx, 1);
  }
  const delta = success ? { hp: 0, mp: 0 } : ev.penaltyFail;
  updateStats(delta);
  state.selectedItems = [];
  renderInventory();
  state._tutorialSuccess = success;
  state.tutorialStep = 'event_result';
  render();
}

function renderTutorialEventResult() {
  const success = state._tutorialSuccess;
  const ev = TUTORIAL_EVENT;
  const resultClass = success ? 'result-good' : 'result-bad';
  const resultText  = success ? 'Avoided' : 'Failed to Avoid';
  const html = `
    ${makeTutorialLabel('Event Result')}
    <div class="main-text">
      <span class="${resultClass}" style="font-size:1.1rem;font-family:'Special Elite',cursive">${resultText}</span><br>
      ${success ? ev.textSuccess : ev.textFail}
    </div>
    ${renderLines(success ? ev.sebaSuccess : ev.sebaFail)}
    ${renderLines(success ? TUTORIAL_LINES.event_result.success : TUTORIAL_LINES.event_result.fail)}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="goTutorialFood()">Next →</button>
    </div>
  `;
  setPanel(html);
}

function goTutorialFood() {
  state.tutorialStep = 'food';
  render();
}

function renderTutorialFood() {
  state.mandatoryFood = null;
  const hasFood = state.inventory.some(id => getCategory(id) === 'food');
  const randalLine = hasFood ? TUTORIAL_LINES.food.has_food : TUTORIAL_LINES.food.no_food;
  const html = `
    ${makeTutorialLabel('Eat')}
    ${renderLines(TUTORIAL_LINES.food.intro)}
    ${renderLines(randalLine)}
    <div class="use-area">
      <div class="use-hint" style="color:#c07070;font-size:0.8rem;letter-spacing:0.1em">
        ◆ Eat something<br>
        <p style="font-size:0.72rem;color:var(--dim)">Skip eating: HP -15 / MP -15</p>
      </div>
      <div class="choices" id="day-food-choices" style="margin-top:8px">${buildFoodSection()}</div>
    </div>
    <div class="choices" style="margin-top:12px">
      <button class="choice-btn primary" onclick="confirmTutorialFood()">Next →</button>
    </div>
  `;
  setPanel(html);
}

function confirmTutorialFood() {
  if (state.mandatoryFood !== null) {
    const idx = state.inventory.indexOf(state.mandatoryFood);
    if (idx >= 0) state.inventory.splice(idx, 1);
    updateStats({ hp: 3, mp: 3 });
  } else {
    updateStats(FOOD_PENALTY);
  }
  state.mandatoryFood = null;
  state.inventory = [];
  // apple from Randal
  state.inventory.push('apple');
  renderInventory();
  state.tutorialStep = 'end';
  render();
}

function renderTutorialEnd() {
  const html = `
    ${makeTutorialLabel('Complete')}
    ${renderLines(TUTORIAL_LINES.end)}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="endTutorial()">Start →</button>
    </div>
  `;
  setPanel(html);
}

function endTutorial() {
  state.hp = 100;
  state.mp = 100;
  state.tutorialStep = '';
  state.phase = 'explore';
  render();
}

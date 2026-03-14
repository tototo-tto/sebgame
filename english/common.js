// ============================================================
// ITEM DATA (item definitions / recovery — edit here to change)
// ============================================================

const ITEM_RECOVERY = {
  food:  { hp: 12, mp: 0,  label: 'HP +12' },
  cloth: { hp: 10,  mp: 0, label: 'HP +10' },
  book:  { hp: 0,  mp: 12, label: 'MP +12' },
  junk:  { hp: 5,  mp: 5,  label: 'HP +5 / MP +5' },
  rare:  { hp: 20, mp: 20, label: 'HP +20 / MP +20' },
};

const FOOD_PENALTY = { hp: -15, mp: -15 };

// ============================================================
// GAME STATE
// ============================================================

let state = {
  day: 1,
  hp: 100,
  mp: 100,
  inventory: [],
  cycle: 0,
  phase: 'explore', // explore|event|day_end|day_talk|gameover|ending_talk|prologue|tutorial|key_door|key_door_result|key_door_chat|randal_check
  currentEvent: null,
  selectedItems: [],
  eventsRemaining: [],
  currentTalk: null,
  talkLineIndex: 0,
  _talkIsLast: false,
  _endingType: '',
  _endingTalkKey: '',
  _hasSeenEnding: false,
  _gameOverCount: 0,
  mandatoryFood: null,
  triggeredTalks: [],
  daysWithoutFood: 0,
  _keyDoorOutcome: null,
  _keyDoorGotItems: [],
  _usedKeyDoorIds: [],
  bond: 0,
  _lastExploreLocId: '',
  _extraExploreCount: 0,
  tutorialStep: '',
  _tutorialGotItems: [],
  _tutorialLoc: null,
  _tutorialSuccess: false,
  eventFlags: {},
  triggeredEvents: [],
  _tutorialExtraCount: 0,
  _statHidden: false,
  _statHiddenDays: 0,
  _statJustRestored: false,
};

let _debugUnlocked = false;
let _appleTapCount  = 0;
function _onAppleTap() {
  _appleTapCount++;
  if (_appleTapCount >= 10) {
    _debugUnlocked = true;
    const panel = document.getElementById('debug-panel');
    if (panel) panel.style.display = 'flex';
    renderInventory();
  }
}

function initCycle() {
  state.day = 1;
  state.hp = 100;
  state.mp = 100;
  state.inventory = state.cycle === 0 ? [] : ['apple'];
  state.triggeredTalks = [];
  state.daysWithoutFood = 0;
  state.bond = 0;
  state._extraExploreCount = 0;
  state._usedKeyDoorIds = [];
  state._randalPlayFailCount = 0;
  state._randalRetryBonus = 0;
  state._statHidden = false;
  state._statHiddenDays = 0;
  state._statJustRestored = false;
  state.eventFlags = {};
  state.triggeredEvents = [];

  // Pick 10 random events (10-day run: DAY7=midcheck, so 10 normal event days)
  const pool = [...EVENTS].sort(() => Math.random() - 0.5).slice(0, 10);
  state.eventsRemaining = pool;

  if (state.cycle === 0) {
    state.currentTalk = PROLOGUE_LINES;
    state.talkLineIndex = 0;
    state.phase = 'prologue';
  } else {
    state.phase = 'explore';
  }
  render();
}

// ============================================================
// HELPERS
// ============================================================


// Multi-character dialogue rendering for events
function charLine(lineObj) {
  const speaker = (lineObj && lineObj.speaker) ? lineObj.speaker : 'seba';
  const text = (lineObj && typeof lineObj === 'object') ? lineObj.text : String(lineObj);
  const face = (lineObj && lineObj.face) ? lineObj.face : 'normal';
  const char = CHARACTERS[speaker] || CHARACTERS.seba;
  const avatarSrc = `${char.avatarPrefix}${face}.png`;
  return `<div class="char-line" style="border-left-color:${char.border};background:${char.bg}">
    <div class="seba-avatar"><img src="${avatarSrc}" alt="" onerror="this.style.display='none'"></div>
    <div><div class="char-name" style="color:${char.color}">${char.label}</div>${text}</div>
  </div>`;
}

// Handles both single objects and arrays
function renderLines(linesOrSingle) {
  if (!linesOrSingle) return '';
  const arr = Array.isArray(linesOrSingle) ? linesOrSingle : [linesOrSingle];
  return arr.map(line => charLine(line)).join('');
}

// Weighted random drop count (uses weights array if present, otherwise uniform distribution)
function pickDropCount(range) {
  if (range.weights) {
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < range.weights.length; i++) {
      cum += range.weights[i];
      if (r < cum) return range.min + i;
    }
    return range.max;
  }
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function sortItemIds(ids) {
  const order = typeof ITEM_LIST !== 'undefined' ? Object.keys(ITEM_LIST) : [];
  return [...ids].sort((a, b) => {
    const ai = order.indexOf(a), bi = order.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

function getItem(id) {
  if (typeof ITEM_LIST !== 'undefined' && ITEM_LIST[id]) return ITEM_LIST[id];
  return { name: id, emoji: '❓', desc: '', category: id };
}

function getCategory(id) {
  return getItem(id).category;
}

function getRecovery(id) {
  const item = getItem(id);
  if (item.recovery) return item.recovery;
  return ITEM_RECOVERY[item.category] || { hp: 0, mp: 0, label: 'No effect' };
}

// Exclude unique items already in inventory from drop candidates
function getAvailableDrops(drops) {
  const filtered = drops.filter(d => {
    const item = getItem(d.item);
    return !item.unique || !state.inventory.includes(d.item);
  });
  return filtered.length > 0 ? filtered : drops;
}

function weightedDrop(drops) {
  const total = drops.reduce((s, d) => s + d.weight, 0);
  let r = Math.random() * total;
  for (const d of drops) {
    r -= d.weight;
    if (r <= 0) return d.item;
  }
  return drops[drops.length - 1].item;
}

function getEventBonus(event, itemId) {
  if (event.bonusGroups) {
    for (const group of event.bonusGroups) {
      if (group.items.includes(itemId)) return group.bonus;
    }
  }
  if (event.defaultBonus !== undefined) return event.defaultBonus;
  const item = getItem(itemId);
  return item.eventBonus !== undefined ? item.eventBonus : 0.15;
}

function calcProb(event, items) {
  // If a critical item is present, immediately 100%
  if (event.critical) {
    for (const itemId of items) {
      if (event.critical.includes(itemId)) return 1.0;
    }
  }
  // Use baseProb if specified (default 0.10)
  let base = event.baseProb !== undefined ? event.baseProb : 0.10;
  for (const itemId of items) {
    base += getEventBonus(event, itemId);
  }
  return Math.min(event.noCap ? 1.0 : 0.80, base);
}

function addBond(n) {
  state.bond = Math.min(12, state.bond + n);
  const el = document.getElementById('debug-bond');
  if (el) el.textContent = state.bond;
}


// General function to select dialogue based on bond level
// Just adding minBond to data automatically adds new tiers
function pickBondLine(lines) {
  const thresholds = [...new Set(lines.map(l => l.minBond || 0))]
    .filter(t => t > 0)
    .sort((a, b) => b - a);

  for (const t of thresholds) {
    if (state.bond < t) continue;
    const pool = lines.filter(l => l.minBond === t);
    const prob = 0.45 + (t / (thresholds[0] || 1)) * 0.25;
    if (pool.length && Math.random() < prob) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  const base = lines.filter(l => !l.minBond);
  return base[Math.floor(Math.random() * base.length)];
}

function updateStats(delta) {
  state.hp = Math.max(0, Math.min(100, state.hp + (delta.hp || 0)));
  state.mp = Math.max(0, Math.min(100, state.mp + (delta.mp || 0)));
  renderStats();
}

function renderInventory() {
  const descEl = document.getElementById('item-desc');
  if (descEl) descEl.textContent = '';
  const el = document.getElementById('inventory');
  const foodsEl = el.querySelector('.foods');
  const othersEl = el.querySelector('.others');
  foodsEl.innerHTML = '';
  othersEl.innerHTML = '';

  if (state.inventory.length === 0) {
    othersEl.innerHTML = '<span class="inv-item empty">Nothing</span>';
    return;
  }

  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;

  const foodEntries  = sortItemIds(Object.keys(counts)).filter(id => getCategory(id) === 'food').map(id => [id, counts[id]]);
  const otherEntries = sortItemIds(Object.keys(counts)).filter(id => getCategory(id) !== 'food').map(id => [id, counts[id]]);

  function makeItemDiv([id, count]) {
    const item = getItem(id);
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.textContent = `${item.emoji} ${item.name} ×${count}`;
    div.title = item.desc;
    div.addEventListener('click', () => {
      const descEl = document.getElementById('item-desc');
      if (descEl) descEl.textContent = item.desc;
      el.querySelectorAll('.inv-item').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
    });
    if (id === 'apple' && !_debugUnlocked) {
      div.addEventListener('click', _onAppleTap);
    }
    return div;
  }

  if (foodEntries.length > 0) {
    const label = document.createElement('div');
    label.className = 'inv-section-label';
    label.textContent = 'Food';
    foodsEl.appendChild(label);
    foodEntries.forEach(e => foodsEl.appendChild(makeItemDiv(e)));
  }

  if (otherEntries.length > 0) {
    const label = document.createElement('div');
    label.className = 'inv-section-label';
    label.textContent = 'Other';
    othersEl.appendChild(label);
    otherEntries.forEach(e => othersEl.appendChild(makeItemDiv(e)));
  }
}

function setPanel(html) {
  const panel = document.getElementById('main-panel');
  panel.classList.remove('fade-in');
  void panel.offsetWidth;
  panel.innerHTML = html;
  panel.classList.add('fade-in');
}

// ============================================================
// RENDER
// ============================================================

function renderStats() {
  const confused = document.getElementById('confused-banner');
  if (confused) confused.style.display = state._statHidden ? 'block' : 'none';

  if (state._statHidden) {
    document.getElementById('hp-bar').style.width = '100%';
    document.getElementById('hp-bar').style.background = 'var(--border)';
    document.getElementById('mp-bar').style.width = '100%';
    document.getElementById('mp-bar').style.background = 'var(--border)';
    document.getElementById('hp-val').textContent = '??? / 100';
    document.getElementById('mp-val').textContent = '??? / 100';
  } else {
    document.getElementById('hp-bar').style.width = state.hp + '%';
    document.getElementById('hp-bar').style.background = '';
    document.getElementById('mp-bar').style.width = state.mp + '%';
    document.getElementById('mp-bar').style.background = '';
    document.getElementById('hp-val').textContent = state.hp + ' / 100';
    document.getElementById('mp-val').textContent = state.mp + ' / 100';
  }
  const bondEl = document.getElementById('debug-bond');
  if (bondEl) bondEl.textContent = state.bond;
}

function debugKeyDoor() {
  state.phase = 'key_door';
  render();
}

function debugEvent(eventId) {
  const ev = [...EVENTS, ...(typeof CHAIN_EVENTS !== 'undefined' ? CHAIN_EVENTS : [])]
    .find(e => e.id === eventId);
  if (!ev) return;
  state.currentEvent = ev;
  state.selectedItems = [];
  state.phase = 'event';
  render();
}

function debugBond(n) {
  state.bond = Math.max(0, Math.min(12, state.bond + n));
  const el = document.getElementById('debug-bond');
  if (el) el.textContent = state.bond;
}

function render() {
  renderStats();
  renderInventory();
  if (state.phase === 'explore') renderExplore();
  else if (state.phase === 'event') renderEvent();
  else if (state.phase === 'day_end') renderDayEnd();
  else if (state.phase === 'day_talk') renderDayTalk();
  else if (state.phase === 'gameover') renderGameover();
  else if (state.phase === 'ending_talk') renderEndingTalk();
  else if (state.phase === 'prologue') renderPrologue();
  else if (state.phase === 'tutorial') renderTutorialStep();
  else if (state.phase === 'key_door') renderKeyDoor();
  else if (state.phase === 'key_door_result') renderKeyDoorResult();
  else if (state.phase === 'key_door_chat') renderKeyDoorChat();
  else if (state.phase === 'randal_check') renderRandalCheck();
}

function makeDayLabel(day, activePhase) {
  const phases = ['Explore', 'Event', 'Eat'];
  const phaseMap = {
    'Explore': 0, 'Explore Result': 0, 'Extra Explore': 0,
    'Event': 1, 'Event Result': 1, 'Avoidance Failed': 1,
    'Eat': 2, 'End of Day': 2,
  };
  const activeIdx = phaseMap[activePhase] ?? -1;
  const flowHtml = phases.map((p, i) => {
    const cls = i === activeIdx ? ' class="active"' : '';
    const sep = i < phases.length - 1 ? '<span class="glid-sep">→</span>' : '';
    return `<span${cls}>${p}</span>${sep}`;
  }).join('');
  return `<div class="phase-label"><span class="day-marker">DAY ${day}</span><div class="glid-label">${flowHtml}</div></div>`;
}

function renderExplore() {
  const cycleNote = state.cycle > 0 ? `<span class="cycle-badge">CYCLE ${state.cycle + 1}</span>` : '';
  let sebaOpening;
  if (state.day === 1 && state._hasSeenEnding && state.cycle >= 4) {
    sebaOpening = RANDAL_DAY1_DEBUG_LINE;
  } else if (state._statJustRestored) {
    sebaOpening = pickBondLine(SEBA_EXPLORE_LINES_STAT_RESTORED);
    state._statJustRestored = false;
  } else if (state._statHidden) {
    sebaOpening = pickBondLine(SEBA_EXPLORE_LINES_STAT_HIDDEN);
  } else {
    sebaOpening = pickBondLine(SEBA_EXPLORE_LINES);
  }

  let html = `
    ${cycleNote}
    ${makeDayLabel(state.day, 'Explore')}
    <div class="main-text">Where will you explore today?</div>
    ${renderLines(sebaOpening)}
    <div class="choices">
  `;
  for (const loc of LOCATIONS) {
    html += `<button class="choice-btn" onclick="doExplore('${loc.id}')">
      <strong>${loc.name}</strong><br>
      <small style="color:var(--dim)">${loc.desc}</small>
    </button>`;
  }
  setPanel(html);
}

function doExplore(locId) {
  state._lastExploreLocId = locId;
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
  const isGood = gotItems.length > 2;

  // Item reaction takes priority; otherwise select from location × good/bad pool with bond branching
  let sebaText = null;
  if (typeof SEBA_ITEM_REACTIONS !== 'undefined') {
    for (const id of gotItems) {
      if (SEBA_ITEM_REACTIONS[id]) { sebaText = pickBondLine(SEBA_ITEM_REACTIONS[id]); break; }
    }
  }
  if (!sebaText) {
    const pool = SEBA_EXPLORE_RESULT[locId];
    sebaText = pool
      ? pickBondLine(isGood ? pool.good : pool.bad)
      : (isGood ? loc.sebaLine : loc.sebaLineBad); // fallback
  }
  const itemListHtml = gotItems.map(id => {
    const item = getItem(id);
    return `<span style="color:var(--accent)">${item.emoji} ${item.name}</span>`;
  }).join(', ');

  const extraBtn = state._extraExploreCount < 3 ? buildExtraExploreBtn(locId) : '';

  let html = `
    ${makeDayLabel(state.day, 'Explore Result')}
    <div class="main-text">
      Searched <strong>${loc.name}</strong>.<br>
      Found ${itemListHtml}.
    </div>
    ${renderLines(sebaText)}
    <hr class="divider">
    <div class="choices">
      ${extraBtn}
      <button class="choice-btn primary" onclick="startEvent()">End Explore</button>
    </div>
  `;
  setPanel(html);
}

// Build the extra explore button (count = current attempt count)
function buildExtraExploreBtn(locId) {
  const failRates = [30, 50, 80];
  const rate = failRates[state._extraExploreCount];
  const label = state._extraExploreCount === 0 ? 'Extra Explore' : 'Search Further';
  return `<button class="choice-btn" onclick="doExtraExplore('${locId}')">
  ${label} <small style="color:var(--dim)">(Fail Rate ${rate}%)</small>
  </button>`;
}

function doExtraExplore(locId) {
  const attempt = state._extraExploreCount; // 0=1st, 1=2nd, 2=3rd
  const successRates = [0.70, 0.50, 0.20];
  const success = Math.random() < successRates[attempt];
  state._extraExploreCount++;

  const loc = LOCATIONS.find(l => l.id === locId);
  const extraBtn = state._extraExploreCount < 3 ? buildExtraExploreBtn(locId) : '';

  if (success) {
    const got = weightedDrop(getAvailableDrops(loc.drops));
    state.inventory.push(got);
    renderInventory();
    const item = getItem(got);
    let sebaText = null;
    if (typeof SEBA_ITEM_REACTIONS !== 'undefined' && SEBA_ITEM_REACTIONS[got]) {
      sebaText = pickBondLine(SEBA_ITEM_REACTIONS[got]);
    }
    if (!sebaText) sebaText = pickBondLine(SEBA_EXTRA_EXPLORE.success[attempt]);
    const html = `
      ${makeDayLabel(state.day, 'Extra Explore')}
      <div class="main-text">Searched deeper.<br>
        Found an additional <span style="color:var(--accent)">${item.emoji} ${item.name}</span>.
      </div>
      ${renderLines(sebaText)}
      <hr class="divider">
      <div class="choices">
        ${extraBtn}
        <button class="choice-btn primary" onclick="startEvent()">End Explore</button>
      </div>
    `;
    setPanel(html);
  } else {
    const dmgHp = 15;
    const dmgMp = 10;
    updateStats({ hp: -dmgHp, mp: -dmgMp });
    if (state.hp <= 0 || state.mp <= 0) { gameOver(); return; }
    const sebaText = pickBondLine(SEBA_EXTRA_EXPLORE.fail[attempt]);
    const html = `
      ${makeDayLabel(state.day, 'Extra Explore')}
      <div class="main-text" style="color:var(--danger)">
        Pushed too far.<br>
        HP -${dmgHp} / MP -${dmgMp}
      </div>
      ${renderLines(sebaText)}
      <hr class="divider">
      <div class="choices">
        ${extraBtn}
        <button class="choice-btn primary" onclick="startEvent()">End Explore</button>
      </div>
    `;
    setPanel(html);
  }
}

function startEvent() {
  if (state.inventory.includes('old_key') && Math.random() < 0.50) {
    state.phase = 'key_door';
    render();
    return;
  }
  pickNormalEvent();
}

function pickNormalEvent() {
  const loc = LOCATIONS.find(l => l.id === state._lastExploreLocId);
  const linked = loc && loc.linkedEvents ? loc.linkedEvents : [];

  // Randomly insert chain events with raised flags (only ones not yet added)
  if (typeof CHAIN_EVENTS !== 'undefined') {
    for (const ce of CHAIN_EVENTS) {
      if (
        ce.requiresFlag &&
        state.eventFlags[ce.requiresFlag] &&
        !(ce.setsFlag && state.eventFlags[ce.setsFlag]) &&
        !state.eventsRemaining.find(e => e.id === ce.id)
      ) {
        const insertIdx = Math.floor(Math.random() * (state.eventsRemaining.length + 1));
        state.eventsRemaining.splice(insertIdx, 0, ce);
      }
    }
  }

  // blockIfItem permanently excluded (won't appear while holding the item)
  state.eventsRemaining = state.eventsRemaining.filter(
    e => !e.blockIfItem || !state.inventory.includes(e.blockIfItem)
  );

  // minDay condition only skips that day (event stays in pool)
  const selectablePool = state.eventsRemaining.filter(
    e => !e.minDay || state.day >= e.minDay
  );

  const linkedAvailable = linked.filter(id => selectablePool.find(e => e.id === id));

  let chosen = null;
  if (linkedAvailable.length > 0 && Math.random() < 0.5) {
    const linkedId = linkedAvailable[Math.floor(Math.random() * linkedAvailable.length)];
    const idx = state.eventsRemaining.findIndex(e => e.id === linkedId);
    chosen = state.eventsRemaining.splice(idx, 1)[0];
  }
  if (!chosen) {
    if (selectablePool.length > 0) {
      const idx = state.eventsRemaining.findIndex(e => e.id === selectablePool[0].id);
      chosen = state.eventsRemaining.splice(idx, 1)[0];
    } else {
      chosen = state.eventsRemaining.shift() || EVENTS[Math.floor(Math.random() * EVENTS.length)];
    }
  }
  state.currentEvent = chosen;

  state.selectedItems = [];
  state._wallMouthGiveCount = 0;
  state.phase = 'event';
  render();
}

// ── Choice-type event ─────────────────────────────────────────

function renderChoiceEvent() {
  const ev = state.currentEvent;
  const giveLabel   = ev.giveLabel   || 'Give something';
  const refuseLabel = ev.refuseLabel || 'Give nothing';

  // Add dedicated button if player has a critical item
  let criticalBtn = '';
  if (ev.critical) {
    for (const itemId of ev.critical) {
      if (state.inventory.includes(itemId)) {
        const item = getItem(itemId);
        criticalBtn += `<button class="choice-btn" onclick="choiceEventCritical('${itemId}')">Give ${item.emoji} ${item.name}</button>`;
      }
    }
  }

  let giveBtn = '';
  if (ev.demandMostHeldItem) {
    const most = getMostHeldItem();
    if (most) {
      const item = getItem(most.id);
      giveBtn = `<button class="choice-btn" onclick="choiceEventGiveMostHeld('${most.id}')">
        ${giveLabel} (${item.emoji} ${item.name} ×${most.count})
      </button>`;
    } else {
      giveBtn = `<div style="color:var(--dim);font-size:0.8rem">Nothing to give.</div>`;
    }
  } else {
    giveBtn = `${criticalBtn}
      <button class="choice-btn ${criticalBtn ? '' : ''}" onclick="choiceEventGive()">${giveLabel}</button>`;
  }

  const html = `
    <div class="event-header">
      ${makeDayLabel(state.day, 'Event')}
    </div>
    <div class="main-text" style="white-space:pre-line">${ev.desc}</div>
    ${renderLines(ev.sebaEvent)}
    <hr class="divider">
    <div class="choices">
      ${giveBtn}
      <button class="choice-btn" onclick="choiceEventRefuse()">${refuseLabel}</button>
    </div>
  `;
  setPanel(html);
}

function choiceEventCritical(itemId) {
  const ev = state.currentEvent;
  const idx = state.inventory.indexOf(itemId);
  if (idx >= 0) state.inventory.splice(idx, 1);
  if (ev.criticalRecovery) updateStats(ev.criticalRecovery);
  if (ev.criticalGiveItem) state.inventory.push(ev.criticalGiveItem);
  if (ev.criticalPenalty) updateStats(ev.criticalPenalty);
  if (ev.criticalStatHiddenDays) applyStatHidden(ev.criticalStatHiddenDays);
  addBond(ev.bondOnSuccess || 1);
  renderInventory();

  let extraText = '';
  if (ev.criticalGiveItem) {
    const item = getItem(ev.criticalGiveItem);
    extraText += `<div class="gain-bubble">Obtained<br>${item.emoji} ${item.name}</div>`;
  }
  if (ev.criticalPenalty) {
    const parts = [];
    if (ev.criticalPenalty.hp) parts.push(`HP ${ev.criticalPenalty.hp}`);
    if (ev.criticalPenalty.mp) parts.push(`MP ${ev.criticalPenalty.mp}`);
    extraText += `<div class="gain-bubble minus">${parts.join(' / ')}</div>`;
  }

  const html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      ${ev.textSuccessCritical || ''}
    </div>
    ${renderLines(ev.sebaSuccessCritical)}
    ${ev.criticalRecovery && (ev.criticalRecovery.hp || ev.criticalRecovery.mp) ? `<div class="gain-bubble">HP +${ev.criticalRecovery.hp} / MP +${ev.criticalRecovery.mp}</div>` : ''}
    ${extraText}
    <hr class="divider">
    <div class="choices"><button class="choice-btn primary" onclick="endDay()">End the Day</button></div>
  `;
  setPanel(html);
}

function getMostHeldItem() {
  if (state.inventory.length === 0) return null;
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  const topId = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
  return { id: topId, count: counts[topId] };
}

function choiceEventGiveMostHeld(itemId) {
  const ev = state.currentEvent;
  // Remove all items of that ID
  state.inventory = state.inventory.filter(id => id !== itemId);
  renderInventory();

  const isCritical = ev.critical && ev.critical.includes(itemId);
  if (isCritical) {
    addBond(ev.bondOnSuccess || 1);
    if (ev.criticalGiveItem) { state.inventory.push(ev.criticalGiveItem); renderInventory(); }
    if (ev.criticalPenalty) updateStats(ev.criticalPenalty);
    if (ev.criticalStatHiddenDays) applyStatHidden(ev.criticalStatHiddenDays);
  }

  if (ev.bondOnSuccess && !isCritical) addBond(ev.bondOnSuccess);
  if (ev.setsFlag) state.eventFlags[ev.setsFlag] = true;

  let extraText = '';
  if (isCritical && ev.criticalGiveItem) {
    const item = getItem(ev.criticalGiveItem);
    extraText += `<div class="gain-bubble">Obtained<br>${item.emoji} ${item.name}</div>`;
  }
  if (isCritical && ev.criticalPenalty) {
    const parts = [];
    if (ev.criticalPenalty.hp) parts.push(`HP ${ev.criticalPenalty.hp}`);
    if (ev.criticalPenalty.mp) parts.push(`MP ${ev.criticalPenalty.mp}`);
    extraText += `<div class="gain-bubble minus">${parts.join(' / ')}</div>`;
  }

  const sebaText = isCritical ? (ev.sebaSuccessCritical || ev.sebaSuccess) : ev.sebaSuccess;
  const html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      ${isCritical ? (ev.textSuccessCritical || ev.textSuccess || '') : (ev.textSuccess || '')}
    </div>
    ${renderLines(sebaText)}
    ${extraText}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="endDay()">End the Day</button>
    </div>
  `;
  setPanel(html);
}

function applyStatHidden(days) {
  if (state._statHidden) {
    state._statHiddenDays += days;
  } else {
    state._statHidden = true;
    state._statHiddenDays = days;
  }
}

function choiceEventGive() {
  const ev = state.currentEvent;
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;

  const itemButtons = sortItemIds(Object.keys(counts)).map(id => {
    const item = getItem(id);
    return `<button class="choice-btn" onclick="choiceEventConfirmGive('${id}')">
      ${item.emoji} ${item.name} ×${counts[id]}<br>
      <small style="color:var(--dim)">${item.desc}</small>
    </button>`;
  }).join('') || `<div style="color:var(--dim);font-size:0.8rem">Nothing to give.</div>`;

  const html = `
    <div class="event-header">
      ${makeDayLabel(state.day, 'Event')}
    </div>
    <div class="main-text">What will you give?</div>
    <div class="choices" style="margin-bottom:12px">${itemButtons}</div>
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn" onclick="renderChoiceEvent()">← Back</button>
    </div>
  `;
  setPanel(html);
}

function choiceEventConfirmGive(itemId) {
  const ev = state.currentEvent;
  const idx = state.inventory.indexOf(itemId);
  if (idx >= 0) state.inventory.splice(idx, 1);
  renderInventory();

  const isCritical = ev.critical && ev.critical.includes(itemId);

  // Random success check when giving (e.g. 30% satisfied)
  if (!isCritical && ev.giveSuccessRate !== undefined && Math.random() >= ev.giveSuccessRate) {
    // Not satisfied — item consumed, show text and continue same choices
    state._wallMouthGiveCount++;
    const giveLabel   = ev.giveLabel   || 'Give something';
    const refuseLabel = ev.refuseLabel || 'Give nothing';
    const html = `
      ${makeDayLabel(state.day, 'Event')}
      <div class="main-text">${ev.textGiveNotSatisfied || 'It still seems to want something.'}</div>
      ${renderLines(ev.sebaGiveNotSatisfied)}
      <hr class="divider">
      <div class="choices">
        <button class="choice-btn" onclick="choiceEventGive()">${giveLabel}</button>
        <button class="choice-btn" onclick="choiceEventRefuse()">${refuseLabel}</button>
      </div>
    `;
    setPanel(html);
    return;
  }

  if (isCritical) {
    addBond(ev.bondOnSuccess || 1);
    if (ev.criticalGiveItem) state.inventory.push(ev.criticalGiveItem);
    if (ev.criticalPenalty) updateStats(ev.criticalPenalty);
    if (ev.criticalStatHiddenDays) applyStatHidden(ev.criticalStatHiddenDays);
    renderInventory();
  }
  if (ev.bondOnSuccess && !isCritical) addBond(ev.bondOnSuccess);
  if (ev.setsFlag) state.eventFlags[ev.setsFlag] = true;
  if (ev.requiresFlag) state.triggeredEvents.push(ev.id);
  const sebaText  = isCritical ? (ev.sebaSuccessCritical  || ev.sebaSuccess) : ev.sebaSuccess;
  const mainText  = isCritical ? (ev.textSuccessCritical  || ev.textSuccess  || '') : (ev.textSuccess || '');
  const resultText = isCritical ? 'Critical Success' : 'Success';

  let extraText = '';
  if (isCritical) {
    if (ev.criticalGiveItem) {
      const item = getItem(ev.criticalGiveItem);
      extraText += `<div class="gain-bubble">Obtained<br>${item.emoji} ${item.name}</div>`;
    }
    if (ev.criticalPenalty) {
      const parts = [];
      if (ev.criticalPenalty.hp) parts.push(`HP ${ev.criticalPenalty.hp}`);
      if (ev.criticalPenalty.mp) parts.push(`MP ${ev.criticalPenalty.mp}`);
      extraText += `<br><span style="color:#c07070;font-size:0.85rem">${parts.join(' / ')}</span>`;
    }
  }

  let html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      <span class="result-good" style="font-size:1.1rem;font-family:'Special Elite',cursive">${resultText}</span><br>
      ${mainText}
      ${extraText}
    </div>
    ${renderLines(sebaText)}
    <hr class="divider">
    <div class="choices"><button class="choice-btn primary" onclick="endDay()">End the Day</button></div>
  `;
  setPanel(html);
}

// ============================================================
// THREE-WAY EVENT (forced 3-choice event)
// ============================================================

function renderThreeWayEvent() {
  const ev = state.currentEvent;
  const choiceButtons = ev.choices.map(c => {
    let hint = '';
    if (c.effect.hp)    hint = `HP ${c.effect.hp}`;
    if (c.effect.mp)    hint = `MP ${c.effect.mp}`;
    if (c.effect.items) hint = `Up to ${c.effect.items} items lost`;
    return `<button class="choice-btn" onclick="resolveThreeWayEvent('${c.id}')">
      ${c.label}<br><small style="color:var(--dim)">${hint}</small>
    </button>`;
  }).join('');

  const html = `
    ${makeDayLabel(state.day, 'Event')}
    <div class="main-text" style="white-space:pre-line">${ev.desc}</div>
    ${renderLines(ev.sebaEvent)}
    <hr class="divider">
    <div class="choices">${choiceButtons}</div>
  `;
  setPanel(html);
}

function resolveThreeWayEvent(choiceId) {
  const ev = state.currentEvent;
  const choice = ev.choices.find(c => c.id === choiceId);
  if (!choice) return;

  let lostItemsHtml = '';

  if (choice.effect.hp) updateStats({ hp: choice.effect.hp });
  if (choice.effect.mp) updateStats({ mp: choice.effect.mp });
  if (choice.effect.items) {
    const lossCount = Math.min(choice.effect.items, state.inventory.length);
    const lostNames = [];
    for (let i = 0; i < lossCount; i++) {
      const idx = Math.floor(Math.random() * state.inventory.length);
      const lostId = state.inventory.splice(idx, 1)[0];
      const lostItem = getItem(lostId);
      lostNames.push(lostItem ? lostItem.name : lostId);
    }
    if (lostNames.length > 0) {
      lostItemsHtml = `<div class="gain-bubble minus">Items Lost<br>${lostNames.join(', ')}</div>`;
    }
  }

  if (choice.bond) addBond(choice.bond);
  if (ev.setsFlag) state.eventFlags[ev.setsFlag] = true;
  renderInventory();

  if (state.hp <= 0 || state.mp <= 0) { gameOver(); return; }

  const effectParts = [];
  if (choice.effect.hp) effectParts.push(`HP ${choice.effect.hp}`);
  if (choice.effect.mp) effectParts.push(`MP ${choice.effect.mp}`);
  const effectHtml = effectParts.length ? `<div class="gain-bubble minus">${effectParts.join(' / ')}</div>` : '';

  const html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      ${choice.text}
      ${lostItemsHtml}
    </div>
    ${renderLines(choice.sebaLines)}
    ${effectHtml}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="endDay()">End the Day</button>
    </div>
  `;
  setPanel(html);
}

function choiceEventRefuse() {
  const ev = state.currentEvent;

  // Multiple branching refuse outcomes (e.g. wall_mouth)
  if (ev.refuseOutcomes && ev.refuseOutcomes.length > 0) {
    const n = state._wallMouthGiveCount || 0;
    const reduction = n === 0 ? 0 : 10 + (n - 1) * 5;
    const outcomes = ev.refuseOutcomes.map(o =>
      (o.type === 'damage' || o.type === 'itemLoss')
        ? { ...o, weight: Math.max(5, o.weight - reduction) }
        : o
    );
    const total = outcomes.reduce((sum, o) => sum + o.weight, 0);
    let rand = Math.random() * total;
    let outcome = outcomes[outcomes.length - 1];
    for (const o of outcomes) {
      rand -= o.weight;
      if (rand <= 0) { outcome = o; break; }
    }

    let extraHtml = '';
    if (outcome.type === 'damage') {
      updateStats(ev.penaltyFail);
      const damageParts = [];
      if (ev.penaltyFail.hp) damageParts.push(`HP ${ev.penaltyFail.hp}`);
      if (ev.penaltyFail.mp) damageParts.push(`MP ${ev.penaltyFail.mp}`);
      if (damageParts.length) extraHtml = `<div class="gain-bubble minus">${damageParts.join(' / ')}</div>`;
    } else if (outcome.type === 'itemLoss') {
      const lossCount = Math.min(outcome.lossCount || 3, state.inventory.length);
      const lostItems = [];
      for (let i = 0; i < lossCount; i++) {
        if (state.inventory.length === 0) break;
        const pick = Math.floor(Math.random() * state.inventory.length);
        lostItems.push(state.inventory.splice(pick, 1)[0]);
      }
      if (lostItems.length > 0) {
        const names = lostItems.map(id => { const it = getItem(id); return it ? it.name : id; });
        extraHtml = `<div class="gain-bubble minus">Items Lost<br>${names.join(', ')}</div>`;
      }
    } else if (outcome.type === 'rareItemGain') {
      const rareIds = Object.keys(ITEM_LIST).filter(id => ITEM_LIST[id].category === 'rare');
      const candidates = rareIds.filter(id => !ITEM_LIST[id].unique || !state.inventory.includes(id));
      if (candidates.length > 0) {
        const gained = candidates[Math.floor(Math.random() * candidates.length)];
        state.inventory.push(gained);
        const it = getItem(gained);
        extraHtml = `<div class="gain-bubble">Obtained<br>${it.emoji} ${it.name}</div>`;
      }
    } else if (outcome.type === 'bond') {
      if (outcome.bondGain) addBond(outcome.bondGain);
      // Bond increase is silent (no display)
    }
    // type === 'nothing' does nothing

    renderInventory();
    if (ev.setsFlag && !ev.setFlagOnGiveOnly) state.eventFlags[ev.setsFlag] = true;
    if (ev.requiresFlag) state.triggeredEvents.push(ev.id);

    const hasBondChat = outcome.type === 'bond' && outcome.chatLines && outcome.chatLines.length > 0;
    if (hasBondChat) state._lastRefuseOutcome = outcome;

    let html = `
      ${makeDayLabel(state.day, 'Event Result')}
      <div class="main-text">
        ${outcome.text || ''}
      </div>
      ${renderLines(outcome.sebaText)}
      ${extraHtml}
      <hr class="divider">
    `;
    if (state.hp <= 0 || state.mp <= 0) {
      html += `<div class="choices"><button class="choice-btn" onclick="gameOver()">……</button></div>`;
    } else if (hasBondChat) {
      html += `<div class="choices"><button class="choice-btn primary" onclick="startOutcomeChat()">Continue</button></div>`;
    } else {
      html += `<div class="choices"><button class="choice-btn primary" onclick="endDay()">End the Day</button></div>`;
    }
    setPanel(html);
    return;
  }

  // Standard refuse handling
  if (ev.demandMostHeldItem) { state._statHidden = true; state._statHiddenDays = 2; }
  updateStats(ev.penaltyFail);
  if (ev.setsFlag && !ev.setFlagOnGiveOnly) state.eventFlags[ev.setsFlag] = true;
  if (ev.requiresFlag) state.triggeredEvents.push(ev.id);
  renderInventory();

  let html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      ${ev.textFail || ''}
    </div>
    ${renderLines(ev.sebaFail)}
    <hr class="divider">
  `;
  if (state.hp <= 0 || state.mp <= 0) {
    html += `<div class="choices"><button class="choice-btn" onclick="gameOver()">……</button></div>`;
  } else {
    html += `<div class="choices"><button class="choice-btn primary" onclick="endDay()">End the Day</button></div>`;
  }
  setPanel(html);
}

// ── Standard event ────────────────────────────────────────────

function renderEvent() {
  const ev = state.currentEvent;
  if (ev.eventType === 'choice')     { renderChoiceEvent();   return; }
  if (ev.eventType === 'three_way')  { renderThreeWayEvent(); return; }

  const ropeAutoSuccess = ev.id === 'sebastian' && state.triggeredTalks.includes('item_rope');
  const prob = ropeAutoSuccess ? 1.0 : calcProb(ev, state.selectedItems);
  const probPct = Math.round(prob * 100);

  let html = `
    <div class="event-header">
      ${makeDayLabel(state.day, 'Event')}
    </div>
    <div class="main-text" style="white-space:pre-line">${ev.desc}</div>
    ${renderLines(ev.sebaEvent)}
    <div class="use-area">
      <div class="use-hint">Select items to use for avoidance</div>
      <div class="choices" id="item-choices">${buildEventItemButtons()}</div>
      <div class="prob-display" id="prob-display">${state._statHidden ? 'Avoidance Rate ???%' : `Avoidance Rate ${probPct}%`}</div>
      <div class="prob-bar-wrap"><div class="prob-bar" id="prob-bar" style="width:${state._statHidden ? 0 : probPct}%"></div></div>
      <div class="small-note" style="color:#c07070;margin-bottom:12px; text-align: center; font-size: 16px">
        On Fail:${ev.penaltyFail.hp ? ` HP ${ev.penaltyFail.hp}` : ''}${ev.penaltyFail.mp ? ` / MP ${ev.penaltyFail.mp}` : ''}
      </div>
      <div class="stats" style="margin-block:12px;">
      <div class="stat-block">
        <div class="stat-label">HP</div>
        <div class="stat-bar-wrap"><div class="stat-bar hp" style="width:${state._statHidden ? 100 : state.hp}%;${state._statHidden ? 'background:var(--border)' : ''}"></div></div>
        <div class="stat-value">${state._statHidden ? '??? / 100' : state.hp + ' / 100'}</div>
      </div>
      <div class="stat-block">
        <div class="stat-label">MP</div>
        <div class="stat-bar-wrap"><div class="stat-bar mp" style="width:${state._statHidden ? 100 : state.mp}%;${state._statHidden ? 'background:var(--border)' : ''}"></div></div>
        <div class="stat-value">${state._statHidden ? '??? / 100' : state.mp + ' / 100'}</div>
      </div>
    </div>
      <div class="choices">
        <button class="choice-btn primary" onclick="resolveEvent()">Deal with it</button>
      </div>
    </div>
  `;
  setPanel(html);
}

function toggleItem(id) {
  const inInv = state.inventory.filter(i => i === id).length;
  const currentUsing = state.selectedItems.filter(i => i === id).length;
  state.selectedItems = state.selectedItems.filter(i => i !== id);
  if (currentUsing < inInv) {
    for (let i = 0; i < currentUsing + 1; i++) state.selectedItems.push(id);
  }

  const _ev = state.currentEvent;
  const _ropeAuto = _ev.id === 'sebastian' && state.triggeredTalks.includes('item_rope');
  const _hasCritical = _ev.critical && state.selectedItems.some(id => _ev.critical.includes(id));
  const probPct = (_ropeAuto || _hasCritical) ? 100 : Math.round(Math.min(0.80, calcProb(_ev, state.selectedItems) + state._randalRetryBonus) * 100);
  document.getElementById('prob-display').textContent = state._statHidden ? 'Avoidance Rate ???%' : `Avoidance Rate ${probPct}%`;
  document.getElementById('prob-bar').style.width = (state._statHidden ? 0 : probPct) + '%';
  document.getElementById('item-choices').innerHTML = buildEventItemButtons();
}

function resolveEvent() {
  const ev = state.currentEvent;
  const ropeAutoSuccess = ev.id === 'sebastian' && state.triggeredTalks.includes('item_rope');
  const hasCriticalSelected = ev.critical && state.selectedItems.some(id => ev.critical.includes(id));
  const prob = (ropeAutoSuccess || hasCriticalSelected) ? 1.0 : Math.min(0.80, calcProb(ev, state.selectedItems) + state._randalRetryBonus);
  const success = ropeAutoSuccess || Math.random() < prob;

  const isCritical = !ropeAutoSuccess && success && ev.critical &&
    state.selectedItems.some(id => ev.critical.includes(id));

  // Remove used items from inventory
  for (const id of state.selectedItems) {
    const idx = state.inventory.indexOf(id);
    if (idx >= 0) state.inventory.splice(idx, 1);
  }

  const delta = success ? (ev.recoverySuccess || { hp: 0, mp: 0 }) : ev.penaltyFail;
  updateStats(delta);
  let loseItemHtml = '';
  let _failEmpty = false;
  if (!success && ev.loseItemOnFail) {
    if (state.inventory.length > 0) {
      const lossCount = Math.min(ev.loseItemOnFail, state.inventory.length);
      const lostNames = [];
      for (let i = 0; i < lossCount; i++) {
        const idx = Math.floor(Math.random() * state.inventory.length);
        const lostId = state.inventory.splice(idx, 1)[0];
        const lostItem = getItem(lostId);
        lostNames.push(lostItem ? lostItem.name : lostId);
      }
      loseItemHtml = `<div class="gain-bubble minus">Items Lost<br>${lostNames.join(', ')}</div>`;
    } else {
      _failEmpty = true;
      if (ev.failEmptyGiveItem) {
        state.inventory.push(ev.failEmptyGiveItem);
        const givenItem = getItem(ev.failEmptyGiveItem);
        loseItemHtml = `<div class="gain-bubble">Obtained<br>${givenItem ? `${givenItem.emoji} ${givenItem.name}` : ev.failEmptyGiveItem}</div>`;
      }
      renderInventory();
    }
  }
  if (success && ev.bondOnSuccess) addBond(ev.bondOnSuccess);
  if (isCritical && ev.bondOnCritical) addBond(ev.bondOnCritical);
  if (ev.bondAlways) addBond(ev.bondAlways);
  if (ev.setsFlag) state.eventFlags[ev.setsFlag] = true;
  if (ev.requiresFlag) state.triggeredEvents.push(ev.id);
  renderInventory();

  // randal: reset retry state on success
  if (ev.id === 'randal' && success) {
    state._randalPlayFailCount = 0;
    state._randalRetryBonus = 0;
  }

  // randal: repeat on failure up to 3 times
  if (ev.id === 'randal' && !success) {
    state._randalPlayFailCount++;
    state._randalRetryBonus = state._randalPlayFailCount * 0.15;
    if (state._randalPlayFailCount < 3) {
      state.selectedItems = [];
      const retryLines = ev.sebaFailRetry[state._randalPlayFailCount - 1];
      const prob = Math.min(0.80, calcProb(ev, state.selectedItems) + state._randalRetryBonus);
      const probPct = Math.round(prob * 100);
      const html = `
        ${makeDayLabel(state.day, 'Avoidance Failed')}
        <div class="main-text">
          <span class="result-bad" style="font-size:1.1rem;font-family:'Special Elite',cursive">Failed to Avoid</span><br>
          ${ev.textFail || 'It didn\'t work out.'}
        </div>
        ${renderLines(retryLines)}
        <hr class="divider">
        <div class="use-area">
          <div class="use-hint">Select items to use</div>
          <div class="choices" id="item-choices">${buildEventItemButtons()}</div>
          <div class="prob-display" id="prob-display">${state._statHidden ? 'Avoidance Rate ???%' : `Avoidance Rate ${probPct}%`}</div>
          <div class="prob-bar-wrap"><div class="prob-bar" id="prob-bar" style="width:${state._statHidden ? 0 : probPct}%"></div></div>
          <div class="small-note" style="color:#c07070;margin-bottom:12px;text-align:center;font-size:16px">
            On Fail:${ev.penaltyFail.hp ? ` HP ${ev.penaltyFail.hp}` : ''}${ev.penaltyFail.mp ? ` / MP ${ev.penaltyFail.mp}` : ''}
          </div>
          <div class="choices">
            <button class="choice-btn primary" onclick="resolveEvent()">Deal with it</button>
          </div>
        </div>
      `;
      setPanel(html);
      return;
    }
    state._randalPlayFailCount = 0;
    state._randalRetryBonus = 0;
  }

  const sebaText = ropeAutoSuccess
    ? (ev.sebaSuccessRope || ev.sebaSuccess)
    : isCritical
    ? (ev.sebaSuccessCritical || ev.sebaSuccess)
    : success ? ev.sebaSuccess
    : (_failEmpty && ev.sebaFailEmpty) ? ev.sebaFailEmpty
    : ev.sebaFail;
  const resultClass = success ? 'result-good' : 'result-bad';
  const resultText = ropeAutoSuccess ? 'Auto-Success' : isCritical ? 'Critical!' : success ? 'Avoided' : 'Failed to Avoid';

  let html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">
      <span class="${resultClass}" style="font-size:1.1rem;font-family:'Special Elite',cursive">${resultText}</span><br>
      ${ropeAutoSuccess
        ? (ev.textSuccessRope || ev.textSuccess || 'Managed to get through it.')
        : isCritical
        ? (ev.textSuccessCritical || ev.textSuccess || 'Managed to get through it.')
        : success
        ? (ev.textSuccess || 'Managed to get through it.')
        : (_failEmpty && ev.textFailEmpty)
        ? ev.textFailEmpty
        : (ev.textFail    || 'It didn\'t work out. HP or MP took a hit.')
      }
    </div>
    ${renderLines(sebaText)}
    ${loseItemHtml}
    ${success && ev.recoverySuccess ? `<div class="gain-bubble">HP +${ev.recoverySuccess.hp} / MP +${ev.recoverySuccess.mp}</div>` : ''}
    ${!success && ev.penaltyFail ? (() => { const parts = []; if (ev.penaltyFail.hp) parts.push(`HP ${ev.penaltyFail.hp}`); if (ev.penaltyFail.mp) parts.push(`MP ${ev.penaltyFail.mp}`); return parts.length ? `<div class="gain-bubble minus">${parts.join(' / ')}</div>` : ''; })() : ''}
    <hr class="divider">
  `;

  if (state.hp <= 0 || state.mp <= 0) {
    html += `<div class="choices"><button class="choice-btn" onclick="gameOver()">……</button></div>`;
  } else {
    html += `<div class="choices"><button class="choice-btn primary" onclick="endDay()">End the Day</button></div>`;
  }
  setPanel(html);
}

function endDay() {
  state.phase = 'day_end';
  render();
}

// ── End-of-day shared drawing helpers ──────────────────────────

function buildFoodSection() {
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  const foodIds = sortItemIds(Object.keys(counts)).filter(id => getCategory(id) === 'food');
  if (foodIds.length === 0) return '<div style="color:#c07070;font-size:0.8rem">No food</div>';
  return foodIds.map(iid => {
    const item = getItem(iid);
    const sel = state.mandatoryFood === iid;
    return `<button class="choice-btn ${sel ? 'primary' : ''}" onclick="toggleMandatoryFood('${iid}')">
      ${item.emoji} ${item.name} ×${counts[iid]}${sel ? ' [Selected]' : ''}<br>
    </button>`;
  }).join('');
}

function buildOptionalSection() {
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  const available = {};
  for (const id of sortItemIds(Object.keys(counts))) {
    const avail = counts[id] - (state.mandatoryFood === id ? 1 : 0);
    if (avail > 0) available[id] = avail;
  }
  if (Object.keys(available).length === 0) return '<div style="color:var(--dim);font-size:0.8rem">None</div>';
  return sortItemIds(Object.keys(available)).map(iid => {
    const item = getItem(iid);
    const rec = getRecovery(iid);
    const sel = state.selectedItems.filter(i => i === iid).length;
    return `<button class="choice-btn ${sel > 0 ? 'primary' : ''}" onclick="toggleDayItem('${iid}')">
      ${item.emoji} ${item.name} ×${available[iid]}<br>
      <small style="color:var(--dim)">${rec.label}</small>${sel > 0 ? ` [In use: ${sel}]` : ''}
    </button>`;
  }).join('');
}

function renderDayEnd() {
  state.mandatoryFood = null;
  state.selectedItems = [];
  const line = state._statHidden
    ? pickBondLine(SEBA_DAY_END_STAT_HIDDEN)
    : pickBondLine(SEBA_DAY_END);
  const isLast = state.day >= 10;

  const nextDayLabel = state.day === 7 ? 'To Midpoint Check' : `Next Day (DAY ${state.day + 1})`;
  const nextBtn = isLast
    ? `<button class="choice-btn primary" onclick="confirmDayEnd(true)">To Ending</button>`
    : `<button class="choice-btn primary" onclick="confirmDayEnd(false)">${nextDayLabel}</button>`;

  let html = `
    ${makeDayLabel(state.day, 'End of Day')}
    <div class="main-text">
      A quiet night has come. The day is finally over.
    </div>
    ${renderLines(line)}
    <div class="use-area">
      <div class="use-hint" style="color:#c07070;font-size:0.8rem;letter-spacing:0.1em">
        ◆ Hungry. You need to eat something.: HP -15 / MP -15
      </div>
      <div class="choices" id="day-food-choices" style="margin-top:8px">${buildFoodSection()}</div>
    </div>
    <div class="use-area">
      <div class="use-hint">You can use items for additional recovery.</div>
      <div class="choices" id="day-other-choices">${buildOptionalSection()}</div>
    </div>
    <div class="choices" style="margin-top:12px">${nextBtn}</div>
  `;
  setPanel(html);
}

function toggleMandatoryFood(id) {
  state.mandatoryFood = state.mandatoryFood === id ? null : id;
  // Trim selectedItems if mandatory took some units
  const avail = state.inventory.filter(i => i === id).length - (state.mandatoryFood === id ? 1 : 0);
  const sel = state.selectedItems.filter(i => i === id).length;
  if (sel > avail) {
    state.selectedItems = state.selectedItems.filter(i => i !== id);
    for (let i = 0; i < avail; i++) state.selectedItems.push(id);
  }
  document.getElementById('day-food-choices').innerHTML = buildFoodSection();
  const opt = document.getElementById('day-other-choices');
  if (opt) opt.innerHTML = buildOptionalSection();
}

function toggleDayItem(id) {
  const avail = state.inventory.filter(i => i === id).length - (state.mandatoryFood === id ? 1 : 0);
  const currentUsing = state.selectedItems.filter(i => i === id).length;
  state.selectedItems = state.selectedItems.filter(i => i !== id);
  if (currentUsing < avail) {
    for (let i = 0; i < currentUsing + 1; i++) state.selectedItems.push(id);
  }
  const container = document.getElementById('day-other-choices');
  if (container) container.innerHTML = buildOptionalSection();
}

function confirmDayEnd(isLast) {
  // Mandatory food consumption (no recovery)
  const foodConsumed = state.mandatoryFood !== null;
  const usedOptionals = [...state.selectedItems];
  const allConsumed = foodConsumed ? [...state.selectedItems, state.mandatoryFood] : [...state.selectedItems];
  if (foodConsumed) {
    const idx = state.inventory.indexOf(state.mandatoryFood);
    if (idx >= 0) state.inventory.splice(idx, 1);
  }

  // Optional consumption (all items including food have recovery)
  let hpItem = 0, mpItem = 0;
  for (const id of state.selectedItems) {
    hpItem += getRecovery(id).hp;
    mpItem += getRecovery(id).mp;
    const idx = state.inventory.indexOf(id);
    if (idx >= 0) state.inventory.splice(idx, 1);
  }

  if (!foodConsumed) {
    hpItem += FOOD_PENALTY.hp;
    mpItem += FOOD_PENALTY.mp;
    state.daysWithoutFood++;
  } else {
    state.daysWithoutFood = 0;
  }

  updateStats({ hp: hpItem, mp: mpItem });
  renderInventory();
  state.selectedItems = [];
  state.mandatoryFood = null;
  if (state.hp <= 0 || state.mp <= 0) { gameOver(); return; }

  // Conditional conversation trigger check
  const context = {
    chocolateEaten: allConsumed.includes('chocolate'),
    hpLow: state.hp <= 50,
    mpLow: state.mp <= 50,
    hpVeryLow: state.hp <= 30,
    mpVeryLow: state.mp <= 30,
    bothLow: state.hp <= 30 && state.mp <= 30,
    daysWithoutFood: state.daysWithoutFood,
  };
  const talk = findTriggerableTalk(context);
  const itemTalk = talk ? null : findItemUseTalk(usedOptionals);
  const activeTalk = talk || itemTalk;
  if (activeTalk) {
    state.triggeredTalks.push(activeTalk.id);
    if (talk) addBond(talk.bond != null ? talk.bond : (talk.trigger === 'chocolate_eaten' ? 2 : 1));
    else addBond(itemTalk.bond || 1);
    state.currentTalk = activeTalk;
    state.talkLineIndex = 0;
    state._talkIsLast = isLast;
    state.phase = 'day_talk';
    render();
  } else {
    if (isLast) showEnding();
    else nextDay();
  }
}

function findItemUseTalk(usedItems) {
  if (typeof ITEM_USE_TALKS === 'undefined' || !usedItems.length) return null;
  for (const talk of ITEM_USE_TALKS) {
    if (state.triggeredTalks.includes(talk.id)) continue;
    if (usedItems.some(id => id === talk.triggerItem || getCategory(id) === talk.triggerItem)) return talk;
  }
  return null;
}

function findTriggerableTalk(context) {
  if (typeof SEBA_TALKS === 'undefined') return null;
  for (const talk of SEBA_TALKS) {
    if (state.triggeredTalks.includes(talk.id)) continue;
    if (checkTalkTrigger(talk.trigger, context)) return talk;
  }
  return null;
}

function checkTalkTrigger(trigger, ctx) {
  if (trigger === 'chocolate_eaten')   return ctx.chocolateEaten;
  if (trigger === 'hp_low')            return ctx.hpLow;
  if (trigger === 'mp_low')            return ctx.mpLow;
  if (trigger === 'hp_very_low')       return ctx.hpVeryLow;
  if (trigger === 'mp_very_low')       return ctx.mpVeryLow;
  if (trigger === 'both_low')          return ctx.bothLow;
  if (trigger === 'no_food_2days')     return ctx.daysWithoutFood >= 2;
  return false;
}

function appendTalkBubble(line) {
  const log = document.getElementById('talk-log');
  const tmp = document.createElement('div');
  tmp.innerHTML = makeTalkBubble(line);
  log.appendChild(tmp.firstElementChild);
  scrollTalkLog();
}

function buildEventItemButtons() {
  const counts = {};
  for (const id of state.inventory) counts[id] = (counts[id] || 0) + 1;
  return sortItemIds(Object.keys(counts)).map(id => {
    const item = getItem(id);
    const sel = state.selectedItems.filter(i => i === id).length;
    return `<button class="choice-btn ${sel > 0 ? 'primary' : ''}" onclick="toggleItem('${id}')">
      ${item.emoji} ${item.name} ×${counts[id]}${sel > 0 ? ` [In use: ${sel}]` : ''}
    </button>`;
  }).join('') || '<div style="color:var(--dim);font-size:0.8rem">No items</div>';
}

function makeTalkBubble(line) {
  const speaker = line.speaker || 'seba';
  if (speaker === 'you') {
    return `<div class="talk-bubble talk-right">
      <div class="talk-speaker">YOU</div>
      <div class="talk-text">${line.text}</div>
    </div>`;
  }
  const face = line.face || 'normal';
  const char = CHARACTERS[speaker] || CHARACTERS.seba;
  const avatarSrc = `${char.avatarPrefix}${face}.png`;
  return `<div class="talk-bubble talk-left">
    <div class="talk-left-row">
      <div class="seba-avatar seba-avatar--sm"><img src="${avatarSrc}" alt="" onerror="this.style.display='none'"></div>
      <div>
        <div class="talk-speaker" style="color:${char.color}">${char.label}</div>
        <div class="talk-text" style="background:${char.bg}">${line.text}</div>
      </div>
    </div>
  </div>`;
}

function buildTalkRecoveryHtml(recovery) {
  if (!recovery) return '';
  const parts = [];
  if (recovery.hp) parts.push(`HP +${recovery.hp}`);
  if (recovery.mp) parts.push(`MP +${recovery.mp}`);
  if (!parts.length) return '';
  return `<div class="gain-bubble">${parts.join(' / ')}</div>`;
}

function renderDayTalk() {
  const talk = state.currentTalk;

  let messagesHtml = '';
  for (let i = 0; i <= state.talkLineIndex; i++) {
    messagesHtml += makeTalkBubble(talk.lines[i]);
  }

  const isLast = state.talkLineIndex >= talk.lines.length - 1;
  const nextLabel = state._talkIsLast ? 'To Ending' : `Next Day (DAY ${state.day + 1})`;

  const hasGain = isLast && !!buildTalkRecoveryHtml(talk.recovery);

  let html = `
    ${makeDayLabel(state.day, 'Eat')}
    <div class="phase-label talkTit">◆ ${talk.title || 'Conversation with Sebastian'}</div>
    <div class="talk-log" id="talk-log">${messagesHtml}</div>
    <hr class="divider">
    <div class="choices" id="talk-btn-area">
      ${!isLast
        ? `<button class="choice-btn primary" onclick="advanceTalk()">Continue</button>`
        : hasGain
          ? `<button class="choice-btn primary" onclick="showTalkGain()">Continue</button>`
          : `<button class="choice-btn primary" onclick="endTalk()">${nextLabel}</button>`
      }
    </div>
  `;
  setPanel(html);
  scrollTalkLog();
}

function advanceTalk() {
  state.talkLineIndex++;
  const talk = state.currentTalk;
  const line = talk.lines[state.talkLineIndex];
  const isLast = state.talkLineIndex >= talk.lines.length - 1;

  appendTalkBubble(line);

  if (isLast) {
    const gainHtml = buildTalkRecoveryHtml(talk.recovery);
    if (gainHtml) {
      document.getElementById('talk-btn-area').innerHTML =
        `<button class="choice-btn primary" onclick="showTalkGain()">Continue</button>`;
    } else {
      const nextLabel = state._talkIsLast ? 'To Ending' : `Next Day (DAY ${state.day + 1})`;
      document.getElementById('talk-btn-area').innerHTML =
        `<button class="choice-btn primary" onclick="endTalk()">${nextLabel}</button>`;
    }
  }

  scrollTalkLog();
}

function showTalkGain() {
  const talk = state.currentTalk;
  updateStats(talk.recovery);
  talk._recoveryApplied = true;
  renderStats();
  const nextLabel = state._talkIsLast ? 'To Ending' : `Next Day (DAY ${state.day + 1})`;
  document.getElementById('talk-log').insertAdjacentHTML('beforeend', buildTalkRecoveryHtml(talk.recovery));
  document.getElementById('talk-btn-area').innerHTML =
    `<button class="choice-btn primary" onclick="endTalk()">${nextLabel}</button>`;
  scrollTalkLog();
}

// ── Chat after event result (bond outcome etc.) ────────────────
function startOutcomeChat() {
  const ev = state.currentEvent;
  const outcome = state._lastRefuseOutcome;
  if (!outcome || !outcome.chatLines) return;
  state._outcomeChatIdx = 0;
  renderOutcomeChat();
}

function renderOutcomeChat() {
  const outcome = state._lastRefuseOutcome;
  const lines = outcome.chatLines;
  const idx = state._outcomeChatIdx;
  const isLast = idx >= lines.length - 1;

  let messagesHtml = '';
  for (let i = 0; i <= idx; i++) {
    messagesHtml += makeTalkBubble(lines[i]);
  }

  const btnHtml = isLast
    ? `<button class="choice-btn primary" onclick="endDay()">End the Day</button>`
    : `<button class="choice-btn primary" onclick="advanceOutcomeChat()">Continue</button>`;

  const html = `
    ${makeDayLabel(state.day, 'Event Result')}
    ${outcome.title ? `<div class="phase-label">◆ ${outcome.title}</div>` : ''}
    <div class="talk-log" id="talk-log">${messagesHtml}</div>
    <hr class="divider">
    <div class="choices" id="outcome-chat-btn">${btnHtml}</div>
  `;
  setPanel(html);
  scrollTalkLog();
}

function advanceOutcomeChat() {
  const outcome = state._lastRefuseOutcome;
  const lines = outcome.chatLines;
  state._outcomeChatIdx++;
  const isLast = state._outcomeChatIdx >= lines.length - 1;

  appendTalkBubble(lines[state._outcomeChatIdx]);

  if (isLast) {
    document.getElementById('outcome-chat-btn').innerHTML =
      `<button class="choice-btn primary" onclick="endDay()">End the Day</button>`;
  }
  scrollTalkLog();
}

function scrollTalkLog() {
  const log = document.getElementById('talk-log');
  if (log) log.scrollTop = log.scrollHeight;
}

function endTalk() {
  const talk = state.currentTalk;
  if (talk && talk.recovery && !talk._recoveryApplied) updateStats(talk.recovery);
  state.currentTalk = null;
  state.talkLineIndex = 0;
  if (state._talkIsLast) showEnding();
  else nextDay();
}

function nextDay() {
  state._extraExploreCount = 0;
  if (state._statHiddenDays > 0) {
    state._statHiddenDays--;
    if (state._statHiddenDays === 0) {
      state._statHidden = false;
      state._statJustRestored = true;
    }
  }
  if (state.day === 7) {
    state.phase = 'randal_check';
    state.day++;
    render();
    return;
  }
  state.day++;
  state.phase = 'explore';
  render();
}

function gameOver() {
  state.cycle++;
  state._gameOverCount++;
  state._statHidden = false;
  state._statHiddenDays = 0;
  state.phase = 'gameover';
  render();
}

function renderGameover() {
  const randalRetry = RANDAL_RETRY_LINES[Math.min(state._gameOverCount - 1, RANDAL_RETRY_LINES.length - 1)];
  let html = `
    <div class="ending-panel">
      <div class="ending-title bad">GAME OVER</div>
      <div class="ending-text">Consciousness fading. Is this really where it ends?</div>
      <div>
        ${charLine({ speaker: 'randal', text: randalRetry.text, face: randalRetry.face })}
      </div>
      <button class="choice-btn primary" onclick="initCycle()">
        Back to Day 1
      </button>
    </div>
  `;
  setPanel(html);
}

function getEndingTalkKey() {
  const b = state.bond;
  if (b >= 10) return 'bond10';
  if (b >= 8)  return 'bond8';
  if (b >= 6)  return 'bond6';
  if (b >= 1)  return 'bond2';
  return 'bond0';
}

function showEnding() {
  state.cycle++;
  state._hasSeenEnding = true;
  const b = state.bond;
  if (b >= 10)      state._endingType = 'perfect';
  else if (b >= 8)  state._endingType = 'good';
  else if (b >= 6)  state._endingType = 'normal';
  else if (b >= 1)  state._endingType = 'bad_bond';
  else              state._endingType = 'bad';

  state._endingTalkKey = getEndingTalkKey();
  state.currentTalk    = ENDING_TALKS[state._endingTalkKey];
  state.talkLineIndex  = 0;
  state.phase         = 'ending_talk';
  render();
}

function renderEndingTalk() {
  const bondKey = state._endingTalkKey;
  const titles = {
    bond10: 'ENDING A',
    bond8:  'ENDING B',
    bond6:  'ENDING C',
    bond2:  'ENDING D',
    bond0:  'END？？？',
  };
  const classes = {
    bond10: 'clear',
    bond8:  'clear',
    bond6:  'good',
    bond2:  'bad',
    bond0:  'bad',
  };
  const endClass = classes[bondKey];
  const titleText = titles[bondKey];

  const html = `
    <div class="ending-panel">
      <div class="ending-title ${endClass}" style="text-align:center;margin-bottom:20px">${titleText}</div>
      <div class="talk-log" id="talk-log"></div>
      <div id="talk-btn-area" class="choices">
        <button class="choice-btn primary" onclick="advanceEndingTalk()">Continue</button>
      </div>
    </div>
  `;
  setPanel(html);
  advanceEndingTalk();
}

function advanceEndingTalk() {
  const lines = state.currentTalk;
  const idx   = state.talkLineIndex;
  if (idx >= lines.length) return;

  appendTalkBubble(lines[idx]);
  state.talkLineIndex++;
  if (state.talkLineIndex >= lines.length) {
    if (state._endingTalkKey === 'bond0') {
      triggerBond0CloseEffect();
    } else {
      document.getElementById('talk-btn-area').innerHTML = `
        <button class="choice-btn primary" onclick="initCycle()">
          Back to Start
        </button>
      `;
    }
  }
}

function triggerBond0CloseEffect() {
  const btnArea = document.getElementById('talk-btn-area');
  if (btnArea) btnArea.innerHTML = '';

  // Fullscreen inoperable overlay
  const overlay = document.createElement('div');
  overlay.id = 'bond0-overlay';
  overlay.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100vw', 'height:100vh',
    'z-index:9999', 'pointer-events:all',
    'background:transparent',
  ].join(';');
  document.body.appendChild(overlay);

  // Canvas noise animation (opacity fades in over 1500ms)
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:absolute', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'opacity:0', 'mix-blend-mode:screen',
  ].join(';');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  overlay.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const DURATION    = 1500;
  const MAX_OPACITY = 0.22;
  const MAX_SHIFT   = 2;   // px
  const startTime   = performance.now();
  const gc          = document.getElementById('game-container');
  let animId;
  (function drawNoise(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / DURATION, 1);

    // Noise opacity: 0 → MAX_OPACITY
    canvas.style.opacity = t * MAX_OPACITY;

    // Glitch shift: 0 → MAX_SHIFT px, with per-frame random jitter
    const shift = t * MAX_SHIFT;
    const dx = (Math.random() * 2 - 1) * shift;
    const dy = (Math.random() * 2 - 1) * shift;
    const hue = t * 60 * (Math.random() > 0.5 ? 1 : -1);
    if (gc) gc.style.transform = `translate(${dx}px, ${dy}px)`;
    if (gc) gc.style.filter    = `hue-rotate(${hue}deg) brightness(${1 + t * 0.08})`;

    const img = ctx.createImageData(canvas.width, canvas.height);
    const d   = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 160;
    }
    ctx.putImageData(img, 0, 0);
    animId = requestAnimationFrame(drawNoise);
  })(startTime);

  // Close tab after 1500ms; fallback if browser blocks window.close()
  setTimeout(() => {
    cancelAnimationFrame(animId);
    if (gc) { gc.style.transform = ''; gc.style.filter = ''; }
    window.close();
    setTimeout(() => {
      document.body.innerHTML =
        '<div style="background:#000;color:#1a1a1a;width:100vw;height:100vh;' +
        'display:flex;align-items:center;justify-content:center;' +
        'font-family:monospace;font-size:0.75rem;letter-spacing:0.2em;">' +
        'CONNECTION TERMINATED</div>';
    }, 300);
  }, 1500);
}

// ============================================================
// PROLOGUE
// ============================================================

function renderPrologue() {
  const linesHtml = state.currentTalk.map(l => charLine(l)).join('');
  const html = `
    <div class="phase-label">◆ Prologue</div>
    ${linesHtml}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="endPrologue()">Begin Trial</button>
    </div>
  `;
  setPanel(html);
  const skipArea = document.getElementById('prologue-skip-area');
  if (skipArea) skipArea.style.display = 'block';
}

function endPrologue() {
  const skipArea = document.getElementById('prologue-skip-area');
  if (skipArea) skipArea.style.display = 'none';
  state.currentTalk = null;
  state.talkLineIndex = 0;
  startTutorial();
}

function skipPrologue() {
  const skipArea = document.getElementById('prologue-skip-area');
  if (skipArea) skipArea.style.display = 'none';
  state.currentTalk = null;
  state.talkLineIndex = 0;
  if (state.inventory.length === 0) state.inventory.push('apple');
  state.phase = 'explore';
  render();
}

// ============================================================
// KEY DOOR EVENT
// ============================================================

function renderKeyDoor() {
  const html = `
    ${makeDayLabel(state.day, 'Event')}
    <div class="main-text">There's a locked door at the end of the hallway.</div>
    ${renderLines(KEY_DOOR_EVENT.intro)}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn" onclick="openKeyDoor()">Open the Door</button>
      <button class="choice-btn" onclick="pickNormalEvent()">Leave it</button>
    </div>
  `;
  setPanel(html);
}

function openKeyDoor() {
  const outcomes = KEY_DOOR_EVENT.outcomes;
  const available = outcomes.filter(o => !state._usedKeyDoorIds.includes(o.id));
  if (!available.length) { pickNormalEvent(); return; }
  const outcome = available[Math.floor(Math.random() * available.length)];
  state._usedKeyDoorIds.push(outcome.id);

  const keyIdx = state.inventory.indexOf('old_key');
  if (keyIdx >= 0) state.inventory.splice(keyIdx, 1);
  renderInventory();

  if (outcome.recovery) {
    updateStats(outcome.recovery);
  }
  addBond(3);

  const gotItems = [];
  if (outcome.drops) {
    const range = outcome.dropCount;
    const count = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    for (let i = 0; i < count; i++) {
      const item = outcome.drops[Math.floor(Math.random() * outcome.drops.length)];
      gotItems.push(item);
      state.inventory.push(item);
    }
    renderInventory();
  }

  state._keyDoorOutcome = outcome;
  state._keyDoorGotItems = gotItems;
  state.phase = 'key_door_result';
  render();
}

function renderKeyDoorResult() {
  const outcome = state._keyDoorOutcome;

  let bonusHtml = '';

  if (state._keyDoorGotItems.length > 0) {
    const counts = {};
    for (const id of state._keyDoorGotItems) counts[id] = (counts[id] || 0) + 1;
    const itemListHtml = Object.entries(counts).map(([id, n]) => {
      const item = getItem(id);
      return `<span style="color:var(--accent)">${item.emoji} ${item.name} ×${n}</span>`;
    }).join(', ');
    bonusHtml = `<div class="gain-bubble">Obtained<br>${itemListHtml}</div>`;
  }

  const hasChatLines = outcome.chatLines && outcome.chatLines.length > 0;
  const nextBtn = hasChatLines
    ? `<button class="choice-btn primary" onclick="startKeyDoorChat()">Continue</button>`
    : `<button class="choice-btn primary" onclick="endDay()">Next Phase</button>`;

  const recoveryHtml = outcome.recoveryText
    ? `<div class="gain-bubble">${outcome.recoveryText}</div>`
    : '';

  const html = `
    ${makeDayLabel(state.day, 'Event Result')}
    <div class="main-text">${outcome.title}</div>
    ${renderLines(outcome.lines)}
    ${bonusHtml}
    ${recoveryHtml}
    <hr class="divider">
    <div class="choices">${nextBtn}</div>
  `;
  setPanel(html);
}

function startKeyDoorChat() {
  state.talkLineIndex = 0;
  state.phase = 'key_door_chat';
  render();
}

function renderKeyDoorChat() {
  const outcome = state._keyDoorOutcome;
  const lines = outcome.chatLines;
  const html = `
      ${makeDayLabel(state.day, 'Event Result')}
      ${outcome.chatTitle ? `<div class="phase-label talkTit">◆ ${outcome.chatTitle}</div>` : ''}
      <div class="talk-log" id="talk-log"></div>
      <div id="talk-btn-area" class="choices">
        <button class="choice-btn primary" onclick="advanceKeyDoorChat()">Continue</button>
      </div>
  `;
  setPanel(html);
  advanceKeyDoorChat();
}

function advanceKeyDoorChat() {
  const lines = state._keyDoorOutcome.chatLines;
  const idx = state.talkLineIndex;
  if (idx >= lines.length) return;

  appendTalkBubble(lines[idx]);
  state.talkLineIndex++;
  if (state.talkLineIndex >= lines.length) {
    document.getElementById('talk-btn-area').innerHTML = `
      <button class="choice-btn primary" onclick="endDay()">Next Phase</button>
    `;
  }
}


// ============================================================
// RANDAL MIDCHECK (DAY 7)
// ============================================================

function renderRandalCheck() {
  let variant;
  if (state.hp < 30 && state.mp < 30) variant = 'hp_mp_low';
  else if (state.bond >= 10)          variant = 'bond10';
  else if (state.bond >= 8)           variant = 'bond8';
  else if (state.bond >= 6)           variant = 'bond6';
  else if (state.bond >= 1)           variant = 'bondlow';
  else                                variant = 'bond0';

  const lines = RANDAL_MIDCHECK[variant];
  const linesHtml = lines.map(l => charLine(l)).join('');

  const html = `
    <div class="phase-label">◆ Midpoint Check — End of DAY 7</div>
    ${linesHtml}
    <hr class="divider">
    <div class="choices">
      <button class="choice-btn primary" onclick="endRandalCheck()">Next Day (DAY ${state.day})</button>
    </div>
  `;
  setPanel(html);
}

function endRandalCheck() {
  state._extraExploreCount = 0;
  state.phase = 'explore';
  render();
}

// ============================================================
// START
// ============================================================
initCycle();

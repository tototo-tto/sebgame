// ============================================================
// GAME DATA — Characters / Locations / Events / Dialogue
// ============================================================
//
// ■ Character definitions (CHARACTERS)
//   label        : display name on screen
//   color        : name text color
//   bg           : dialogue box background color
//   border       : dialogue box left border color
//   avatarPrefix : prefix for avatar image path
//                  → actual file is {avatarPrefix}{face}.png
//
// ■ How to write event dialogue
//   single : { speaker:'seba', text:'…', face:'normal' }
//   multiple: [ { speaker:'seba', … }, { speaker:'nyen', … } ]
//   ※ if speaker is omitted, defaults to 'seba'
//
// ■ Avoidance rate bonus settings
//   bonusGroups : specify bonuses per item in groups
//     { bonus: 0.30, items: ['apple', 'canned'] }  → +30%
//   defaultBonus: bonus for all items not in bonusGroups
//   ※ if not set, falls back to the item's eventBonus
//
// ■ Face list
//   'normal' / 'tense' / 'scared' / 'relieved' / 'tired'
//
// ============================================================

// ============================================================
// ITEM LIST — specific item definitions
// ============================================================
// category: 'food' / 'cloth' / 'junk' / 'book' / 'rare'
//   → same category items share recovery and event effects
//   → items marked critical achieve 100% on specific events
// ============================================================

// eventBonus : avoidance rate increase when used during event (0.0–1.0)
//   e.g.) 0.20 → Avoidance Rate +20%
//   items marked critical always reach 100% regardless of eventBonus

const ITEM_LIST = {
  // ── food ──────────────────────────────────
  bread:      { name: 'Bread',        emoji: '🍞', category: 'food',  eventBonus: 0.15, desc: 'A little stale.',  recovery: { hp: 10, mp:  0, label: 'HP +10' } },
  apple:      { name: 'Apple',        emoji: '🍎', category: 'food',  eventBonus: 0.15, desc: 'Fresh and crisp.',          recovery: { hp: 15, mp:  0, label: 'HP +15' } },
  pickle_jar: { name: 'Pickle Jar',   emoji: '🥒', category: 'food',  eventBonus: 0.20, desc: 'Edible. Could also be thrown to smash the glass.',              recovery: { hp: 8, mp:  8, label: 'HP +8 / MP +8' } },
  chocolate:  { name: 'Chocolate',    emoji: '🍫', category: 'food',  eventBonus: 0.15, desc: 'A small luxury.',        recovery: { hp: 12, mp: 12, label: 'HP +12 / MP +12' } },
  water:      { name: 'Water',        emoji: '💧', category: 'food',  eventBonus: 0.10, desc: 'Drinking water in a bottle.',          recovery: { hp:  0, mp: 15, label: 'MP +15' } },
  // ── cloth ─────────────────────────────────
  rag:        { name: 'Rag',          emoji: '🧣', category: 'cloth', eventBonus: 0.15, desc: 'A bit ratty, but could block someone\'s view.' },
  jacket:     { name: 'Jacket',       emoji: '🧥', category: 'cloth', eventBonus: 0.25, desc: 'A cool green jacket. Could protect you.' },
  // ── junk ──────────────────────────────────
  rope:       { name: 'Rope',         emoji: '🪢', category: 'junk',  eventBonus: 0.25, desc: 'Tie things up, pull things. Handy.' },
  candle:     { name: 'Candle',       emoji: '🕯️', category: 'junk',  eventBonus: 0.15, desc: 'Provides light. Might work as a threat too.', recovery: { hp:  0, mp: 15, label: 'MP +15' }},
  // ── book ──────────────────────────────────
  novel:      { name: 'Novel',        emoji: '📖', category: 'book',  eventBonus: 0.20, desc: 'Has a somewhat difficult title. Could be thrown, too.'},
  magazine:   { name: 'Magazine',     emoji: '📰', category: 'book',  eventBonus: 0.10, desc: 'Something to pass the time. Totally baffling content.' },
  // ── rare ──────────────────────────────────
  notebook:   { name: 'Cringe Notebook', emoji: '📓', category: 'rare',  eventBonus: 0.15, desc: 'Reading it might cause secondhand embarrassment.', unique: true ,recovery: { hp:  0, mp: 15, label: 'MP +15' }},
  cigarette:  { name: 'Cigarette',    emoji: '🚬', category: 'rare',  eventBonus: 0.15, desc: 'Someone\'s vice.' ,recovery: { hp:  5, mp: 5, label: 'HP +5 / MP +5' }},
  finger:     { name: 'Finger',       emoji: '👆', category: 'rare',  eventBonus: 0.25, desc: 'Wiggling around like it\'s trying to tell you something.', unique: true},
  old_key:    { name: 'Old Key',      emoji: '🗝️', category: 'rare',  eventBonus: 0.10, desc: 'Whose lock does this open? Something might happen if you carry it.', unique: true ,recovery: { hp:  5, mp: 5, label: 'HP +5 / MP +5' }},
};

const CHARACTERS = {
  seba: {
    label: 'SEBASTIAN',
    color: '#c4745a',
    bg: 'rgba(196,116,90,0.08)',
    border: '#c4745a',
    avatarPrefix: 'img/seba_',
  },
  randal: {
    label: 'RANDAL',
    color: '#f1b269',
    bg: 'rgba(181, 157, 84, 0.08)',
    border: '#f1b269',
    avatarPrefix: 'img/randal_',
  },
  nyen: {
    label: 'NYEN',
    color: '#9d5787',
    bg: 'rgba(144,128,184,0.08)',
    border: '#753b63',
    avatarPrefix: 'img/nyen_',
  },
    nyon: {
    label: 'NYON',
    color: '#80b3b8',
    bg: 'rgba(128, 172, 184, 0.08)',
    border: '#80b3b8',
    avatarPrefix: 'img/nyon_',
  },
  luther: {
    label: 'LUTHER',
    color: '#8090b0',
    bg: 'rgba(128,144,176,0.08)',
    border: '#8090b0',
    avatarPrefix: 'img/luther_',
  },
  rat: {
    label: 'RAT',
    color: '#6d6d6d',
    bg: 'rgba(148, 148, 148, 0.08)',
    border: '#6d6d6d',
    avatarPrefix: '',
  },
  robert: {
    label: 'ROBERT',
    color: '#5a8a72',
    bg: 'rgba(128, 176, 162, 0.08)',
    border: '#5a8a72',
    avatarPrefix: 'img/robert_',
  },
    nana: {
    label: 'NANA',
    color: '#d5b6d6',
    bg: 'rgba(164, 128, 176, 0.08)',
    border: '#d5b6d6',
    avatarPrefix: 'img/nana_',
  },
      kitty: {
    label: 'KITTY',
    color: '#e2cf90',
    bg: 'rgba(228, 217, 107, 0.08)',
    border: '#e2cf90',
    avatarPrefix: 'img/kitty_',
  },
  you: {
    label: 'YOU',
    color: '#909090',
    bg: 'rgba(179, 179, 179, 0.08)',
    border: '#909090',
    avatarPrefix: '',
  },
};

const LOCATIONS = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    desc: 'Can\'t survive without food.',
    dropCount: { min: 2, max: 4, weights: [0.30, 0.50, 0.20]  },
    drops: [
      { item: 'bread',     weight: 25 },
      { item: 'apple',     weight: 25 },
      { item: 'water',      weight: 20 },
      { item: 'pickle_jar', weight: 15 },
      { item: 'chocolate',  weight: 10 },
      { item: 'cigarette',  weight: 5  },
    ],
    linkedEvents: ['rats','nyen'],
  },
  {
    id: 'randal',
    name: 'Randal\'s Room',
    desc: 'A total mess. Books, magazines... all kinds of stuff.',
    dropCount: { min: 2, max: 4, weights: [0.35, 0.50, 0.15] },
    drops: [
      { item: 'novel',    weight: 25 },
      { item: 'magazine', weight: 25 },
      { item: 'rag',      weight: 20 },
      { item: 'jacket',     weight: 15 },
      { item: 'pickle_jar', weight: 10 },
      { item: 'notebook',   weight: 5 },
      { item: 'finger',    weight: 5  },
    ],
    linkedEvents: ['randal'],
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    desc: 'A jumbled mess of all kinds of things.',
    dropCount: { min: 2, max: 4, weights: [0.35, 0.50, 0.15] },
    drops: [
      { item: 'rope',       weight: 20 },
      { item: 'candle',     weight: 20 },
      { item: 'rag',       weight: 15 },
      { item: 'magazine', weight: 15 },
      { item: 'pickle_jar', weight: 15 },
      { item: 'water',      weight: 5 },
      { item: 'cigarette',  weight: 5 },
      { item: 'finger',    weight: 5  },
    ],
    linkedEvents: ['nana','nyon'],
  },
];

const EVENTS = [
  {
    id: 'ghost',
    name: 'Q',
    desc: 'At the end of the hallway stands a pale-faced man in a hat. He grins when he sees us, then drops to all fours and starts crawling out.<br>…He\'s coming fast.',
    effective: ['junk', 'rare'],
    bonusGroups: [
      { bonus: 0.30, items: ['rope', 'finger', 'pickle_jar'] },
      { bonus: 0.25, items: ['rag'] },
      { bonus: 0.20, items: ['water'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -25, mp: -15 },
    penaltyFail: { hp: -40, mp: -20 },
    sebaEvent:   { text: '"That thing" is bad news… it\'s going for the body.<br>H-hey, run!', face: 'scared'   },
    textSuccess: 'We sprinted to the end of the hallway. The moment we turned the corner, the man vanished.<br>Our legs are still shaking.',
    sebaSuccess: { text: '…hah. hah. Looks like we shook it off.', face: 'scared' },
    textFail:    'It caught us. For some reason our bodies are stinging.',
    sebaFail:    { text: 'Ugh, that\'s disgusting…!<br>Hey — you okay? Your body okay?', face: 'scared'},
  },
  {
    id: 'rats',
    name: 'Rats',
    desc: 'There appears to be a rat infestation.<br>The rat is pointing a blade at us, threatening.',
    effective: ['food', 'cloth'],
    bonusGroups: [
      { bonus: 0.30, items: ['apple', 'pickle_jar', 'water', 'chocolate', 'bread'] },
      { bonus: 0.20, items: ['rag', 'jacket'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -20, mp: -5 },
    penaltyFail: { hp: -40, mp: -15 },
    sebaEvent:[
              { speaker: 'rat',  text: 'Give us your food…!' },
              { speaker: 'seba',  text: 'Hey, we\'re… harmless, okay? C-calm down.', face: 'tense' },
              ],
    sebaSuccess: { text: 'Good. Looks like they let us off the hook.', face: 'relieved' },
    sebaFail:    { text: 'Damn, got stabbed. …You too? We\'re bleeding.<br>Let\'s lie low for today.', face: 'scared'    },
    textSuccess: 'Once they realized we meant no harm, the rats slowly turned and left.',
    textFail:    'The frightened rat lunged at us. We got stabbed with that sharp blade.',
  },
  {
    id: 'randal',
    name: 'Randal Wants to "Play"',
    desc: 'Randal pops up right in front of us.',
    effective: ['junk', 'book'],
    critical: ['notebook'],
    bonusGroups: [
      { bonus: 0.50, items: ['finger'] },
      { bonus: 0.25, items: ['novel', 'magazine'] },
      { bonus: 0.20, items: ['rope', 'pickle_jar', 'candle', 'old_key'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -15, mp: -20 },
    penaltyFail: { hp: -12, mp: -12 },
    sebaEvent:[
              { speaker: 'randal',  text: 'Hey, wanna play a game? I\'m bored.', face: 'serious' },
              { speaker: 'seba',  text: 'Listen, how does getting in our way help you…', face: 'tired' },
              ],
    textSuccessCritical: 'The moment we showed the notebook, Randal\'s face went bright red.',
    sebaSuccessCritical:[
              { speaker: 'randal',  text: 'Hey! Where did you even get that — that\'s awful!<br>I\'m done with you both!', face: 'shy' },
              { speaker: 'you',  text: 'Sorry…', face: 'normal' },
              { speaker: 'seba',  text: 'Damn, that\'s kind of sad…', face: 'tense' },
              ],
    textSuccess: 'Randal rapidly lost interest and left us alone.',
    sebaSuccess: [
              { speaker: 'randal',  text: 'Oh, hold on a sec?<br>Looks like something more interesting is happening elsewhere. See ya!', face: 'normal' },
              { speaker: 'seba',  text: 'We\'re safe, but… I don\'t feel great about it.', face: 'dumb' },
              ],
    textFail:    'We got dragged into some outrageous game.',
    sebaFail:[
              { speaker: 'randal',  text: 'Haha! That was so fun! I can\'t wait to officially adopt you♡<br>Right, Sebastian!', face: 'smile' },
              { speaker: 'seba',  text: 'Damn… no mercy at all.', face: 'tense' },
              ],
    sebaFailRetry: [
      [
        { speaker: 'randal', text: 'Heheh… I can\'t believe how fun the dismantling game got…!<br>Come on, let\'s go again.', face: 'smile' },
        { speaker: 'seba',   text: 'Please just let it go already…', face: 'dumb' },
      ],
      [
        { speaker: 'randal', text: 'Not yet — my Diddy hasn\'t lost. The next round is where it really counts.', face: 'normal_dk' },
        { speaker: 'you',   text: 'I\'m… so tired…',},
      ],
    ],
  },
  {
    id: 'hands',
    name: 'A Pile of "Wrists"',
    desc: 'In the corner of the room there\'s a huge pile of wrists stacked up.<br>The topmost one drops to the floor. One by one, then another…<br>Before we know it, the entire hallway is filled with them.',
    effective: ['cloth', 'junk'],
    bonusGroups: [
      { bonus: 0.40, items: ['finger'] },
      { bonus: 0.30, items: ['rag'] },
      { bonus: 0.20, items: ['magazine', 'novel','jacket', 'pickle_jar', 'water'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -5, mp: -30 },
    penaltyFail: { hp: -5, mp: -45 },
    sebaEvent:   { text: 'They\'re coming this way. Throw something to stop them — well, "hand" them? …whatever, just throw SOMETHING!',       face: 'scared' },
    sebaSuccess: { text: 'hah… we managed. I really hope we never have to see those again.', face: 'tired'  },
    sebaFail:    { text: 'Ugh… they crawled all over us. I feel sick…',   face: 'scared'  },
    textSuccess: 'We stopped them. Let\'s get out of here fast.',
    textFail:    'We couldn\'t move for a while.',
  },
  {
    id: 'blackdown',
    name: 'Sudden Darkness',
    desc: 'The lights went out all at once. Can\'t see anything…',
    effective: ['cloth', 'book'],
    critical: ['candle'],
    bonusGroups: [
      { bonus: 0.30, items: ['jacket', 'rag'] },
      { bonus: 0.25, items: ['cigarette','rope'] },
      { bonus: 0.15, items: ['water'] },
    ],
    defaultBonus: 0.10,
    bondOnCritical: 1,
    penalty: { hp: 0, mp: -25 },
    penaltyFail: { hp: 0, mp: -40 },
    sebaEvent:   { text: 'W-what\'s that sound…<br>Hey, are you close to me?',face: 'tense'  },
    textSuccessCritical: 'We lit the candle.',
    sebaSuccessCritical:[
              { speaker: 'seba',  text: 'Oh — sorry. We\'re pretty close.', face: 'shy' },
              ],
    textSuccess: 'Swinging things around, our eyes gradually adjusted.',
    sebaSuccess: { text: 'Good. Don\'t wander off.', face: 'normal' },
    textFail:    'Someone reached out from the darkness and touched my hand.',
    sebaFail:    { text: '…Hey, did you just touch me?<br>I-It\'s nothing, never mind…',face: 'scared'  },
  },
  {
    id: 'nyen',
    name: 'Nyen Gets in Our Way',
    setsFlag: 'nyen_met',
    baseProb: 0,
    desc: 'Nyen is blocking the path. He\'s staring at me like he might kill me right here.',
    effective: ['food', 'rare'],
    critical: ['cigarette'],
    bonusGroups: [
      { bonus: 0.25, items: ['finger', 'magazine', 'jacket'] },
      { bonus: 0.20, items: ['bread', 'apple', 'novel', 'chocolate', 'water'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -20, mp: -15 },
    penaltyFail: { hp: -45, mp: -20 },
    sebaEvent:[
              { speaker: 'nyen',  text: 'Hah? The hell are you.', face: 'normal' },
              { speaker: 'you',  text: '…A pet?'},
              { speaker: 'seba',  text: 'We\'re just, uh… haha.<br>We haven\'t done anything, right? Just let us through.', face: 'tense' },
              { speaker: 'nyen',  text: 'You two are carrying a lot of stuff.<br>Heh… hand it over and I might let you go.', face: 'normal' },
              ],
    textSuccess: 'Nyen left in a good mood.',
    sebaSuccess: { text: 'That guy is terrifying.', face: 'tense' },
    textSuccessCritical: 'When we held out a cigarette, Nyen snatched it up happily and lit it right away.',
    sebaSuccessCritical:[
              { speaker: 'nyen',  text: 'You\'re useful. Just ran out anyway.<br>…What? Get out of here.', face: 'smoke' },
              { speaker: 'seba',  text: 'Oh thank god…', face: 'tense' },
              { speaker: 'you',  text: 'Maybe he\'s not actually that scary?'},
              { speaker: 'seba',  text: 'He is.', face: 'dumb' },
              ],
    textFail:    'We each got hit. Obviously.',
    sebaFail:    { text: 'Ow… he didn\'t have to punch us, come on.', face: 'scared'   },
  },
  {
    id: 'nyon',
    name: 'Nyon Approaches',
    setsFlag: 'nyon_met',
    setFlagOnGiveOnly: true,
    blockIfItem: 'old_key',
    eventType: 'choice',              // choice-type event
    giveLabel:   'Give something',    // label for give button
    refuseLabel: 'Give nothing',      // label for refuse button
    desc: 'Nyon is suddenly standing behind us.',
    critical: ['pickle_jar'],              // giving this item triggers critical effect
    criticalRecovery: { hp: 0, mp: 0 }, // recovery amount on critical
    criticalGiveItem: 'old_key',
    penaltyFail: { hp: -5, mp: -5 },      // penalty for refusing
    sebaEvent:[
              { speaker: 'nyon',  text: '…Excuse me.', face: 'normal' },
              { speaker: 'you',  text: 'Oh! You startled me.' },
              { speaker: 'seba',  text: 'Uh… what is it?', face: 'tense' },
              { speaker: 'nyon',  text: 'Please give me something.<br>Anything is fine.', face: 'normal' },
              ],
    textSuccess: 'Nyon left looking happy.',
    sebaSuccess:[
              { speaker: 'you',  text: 'Is he… a nice person?' },
              { text: 'Beats me…', face: 'tense' },
              ],
    textSuccessCritical: 'When we held out the pickle jar, Nyon happily received it with both hands.',
    sebaSuccessCritical:[
              { speaker: 'nyon',  text: '!', face: 'normal' },
              { speaker: 'nyon',  text: 'In return, please take this…', face: 'normal' },
              { speaker: 'seba',  text: '…A key?', face: 'normal' },
              ],
    textFail:    'Nyon left looking sad.',
    sebaFail:    { text: '…Can\'t be helped, right?', face: 'normal'   },
  },
  {
    id: 'sebastian',
    name: 'Sebastian Disappeared',
    desc: 'I suddenly realize Sebastian isn\'t beside me. The hallway ahead is dark and silent.<br>…I\'m starting to get scared.',
    effective: ['junk', 'rare'],
    bonusGroups: [
      { bonus: 0.40, items: ['finger'] },
      { bonus: 0.30, items: ['jacket', 'candle','novel'] },
      { bonus: 0.20, items: ['old_key'] },
    ],
    defaultBonus: 0.10,
    bondAlways: 1,
    penalty: { hp: -20, mp: -30 },
    penaltyFail: { hp: -15, mp: -40 },
    textSuccess: 'After searching for a while we finally found Sebastian.<br>I felt tears prick my eyes from sheer relief.',
    sebaSuccess: [
      { speaker: 'seba', text: 'Thank god. I thought we\'d lost each other.', face: 'relieved' },
      { speaker: 'seba', text: 'Ah… sorry. Made you worry.', face: 'shy' },
    ],
    textSuccessRope: '…I feel the rope tied to my body being pulled.',
    sebaSuccessRope: [
      { speaker: 'seba', text: 'Oh… it actually worked. Glad we tied the rope.', face: 'tense' },
    ],
    textFail: 'Walking through the dark hallway, I froze up from fear.',
    sebaFail: [
      { speaker: 'seba', text: 'There you are. The floor started moving on me…', face: 'normal' },
      { speaker: 'seba', text: 'You\'re shaking. Sorry for leaving you alone.', face: 'dumb' },
    ],
  },
  {
    id: 'broken_floor',
    name: 'Broken Floor',
    desc: 'A large section of the hallway floor has collapsed.\nIt\'s too dark to see the bottom. We\'ll have to cross carefully.',
    effective: ['junk', 'cloth'],
    critical: ['rope'],
    bondOnCritical: 1,
    bonusGroups: [
      { bonus: 0.30, items: ['jacket','candle'] },
      { bonus: 0.20, items: ['rag'] },
    ],
    defaultBonus: 0.10,
    penalty: { hp: -20, mp: -10 },
    penaltyFail: { hp: -40, mp: -10 },
    sebaEvent: { text: 'The floor… I don\'t know what happens if we fall. Careful.', face: 'tense' },
    textSuccessCritical: 'We hooked the rope to a beam and crossed together.',
    sebaSuccessCritical: [
      { speaker: 'seba', text: 'Here, reach out… okay. We made it.', face: 'tense' },
      { speaker: 'seba', text: 'Good thing we had that rope.', face: 'relieved' },
    ],
    textSuccess: 'We carefully made it across along the edge.',
    sebaSuccess: { text: '…We crossed. That was close.', face: 'relieved' },
    textFail: 'We slipped. Didn\'t fall all the way, but we slammed into the edge of the floor.',
    sebaFail: { text: 'Are you okay?! Hold on — I\'ll pull you up…', face: 'scared' },
  },
    {
    id: 'kitty',
    name: 'Kitty Appears!',
    desc: 'I suddenly notice a tail that shot out of the carpet is rubbing against my leg.',
    effective: ['food'],
    bonusGroups: [
      { bonus: 0.40, items: ['bread', 'apple', 'water', 'pickle_jar'] },
      { bonus: 0.30, items: ['rag'] },
    ],
    baseProb: 0,
    defaultBonus: 0.10,
    penalty: { hp: -20, mp: -10 },
    penaltyFail: { hp: -10, mp: -10 },
    recoverySuccess: { hp: 10, mp: 10 },
    loseItemOnFail: 1,
    failEmptyGiveItem: 'old_key',
    sebaEvent: [
      { speaker: 'kitty',  text: 'prrrrr!' , face: 'tail' },
      { speaker: 'you',  text: 'Oh, it\'s a tail.' },
      { speaker: 'kitty',  text: 'Hey hey! I\'m starving over here.<br>Do you have any food~?' , face: 'normal' },
    ],
    textSuccess: 'Kitty gave us a big hug!',
    sebaSuccess: [
      { speaker: 'kitty',  text: 'Thanks~! Good luck out there!' , face: 'smile' },
      { speaker: 'you',  text: 'Oh… so soft.' },
    ],
    textFail: 'Kitty swiped our bag!',
    sebaFail: [
      { speaker: 'kitty',  text: 'Gotcha! Don\'t let your guard down♡ See ya~!' , face: 'normal' },
      { speaker: 'you',  text: 'Oh no, that\'s not fair…' },
      { speaker: 'seba',  text: 'That\'s just… how cats are.', face: 'dumb' },
    ],
    textFailEmpty: 'Kitty dug through our bag and then put her ears down apologetically.',
    sebaFailEmpty: [
      { speaker: 'kitty',  text: 'Huh? It\'s empty. Did you give me everything?<br>…Here, take this then.', face: 'normal' },
      { speaker: 'you',  text: 'Oh, thank you.<br>…Can I pet you?' },
      { speaker: 'kitty',  text: 'Sure!' , face: 'smile' },
    ],
  },
];

// ============================================================
// Choice-type events
// ============================================================

EVENTS.push(
  {
    id: 'wall_mouth',
    name: 'A Mouth in the Wall',
    setsFlag: 'wall_mouth_met',
    eventType: 'choice',
    giveLabel: 'Give it something',
    refuseLabel: 'Ignore it and push through',
    desc: 'A huge mouth has opened in the wall.<br>A large tongue is blocking the path — there\'s no way through.',
    criticalRecovery: { hp: 5, mp: 10 },
    penaltyFail: { hp: -20, mp: -20 },
    sebaEvent: { text: 'I\'ve been swallowed before — it just takes you to a different room. Still, not great.', face: 'dumb' },
    giveSuccessRate: 0.30,
    textGiveNotSatisfied: 'Whatever we placed on the tongue was swallowed instantly. But the tongue reaches out again.',
    sebaGiveNotSatisfied: { text: 'It\'s still not satisfied… anything else we can give it?', face: 'tense' },
    textSuccess: 'The mouth quietly swallowed what we offered and went still.',
    sebaSuccess: { text: '…Now\'s our chance? Let\'s get across fast.', face: 'relieved' },
    refuseOutcomes: [
      {
        weight: 20,
        type: 'damage',
        text: 'The moment we tried to push through, the tongue wrapped around us and bit down.',
        sebaText: { text: 'Ugh… the worst…', face: 'scared' },
      },
      {
        weight: 20,
        type: 'itemLoss',
        lossCount: 3,
        text: 'When we leapt over the tongue, some stuff fell out of our bag.<br>The tongue is undulating, licking it all up.',
        sebaText: { text: 'Oh no, our stuff…! Well — can\'t help it. Let\'s move.', face: 'tense' },
      },
      {
        weight: 10,
        type: 'rareItemGain',
        text: 'The mouth spat something out and went quiet.',
        sebaText: { text: 'Something came out. A bit slimy, but… grab it?', face: 'tense' },
      },
      {
        weight: 20,
        type: 'bond',
        bondGain: 3,
        text: 'The moment we tried to cross, the tongue coiled around us. Might swallow us whole.',
        sebaText: [
          { speaker: 'seba', text: 'This is bad — give me your hand…!?', face: 'tense' },
          { speaker: 'you',  text: 'Whoa…!' },
        ],
        title: 'That was awkward',
        chatLines: [
          { speaker: 'you',  text: '……' },
          { speaker: 'seba', text: '……', face: 'dumb' },
          { speaker: 'seba', text: 'I mean… I didn\'t expect that either…', face: 'dumb' },
          { speaker: 'you',  text: 'Well, at least we\'re both okay… right' },
          { speaker: 'seba', text: 'Yeah uh…', face: 'dumb' },
          { speaker: 'you',  text: '……' },
          { speaker: 'seba', text: '……', face: 'dumb' },
          { speaker: 'seba', text: '…sorry', face: 'shy' },
        ],
      },
      {
        weight: 20,
        type: 'nothing',
        text: 'We ignored it and jumped over the tongue. Nothing happened.',
        sebaText: { text: '…Lucky. Let\'s get moving.', face: 'relieved' },
      },
    ],
  },
    {
    id: 'nana',
    name: 'Nana Blocks the Way',
    eventType: 'three_way',
    desc: 'A woman is standing in the hallway. Except her body coils like a snake.<br>The human part of her turns toward us, eyes fixing on me with a sharp stare.',
    sebaEvent: [
      { speaker: 'nana',  text: 'My, my… what a tasty-looking thing. You want to pass through?<br>Fine. What will you offer me?', face: 'normal' },
    ],
    choices: [
      {
        id: 'hp',
        label: 'Sacrifice HP',
        bond: 1,
        effect: { hp: -30 },
        text: 'Nana\'s fangs slowly pierced my neck. She\'s drinking my blood.',
        sebaLines: [
          { speaker: 'you',  text: '…!' },
          { speaker: 'nana', text: 'Mmm… delicious. Do let me have another taste sometime.<br>Now go ahead, little candy.', face: 'normal' },
          { speaker: 'seba', text: 'You okay…? That had to drain you.<br>Sorry it\'s just my glove, but… let me stop the bleeding.', face: 'scared' },
        ],
      },
      {
        id: 'mp',
        label: 'Sacrifice MP',
        bond: 1,
        effect: { mp: -30 },
        text: 'Nana\'s tail constricted around me. The breath is being squeezed from my lungs.',
        sebaLines: [
          { speaker: 'nana', text: 'Your moaning is… a little intoxicating. Don\'t you think?', face: 'normal' },
          { speaker: 'seba', text: '…You\'re the only ones with tastes like that.', face: 'scared' },
          { speaker: 'you',  text: 'My head feels so hazy…' },
          { speaker: 'nana', text: 'That was a fine sound. You may pass.', face: 'normal' },
        ],
      },
      {
        id: 'items',
        label: 'Sacrifice Items',
        effect: { items: 5 },
        text: 'Nana swallowed a large amount of items with her big mouth.',
        sebaLines: [
          { speaker: 'nana', text: 'It all belonged to Mr. RUU anyway. I\'ll return it.<br>Go on.', face: 'normal' },
          { speaker: 'seba', text: 'hah… gotta collect it all again.', face: 'dumb' },
        ],
      },
    ],
  },
  {
    id: 'luther',
    name: 'Crossing Paths with Luther',
    setsFlag: 'luther_pass_met',
    minDay: 3,
    eventType: 'choice',
    demandMostHeldItem: true,
    blockIfItem: 'old_key',
    giveLabel: 'Hand it over',
    refuseLabel: 'Refuse',
    desc: 'Luther is walking down the hallway. His heavy gaze settles on me as if taking stock of me.',
    penaltyFail: { hp: -20, mp: -20 },
    sebaEvent: [
      { speaker: 'luther', text: 'Ah, it\'s you. The one Randal rescued.<br>My apologies for not greeting you sooner — things have been a bit hectic. My goodness.', face: 'normal' },
      { speaker: 'luther', text: 'Hmm… less is more, they say. I hate to ask, but might I have that?', face: 'normal' },
      { speaker: 'seba', text: '…If you say no, he literally tinkers with your body.', face: 'scared' },
    ],
    critical: ['water'],
    criticalGiveItem: 'old_key',
    textSuccessCritical: 'When we handed over the water, Luther pressed a hand to his forehead like he\'d made a mistake.',
    sebaSuccessCritical: [
      { speaker: 'luther', text: 'Oh dear — I didn\'t expect to take the very water a human needs most.', face: 'angry' },
      { speaker: 'luther', text: 'That can\'t stand. Here — let me give you this♡', face: 'smile' },
      { speaker: 'seba',   text: 'Traded water for a key…? What even is this house.', face: 'dumb' },
    ],
    textSuccess: 'Luther took everything quietly and walked away.',
    sebaSuccess: [
      { speaker: 'luther', text: 'Good girl♡ I\'m so glad you\'re a cooperative one♡', face: 'smile' },
      { speaker: 'you', text: 'Y-yes'},
      { speaker: 'seba', text: '…Why does he always have to interfere. This house…', face: 'dumb' },
    ],
    textFail: 'The eyes on Luther\'s cheeks open. Before I know it, his fingers are inside my head.',
    sebaFail: [
      { speaker: 'luther', text: 'Having a strong will isn\'t a bad thing. But a certain level of order is necessary.<br>…You understand. Don\'t you?', face: 'angry' },
      { speaker: 'seba', text: 'What the — what are you doing?!', face: 'tense' },
      { speaker: 'luther', text: 'I simply gave you a small lesson.', face: 'angry' },
      { speaker: 'you', text: 'My head is spinning…'},
    ],
  }
);

// ============================================================
// CHAIN EVENTS — events that only trigger after a flag is set
// ============================================================
// requiresFlag : becomes a candidate for pickNormalEvent when this flag is true
// setsFlag     : flag to set after triggering
// id is logged in triggeredEvents to prevent re-triggering
// ============================================================

const CHAIN_EVENTS = [
  {
    id: 'nyen_again',
    name: 'Nyen Again',
    requiresFlag: 'nyen_met',
    setsFlag: 'nyen_again_met',
    blockIfItem: 'old_key',
    eventType: 'choice',
    giveLabel: 'Pay the toll',
    refuseLabel: 'Push through anyway',
    desc: 'Nyen shoves us from behind out of nowhere.',
    critical: ['cigarette'],
    criticalRecovery: { hp: 10, mp: 10 },
    criticalGiveItem: 'old_key',
    penaltyFail: { hp: -20, mp: -20 },
    sebaEvent: [
      { speaker: 'nyen', text: 'Hah. You two again. So — you know what this means, right?', face: 'normal' },
      { speaker: 'seba', text: 'We really don\'t… do we just have to hand something over?', face: 'tense' },
    ],
    textSuccess: 'Nyen grinned and stepped aside.',
    sebaSuccess: { text: 'Huh? Just that? That\'s it?<br>…Is he being weirdly easy on you or something?', face: 'tense' },
    textSuccessCritical: 'When we held out a cigarette, Nyen narrowed his eyes and smiled.',
    sebaSuccessCritical: [
      { speaker: 'nyen', text: 'Move it, slowpokes.', face: 'smoke' },
      { speaker: 'seba', text: 'He kicked us, damn it…', face: 'tense' },
      { speaker: 'nyen', text: 'Here. Take this.', face: 'smoke' },
      { speaker: 'seba', text: 'What? A key…?', face: 'tense' },
    ],
    textFail: 'We tried to push through, but Nyen\'s fist was faster.',
    sebaFail: { text: 'That wasn\'t brave — that was reckless…!', face: 'dumb' },
  },
  {
    id: 'nyon_again',
    name: 'Nyon Again',
    requiresFlag: 'nyon_met',
    setsFlag: 'nyon_again_met',
    eventType: 'choice',
    giveLabel: 'Give something',
    refuseLabel: 'Give nothing',
    desc: 'Nyon is standing in the hallway. When he notices us, he calls out.',
    critical: ['pickle_jar'],
    criticalPenalty: { hp: 0, mp: -25 },
    criticalStatHiddenDays: 2,
    penaltyFail: { hp: 0, mp: 0 },
    sebaEvent: [
      { speaker: 'nyon', text: '……Привет', face: 'normal' },
      { speaker: 'you',  text: 'H-hi…?' },
      { speaker: 'nyon', text: '……Please give me something. Anything is fine.', face: 'normal' },
      { speaker: 'seba', text: 'Is someone telling him to say that?', face: 'dumb' },
    ],
    textSuccess: 'Nyon\'s ears moved happily as he left.',
    sebaSuccess: { text: 'Is this seriously all it takes…?', face: 'dumb' },
    textSuccessCritical: 'When we gave him the pickles, Nyon cried out with joy.',
    sebaSuccessCritical: [
      { speaker: 'nyon', text: 'Ура！', face: 'normal' },
      { speaker: 'nyon', text: 'I\'m so happy. And here, please take this…', face: 'drug' },
      { speaker: 'seba', text: 'Wait, is that — drugs?! Hey, don\'t inhale that!', face: 'tense' },
    ],
    textFail: 'Nyon hung his head sadly and walked away.',
    sebaFail: { text: '…Why do I feel guilty about that.', face: 'dumb' },
  },
];

// ============================================================
// PROLOGUE — Randal's introduction at the start of the game
// ============================================================

const PROLOGUE_LINES = [
  { speaker: 'randal', text: 'Good morning! Best wake-up ever, right?', face: 'normal' },
  { speaker: 'you',   text: '…Where… am I?' },
  { speaker: 'randal', text: 'My house. The space is a little twisted right now, but only a little.', face: 'normal' },
  { speaker: 'seba',  text: 'What the — did you kidnap another person?', face: 'tense' },
  { speaker: 'randal', text: '"Another"? I went through the "proper" steps this time.<br>Just like I did with Sebastian.', face: 'dumb' },
  { speaker: 'seba',  text: '…I feel sorry for you.', face: 'tired' },
  { speaker: 'randal', text: 'But see, in order to adopt you as a pet, my brother set a condition for me.', face: 'normal' },
  { speaker: 'you',   text: 'A condition?' },
  { speaker: 'randal', text: 'A trial period to check compatibility with Sebastian, he said.', face: 'dumb' },
  { speaker: 'seba',  text: 'Wait, I\'m involved in what? Please don\'t drag me into this.', face: 'tense' },
  { speaker: 'seba',  text: '(…Wait. If I refuse, does that mean this new person gets to go home?)', face: 'normal' },
  { speaker: 'randal', text: 'No. You have to do this properly.<br>Otherwise, this one gets sent back to the processing center.', face: 'serious' },
  { speaker: 'you',   text: 'That\'s where I came from…?' },
  { speaker: 'seba',  text: 'Damn it… this is awful. If you\'re going to keep a pet, do it on your own.', face: 'dumb' },
  { speaker: 'you',   text: 'What does compatibility mean exactly?' },
  { speaker: 'randal', text: 'Just survive in this house for 10 days. Both of you together.<br>The house is a little messed up right now, but you two will probably be fine. Probably.', face: 'normal' },
  { speaker: 'you',   text: 'What if we fail?' },
  { speaker: 'randal', text: 'Failure isn\'t an option! I\'ll walk you through exactly what to do right now♡<br>Come on — the trial begins.', face: 'smile' },
];

// ============================================================
// RETRY — Dialogue on retry
// ============================================================

const RANDAL_RETRY_LINES = [
  { text: 'It\'s okay, it\'s okay — try again from the start!<br>The key is to use items aggressively and keep your stats as high as you can!', face: 'normal' },
  { text: 'Did you fail again? Fine — try once more.<br>"Failure isn\'t an option." So.', face: 'serious' },
  { text: '…You\'re still not giving up. Good for you♡ Thank you for trying so hard♡<br>Have you seen an ending yet? I\'ll tell you something good later.<br>Or do you already know?', face: 'smile' },
];


// ============================================================
// TUTORIAL EVENT — the trial event in the tutorial
// ============================================================

const TUTORIAL_EVENT = {
  id: 'tutorial',
  desc: 'At the end of the hallway stands a strangely shaped doll.\nIt feels like it\'s staring at us, and there\'s something unsettling about it.',
  penaltyFail: { hp: -10, mp: -10 },
  noCap: false,
  defaultBonus: 0.20,
  sebaEvent: { text: 'Why not just try everything you\'ve got?', face: 'normal' },
  textSuccess: 'We threw everything at it, and the doll crumbled apart.',
  textFail:    'A knife shot out of the doll\'s belly.<br>It grazed my cheek and stuck in the wall.',
  sebaFail:    { text: 'What the —?! Hey — you okay?!', face: 'tense' },
};

// ============================================================
// KEY DOOR EVENT — special event triggered when holding the old key
// ============================================================

const KEY_DOOR_EVENT = {
  intro: [
    { speaker: 'seba', text: 'This door is locked.', face: 'normal' },
    { speaker: 'you',  text: 'That key we got earlier… I wonder if it works.' },
    { speaker: 'seba', text: 'Looks like it might.', face: 'normal' },
  ],
  outcomes: [
    {
      id: 'break_room',
      title: 'It looks like a lounge. A fire is burning in the fireplace.<br>Incredibly warm.',
      lines: [
        { speaker: 'seba', text: 'Nicer room than I expected. And warm.', face: 'relieved' },
        { speaker: 'you',  text: 'There\'s even a sofa…! Hey, can we rest here for a little while?' },
        { speaker: 'seba', text: 'Sure. Seems safe enough here… rest as long as you need.', face: 'relieved' },
        { speaker: 'you',  text: '…Sebastian, aren\'t you going to sit down?' },
        { speaker: 'seba', text: 'Huh? Oh, I mean… is it okay if I sit next to you?', face: 'normal' },
        { speaker: 'you',  text: 'Of course. No problem at all.' },
      ],
      chatTitle: 'By the Fireplace',
      chatLines: [
        { speaker: 'you',  text: 'Hey… Sebastian.' },
        { speaker: 'seba', text: 'Y-yeah.', face: 'shy' },
        { speaker: 'you',  text: 'I wonder what\'s going to happen to me.' },
        { speaker: 'seba', text: 'I don\'t know either.', face: 'normal' },
        { speaker: 'you',  text: 'Sebastian… don\'t you want to go home?' },
        { speaker: 'seba', text: '…………', face: 'tired' },
        { speaker: 'you',  text: 'Sorry — forget it.' },
        { speaker: 'seba', text: '…At least having you here keeps my mind off it. I\'ve been alone until now.', face: 'normal' },
        { speaker: 'you',  text: 'Is that so… then maybe it\'s good I\'m here.' },
        { speaker: 'seba', text: 'Ha. Don\'t say that. Nothing good about it.', face: 'relieved' },
        { speaker: 'you',  text: 'Not being alone is a good thing.' },
        { speaker: 'seba', text: '…Maybe.', face: 'shy' },
      ],
      recovery: { hp: 20, mp: 20 },
      recoveryText: 'HP +20 / MP +20',
    },
    {
      id: 'cafeteria',
      title: 'A wide cafeteria-like space opens up before us.<br>The tables are covered in all kinds of food.',
      lines: [
        { speaker: 'seba', text: 'Oh, there\'s food!', face: 'relieved' },
        { speaker: 'you',  text: 'Wow, can we take some of this with us?' },
        { speaker: 'seba', text: 'Eat some now while you\'re at it.', face: 'relieved' },
        { speaker: 'you',  text: 'Okay!' },
      ],
      chatTitle: 'What\'s Your Favorite Food?',
      chatLines: [
        { speaker: 'you',  text: 'Hey Sebastian — what\'s your favorite food?' },
        { speaker: 'seba', text: 'Where did that come from…', face: 'normal' },
        { speaker: 'you',  text: 'Just making conversation.' },
        { speaker: 'seba', text: '…Anything that tastes like cheese.', face: 'shy' },
        { speaker: 'you',  text: 'How come you look embarrassed?' },
        { speaker: 'seba', text: 'Because it sounds childish.', face: 'shy' },
        { speaker: 'you',  text: 'I don\'t think so. I like pizza.' },
        { speaker: 'seba', text: 'Mmm… pizza…', face: 'dumb' },
        { speaker: 'you',  text: 'Hmm, you\'re making a complicated face.' },
      ],
      drops: ['bread', 'apple', 'pickle_jar', 'water'],
      dropCount: { min: 3, max: 4 },
      recovery: { hp: 5, mp: 5 },
      recoveryText: 'HP +5 / MP +5',
    },
    {
      id: 'rat_room',
      title: 'A dark room. Feels like being inside an exhaust duct.',
      lines: [
        { speaker: 'seba', text: '…A rat!', face: 'tense' },
        { speaker: 'robert',  text: 'Who are you two.', face: 'normal'},
        { speaker: 'seba', text: 'Uh, we\'re not enemies or anything…', face: 'tense' },
        { speaker: 'robert',  text: '…Hmph. Watch out for the other rats. They\'re not organized.',face: 'normal' },
        { speaker: 'you',  text: 'Can we rest here for a while?' },
        { speaker: 'robert',  text: 'Do as you like.' ,face: 'normal'},
      ],
      chatTitle: 'How Human Is Human?',
      chatLines: [
        { speaker: 'you',  text: 'Cat-people, rat-people… all kinds of creatures live in this house.' },
        { speaker: 'seba', text: '…Yeah.', face: 'normal' },
        { speaker: 'you',  text: 'Sebastian — are you human?' },
        { speaker: 'seba', text: 'I\'m human.<br>…Obviously.', face: 'serious' },
        { speaker: 'you',  text: 'Sorry — that was a weird thing to ask.' },
        { speaker: 'seba', text: '……', face: 'serious' },
        { speaker: 'you',  text: 'To stay human in a place like this… that means…' },
        { speaker: 'you',  text: 'So… I think Sebastian is incredible for that.' },
        { speaker: 'seba', text: '……', face: 'tired' },
        { speaker: 'you',  text: 'Ow. You flicked me.' },
        { speaker: 'seba', text: 'You\'re bad at this. The whole comfort thing.', face: 'tired' },
      ],
      recovery: { hp: 10, mp: 20 },
      recoveryText: 'HP +10 / MP +20',
    },
  ],
};

// ============================================================
// DAY 1 Randal line (after ending seen, CYCLE 3+)
// ============================================================
const RANDAL_DAY1_DEBUG_LINE = { speaker: 'randal', text: 'Hey, thank you for playing so much. Try tapping that apple I gave you about 10 times.', face: 'smile' };


// ============================================================
// RANDAL MIDCHECK — Randal mid-check at end of DAY 7
// ============================================================

const RANDAL_MIDCHECK = {
  hp_mp_low: [
    { speaker: 'randal', text: '…Hey, are you okay? You look kind of rough.', face: 'normal' },
    { speaker: 'you',    text: 'Randal…' },
    { speaker: 'randal', text: 'Don\'t give up yet, okay? I really, really want you as my pet. I can\'t have you dying on me~.', face: 'dumb' },
    { speaker: 'seba',   text: '…Then help us out. Seriously.', face: 'tired' },
    { speaker: 'randal', text: 'Heh… you\'ve got 3 more days. Do your best!', face: 'smile' },
  ],
  bond10: [
    { speaker: 'randal', text: 'Oh? That\'s pretty fast… you\'re already close, huh.', face: 'normal' },
    { speaker: 'seba',   text: '…It\'s not like that.', face: 'shy' },
    { speaker: 'randal', text: 'Really? You\'re so much more comfortable with each other than day one. Enough that even my brother might be convinced…', face: 'normal' },
    { speaker: 'seba',   text: 'Please stop.', face: 'dumb' },
    { speaker: 'randal', text: 'Stay alive 3 more days and you\'re my pet♡', face: 'smile' },
    { speaker: 'you',    text: 'I… I\'ll do my best.' },
  ],
  bond8: [
    { speaker: 'randal', text: 'Hey, how are you doing? Hmm… you\'re getting along better, aren\'t you.', face: 'normal' },
    { speaker: 'you',    text: 'I guess… maybe?' },
    { speaker: 'randal', text: 'Good! The best pets are the ones who get along.', face: 'smile' },
    { speaker: 'seba',   text: '…Ugh. Who\'s a pet…', face: 'tired' },
    { speaker: 'randal', text: '3 more days — don\'t die♡', face: 'normal' },
  ],
  bond6: [
    { speaker: 'randal', text: 'How\'s it going? Getting along okay? …Hmm, looking decent.', face: 'dumb' },
    { speaker: 'you',    text: 'Randal!' },
    { speaker: 'randal', text: 'Think you can manage in this house?', face: 'normal' },
    { speaker: 'you',    text: 'Yeah… somehow.' },
    { speaker: 'seba',   text: 'There\'s not much else to say.', face: 'dumb' },
    { speaker: 'randal', text: '3 more days. Make sure you stay alive, okay?', face: 'normal' },
  ],
  bondlow: [
    { speaker: 'randal', text: 'You two still tense around each other? Try to get a little closer, okay.', face: 'dumb' },
    { speaker: 'you',    text: 'Uh…' },
    { speaker: 'seba',   text: 'Humans don\'t just bond in a week, you know…', face: 'dumb' },
    { speaker: 'randal', text: 'Fair enough — you\'ve got 3 more days. Good luck!', face: 'smile' },
  ],
    bond0: [
    { speaker: 'randal', text: '…How? You two haven\'t bonded at all.', face: 'serious' },
    { speaker: 'you',    text: '……' },
    { speaker: 'seba',   text: 'We\'re giving it everything we\'ve got. Give us a break…', face: 'tired' },
    { speaker: 'randal', text: 'Hmm… are you doing something?', face: 'serious' },
    { speaker: 'you',    text: '…What?' },
    { speaker: 'randal', text: 'Like using items in extra ways, things like that.', face: 'serious' },
    { speaker: 'randal', text: 'Well anyway. Let me see how this plays out.', face: 'normal_dk' },
  ],

};


// ============================================================
// ENDING TALKS — chats during the ending
// ============================================================

const ENDING_TALKS = {
  bond10: [
    { speaker: 'randal', text: 'Good work, you two! You survived so well! Your teamwork was perfect!', face: 'smile' },
    { speaker: 'randal', text: 'My brother was so happy! Another wonderful family member, he said.', face: 'smile' },
    { speaker: 'seba', text: 'Is that right. Great.', face: 'tired' },
    { speaker: 'you',  text: 'So I really am staying in this house…?' },
    { speaker: 'randal', text: 'Of course. As my adorable second pet, I\'ll spoil you endlessly.', face: 'normal' },
    { speaker: 'randal', text: 'Now, I\'ve got to get things ready — wait here a sec!', face: 'smile' },
    { speaker: 'you',  text: '…He\'s gone.' },
    { speaker: 'seba', text: 'Ah… I mean, for what it\'s worth…', face: 'dumb' },
    { speaker: 'you',  text: '…Thank you. I couldn\'t have held on without you, Sebastian.' },
    { speaker: 'seba', text: 'Oh, yeah…', face: 'normal' },
    { speaker: 'seba', text: 'Thinking about what\'s best for you… it probably shouldn\'t be this, but…', face: 'dumb' },
    { speaker: 'seba', text: 'I… want to be with you. From now on too.', face: 'shy' },
    { speaker: 'you',  text: 'Same. I\'m glad you were in this house, Sebastian.' },
    { speaker: 'seba', text: '…That makes me happy.', face: 'shy' },
    { speaker: 'you',  text: 'So… take care of me from here on.' },
    { speaker: 'seba', text: 'Yeah. Whatever happens, let\'s stay together.', face: 'relieved' },
    { speaker: 'seba', text: '…Whatever happens.', face: 'dark' },
  ],
  bond8: [
    { speaker: 'randal', text: 'Yep yep — looks like you two are quite compatible!', face: 'normal' },
    { speaker: 'randal', text: 'I think my brother will approve! I\'ll brush your hair every day♡', face: 'smile' },
    { speaker: 'you',  text: 'Oh, that sounds nice.' },
    { speaker: 'randal', text: 'Wait here — I\'ll go get my brother.', face: 'normal' },
    { speaker: 'seba', text: '…Is this okay? How things turned out.', face: 'normal' },
    { speaker: 'you',  text: 'Yeah… exploring the house made it clear there\'s no escaping.' },
    { speaker: 'seba', text: 'I see…', face: 'tired' },
    { speaker: 'you',  text: 'But it\'s not bad. Because Sebastian is here.' },
    { speaker: 'seba', text: '…Is that so?', face: 'shy' },
    { speaker: 'you',  text: 'Yeah. I want us to keep looking out for each other.' },
    { speaker: 'seba', text: '…Yeah. With two of us, maybe we can manage somehow.', face: 'relieved' },
    { speaker: 'you',  text: 'Take care of me.' },
  ],
  bond6: [
    { speaker: 'seba', text: '…We made it.', face: 'tired' },
    { speaker: 'you',  text: 'Just barely… yeah.' },
    { speaker: 'randal', text: 'Nice! You two have gotten to know each other at least a little, right?', face: 'normal' },
    { speaker: 'you',  text: 'Yeah. …We did get a bit closer.' },
    { speaker: 'seba', text: 'No, not really.', face: 'tense' },
    { speaker: 'you',  text: 'Huh?' },
    { speaker: 'seba', text: 'So send this one home.', face: 'tired' },
    { speaker: 'you',  text: 'Sebastian…' },
    { speaker: 'randal', text: 'No can do. This one doesn\'t have a home to go back to anymore. This is home now.', face: 'serious' },
    { speaker: 'you',  text: 'Huh?' },
    { speaker: 'seba', text: 'Yeah… I thought so. You\'re already on "this side" apparently.', face: 'scared' },
    { speaker: 'randal', text: 'Oh well! As long as you warm up to each other little by little♡', face: 'smile' },
    { speaker: 'randal', text: 'I think my brother will be fine with this.', face: 'normal' },
    { speaker: 'randal', text: 'I\'m excited… I really think we\'re going to get along great. Let\'s play lots.', face: 'smile' },
    { speaker: 'you',  text: '…Okay. Thanks to both of you.' },
    { speaker: 'seba', text: 'Adapting fast. Good for you.', face: 'dumb' },
  ],
  bond2: [
    { speaker: 'randal', text: 'Hmm, was it a bit tough?', face: 'normal' },
    { speaker: 'you',  text: 'Yeah… but we made it somehow.' },
    { speaker: 'seba', text: '…Just being alive is enough, right?', face: 'tired' },
    { speaker: 'randal', text: 'Hmm… it\'s a little different from what I had in mind.', face: 'dumb' },
    { speaker: 'randal', text: 'Can\'t be helped… I\'ll have you "start over".', face: 'serious' },
    { speaker: 'seba', text: 'Start over… what do you mean?', face: 'scared' },
    { speaker: 'you',  text: '……' },
    { speaker: 'randal', text: 'It\'s fine. I can erase things as many times as it takes. Your memories, that is!', face: 'normal_dk' },
    { speaker: 'randal', text: 'Off you go.', face: 'smile' },
  ],
  bond0: [
    { speaker: 'randal', text: 'You two haven\'t bonded at all.', face: 'serious' },
    { speaker: 'randal', text: 'That has to be on purpose, doesn\'t it? Otherwise it\'s just weird.', face: 'serious' },
    { speaker: 'you',  text: '…I wonder what you mean by that.' },
    { speaker: 'randal', text: 'Could it be the apple? So you figured it out.', face: 'normal_dk' },
    { speaker: 'randal', text: 'Heh… thank you for digging this deep into the "game".', face: 'smile' },
    { speaker: 'randal', text: 'I really do think you and I are so well suited.', face: 'normal' },
    { speaker: 'randal', text: 'Looking for a hidden ending like this.', face: 'normal' },
    { speaker: 'randal', text: 'Were you curious about my reaction?', face: 'normal' },
    { speaker: 'randal', text: 'Not Sebastian\'s — mine♡', face: 'smile' },
    { speaker: 'randal', text: 'I\'m right, aren\'t I. Of course I am.', face: 'serious' },
    { speaker: 'randal', text: 'You\'re my pet. I\'ve decided. It\'s final.', face: 'serious' },
    { speaker: 'randal', text: 'I\'m coming to get you. No point playing a game right now.', face: 'normal_dk' },
    { speaker: 'randal', text: 'Well then…', face: 'normal_dk' },
    { speaker: 'randal', text: 'Wait for me♡', face: 'horror' },
  ],
};

// ============================================================
// TUTORIAL LINES
// ============================================================

const TUTORIAL_LINES = {
  explore: {
    lines: [
      { speaker: 'randal', text: 'First, pick somewhere to explore.<br>You can only go one place per day, so think carefully about what you need.', face: 'normal' },
    ],
  },
  explore_result: {
    byLoc: {
      kitchen:   { speaker: 'randal', text: 'Mm-hmm, a safe choice.<br>But most of what you\'ll find there isn\'t great for solving problems.', face: 'normal' },
      randal:    { speaker: 'randal', text: 'My room?! Hold on — I haven\'t tidied up in there!<br>I didn\'t say you could explore it!', face: 'shy' },
      warehouse: { speaker: 'randal', text: 'You went to the warehouse. You can get a wide variety of things there — I think. I\'m not sure.', face: 'normal' },
    },
    lines: [
      { speaker: 'randal', text: 'The number of items you get is random every time. Usually up to 4. You can keep searching, but failing costs you damage.', face: 'dumb' },
    ],
  },
  extra_explore: {
    success: [[
      { speaker: 'randal', text: 'Lucky you. First try has a 70% chance of finding something.<br>A good deal, but… even "Thunder" can miss.', face: 'normal' },
      { speaker: 'randal', text: 'Worth looking — as long as your HP can handle it.', face: 'dumb' },
    ],
      { speaker: 'randal', text: 'The gamble paid off. But honestly, the next one isn\'t worth the odds.',                                                             face: 'normal' },
      { speaker: 'randal', text: 'Whooo! Going for a 20% — you really are interesting♡',                                             face: 'smile'  },
    ],
    fail: [
      { speaker: 'randal', text: 'Oops — looks like "Fissure" landed on you. Rough.<br>Some days just aren\'t lucky, so always check your remaining HP before pushing further.', face: 'dumb'   },
      { speaker: 'randal', text: 'Haha. Rough run of it. That\'s the damage you take when it fails.<br>Always keep the risks in mind, okay?',               face: 'normal' },
      { speaker: 'randal', text: 'That was reckless… but that recklessness is exactly why I wanted you♡',                                               face: 'dumb'   },
    ],
  },
  event: {
    lines: [
      { speaker: 'randal', text: 'After exploring, it\'s time to deal with trouble! Use items to push your avoidance rate up.', face: 'smile' },
      { speaker: 'randal', text: 'Different items work better for different problems.<br>This time the rate is fixed, but when real trouble hits, experiment.', face: 'normal' },
      { speaker: 'randal', text: 'Oh — no matter how many items you use, you can\'t go above 80%. Keep that in mind.', face: 'dumb' },
    ],
  },
  event_result: {
    success: { speaker: 'randal', text: 'You handled it! You\'re lucky! Keep it up.', face: 'smile' },
    fail:    { speaker: 'randal', text: 'Heh… you failed. Even with a high avoidance rate, failure can still happen.<br>Unless there\'s a critical item that completely handles the problem — and not every problem has one of those. …Am I talking too much?',  face: 'dumb' },
  },
  food: {
    intro:    [
      { speaker: 'randal', text: 'This is the last phase. At the end of each day, consume food — or your HP and MP will take a hit.', face: 'normal'  },
      { speaker: 'randal', text: 'Humans can die from just that alone. Cute, isn\'t it.', face: 'smile'  },
    ],
    has_food: { speaker: 'randal', text: 'Oh? You kept food in reserve. Did you take a risk somewhere?',    face: 'dumb' },
    no_food:  { speaker: 'randal', text: 'You have nothing? That\'s rough…<br>Food can drop outside the Kitchen, but the chance is low. Think about whether to keep at least one item for food, or spend everything on the current problem. Your call.',                         face: 'dumb' },
  },
  end: [
    { speaker: 'randal', text: 'That\'s a full day. Got it? Survive like that with Sebastian for 10 days.', face: 'normal' },
    { speaker: 'you',    text: 'Understood.' },
    { speaker: 'randal', text: 'Oh right — Sebastian, you\'re just here to watch over this one, okay? No interfering too much — they need to get used to this house.', face: 'dumb' },
    { speaker: 'seba',   text: '…I\'m barely surviving myself here.', face: 'dumb' },
    { speaker: 'randal', text: 'Alright, do your best! I absolutely want you as my pet!', face: 'smile' },
    { speaker: 'you',    text: 'Well… take care of us then?' },
    { speaker: 'seba',   text: 'hah. Are we really going to be okay…', face: 'tired' },
    { speaker: 'randal', text: '…Oh, and here — I\'ll give you one apple to start. A gift from me♡', face: 'normal_dk' },
  ],
};

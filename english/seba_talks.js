// ============================================================
// Conversation events with Sebastian (conditional, one-time only)
// These are treated as end-of-day conversations and will not
// interrupt other scenes. (Except special key events.)
// ============================================================
// Structure:
//   id      : identifier (must be unique)
//   trigger : trigger condition (see below)
//   title   : title shown at top of chat screen (default: "Conversation with Sebastian")
//   lines   : array of dialogue lines
//     speaker : 'seba' (Sebastian) or 'you' (player)
//     text    : dialogue text
//     face    : expression identifier (only valid when speaker:'seba')
//               → corresponding image: img/seba_{face}.png
//               defaults to 'normal' if omitted
//
// ■ trigger list
//   'chocolate_eaten' : chocolate was consumed that day (mandatory or optional)
//   'hp_low'          : HP dropped to 50 or below
//   'mp_low'          : MP dropped to 50 or below
//   'hp_very_low'     : HP dropped to 20 or below
//   'mp_very_low'     : MP dropped to 20 or below
//   'both_low'        : both HP and MP are at 20 or below
//   'no_food_2days'   : 2 days have passed without food
// ============================================================

const SEBA_TALKS = [
    {
    id: 'talk_no_food',
    trigger: 'no_food_2days',
    title: 'Two Days Without Food',
    bond: 1,
    lines: [
      { speaker: 'seba', text: '……we haven\'t eaten in two days.', face: 'tired' },
      { speaker: 'you',  text: 'Yeah……' },
      { speaker: 'seba', text: 'Tomorrow we\'re definitely going to the Kitchen. Nothing else matters right now……', face: 'tense' },
      { speaker: 'you',  text: 'Yeah……' },
      { speaker: 'seba', text: '……please don\'t drop dead on me.', face: 'scared' },
    ],
  },
  {
    id: 'talk_chocolate',
    trigger: 'chocolate_eaten',
    title: 'Item: Chocolate',
    bond: 2,
    lines: [
      { speaker: 'seba', text: 'Good stuff. Chocolate.', face: 'normal' },
      { speaker: 'you',  text: 'Yeah. It\'s good……' },
      { speaker: 'you',  text: '……makes me feel a little nostalgic.' },
      { speaker: 'seba', text: 'Yeah. The way it\'s wrapped in foil and everything……',  face: 'relieved'   },
      { speaker: 'you',  text: '……' },
      { speaker: 'seba', text: '……are you crying?',  face: 'normal'   },
      { speaker: 'you',  text: 'I\'m not……' },
      { speaker: 'seba', text: 'Don\'t push yourself… though I guess that\'s not much help.',  face: 'normal' },
      { speaker: 'seba', text: 'Here, have half of mine.',  face: 'relieved'   },
      { speaker: 'you',  text: 'Thanks……' },
    ],
  },
    {
    id: 'talk_both_low',
    trigger: 'both_low',
    title: 'Completely Falling Apart',
    bond: 2,
    recovery: { hp: 10, mp: 10 },
    lines: [
      { speaker: 'seba', text: '……hey, can you hear me?', face: 'tense' },
      { speaker: 'you',  text: 'Yeah……I kind of zoned out.' },
      { speaker: 'seba', text: 'Can you move? Be honest.', face: 'tense' },
      { speaker: 'you',  text: 'Not really……' },
      { speaker: 'seba', text: 'This is really bad if something happens now.', face: 'scared' },
      { speaker: 'you',  text: 'If something comes, just leave me……' },
      { speaker: 'seba', text: '……honestly, that was my plan on day one.', face: 'tired' },
      { speaker: 'seba', text: 'hah……why did I end up tangled up with you……<br>Just — hang in there, okay.', face: 'dumb' },
    ],
  },
    {
    id: 'talk_hp_very_low',
    trigger: 'hp_very_low',
    title: 'HP: Very Low',
    bond: 1,
    recovery: { hp: 20, mp: 0 },
    lines: [
      { speaker: 'seba', text: 'You look pale. Are you really okay?', face: 'scared' },
      { speaker: 'you',  text: '……I might not be. My body won\'t move right.' },
      { speaker: 'seba', text: 'Lie down. I\'ll go find something.', face: 'normal' },
      { speaker: 'you',  text: 'Don\'t leave me alone……' },
      { speaker: 'seba', text: '……', face: 'dumb' },
      { speaker: 'seba', text: 'Then get some proper rest.', face: 'shy' },
    ],
  },
  {
    id: 'talk_mp_very_low',
    trigger: 'mp_very_low',
    title: 'MP: Very Low',
    bond: 1,
    recovery: { hp: 0, mp: 20 },
    lines: [
      { speaker: 'seba', text: 'Hey……your eyes are glazed over.', face: 'tense' },
      { speaker: 'you',  text: '……sorry, I can\'t think straight.' },
      { speaker: 'seba', text: 'That\'s not good. Can you hear my voice okay?', face: 'scared' },
      { speaker: 'you',  text: 'Yeah……I think I need you close by.' },
      { speaker: 'seba', text: '……yeah, I\'m here. Right here.', face: 'scared' },
      { speaker: 'seba', text: '……right. Yeah. This is just…… what happens to a normal person.', face: 'scared' },
    ],
  },
  {
    id: 'talk_hp_low',
    trigger: 'hp_low',
    title: 'HP: Low',
    bond: 1,
    lines: [
      { speaker: 'seba', text: '……hey. You okay? You\'re in pretty rough shape.', face: 'tense'  },
      { speaker: 'you',  text: 'Yeah……might be getting hard.' },
      { speaker: 'seba', text: 'It\'s more than "might be". You should eat more tomorrow.',    face: 'normal' },
      { speaker: 'you',  text: 'But if I use too much now it\'ll catch up with me later……' },
      { speaker: 'seba', text: '……I\'m more worried about you right now. Your call — but don\'t push yourself.', face: 'tired'  },
    ],
  },
  {
    id: 'talk_mp_low',
    trigger: 'mp_low',
    title: 'MP: Low',
    bond: 1,
    lines: [
      { speaker: 'you',  text: '……my head feels foggy.' },
      { speaker: 'seba', text: 'Well, it\'s been one awful thing after another lately……', face: 'tense'  },
      { speaker: 'you',  text: 'Are you……okay, Sebastian?' },
      { speaker: 'seba', text: 'Don\'t worry about me. I\'ve built up more resistance than you.',   face: 'normal' },
      { speaker: 'you',  text: 'That\'s incredible……' },
      { speaker: 'seba', text: 'I mean……it\'s not exactly a good thing.', face: 'scared'  },
    ],
  },
];

// ============================================================
// Conversations triggered by optional item use (one-time only / suppressed if SEBA_TALKS fires)
// ============================================================
// triggerItem : triggers when the item ID is in selectedItems
// bond        : bond points added when triggered
// ============================================================

const ITEM_USE_TALKS = [
  {
    id: 'item_rag',
    triggerItem: 'rag',
    title: 'Item: Rag',
    bond: 2,
    lines: [
      { speaker: 'seba', text: 'What are you planning to do with that rag?', face: 'normal' },
      { speaker: 'you',  text: 'It\'s cold……I thought even this might help a little if I drape it over me.' },
      { speaker: 'seba', text: 'Ah, yeah — this house is a bit cold.', face: 'normal' },
      { speaker: 'you',  text: 'Feel free to share it, Sebastian.' },
      { speaker: 'seba', text: 'Oh, n-no. I\'m fine.', face: 'tense' },
      { speaker: 'you',  text: 'I thought I saw you shivering a little earlier.' },
      { speaker: 'you',  text: 'Was that out of line?' },
      { speaker: 'seba', text: 'Ah……', face: 'dumb' },
      { speaker: 'seba', text: '……thanks.', face: 'shy' },
      { speaker: 'you',  text: 'It\'s warm.' },
    ],
  },
    {
    id: 'item_jacket',
    triggerItem: 'jacket',
    title: 'Item: Jacket',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'This green jacket — it\'s warm, I like it.' },
      { speaker: 'seba', text: 'Whoa, where did you find that……', face: 'tense' },
      { speaker: 'you',  text: 'I don\'t remember. What\'s up?' },
      { speaker: 'seba', text: 'I just… feel like I\'ve seen it somewhere.', face: 'tense' },
      { speaker: 'you',  text: 'Hm?' },
      { speaker: 'you',  text: 'It seems like it would suit Sebastian more, honestly.' },
      { speaker: 'seba', text: 'Ha……you think?', face: 'dumb' },
    ],
  },
    {
    id: 'item_novel',
    triggerItem: 'novel',
    title: 'Item: Novel',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'What a complicated title. "A History of Desolation in a Post-Apocalyptic World……?"' },
      { speaker: 'seba', text: 'Ah……you don\'t have to read that one.', face: 'normal' },
      { speaker: 'you',  text: 'You\'ve read it? What\'s it about?' },
      { speaker: 'seba', text: '……', face: 'shy' },
      { speaker: 'you',  text: 'What?' },
      { speaker: 'seba', text: 'Think about where it came from — a shelf full of titles you can barely pick up — and draw your own conclusions.', face: 'dumb' },
      { speaker: 'you',  text: 'Ehhh……I don\'t really get it.' },
      { speaker: 'seba', text: 'Good. You don\'t need to.', face: 'dumb' },
    ],
  },
  {
    id: 'item_magazine',
    triggerItem: 'magazine',
    title: 'Item: Magazine',
    bond: 1,
    lines: [
      { speaker: 'you',  text: '……hehe.' },
      { speaker: 'seba', text: 'What are you laughing at?', face: 'normal' },
      { speaker: 'you',  text: 'This magazine — I can\'t understand a single thing it says.' },
      { speaker: 'seba', text: 'Oh, that one……', face: 'normal' },
      { speaker: 'you',  text: 'Have you read it?' },
      { speaker: 'seba', text: 'I couldn\'t understand a word of it either.', face: 'relieved' },
      { speaker: 'you',  text: 'Well, yeah.' },
      { speaker: 'you',  text: 'The pictures are interesting though.' },
      { speaker: 'seba', text: 'Are they?', face: 'dumb' },
    ],
  },
    {
    id: 'item_notebook',
    triggerItem: 'notebook',
    title: 'Item: Cringe Notebook',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'What\'s written in this notebook anyway?' },
      { speaker: 'you',  text: 'Holy Sebastian, Circus Sebastian, Phone Sebastian……?' },
      { speaker: 'seba', text: 'Stop! Don\'t read from that notebook!', face: 'tense' },
      { speaker: 'you',  text: 'W-was this your notebook, Sebastian?' },
      { speaker: 'seba', text: 'No. Absolutely not mine. Seriously don\'t misunderstand.', face: 'tense' },
      { speaker: 'seba', text: 'Why am I the one cringing, anyway.', face: 'dumb' },
      { speaker: 'you',  text: '"Circus Sebastian" is actually pretty good, no?' },
      { speaker: 'seba', text: '……can you please drop it?', face: 'dumb' },
    ],
  },
  {
    id: 'item_finger',
    triggerItem: 'finger',
    title: 'Item: Finger',
    bond: 2,
    lines: [
      { speaker: 'seba', text: 'Ugh, what are you planning to do with that finger?', face: 'scared' },
      { speaker: 'you',  text: 'It seems like it\'s trying to tell me something.' },
      { speaker: 'seba', text: 'It\'s just spasming……', face: 'scared' },
      { speaker: 'you',  text: 'Let\'s see……3 steps right, 5 steps forward……' },
      { speaker: 'seba', text: 'What? Am I weird for not being able to communicate with a finger?', face: 'dumb' },
      { speaker: 'you',  text: 'Sebastian! Look! There\'s a bathroom!' },
      { speaker: 'seba', text: 'No way……', face: 'tense' },
      { speaker: 'you',  text: 'We can wash tonight, and get drinking water too……oh!' },
      { speaker: 'you',  text: 'It stopped moving……<br>I\'m sorry……thank you……' },
      { speaker: 'seba', text: 'Should we… make a little grave for it?', face: 'tense' },
    ],
  },
  {
    id: 'item_cigarette',
    triggerItem: 'cigarette',
    title: 'Item: Cigarette',
    bond: 1,
    lines: [
      { speaker: 'seba', text: 'Do you smoke?', face: 'normal' },
      { speaker: 'you',  text: 'Just holding the light.' },
      { speaker: 'you',  text: 'The smell of a cigarette… when I catch it, my anxiety fades a little.' },
      { speaker: 'seba', text: 'This place does get kind of rank sometimes……', face: 'dumb' },
    ],
  },
  {
    id: 'item_pickle_jar',
    triggerItem: 'pickle_jar',
    title: 'Item: Pickle Jar',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'Let\'s crack open another jar.' },
      { speaker: 'seba', text: 'Oh, pass me some.', face: 'normal' },
      { speaker: 'you',  text: 'They\'re sour, but good — these pickles.' },
      { speaker: 'seba', text: 'Yeah……', face: 'relieved' },
      { speaker: 'you',  text: 'Any ideas for the leftover brine?' },
      { speaker: 'seba', text: 'Come on……', face: 'dumb' },
    ],
  },
  {
    id: 'item_food_extra',
    triggerItem: 'food',
    title: 'Item: Food',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'Maybe I can eat a little more……' },
      { speaker: 'seba', text: 'You should. Dying on me because you held back would be a problem.', face: 'normal' },
      { speaker: 'you',  text: 'Yeah……thanks.' },
      { speaker: 'seba', text: 'Honestly, it\'s almost strange how you keep finding things you can actually eat.', face: 'normal' },
      { speaker: 'seba', text: 'Normally it\'s more……well, I won\'t say it.', face: 'tired' },
      { speaker: 'seba', text: 'Point is: eat when you can.', face: 'normal' },
      { speaker: 'you',  text: 'O-okay……That\'s kind of terrifying, though.' },
    ],
  },
  {
    id: 'item_rope',
    triggerItem: 'rope',
    title: 'Item: Rope',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'I wonder if we can use this rope for anything.' },
      { speaker: 'seba', text: 'Tie things down, pull things around……it\'s worth keeping.', face: 'normal' },
      { speaker: 'you',  text: 'What if we tied it to Sebastian so you don\'t wander off?' },
      { speaker: 'seba', text: 'If anyone\'s going to wander, it\'s you.', face: 'tired' },
      { speaker: 'you',  text: 'Then if I wander, you can pull me back.' },
      { speaker: 'seba', text: '……are you serious?', face: 'dumb' },
    ],
  },
  {
    id: 'item_candle',
    triggerItem: 'candle',
    title: 'Item: Candle',
    bond: 1,
    lines: [
      { speaker: 'you',  text: 'What if something catches fire?' },
      { speaker: 'seba', text: 'Say that before you light it.', face: 'dumb' },
      { speaker: 'you',  text: '……the 1/f flickering of a flame stimulates alpha brainwaves, bringing relaxation, focus, and a sense of peace……' },
      { speaker: 'seba', text: 'Huh? What is that?', face: 'tense' },
      { speaker: 'you',  text: 'It was in a magazine in Randal\'s room.' },
      { speaker: 'seba', text: 'Oh……', face: 'dumb' },
      { speaker: 'you',  text: 'Did it relax you?' },
      { speaker: 'seba', text: 'Nope.', face: 'dumb' },
    ],
  },
];

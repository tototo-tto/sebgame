// ============================================================
// SEBA_TXT — Sebastian's dialogue lines during the Explore phase
// ============================================================
// Selected via pickBondLine(lines).
// If minBond is omitted, always a candidate for bond 0 and above.
//
// ■ Structure
//   SEBA_EXPLORE_RESULT  : Normal explore results (location × good / bad)
//   SEBA_EXTRA_EXPLORE   : Extra explore results (attempt count × success / fail)
//   SEBA_ITEM_REACTIONS  : Reactions when specific items are found
// ============================================================


// ── Normal explore result lines ────────────────────────────────────────────────
// good : when the explore ended on a positive note (70% chance)
// bad  : when something unpleasant was seen during explore (30% chance)
//        if SEBA_ITEM_REACTIONS hits first, that takes priority


// ============================================================
// SEBA_EXPLORE_LINES — opening lines for the Explore phase (bond branches)
// ============================================================

const SEBA_EXPLORE_LINES = [
  // base
  { text: 'You\'ve got my sympathies. Truly.',               face: 'tired'    },
  { text: 'hah……why does it have to be like this.',   face: 'tired'    },
  { text: '……let\'s go. Just sitting here won\'t get us anywhere.',                       face: 'normal'    },
  // bond >= 2
  { text: 'You\'re more capable than I expected.',           face: 'normal',   minBond: 2 },
  { text: 'Where are you thinking of going today?',    face: 'normal',   minBond: 2 },
  // bond >= 4
  { text: 'Hey. You\'re surprisingly stubborn, you know that?<br>I mean it as a compliment……',      face: 'normal',   minBond: 4 },
  { text: '……you look better today. Come on, let\'s go.', face: 'normal', minBond: 4 },
  // bond >= 6
  { text: '……it\'s started to feel normal, moving around together like this.', face: 'relieved', minBond: 6 },
  { text: 'Where to? Doesn\'t really matter — we\'ll manage either way.',     face: 'normal', minBond: 6 },
  // bond >= 8
  { text: 'You pick. I\'ll follow wherever.', face: 'relieved',      minBond: 8 },
  { text: 'I guess this is still better than my usual routine. Even like this.<br>……because you\'re here.',      face: 'relieved', minBond: 8 },
  // bond >= 10
  { text: 'Feels like we\'ve been together a long time.<br>Not in a weird way……yeah……', face: 'shy',      minBond: 10 },
  { text: 'I\'m glad you\'re here. ……I really mean it.',      face: 'relieved', minBond: 10 },
  { text: 'If you\'re talking compatibility……ours is pretty solid, right?', face: 'shy', minBond: 12 },
  { text: 'Decided where you want to go? Wherever it is — I\'m coming with you.', face: 'relieved', minBond: 12 },
];


// ============================================================
// SEBA_DAY_END — end-of-day closing lines (bond branches)
// ============================================================

const SEBA_DAY_END = [
  { text: 'Exhausted.',               face: 'tired'    },
  { text: 'Want to have a normal day tomorrow. If possible.', face: 'normal'   },
  { text: 'You\'re still holding it together, right?',     face: 'normal'   },
  // bond >= 2
  { text: 'You never get used to a life like this, but……<br>When something happens, I just think "here we go again". At some point, I just did.', face: 'tired', minBond: 2 },
  { text: 'Tired. But……wasn\'t too bad, was it?', face: 'normal', minBond: 2 },
  // bond >= 4
  { text: 'You\'ve got guts, I\'ll give you that. I mean — it helped.', face: 'relieved', minBond: 4 },
  { text: 'You okay? I know this is hard to get used to……but I\'d like you to get used to it.', face: 'normal', minBond: 4 },
  // bond >= 6
  { text: 'You eating okay?<br>……me? I can eat pretty much anything, I\'m fine.', face: 'normal', minBond: 6 },
  { text: 'You know……you might actually be able to adapt to this place.', face: 'normal', minBond: 6 },
  // bond >= 8
  { text: 'Hey……never mind. Let\'s eat something.', face: 'normal', minBond: 8 },
  { text: '……good night.', face: 'relieved', minBond: 8 },
  { text: '(watching you as you sit beside him)', face: 'relieved', minBond: 8 },
  // bond >= 10
  { text: 'Watching you, my head goes foggy. "What if we could get out of here"……I haven\'t thought about that in a while.', face: 'shy', minBond: 10 },
  { text: '(staring blankly at you)', face: 'shy', minBond: 10 },
  { text: 'I think I\'m losing it. In a situation like this, why do I keep thinking about you……', face: 'shy', minBond: 12 },
  { text: 'I want to get you home……but. ……hah.', face: 'shy', minBond: 12 },
];

// ============================================================
// SEBA_EXPLORE_LINES_STAT_HIDDEN — opening lines during the Luther debuff
// ============================================================

const SEBA_EXPLORE_LINES_STAT_HIDDEN = [
  { text: 'You\'ve been out of it ever since……', face: 'dumb' },
  { text: 'Can\'t read your face……you don\'t look like you\'re back yet.', face: 'tense', minBond: 2 },
  { text: 'Where to? ……you\'re still zoned out, aren\'t you.', face: 'tired', minBond: 4 },
  { text: 'Hey……are you actually okay? You\'re worrying me……', face: 'tense', minBond: 6 },
  { text: 'Okay okay, I\'ll follow you, just let go of my hand……', face: 'dumb', minBond: 8 },
  { text: 'Uh……why are you holding my hand……What am I supposed to do……', face: 'dumb', minBond: 10 },
  { text: 'You just naturally grabbed my hand again……<br>Fine, whatever. Let\'s go.', face: 'shy', minBond: 12 },
];

// ============================================================
// SEBA_DAY_END_STAT_HIDDEN — end-of-day lines during the Luther debuff
// ============================================================

const SEBA_DAY_END_STAT_HIDDEN = [
  { text: 'Whoa, your expression is really off……Are you actually okay like this?', face: 'tense',},
  { text: 'You seem……dazed. You okay?', face: 'tense',minBond: 2 },
  { text: 'Hey, can you hear me?<br>……Doesn\'t seem like it.', face: 'dumb', minBond: 4 },
  { text: 'When you\'re quiet like this, you\'re like a different person.<br>……Ugh. Just come back already.', face: 'normal', minBond: 6 },
  { text: '……uh, you\'re a bit……close, aren\'t you……', face: 'shy', minBond: 8 },
  { text: '……why are you holding my hand……', face: 'shy', minBond: 10 },
  { text: 'So uh, this is just……you being confused, right?<br>Come on……cut me some slack.', face: 'shy', minBond: 12 },
];

// ============================================================
// SEBA_EXPLORE_LINES_STAT_RESTORED — opening lines right after the Luther debuff ends
// ============================================================

const SEBA_EXPLORE_LINES_STAT_RESTORED = [
  // bond 0+
  { text: 'Oh……you\'re not out of it anymore.', face: 'normal' },
  // bond >= 2
  { text: 'Hey, you seem like you\'re back. All good now?', face: 'relieved', minBond: 2 },
  // bond >= 4
  { text: 'Color\'s come back to your face. Welcome back.', face: 'relieved', minBond: 4 },
  // bond >= 6
  { text: 'Ha……you\'re finally back to normal.<br>Yeah. I like you better like this.', face: 'relieved', minBond: 6 },
  // bond >= 8
  { text: 'Oh, you\'re back. ……I just meant it feels like more distance now……', face: 'normal', minBond: 8 },
  // bond >= 10
  { text: 'We can make eye contact again. Be careful around the others in this house, okay?<br>……I mean it.', face: 'shy', minBond: 10 },
  // bond >= 12
  { text: 'Hey — do you remember anything from yesterday?<br>……actually, never mind. Don\'t answer.', face: 'shy', minBond: 12 },

];

const SEBA_EXPLORE_RESULT = {

  kitchen: {
    good: [
      { text: 'Thank god……there\'s food.',                                         face: 'relieved' },
      { text: 'There can be rats near the Kitchen……watch out.',      face: 'normal'   },
      // bond >= 2
      { text: 'I\'m starving.',                                               face: 'normal', minBond: 4 },
      { text: 'Take as much as we can carry.',                                           face: 'normal',   minBond: 2 },
      // bond >= 4
      { text: 'If you hear a voice coming from the sink, don\'t answer it.',                               face: 'tired',   minBond: 4 },
      { text: '……even in a situation like this, having food is a relief.',                         face: 'relieved', minBond: 4 },
      // bond >= 6
      { text: '……not a bad way to start the day, actually.',                               face: 'relieved', minBond: 6 },
      { text: 'Having food calms me down. Usually it\'s ……ah, never mind.',               face: 'normal', minBond: 6 },
      // bond >= 8
      { text: 'You\'re going to get hurt anyway, so the knife\'s not for you.<br>Not much use for self-defense either.',           face: 'normal',      minBond: 8 },
      { text: 'Coming here is kind of enjoyable, honestly. Just me?',                 face: 'relieved', minBond: 8 },
      // bond >= 10
      { text: 'I actually get proper meals when you\'re around. That helps……',   face: 'relieved',      minBond: 10 },
      { text: 'Oh……booze. No — leave it. I don\'t want to be drunk right now.',               face: 'relieved',      minBond: 10 },
      { text: 'Being in the Kitchen together like this is……not bad at all.',               face: 'shy',      minBond: 12 },
    ],
    bad: [
      { text: '……something moved. No, just my imagination……please let it be.',                face: 'scared'  },
      { text: 'Didn\'t find much.',                                  face: 'normal'   },
      // bond >= 2
      { text: '……bad feeling about this. Let\'s wrap it up.',                                  face: 'tense',   minBond: 2 },
      { text: 'Not much here. Take what we can.',                                  face: 'tense',  minBond: 2 },
      // bond >= 4
      { text: 'This one\'s not edible. Call it gut feeling — I\'ll toss it.',                face: 'dumb',   minBond: 4 },
      { text: 'I\'d like a bit more ideally……but.',                face: 'dumb',   minBond: 4 },
      // bond >= 6
      { text: 'One time I found a rat in here……actually, never mind.',                                  face: 'scared',   minBond: 6 },
      // bond >= 8
      { text: 'That\'s all for today……you take the bigger share.',               face: 'normal',  minBond: 8 },
      // bond >= 10
      { text: 'Hey, what\'s wrong? Look properly. ……quit goofing around.',               face: 'shy',  minBond: 10 },
      { text: '(leaning on his elbow, staring off into space)',               face: 'shy',  minBond: 12 },
    ],
  },

  randal: {
    good: [
      { text: 'He is way too messy.',                                             face: 'tense'    },
      { text: 'Whether we should just walk in? Don\'t bother asking. Pointless.',                           face: 'normal'   },
      // bond >= 2
      { text: '……every time I come here, there\'s new stuff.',                            face: 'tense',   minBond: 2 },
      { text: 'hah……my bed\'s gone too. ……well, it was a coffin, but still.',                       face: 'dumb',   minBond: 2 },
      // bond >= 4
      { text: 'Even this kind of thing……what\'s going on in this room.',               face: 'dumb',  minBond: 4 },
      { text: 'When I try to sleep, he makes weird noises to bother me.',                                  face: 'dumb', minBond: 4 },
      // bond >= 6
      { text: 'I kind of get why he wants to keep you now. Don\'t want to admit it, but……',       face: 'normal',   minBond: 6 },
      // bond >= 8
      { text: '……playing thief with you isn\'t so bad, honestly.',   face: 'tired',   minBond: 8 },
      { text: 'What? ……hey, that\'s my personal stuff.',   face: 'shy',   minBond: 8 },
      // bond >= 10
      { text: 'We\'re in a weird situation. Pets rummaging through their owner\'s room……I feel empty just saying it.',     face: 'tired',     minBond: 10 },
      { text: 'If you were actually his pet……which room would you sleep in?',     face: 'shy',     minBond: 12 },
    ],
    bad: [
      { text: 'No way……this is here too.<br>Oh — nothing, forget it.',          face: 'scared'   },
      // bond >= 2
      { text: '……just what are these people, really.',                                      face: 'normal',   minBond: 2 },
      // bond >= 4
      { text: '……no, we\'re not taking that book. I\'ll get rid of it.',                   face: 'dumb',   minBond: 4 },
      // bond >= 6
      { text: 'Didn\'t find much. Then again, this is his room……what did I expect.',                           face: 'normal',  minBond: 6 },
      // bond >= 8
      { text: 'Ugh, stepped on something gross. Hey……don\'t fall back, stay close.',                               face: 'dumb',  minBond: 8 },
      // bond >= 10
      { text: 'Hm? You tired? We can take a break?',                               face: 'relieved',  minBond: 10 },
      { text: 'If you were going to spend time in this room……honestly, there\'s too much in here I\'d want to hide from you.',      face: 'dumb',  minBond: 12 },
    ],
  },

  warehouse: {
    good: [
      { text: 'Might as well take it?',                 face: 'normal'   },
      { text: 'Warehouse doesn\'t mean there\'s actually useful stuff here.',       face: 'normal'   },
      // bond >= 2
      { text: 'Kind of dusty. Let\'s get out soon.',       face: 'normal',  minBond: 2 },
      { text: 'Oh, glad we found it.',            face: 'normal',  minBond: 2 },
      // bond >= 4
      { text: 'Oh……same jacket as mine. ……wait, isn\'t that your size?',                 face: 'normal',  minBond: 4 },
      { text: 'Found more than I expected. Not all junk, apparently.',        face: 'relieved', minBond: 4 },
      // bond >= 6
      { text: 'Whoa……a doll. But it doesn\'t seem to mean you any harm.',             face: 'scared',  minBond: 6 },
      { text: 'It\'s like a treasure hunt? What are you so happy about.',                           face: 'tired',  minBond: 6 },
      // bond >= 8
      { text: 'Even in a crummy place like this, having you here makes it a little better somehow……',       face: 'relieved',     minBond: 8 },
      // bond >= 10
      { text: 'So — I really thought I was done for that time……oh, I found mine too.<br>Sorry, I was just talking.',  face: 'relieved',     minBond: 10 },
      { text: 'Huh? ……I\'m not enjoying this, okay?<br>I\'m not laughing. Stop saying weird things.',  face: 'shy',     minBond: 12 },
    ],
    bad: [
      { text: '……what is this. I don\'t want to touch it.',                                            face: 'tense'    },
      { text: 'Ah……really not finding anything.',                               face: 'normal'    },
      // bond >= 2
      { text: 'Snake scales?? ……watch out. They literally eat people here.',            face: 'scared',  minBond: 2 },
      { text: 'Ugh……please don\'t touch that board game looking thing.',             face: 'dumb',   minBond: 2 },
      // bond >= 4
      { text: 'Armor……don\'t touch it. It might curl up on its own and I\'m not dealing with that.',                              face: 'scared',   minBond: 4 },
      // bond >= 6
      { text: '……a hot dog plushie? Please throw that away. I\'m begging you.',                        face: 'scared',  minBond: 6 },
      // bond >= 8
      { text: 'I really hate it here……but with you around it\'s at least bearable.',                            face: 'dumb',  minBond: 8 },
      // bond >= 10
      { text: '(staring with a complicated expression at a small-sized jester costume)',                            face: 'dumb',  minBond: 10 },
      { text: 'Whoa — nearly tripped.<br>……oh, uh, sorry. I\'ll back off.',                            face: 'shy',  minBond: 12 },
    ],
  },

};


// ── Extra explore lines ────────────────────────────────────────────────────────
// success[0] = 1st success / success[1] = 2nd success / success[2] = 3rd success
// fail[0]    = 1st fail    / fail[1]    = 2nd fail    / fail[2]    = 3rd fail

const SEBA_EXTRA_EXPLORE = {

  success: [
    // 1st success
    [
      { text: 'Worth taking a second look.',            face: 'normal' },
      { text: 'Oh, there was more?',                 face: 'normal' },
      // bond >= 2
      { text: 'Lucky.',                   face: 'normal',  minBond: 2 },
      // bond >= 4
      { text: 'Good. Things should be a little easier.',      face: 'normal',  minBond: 4 },
      // bond >= 6
      { text: '(gives a thumbs up)',    face: 'relieved', minBond: 6 },
      // bond >= 8
      { text: 'Feels like I find more when you come along. Or is that just me?',   face: 'relieved', minBond: 8 },
      // bond >= 10
      { text: 'Found some more. ……would make me happy if you\'re happy about it.',        face: 'relieved',     minBond: 10 },
      { text: '(bumped fists)',           face: 'relieved',     minBond: 12 },
    ],
    // 2nd success
    [
      { text: 'There was still more. But I think this is where we stop.',                               face: 'normal'   },
      { text: '……keeps turning up.',                                          face: 'normal'   },
      // bond >= 2
      { text: 'Not bad. Okay, let\'s pack it up.',                                      face: 'relieved',  minBond: 2 },
      // bond >= 4
      { text: '……you\'re really lucky.',                                    face: 'relieved',  minBond: 4 },
      // bond >= 6
      { text: 'Don\'t get cocky. Quit while you\'re ahead.',                                    face: 'relieved',   minBond: 6 },
      // bond >= 8
      { text: 'You\'re really serious about this. ……so am I, for the record.',             face: 'relieved',     minBond: 8 },
      // bond >= 10
      { text: '……feels like things have been going our way lately.<br>That\'s not just my imagination, right?',       face: 'shy',     minBond: 10 },
      { text: 'Alright, let\'s keep this up. We\'ve got this.',       face: 'relieved',     minBond: 12 },
    ],
    // 3rd success
    [
      { text: 'Wow……incredible. What a haul.',                        face: 'tense'    },
      { text: 'Impressive……but isn\'t that a bit greedy?',          face: 'tense'    },
      // bond >= 2
      { text: 'At this point I\'m just impressed. Come on, let\'s go.',     face: 'tense',   minBond: 2 },
      // bond >= 4
      { text: 'You……are genuinely lucky. I\'m kind of stunned.',           face: 'tired',  minBond: 4 },
      // bond >= 6
      { text: 'You\'ve got guts. Genuinely impressive.',                            face: 'relieved', minBond: 6 },
      // bond >= 8
      { text: 'Look at you go……where does that determination come from? It\'s actually amazing.',                      face: 'relieved',     minBond: 8 },
      // bond >= 10
      { text: 'Incredible……things always happen when you\'re around.<br>Ha……spending time with you isn\'t bad at all.',     face: 'relieved',     minBond: 10 },
      { text: 'You take risks. I\'d never do that.<br>But it\'s working out, which is the right call.',     face: 'relieved',     minBond: 12 },
    ],
  ],

  fail: [
    // 1st fail
    [
      { text: 'Hey, you okay?',                                            face: 'tense'    },
      { text: 'Be a bit more careful next time.',                                     face: 'normal'    },
      // bond >= 2
      { text: '……well, these things happen.',                                             face: 'normal',   minBond: 2 },
      // bond >= 4
      { text: 'You hurt? I\'ll take a look later.',                                           face: 'normal',   minBond: 4 },
      // bond >= 6
      { text: 'At least you\'re safe……don\'t scare me like that.',                                face: 'tense',   minBond: 6 },
      // bond >= 8
      { text: 'Let me check the injury. ……you look okay though?',                face: 'tense',   minBond: 8 },
      // bond >= 10
      { text: 'Please don\'t do reckless things. I hate it. ……for my own sake.',             face: 'scared',  minBond: 10 },
      { text: 'That hurt, didn\'t it? Sorry for letting you push so far……',             face: 'dumb',  minBond: 12 },
    ],
    // 2nd fail
    [
      { text: '……you really never learn.',                                   face: 'tired'    },
      // bond >= 2
      { text: 'hah……don\'t be reckless.',                                         face: 'tired',   minBond: 2 },
      // bond >= 4
      { text: 'It\'s your call……just don\'t push yourself.',                            face: 'tired',   minBond: 4 },
      // bond >= 6
      { text: 'Please stop being reckless……are you messing with me?',                      face: 'dumb',  minBond: 6 },
      // bond >= 8
      { text: 'I don\'t want to see you get hurt. ……do you get that?',                      face: 'dumb',   minBond: 8 },
      // bond >= 10
      { text: 'I genuinely hate it when you get hurt. Please.',                            face: 'scared',  minBond: 10 },
      { text: 'I know you want to be prepared……hah, I wish I could take the hits for you.',                            face: 'scared',  minBond: 12 },
    ],
    // 3rd fail
    [
      { text: 'Let\'s go. That\'s enough.',                                                   face: 'tired'    },
      // bond >= 2
      { text: '……rough run. Come on, let\'s go.',                              face: 'tired',   minBond: 2 },
      // bond >= 4
      { text: 'It\'s on me too for not stopping you. Just — please, no more.',       face: 'dumb',   minBond: 4 },
      // bond >= 6
      { text: 'Please stop already. Come on — any injuries?',                               face: 'dumb',  minBond: 6 },
      // bond >= 8
      { text: 'Show me the injury. I\'m seriously……going to die of stress over you……',                   face: 'dumb',  minBond: 8 },
      // bond >= 10
      { text: 'Please just……don\'t make me worry. You matter to me.', face: 'scared', minBond: 10 },
      { text: 'The fact that you don\'t fear risk is one of your good points……but I still don\'t want you getting hurt.', face: 'scared', minBond: 12 },
    ],
  ],

};


// ── Reactions when specific items are found ──────────────────────────────────
// When the relevant item is found during exploration, this line takes priority
// over the location's good/bad lines (hitting this overrides the good/bad check)

const SEBA_ITEM_REACTIONS = {
  cigarette: [
    { text: 'Cigarettes……maybe give them to that black cat.',    face: 'tired'    },
    { text: 'I don\'t smoke, but do you? Well, we\'ll hold onto them.',          face: 'normal',  minBond: 6 },
  ],
  finger: [
    { text: 'Whoa — a finger? Are you seriously taking that?<br>Yeah……okay, you hold it.', face: 'scared' },
    { text: '……a finger.<br>Here — you take it. I can\'t.',          face: 'dumb',  minBond: 6 },
],
  old_key: [
    { text: 'A key. Not one for getting outside……I don\'t think.',                       face: 'normal'   },
    { text: '……a key. Hopefully there\'s a room somewhere we can actually rest.',          face: 'normal',  minBond: 6 },
  ],
  chocolate: [
    { text: 'Chocolate. ……nice.',                                     face: 'relieved' },
    { text: 'Chocolate……eating this somehow gives me a little boost.',          face: 'relieved', minBond: 8 },
  ],
  notebook: [
    { text: 'That notebook……you\'re really taking it?<br>Ha……poor thing……',    face: 'tired'    },
    { text: 'That notebook……I wouldn\'t look inside if I were you. Haha……', face: 'dumb', minBond: 6 },
  ],
};

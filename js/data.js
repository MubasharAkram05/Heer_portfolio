/* Content data: the arrays every renderer reads from.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
const PROJECTS = [
  {tag:'Mobile Game', title:'Orbit Drift', desc:'A one-tap arcade game about steering a satellite through asteroid fields, with daily challenge runs.', stack:['Unity','C#','Firebase'], demo:'#', code:'#'},
  {tag:'App', title:'Trailhead', desc:'A hiking companion app with offline maps and trail condition reports from the community.', stack:['Flutter','Firebase'], demo:'#', code:'#'},
  {tag:'Puzzle Game', title:'Knot', desc:'A minimalist rope-untangling puzzle game with 150 hand-built levels and a level editor.', stack:['Unity','C#'], demo:'#', code:'#'},
  {tag:'App', title:'Habitline', desc:'A habit tracker with streaks, gentle reminders, and week-over-week progress charts.', stack:['Kotlin','Room DB'], demo:'#', code:'#'},
  {tag:'Multiplayer Game', title:'Party Grid', desc:'A local-multiplayer mini-game collection built for couch play, four players on one screen.', stack:['Unity','Photon'], demo:'#', code:'#'},
  {tag:'Tool', title:'Colorway', desc:'A palette and contrast-checking tool for designers working in accessible color systems.', stack:['Vanilla JS','Canvas'], demo:'#', code:'#'},
];

const SERVICES = [
  {icon:'▢', title:'Mobile App Development', desc:'iOS and Android builds, from a first prototype through to a store-ready release. Native where it earns its keep and cross-platform where it does not, with offline behaviour and performance treated as features rather than afterthoughts.',
   tags:['Swift','Kotlin','Flutter','React Native'],
   points:['Native and cross-platform','Offline-first where it matters','Store submission handled']},
  {icon:'◈', title:'Game Development', desc:'2D and 3D games with controls that feel right and a frame rate that holds up on the phones people actually own, not just the newest one. Gameplay, level tooling and the build pipeline that lets you keep shipping content after release.',
   tags:['Unity','C#','Shaders','Level tooling'],
   points:['Unity and C#','Gameplay and level tooling','Tested on low-end hardware']},
  {icon:'◐', title:'UI / UX Design', desc:'Interfaces designed around how people actually use them — research, wireframes and final screens, handed over ready to build.',
   tags:['Figma','Design systems','Prototyping','Accessibility'],
   points:['Wireframes to final screens','Design systems and tokens','Accessible by default']},
  {icon:'⬡', title:'Web Development', desc:'Fast, responsive sites and web apps built on web standards rather than page builders, so they stay cheap to change later.',
   tags:['HTML','CSS','JavaScript','Performance'],
   points:['Hand-written HTML, CSS, JS','Responsive to the smallest screen','Fast on a slow connection']},
  {icon:'✦', title:'MVP & Prototyping', desc:'A working slice of the idea in weeks, so you can put it in front of real people before committing a full budget to it.',
   tags:['Scoping','Rapid build','User testing'],
   points:['Scoped to one core loop','Real data, not mockups','Built to be thrown away or grown']},
  {icon:'⟳', title:'Maintenance & Support', desc:'The work that starts after launch. Updates, bug fixes, performance passes and keeping up with everything the app stores and operating systems keep changing underneath you. Available as an ongoing retainer or on demand, whichever suits how often your product moves.',
   tags:['Bug fixes','OS updates','Store compliance','Performance'],
   points:['Bug fixes and OS updates','Store compliance','Ongoing or on demand']},
  {icon:'◈', title:'AI Chatbots', desc:'Intelligent chatbots that handle customer support, qualify leads and keep conversations moving while you sleep. Built on natural language models and wired into your website, mobile app or WhatsApp, so people get answers where they already are.',
   tags:['Natural language','Website widget','WhatsApp','Lead capture','Handover to human'],
   points:['Trained on your own content','Works across web and mobile','Analytics on every conversation']},
  {icon:'⬢', title:'Business Automation', desc:'Workflows that run themselves instead of eating your week. CRM updates, lead routing, reporting and the integrations between the tools you already pay for, so the repetitive parts stop needing a person in the middle.',
   tags:['Workflow automation','CRM integration','Lead routing','Reporting','APIs'],
   points:['Mapped before it is built','Connects existing tools','Handover docs included']},
  {icon:'◑', title:'Graphic Designing', desc:'Brand identity and the artwork around your product — logos, icon sets, key art, store screenshots and social assets. Everything is built to a system rather than as one-off files, so the next piece stays on brand without starting from scratch.',
   tags:['Brand identity','Logo design','Icon sets','Key art','Social assets'],
   points:['Source files handed over','Brand guidelines included','Print and screen ready']},
  {icon:'◭', title:'Digital Marketing', desc:'Getting the build in front of the people it was made for. App store optimisation, launch campaigns, and the analytics underneath them, so you can see what is actually working instead of guessing at it.',
   tags:['App store optimisation','Launch campaigns','Analytics','Social','Email'],
   points:['Store listing optimised','Campaigns set up and tracked','Monthly reporting']},
];

const CAPABILITIES = ['App Development','Game Development','UI / UX Design','Web Development','AI Chatbots','Business Automation','Graphic Design','Digital Marketing','Prototyping','Design Systems','Unity','Flutter','Accessibility','Performance','Store Release','Maintenance'];

const PROCESS = [
  {title:'User research &amp; discovery', desc:'We start by understanding the product, the people who will use it, and the market it lands in. Research and analysis surface the real needs, the pain points, and where the growth actually is.'},
  {title:'Problem definition &amp; strategy', desc:'The core challenges and project goals get written down and agreed. That turns into a focused plan aligned with what the business is trying to achieve, not a wish list.'},
  {title:'Design &amp; prototyping', desc:'Wireframes first, then interactive prototypes and final screens. You get to click through the experience and change your mind before a line of production code exists.'},
  {title:'Development &amp; integration', desc:'The build itself — apps, games and web, wired into whatever services they need. Written for speed, security and for the next person who has to change it.'},
  {title:'Testing &amp; optimisation', desc:'Every build goes through functional testing, performance passes and a real-device sweep. Speed, usability and cross-device behaviour all get tuned before release.'},
  {title:'Launch &amp; deployment', desc:'Once you approve it, we ship — store submission, release and monitoring. The goal is that everything works properly from day one, not day thirty.'},
];

const REVIEW_SCORE = {score:'4.9/5', stars:5, note:'Based on 12 client reviews'};

const TESTIMONIALS = [
  {quote:'We came in with a rough idea and a deadline. Heer scoped it down to something we could actually ship, then shipped it — the first build was in our hands inside three weeks.', name:'Amara Okafor', role:'Founder, Trailhead', feature:true},
  {quote:'The handover was the best part. Clean code, a real README, and a walkthrough call. Our own team picked it up without a single question.', name:'Daniel Reyes', role:'CTO, Northbeam'},
  {quote:'Our game finally feels good to play on cheap Android phones. That was the whole brief and it got solved properly rather than patched over.', name:'Priya Nair', role:'Producer, Sunbreak Studio'},
  {quote:'Weekly builds meant we caught a bad assumption in week two instead of at launch. That alone paid for the project.', name:'Tomas Lindqvist', role:'Product Lead, Habitline'},
];

/* Every tool and game, in the order they appear on their page. */
const CATALOG = [
  {page:'tools', panel:'panel-counter', icon:'✎', title:'Word &amp; Character Counter', desc:'Paste text, get live word, character, and sentence counts.', init:'', tags:["Live counts", "Words", "Sentences"]},
  {page:'tools', panel:'panel-palette', icon:'◆', title:'Color Palette Generator', desc:'Generate a random 5-color palette. Click a swatch to copy its hex.', init:'genPalette', tags:["Random palettes", "Copy hex", "5 colours"]},
  {page:'tools', panel:'panel-pass', icon:'⚿', title:'Password Generator', desc:'Build a random password with the character sets you choose.', init:'', tags:["Character sets", "Adjustable length", "Copy"]},
  {page:'tools', panel:'panel-unit', icon:'↔', title:'Unit Converter', desc:'Convert length between metric and imperial units.', init:'', tags:["Metric", "Imperial", "Length"]},
  {page:'tools', panel:'panel-case', icon:'Aa', title:'Text Case Converter', desc:'Switch text between sentence, title, camel, snake and kebab case.', init:'', tags:["7 cases", "camelCase", "kebab-case"]},
  {page:'tools', panel:'panel-b64', icon:'⧉', title:'Base64 Encoder / Decoder', desc:'Encode text to Base64 or decode it back, entirely in your browser.', init:'', tags:["Encode", "Decode", "Unicode safe"]},
  {page:'tools', panel:'panel-lorem', icon:'¶', title:'Lorem Ipsum Generator', desc:'Placeholder paragraphs for mockups, at the length you need.', init:'genLorem', tags:["1\u20138 paragraphs", "Regenerate", "Copy"]},
  {page:'tools', panel:'panel-contrast', icon:'◑', title:'Contrast Checker', desc:'Check a text and background pair against the WCAG contrast levels.', init:'checkContrast', tags:["WCAG AA", "WCAG AAA", "Live preview"]},
  {page:'games', panel:'panel-ttt', icon:'✕', title:'Tic-Tac-Toe', desc:'Local two-player. First to three in a row wins.', init:'initTTT', tags:["Two player", "Local", "Win detection"]},
  {page:'games', panel:'panel-memory', icon:'▦', title:'Memory Match', desc:'Flip two cards at a time. Match all pairs in the fewest moves.', init:'initMemory', tags:["16 cards", "Pairs", "Move counter"]},
  {page:'games', panel:'panel-rps', icon:'✊', title:'Rock, Paper, Scissors', desc:'Play against the computer. First to five wins the round.', init:'', tags:["vs computer", "First to five", "Running score"]},
  {page:'games', panel:'panel-reaction', icon:'⚡', title:'Reaction Timer', desc:'Wait for the panel to turn, then hit it. How fast are you really?', init:'resetReaction', tags:["Milliseconds", "Best time", "Early-click guard"]},
  {page:'games', panel:'panel-guess', icon:'?', title:'Guess the Number', desc:'One to a hundred. Every guess tells you higher or lower.', init:'resetGuess', tags:["1\u2013100", "Higher / lower", "Guess history"]},
  {page:'games', panel:'panel-simon', icon:'◎', title:'Simon Says', desc:'Watch the sequence, repeat it back. It gets one longer each round.', init:'resetSimon', tags:["Four pads", "Growing sequence", "Round counter"]},
];

/* Rotating job titles for the hero's typing line. */
const roles = ['App & Games Developer', 'Mobile App Builder', 'Game Developer', 'Problem Solver'];

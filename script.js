/* ---------------- Routing ---------------- */
const pageOrder = ['home','about','work','tools','games','services','contact'];

/* Pages visited this session, so Back steps through them instead of
   leaving the site the way the browser's own back button does. */
const pageTrail = [];

function goBack(){
  const prev = pageTrail.pop();
  goTo(prev ? prev.id : 'home', true, prev ? prev.scrollY : 0);
}

function updateBackBtn(){
  const btn = document.getElementById('backBtn');
  if(btn) btn.hidden = pageTrail.length === 0;
}

function goTo(id, isBack, restoreY){
  const current = document.querySelector('.page.active');
  const currentId = current && current.id.replace('page-','');
  if(!isBack && currentId && currentId !== id){
    // remember where we were on that page, not just which page it was
    pageTrail.push({ id: currentId, scrollY: window.scrollY });
    if(pageTrail.length > 20) pageTrail.shift();
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-'+id);
  if(target) target.classList.add('active');

  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === id);
  });

  const idx = pageOrder.indexOf(id) + 1;
  const total = pageOrder.length;
  const label = String(idx).padStart(2,'0') + '/' + String(total).padStart(2,'0');
  document.getElementById('sheetNum').textContent = label;
  document.getElementById('footSheet').textContent = label;

  if(target){
    target.querySelectorAll('.grid-cards').forEach(gridEl => {
      gridEl.classList.remove('animate-in');
      void gridEl.offsetWidth;
      gridEl.classList.add('animate-in');
    });
  }

  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('utilDropdown').classList.remove('open');
  const mt = document.getElementById('menuToggle');
  if(mt) mt.setAttribute('aria-expanded', 'false');
  updateBackBtn();
  document.body.style.overflow = '';
  // 'auto' resolves to the CSS scroll-behavior, which is smooth here, so the
  // jump never happened; 'instant' forces it
  window.scrollTo({ top: isBack ? (restoreY || 0) : 0, behavior:'instant' });
  try { history.replaceState(null,'','#'+id); } catch(err) { /* sandboxed preview: ignore */ }
}

function toggleDropdown(e){
  e.preventDefault();
  document.getElementById('utilDropdown').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const dd = document.getElementById('utilDropdown');
  if(!dd.contains(e.target)) dd.classList.remove('open');

  const nav = document.getElementById('navLinks');
  const toggleBtn = document.getElementById('menuToggle');
  if(nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggleBtn){
    nav.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
});

function toggleMobileNav(){
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('menuToggle');
  const isOpen = nav.classList.contains('open');
  if(isOpen){
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

window.addEventListener('load', () => {
  const hash = location.hash.replace('#','');
  goTo(pageOrder.includes(hash) ? hash : 'home');
});

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const selectors = '.section-head, .about-grid > div, .card, .util-card, .contact-grid > div, .social-list, .titleblock';
  document.querySelectorAll(selectors).forEach(el => el.classList.add('reveal'));

  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------------- Button ripple ---------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .small-btn');
  if(!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

/* ---------------- Hero role typing line ---------------- */
const roles = ['App & Games Developer', 'Mobile App Builder', 'Game Developer', 'Problem Solver'];
let rIdx = 0, cIdx = 0, deleting = false;
function tickRole(){
  const el = document.getElementById('roleLine');
  const current = roles[rIdx];
  if(!deleting){
    cIdx++;
    el.innerHTML = current.slice(0,cIdx) + '<span class="cursor">|</span>';
    if(cIdx === current.length){ deleting = true; setTimeout(tickRole, 1200); return; }
  } else {
    cIdx--;
    el.innerHTML = current.slice(0,cIdx) + '<span class="cursor">|</span>';
    if(cIdx === 0){ deleting = false; rIdx = (rIdx+1) % roles.length; }
  }
  setTimeout(tickRole, deleting ? 40 : 70);
}
tickRole();

/* ---------------- Projects ---------------- */
const PROJECTS = [
  {tag:'Mobile Game', title:'Orbit Drift', desc:'A one-tap arcade game about steering a satellite through asteroid fields, with daily challenge runs.', stack:['Unity','C#','Firebase'], demo:'#', code:'#'},
  {tag:'App', title:'Trailhead', desc:'A hiking companion app with offline maps and trail condition reports from the community.', stack:['Flutter','Firebase'], demo:'#', code:'#'},
  {tag:'Puzzle Game', title:'Knot', desc:'A minimalist rope-untangling puzzle game with 150 hand-built levels and a level editor.', stack:['Unity','C#'], demo:'#', code:'#'},
  {tag:'App', title:'Habitline', desc:'A habit tracker with streaks, gentle reminders, and week-over-week progress charts.', stack:['Kotlin','Room DB'], demo:'#', code:'#'},
  {tag:'Multiplayer Game', title:'Party Grid', desc:'A local-multiplayer mini-game collection built for couch play, four players on one screen.', stack:['Unity','Photon'], demo:'#', code:'#'},
  {tag:'Tool', title:'Colorway', desc:'A palette and contrast-checking tool for designers working in accessible color systems.', stack:['Vanilla JS','Canvas'], demo:'#', code:'#'},
];
const grid = document.getElementById('projectGrid');
function renderProjectCards(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach((p, i) => {
    const row = document.createElement('li');
    row.className = 'service-row';
    row.innerHTML = `
      <span class="row-num">${String(i+1).padStart(2,'0')}.</span>
      <div class="row-main">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="row-links">
          <a href="${p.demo}" class="row-cta" target="_blank" rel="noopener">Live demo <span class="arrow" aria-hidden="true">↗</span></a>
          <a href="${p.code}" class="row-link" target="_blank" rel="noopener">Source</a>
        </div>
        <ul class="row-tags">${p.stack.map(t=>`<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="row-spec">
        <p class="eyebrow">Type</p>
        <p class="row-glyph-text">${p.tag}</p>
      </div>`;
    container.appendChild(row);
  });
}
renderProjectCards('projectGrid', PROJECTS);
renderProjectCards('homeProjectGrid', PROJECTS.slice(0,3));

/* ---------------- Services ---------------- */
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
function renderServiceRows(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach((sv, i) => {
    const row = document.createElement('li');
    row.className = 'service-row';
    row.innerHTML = `
      <span class="row-num">${String(i+1).padStart(2,'0')}.</span>
      <div class="row-main">
        <h3>${sv.title}</h3>
        <p>${sv.desc}</p>
        <a href="#contact" class="row-cta" onclick="goTo('contact')">
          See more &mdash; pricing <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <ul class="row-tags">${sv.tags.map(t=>`<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="row-spec">
        <p class="eyebrow">Deliverables</p>
        <ul>${sv.points.map(pt=>`<li>${pt}</li>`).join('')}</ul>
      </div>`;
    container.appendChild(row);
  });
}

function renderTicker(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  const set = list.map(c=>`<li>${c}</li>`).join('');
  // duplicated so the track loops seamlessly at -50%, same as the home reels
  container.innerHTML = `<ul class="ticker-track">${set}${list.map(c=>`<li aria-hidden="true">${c}</li>`).join('')}</ul>`;
}

function renderProcess(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach((st, i) => {
    const card = document.createElement('li');
    card.className = 'process-card';
    card.innerHTML = `
      <span class="step-oval">${String(i+1).padStart(2,'0')}</span>
      <h3>${st.title}</h3>
      <p>${st.desc}</p>`;
    container.appendChild(card);
  });
}

function renderRating(containerId, r){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = `
    <strong>${r.score}</strong>
    <span class="stars" aria-hidden="true">${'\u2605'.repeat(r.stars)}</span>
    <span class="note">${r.note}</span>`;
  container.setAttribute('aria-label', r.score + ' — ' + r.note);
}

function initials(name){
  return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

function renderQuotes(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach(q => {
    const card = document.createElement('figure');
    card.className = 'quote-card' + (q.feature ? ' featured' : '');
    card.innerHTML = `
      <blockquote>${q.quote}</blockquote>
      <figcaption>
        <span class="avatar" aria-hidden="true">${initials(q.name)}</span>
        <span class="who"><strong>${q.name}</strong><span>${q.role}</span></span>
      </figcaption>`;
    container.appendChild(card);
  });
}

renderServiceRows('serviceRows', SERVICES);
renderServiceRows('homeServiceRows', SERVICES);
renderTicker('capTicker', CAPABILITIES);
renderTicker('heroTicker', CAPABILITIES);
renderQuotes('quoteGrid', TESTIMONIALS);
renderQuotes('homeQuoteGrid', TESTIMONIALS.slice(0,3));
renderProcess('homeProcess', PROCESS);
renderProcess('servicesProcess', PROCESS);

/* ---------------- Footer link columns ---------------- */
function renderFooterLinks(){
  const svc = document.getElementById('footerServices');
  if(svc){
    svc.innerHTML = SERVICES.slice(0,6).map(v =>
      `<li><a href="#services" onclick="goTo('services')">${v.title}</a></li>`).join('');
  }
  // the reels already list every tool and game, so reuse them as the source
  const fill = (id, page) => {
    const box = document.getElementById(id);
    if(!box) return;
    const reel = document.querySelector(`.marquee[aria-label="${page}"]`);
    if(!reel) return;
    const seen = [...reel.querySelectorAll('.mini-card:not([aria-hidden]) h4')];
    box.innerHTML = seen.map(h => {
      const btn = h.parentElement.querySelector('.mini-open');
      return `<li><a href="#${page.toLowerCase()}" onclick="${btn.getAttribute('onclick')}">${h.innerHTML}</a></li>`;
    }).join('');
  };
  fill('footerTools', 'Tools');
  fill('footerGames', 'Games');
}
renderFooterLinks();
renderRating('homeRating', REVIEW_SCORE);

initReveal();
initCounters();

/* ---------------- Stat counters ---------------- */
function initCounters(){
  const nums = document.querySelectorAll('.stat-num');
  if(!nums.length) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const REPEAT_AFTER = 4000;
  const onScreen = new WeakSet();

  const animateNum = (el, done) => {
    if(el.dataset.static){ el.textContent = el.dataset.static; return; }
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if(reduceMotion){ el.textContent = target + suffix; return; }
    const duration = 1100;
    const startTime = performance.now();
    function tick(now){
      const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else if(done) done();
    }
    requestAnimationFrame(tick);
  };

  // Run the count again every few seconds, but only while the figures are
  // actually on screen and the tab is in front.
  const queueRepeat = (el) => {
    setTimeout(() => {
      if(!onScreen.has(el) || document.hidden){ queueRepeat(el); return; }
      el.textContent = '0' + (el.dataset.suffix || '');
      animateNum(el, () => queueRepeat(el));
    }, REPEAT_AFTER);
  };

  const runAndRepeat = (el) => {
    if(reduceMotion || el.dataset.static){ animateNum(el); return; }
    animateNum(el, () => queueRepeat(el));
  };

  // The cards fade in on a stagger, so counting straight away would run
  // most of the way through while they are still hidden. Wait for the
  // card's entrance to finish, then count.
  const countAfterEntrance = (el) => {
    const card = el.closest('.stat-card');
    if(reduceMotion || !card || typeof card.getAnimations !== 'function'){
      runAndRepeat(el);
      return;
    }
    const pending = card.getAnimations().filter(a => a.playState !== 'finished');
    if(!pending.length){ runAndRepeat(el); return; }
    Promise.all(pending.map(a => a.finished))
      .then(() => runAndRepeat(el))
      .catch(() => runAndRepeat(el));
  };

  if(!('IntersectionObserver' in window)){
    nums.forEach(el => { onScreen.add(el); countAfterEntrance(el); });
    return;
  }
  const started = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // keep observing: the repeat loop needs to know when we scroll away
      if(entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
      if(entry.isIntersecting && !started.has(entry.target)){
        started.add(entry.target);
        countAfterEntrance(entry.target);
      }
    });
  }, { threshold:0.4 });
  nums.forEach(el => io.observe(el));
}

/* ---------------- Panels ---------------- */
function togglePanel(id){
  document.getElementById(id).classList.toggle('open');
}

/* ---------------- Tool: word counter ---------------- */
function updateCounter(){
  const text = document.getElementById('counterInput').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim()?1:0);
  document.getElementById('cWords').textContent = words;
  document.getElementById('cChars').textContent = chars;
  document.getElementById('cSentences').textContent = sentences;
}

/* ---------------- Tool: palette ---------------- */
function genPalette(){
  const row = document.getElementById('swatchRow');
  row.innerHTML = '';
  for(let i=0;i<5;i++){
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = hex;
    sw.textContent = hex;
    sw.onclick = () => {
      if(navigator.clipboard){ navigator.clipboard.writeText(hex); }
      const msg = document.getElementById('copyMsg');
      msg.textContent = 'Copied ' + hex;
      msg.classList.remove('pop');
      void msg.offsetWidth;
      msg.classList.add('pop');
    };
    row.appendChild(sw);
  }
}

/* ---------------- Tool: password generator ---------------- */
function genPassword(){
  const len = +document.getElementById('passLength').value;
  const upper = document.getElementById('passUpper').checked;
  const nums = document.getElementById('passNum').checked;
  const syms = document.getElementById('passSym').checked;
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if(upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(nums) chars += '0123456789';
  if(syms) chars += '!@#$%^&*()_+-=[]{}';
  let out = '';
  for(let i=0;i<len;i++){ out += chars[Math.floor(Math.random()*chars.length)]; }
  const outEl = document.getElementById('passOutput');
  outEl.value = out;
  outEl.classList.remove('value-pulse');
  void outEl.offsetWidth;
  outEl.classList.add('value-pulse');
}

/* ---------------- Tool: unit converter ---------------- */
const toMeters = {m:1, km:1000, cm:0.01, in:0.0254, ft:0.3048, mi:1609.34};
function convertUnit(){
  const val = +document.getElementById('unitInput').value || 0;
  const from = document.getElementById('unitFrom').value;
  const to = document.getElementById('unitTo').value;
  const meters = val * toMeters[from];
  const result = meters / toMeters[to];
  const resEl = document.getElementById('unitResult');
  resEl.textContent = result.toLocaleString(undefined,{maximumFractionDigits:4});
  resEl.classList.remove('pop');
  void resEl.offsetWidth;
  resEl.classList.add('pop');
}
convertUnit();

/* ---------------- Game: Tic-Tac-Toe ---------------- */
let tttState, tttTurn, tttOver;
function initTTT(){
  tttState = Array(9).fill(null);
  tttTurn = 'X';
  tttOver = false;
  document.getElementById('tttStatus').textContent = "Player X's turn";
  const board = document.getElementById('tttBoard');
  board.innerHTML = '';
  tttState.forEach((_, i) => {
    const cell = document.createElement('button');
    cell.className = 'ttt-cell';
    cell.setAttribute('aria-label', 'cell '+i);
    cell.onclick = () => tttMove(i, cell);
    board.appendChild(cell);
  });
}
function tttMove(i, cell){
  if(tttOver || tttState[i]) return;
  tttState[i] = tttTurn;
  cell.textContent = tttTurn;
  cell.classList.add('filled');
  cell.disabled = true;
  const outcome = checkTTTWinner();
  if(outcome){
    tttOver = true;
    document.getElementById('tttStatus').textContent = 'Player ' + outcome.winner + ' wins!';
    const cells = document.querySelectorAll('.ttt-cell');
    outcome.line.forEach(idx => cells[idx].classList.add('win'));
    return;
  }
  if(tttState.every(c => c)){
    tttOver = true;
    document.getElementById('tttStatus').textContent = "It's a draw.";
    return;
  }
  tttTurn = tttTurn === 'X' ? 'O' : 'X';
  document.getElementById('tttStatus').textContent = "Player " + tttTurn + "'s turn";
}
function checkTTTWinner(){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const line of lines){
    const [a,b,c] = line;
    if(tttState[a] && tttState[a]===tttState[b] && tttState[a]===tttState[c]) return {winner:tttState[a], line};
  }
  return null;
}

/* ---------------- Game: Memory Match ---------------- */
let memState, memFlipped, memMatched, memMoves, memLock;
function initMemory(){
  const icons = ['🌵','🚀','🎧','📎','🦋','⚙️','🔑','🌊'];
  memState = [...icons, ...icons].sort(() => Math.random()-0.5);
  memFlipped = []; memMatched = []; memMoves = 0; memLock = false;
  document.getElementById('memoryStatus').textContent = 'Moves: 0';
  const board = document.getElementById('memoryBoard');
  board.innerHTML = '';
  memState.forEach((icon, i) => {
    const cell = document.createElement('button');
    cell.className = 'memory-cell';
    cell.dataset.index = i;
    cell.innerHTML = '<div class="memory-card-inner">'
      + '<div class="memory-face memory-front">?</div>'
      + '<div class="memory-face memory-back">' + icon + '</div>'
      + '</div>';
    cell.onclick = () => memFlip(i, cell);
    board.appendChild(cell);
  });
}
function memFlip(i, cell){
  if(memLock || memFlipped.includes(i) || memMatched.includes(i)) return;
  cell.classList.add('flipped');
  memFlipped.push(i);
  if(memFlipped.length === 2){
    memMoves++;
    document.getElementById('memoryStatus').textContent = 'Moves: ' + memMoves;
    memLock = true;
    const [a,b] = memFlipped;
    const cells = document.querySelectorAll('.memory-cell');
    if(memState[a] === memState[b]){
      memMatched.push(a,b);
      cells[a].classList.add('matched');
      cells[b].classList.add('matched');
      memFlipped = []; memLock = false;
      if(memMatched.length === memState.length){
        document.getElementById('memoryStatus').textContent = 'Solved in ' + memMoves + ' moves!';
      }
    } else {
      cells[a].classList.add('mismatch');
      cells[b].classList.add('mismatch');
      setTimeout(() => {
        [a,b].forEach(idx => { cells[idx].classList.remove('flipped'); cells[idx].classList.remove('mismatch'); });
        memFlipped = []; memLock = false;
      }, 750);
    }
  }
}

/* ---------------- Game: Rock Paper Scissors ---------------- */
let rpsYou = 0, rpsCpu = 0;
function playRPS(choice){
  const options = ['rock','paper','scissors'];
  const cpu = options[Math.floor(Math.random()*3)];
  let result, state;
  if(choice === cpu){ result = "Tie — both chose " + choice + '.'; state = 'tie'; }
  else if(
    (choice==='rock' && cpu==='scissors') ||
    (choice==='paper' && cpu==='rock') ||
    (choice==='scissors' && cpu==='paper')
  ){
    rpsYou++; result = 'You win this round — ' + choice + ' beats ' + cpu + '.'; state = 'win';
  } else {
    rpsCpu++; result = 'Computer wins — ' + cpu + ' beats ' + choice + '.'; state = 'lose';
  }
  document.getElementById('rpsScore').textContent = `You: ${rpsYou} — Computer: ${rpsCpu}`;
  const resEl = document.getElementById('rpsResult');
  resEl.textContent = result;
  resEl.className = 'eyebrow ' + state;
  resEl.classList.remove('pop');
  void resEl.offsetWidth;
  resEl.classList.add('pop');
}

/* ---------------- Contact form ---------------- */
function sendMail(e){
  e.preventDefault();
  const name = document.getElementById('cName').value;
  const email = document.getElementById('cEmail').value;
  const msg = document.getElementById('cMsg').value;
  const subject = encodeURIComponent('Portfolio contact from ' + name);
  const body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
  window.location.href = `mailto:hello@hiraiqbal.dev?subject=${subject}&body=${body}`;
  return false;
}

/* ---------------- Inline form validation ---------------- */
function attachInlineValidation(input, validator, message){
  const field = input.closest('.field');
  let hint = field.querySelector('.field-hint');
  if(!hint){
    hint = document.createElement('small');
    hint.className = 'field-hint';
    field.appendChild(hint);
  }
  function check(){
    const ok = validator(input.value.trim());
    field.classList.toggle('field-valid', ok && input.value.trim().length > 0);
    field.classList.toggle('field-invalid', !ok && input.value.trim().length > 0);
    hint.textContent = (!ok && input.value.trim().length > 0) ? message : '';
  }
  input.addEventListener('input', check);
  input.addEventListener('blur', check);
}
(function initContactValidation(){
  const nameEl = document.getElementById('cName');
  const emailEl = document.getElementById('cEmail');
  const msgEl = document.getElementById('cMsg');
  if(!nameEl) return;
  attachInlineValidation(nameEl, v => v.length >= 2, 'Enter at least 2 characters.');
  attachInlineValidation(emailEl, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.');
  attachInlineValidation(msgEl, v => v.length >= 10, 'Message should be at least 10 characters.');
})();

/* ---------------- Theme (auto light/dark) ---------------- */
function applyTheme(mode){
  document.documentElement.setAttribute('data-theme', mode);
  try{ localStorage.setItem('portfolio-theme', mode); }catch(e){}
  const icon = document.querySelector('#themeToggle .mode-icon');
  if(icon) icon.textContent = mode === 'dark' ? '☀️' : '🌙';
}
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
(function initTheme(){
  let saved = null;
  try{ saved = localStorage.getItem('portfolio-theme'); }catch(e){}
  if(saved){
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
})();

/* ---------------- Footer ---------------- */
document.getElementById('footYear').textContent = new Date().getFullYear();
document.getElementById('footDate').textContent = new Date().toLocaleDateString('en-US',{month:'short', year:'numeric'});

/* ---------------- Home reels: hold still while being dragged ---------------- */
(function initReelTouch(){
  const reels = document.querySelectorAll('.marquee');
  if(!reels.length) return;
  reels.forEach(reel => {
    let idle;
    const hold = () => { clearTimeout(idle); reel.classList.add('is-touching'); };
    const release = () => {
      clearTimeout(idle);
      idle = setTimeout(() => reel.classList.remove('is-touching'), 900);
    };
    reel.addEventListener('touchstart', hold, { passive:true });
    reel.addEventListener('touchend', release, { passive:true });
    reel.addEventListener('touchcancel', release, { passive:true });
    // trackpad and momentum scrolling never fire touchend
    reel.addEventListener('scroll', () => { hold(); release(); }, { passive:true });
  });
})();

/* ---------------- Scroll progress ---------------- */
(function initScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
  };
  const onScroll = () => {
    if(queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  addEventListener('scroll', onScroll, { passive:true });
  addEventListener('resize', onScroll, { passive:true });
  update();
})();

/* ---------------- Shared: copy helper ---------------- */
function copyFrom(id, btn){
  const el = document.getElementById(id);
  if(!el) return;
  const text = 'value' in el ? el.value : el.innerText;
  if(!text) return;
  const done = () => {
    const was = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = was; }, 1200);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => {});
  }
}

/* ---------------- Tool: text case ---------------- */
let caseMode = 'upper';
function setCase(mode){ caseMode = mode; convertCase(); }
function convertCase(){
  const src = document.getElementById('caseInput').value;
  const words = src.trim().length ? src.trim().split(/\s+/) : [];
  let out = src;
  if(caseMode === 'upper') out = src.toUpperCase();
  else if(caseMode === 'lower') out = src.toLowerCase();
  else if(caseMode === 'sentence'){
    out = src.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
  }
  else if(caseMode === 'title'){
    out = src.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  else if(caseMode === 'camel'){
    out = words.map((w, i) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      return i === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
    }).join('');
  }
  else if(caseMode === 'snake') out = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g,'')).join('_');
  else if(caseMode === 'kebab') out = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g,'')).join('-');
  document.getElementById('caseOutput').value = out;
}

/* ---------------- Tool: base64 ---------------- */
let b64Mode = 'encode';
function setB64Mode(mode){ b64Mode = mode; runBase64(); }
function runBase64(){
  const src = document.getElementById('b64Input').value;
  const out = document.getElementById('b64Output');
  const note = document.getElementById('b64Note');
  note.textContent = b64Mode === 'encode' ? 'Encoding' : 'Decoding';
  if(!src){ out.value = ''; return; }
  try {
    // the unescape/escape pair keeps non-ASCII working through btoa/atob
    out.value = b64Mode === 'encode'
      ? btoa(unescape(encodeURIComponent(src)))
      : decodeURIComponent(escape(atob(src.trim())));
  } catch(err){
    out.value = '';
    note.textContent = b64Mode === 'encode' ? 'Could not encode that' : 'That is not valid Base64';
  }
}

/* ---------------- Tool: lorem ipsum ---------------- */
const LOREM_WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor '
  + 'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation '
  + 'ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit '
  + 'voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non '
  + 'proident sunt culpa qui officia deserunt mollit anim id est laborum').split(' ');
function genLorem(){
  const paras = +document.getElementById('loremCount').value;
  const out = document.getElementById('loremOut');
  out.innerHTML = '';
  for(let i = 0; i < paras; i++){
    const sentences = 3 + Math.floor(Math.random() * 3);
    let text = '';
    for(let sIdx = 0; sIdx < sentences; sIdx++){
      const len = 8 + Math.floor(Math.random() * 8);
      const words = [];
      for(let w = 0; w < len; w++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      text += words.join(' ') + '. ';
    }
    const p = document.createElement('p');
    p.textContent = text.trim();
    out.appendChild(p);
  }
}

/* ---------------- Tool: contrast checker ---------------- */
function relLuminance(hex){
  const rgb = [1,3,5].map(i => parseInt(hex.substr(i,2),16)/255)
    .map(c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
  return 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2];
}
function checkContrast(){
  const fg = document.getElementById('cFg').value;
  const bg = document.getElementById('cBg').value;
  const l1 = relLuminance(fg), l2 = relLuminance(bg);
  const ratio = (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05);
  const shown = Math.round(ratio * 100) / 100;
  const preview = document.getElementById('contrastPreview');
  preview.style.color = fg;
  preview.style.background = bg;
  document.getElementById('contrastRatio').textContent = shown + ' : 1';
  const levels = [
    ['AA body', 4.5], ['AAA body', 7],
    ['AA large', 3], ['AAA large', 4.5],
  ];
  document.getElementById('contrastBadges').innerHTML = levels.map(([label, need]) => {
    const ok = ratio >= need;
    return '<span class="pass-badge ' + (ok ? 'pass' : 'fail') + '">'
      + label + ' ' + (ok ? 'pass' : 'fail') + '</span>';
  }).join('');
}

/* ---------------- Game: reaction timer ---------------- */
let reactionState = 'idle', reactionAt = 0, reactionTimer = null, reactionBest = null;
function resetReaction(){
  clearTimeout(reactionTimer);
  reactionState = 'idle';
  const pad = document.getElementById('reactionPad');
  pad.className = 'reaction-pad';
  pad.textContent = 'Click to start';
}
function reactionClick(){
  const pad = document.getElementById('reactionPad');
  if(reactionState === 'idle'){
    reactionState = 'waiting';
    pad.className = 'reaction-pad waiting';
    pad.textContent = 'Wait for it…';
    reactionTimer = setTimeout(() => {
      reactionState = 'go';
      reactionAt = performance.now();
      pad.className = 'reaction-pad go';
      pad.textContent = 'Now!';
    }, 1200 + Math.random() * 2800);
    return;
  }
  if(reactionState === 'waiting'){
    clearTimeout(reactionTimer);
    reactionState = 'idle';
    pad.className = 'reaction-pad early';
    pad.textContent = 'Too early — click to try again';
    return;
  }
  if(reactionState === 'go'){
    const ms = Math.round(performance.now() - reactionAt);
    if(reactionBest === null || ms < reactionBest) reactionBest = ms;
    reactionState = 'idle';
    pad.className = 'reaction-pad';
    pad.textContent = ms + ' ms — click to go again';
    document.getElementById('reactionBest').textContent = 'Best: ' + reactionBest + ' ms';
  }
}

/* ---------------- Game: guess the number ---------------- */
let guessTarget = 0, guessCount = 0, guessLog = [];
function resetGuess(){
  guessTarget = 1 + Math.floor(Math.random() * 100);
  guessCount = 0;
  guessLog = [];
  document.getElementById('guessInput').value = '';
  document.getElementById('guessResult').textContent = 'Pick a number to begin.';
  document.getElementById('guessHistory').textContent = '';
}
function submitGuess(){
  const field = document.getElementById('guessInput');
  const n = parseInt(field.value, 10);
  const res = document.getElementById('guessResult');
  if(!Number.isInteger(n) || n < 1 || n > 100){
    res.textContent = 'Enter a whole number between 1 and 100.';
    return;
  }
  guessCount++;
  guessLog.push(n);
  document.getElementById('guessHistory').textContent = 'Tried: ' + guessLog.join(', ');
  if(n === guessTarget){
    res.textContent = 'Got it — ' + n + ' in ' + guessCount + (guessCount === 1 ? ' guess.' : ' guesses.');
  } else {
    res.textContent = n < guessTarget ? n + ' is too low. Go higher.' : n + ' is too high. Go lower.';
  }
  field.value = '';
  field.focus();
}

/* ---------------- Game: simon says ---------------- */
const SIMON_PADS = 4;
let simonSeq = [], simonStep = 0, simonAccepting = false;
function resetSimon(){
  simonSeq = [];
  simonStep = 0;
  simonAccepting = false;
  const board = document.getElementById('simonBoard');
  board.innerHTML = '';
  for(let i = 0; i < SIMON_PADS; i++){
    const pad = document.createElement('button');
    pad.className = 'simon-pad p' + i;
    pad.setAttribute('aria-label', 'pad ' + (i+1));
    pad.onclick = () => simonPress(i);
    board.appendChild(pad);
  }
  document.getElementById('simonStatus').textContent = 'Press start to play.';
}
function flashPad(i){
  const pad = document.querySelectorAll('#simonBoard .simon-pad')[i];
  if(!pad) return;
  pad.classList.add('lit');
  setTimeout(() => pad.classList.remove('lit'), 320);
}
function playSimonSeq(){
  simonAccepting = false;
  document.getElementById('simonStatus').textContent = 'Watch…';
  simonSeq.forEach((v, idx) => setTimeout(() => flashPad(v), idx * 520 + 300));
  setTimeout(() => {
    simonAccepting = true;
    simonStep = 0;
    document.getElementById('simonStatus').textContent = 'Your turn — ' + simonSeq.length + ' to repeat.';
  }, simonSeq.length * 520 + 400);
}
function startSimon(){
  if(!document.querySelectorAll('#simonBoard .simon-pad').length) resetSimon();
  simonSeq.push(Math.floor(Math.random() * SIMON_PADS));
  playSimonSeq();
}
function simonPress(i){
  if(!simonAccepting) return;
  flashPad(i);
  if(simonSeq[simonStep] === i){
    simonStep++;
    if(simonStep === simonSeq.length){
      simonAccepting = false;
      document.getElementById('simonStatus').textContent =
        'Round ' + simonSeq.length + ' cleared. Press start for the next.';
    }
    return;
  }
  simonAccepting = false;
  document.getElementById('simonStatus').textContent =
    'Wrong pad — you reached round ' + simonSeq.length + '. Press start to try again.';
  simonSeq = [];
}

/* ---------------- Tools and games catalog ---------------- */
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

function renderItemRows(containerId, page){
  const container = document.getElementById(containerId);
  if(!container) return;
  CATALOG.filter(it => it.page === page).forEach((it, i) => {
    const row = document.createElement('li');
    row.className = 'service-row item-row';
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', 'Open ' + it.title.replace(/&amp;/g,'&'));
    row.innerHTML = `
      <span class="row-num">${String(i+1).padStart(2,'0')}.</span>
      <div class="row-main">
        <h3>${it.title}</h3>
        <p>${it.desc}</p>
        <span class="row-cta">Open <span class="arrow" aria-hidden="true">↗</span></span>
        <ul class="row-tags">${it.tags.map(t=>`<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="row-spec">
        <p class="eyebrow">${page === 'tools' ? 'Utility' : 'Game'}</p>
        <p class="row-glyph" aria-hidden="true">${it.icon}</p>
      </div>`;
    // the whole row opens the item, not just the button
    row.addEventListener('click', () => openItem(it.page, it.panel, it.init));
    row.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openItem(it.page, it.panel, it.init); }
    });
    container.appendChild(row);
  });
}
renderItemRows('toolRows', 'tools');
renderItemRows('gameRows', 'games');

/* ---------------- Item modal ---------------- */
let modalPanel = null, modalReturnFocus = null;

function openItem(page, panelId, initName){
  const entry = CATALOG.find(it => it.panel === panelId);
  const panel = document.getElementById(panelId);
  if(!panel) return;
  if(page && document.querySelector('.page.active').id !== 'page-' + page) goTo(page);

  modalReturnFocus = document.activeElement;
  document.getElementById('modalTitle').innerHTML = entry ? entry.title : '';
  const body = document.getElementById('modalBody');
  body.innerHTML = '';
  // move the live panel in, so its ids and handlers keep working
  panel.classList.add('open');
  body.appendChild(panel);
  modalPanel = panel;

  const backdrop = document.getElementById('itemModal');
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';

  const init = window[initName];
  if(typeof init === 'function') init();
  const focusable = body.querySelector('input, textarea, select, button');
  if(focusable) focusable.focus();
}

function closeItem(){
  const backdrop = document.getElementById('itemModal');
  if(backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.style.overflow = '';
  if(modalPanel){
    modalPanel.classList.remove('open');
    document.getElementById('panelStore').appendChild(modalPanel);
    modalPanel = null;
  }
  if(modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
  modalReturnFocus = null;
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeItem();
});

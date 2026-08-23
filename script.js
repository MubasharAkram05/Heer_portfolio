/* ---------------- Routing ---------------- */
const pageOrder = ['home','about','work','tools','games','services','contact'];

function goTo(id){
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
  document.body.style.overflow = '';
  window.scrollTo({top:0, behavior:'auto'});
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
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p class="tag-mini">${p.tag}</p>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="stack">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div>
      <div class="links">
        <a href="${p.demo}" target="_blank" rel="noopener">Live demo</a>
        <a href="${p.code}" target="_blank" rel="noopener">Source</a>
      </div>`;
    container.appendChild(card);
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
  {icon:'◑', title:'Graphic Designing', desc:'Brand identity and the artwork around your product — logos, icon sets, key art, store screenshots and social assets. Everything is built to a system rather than as one-off files, so the next piece stays on brand without starting from scratch.',
   tags:['Brand identity','Logo design','Icon sets','Key art','Social assets'],
   points:['Source files handed over','Brand guidelines included','Print and screen ready']},
  {icon:'◭', title:'Digital Marketing', desc:'Getting the build in front of the people it was made for. App store optimisation, launch campaigns, and the analytics underneath them, so you can see what is actually working instead of guessing at it.',
   tags:['App store optimisation','Launch campaigns','Analytics','Social','Email'],
   points:['Store listing optimised','Campaigns set up and tracked','Monthly reporting']},
];

const CAPABILITIES = ['App Development','Game Development','UI / UX Design','Web Development','Graphic Design','Digital Marketing','Prototyping','Design Systems','Unity','Flutter','Accessibility','Performance','Store Release','Maintenance'];

const TESTIMONIALS = [
  {quote:'We came in with a rough idea and a deadline. Heer scoped it down to something we could actually ship, then shipped it — the first build was in our hands inside three weeks.', name:'Amara Okafor', role:'Founder, Trailhead', feature:true},
  {quote:'The handover was the best part. Clean code, a real README, and a walkthrough call. Our own team picked it up without a single question.', name:'Daniel Reyes', role:'CTO, Northbeam'},
  {quote:'Our game finally feels good to play on cheap Android phones. That was the whole brief and it got solved properly rather than patched over.', name:'Priya Nair', role:'Producer, Sunbreak Studio'},
  {quote:'Weekly builds meant we caught a bad assumption in week two instead of at launch. That alone paid for the project.', name:'Tomas Lindqvist', role:'Product Lead, Habitline'},
];
function renderServiceCards(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach(sv => {
    const card = document.createElement('div');
    card.className = 'util-card service-card';
    card.innerHTML = `
      <h3><span class="icon">${sv.icon}</span> ${sv.title}</h3>
      <p>${sv.desc}</p>
      <ul class="service-points">${sv.points.map(pt=>`<li>${pt}</li>`).join('')}</ul>`;
    container.appendChild(card);
  });
}

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

function renderQuotes(containerId, list){
  const container = document.getElementById(containerId);
  if(!container) return;
  list.forEach(q => {
    const card = document.createElement('figure');
    card.className = 'quote-card' + (q.feature ? ' featured' : '');
    card.innerHTML = `
      <blockquote>${q.quote}</blockquote>
      <figcaption><strong>${q.name}</strong><span>${q.role}</span></figcaption>`;
    container.appendChild(card);
  });
}

renderServiceCards('homeServicesGrid', SERVICES);
renderServiceRows('serviceRows', SERVICES);
renderTicker('capTicker', CAPABILITIES);
renderTicker('heroTicker', CAPABILITIES);
renderQuotes('quoteGrid', TESTIMONIALS);
renderQuotes('homeQuoteGrid', TESTIMONIALS.slice(0,3));

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

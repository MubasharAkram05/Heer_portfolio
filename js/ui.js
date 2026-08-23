/* Standalone interface behaviour: reveal, ripple, typing, counters, theme.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const selectors = '.section-head, .about-grid > div, .contact-grid > div, .social-list, .titleblock';
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


/* ---------------- Footer dropdowns ----------------
   Open on a wide screen, collapsed on a narrow one. The stylesheet makes the
   summary inert above 900px, so the state has to be corrected here or a
   column closed on a phone would stay stuck shut after a resize. */
function syncFooterDropdowns(){
  const wide = window.matchMedia('(min-width: 901px)');
  const apply = () => {
    document.querySelectorAll('details.footer-col').forEach(col => {
      col.open = wide.matches;
    });
  };
  apply();
  // addEventListener on a MediaQueryList is the modern form; older Safari
  // only has addListener
  if(wide.addEventListener) wide.addEventListener('change', apply);
  else if(wide.addListener) wide.addListener(apply);
}

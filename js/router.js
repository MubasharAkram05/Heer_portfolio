/* Page routing, the back trail, and the nav menus.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
const pageOrder = ['home','about','tools','games','contact'];

/* Work and Services are sections of the landing page rather than pages of
   their own, so their old hashes still have to lead somewhere. */
const SECTION_HASHES = { work:'home-work', services:'home-services' };

/* The browser restores scroll on its own by default, and it races the offset
   we restore from the history state — Back landed at y=12 instead of 600.
   Taking manual control leaves one mechanism in charge. */
try { history.scrollRestoration = 'manual'; } catch(e){}

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
  /* Bail before touching anything if there is no such page. The swap below
     clears `active` from every page first, so an unknown id used to leave the
     site showing nothing at all. */
  const target = document.getElementById('page-' + id);
  if(!target) return;

  const current = document.querySelector('.page.active');
  const currentId = current && current.id.replace('page-','');
  const leavingY = window.scrollY;
  if(!isBack && currentId && currentId !== id){
    // remember where we were on that page, not just which page it was
    pageTrail.push({ id: currentId, scrollY: window.scrollY });
    if(pageTrail.length > 20) pageTrail.shift();
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  target.classList.add('active');

  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    const isCurrent = a.dataset.page === id;
    a.classList.toggle('active', isCurrent);
    if(isCurrent) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // Tools and Games live behind the dropdown, so light its trigger too
  const ddBtn = document.getElementById('utilDropdownBtn');
  if(ddBtn) ddBtn.classList.toggle('active', id === 'tools' || id === 'games');

  const idx = pageOrder.indexOf(id) + 1;
  const total = pageOrder.length;
  const label = String(idx).padStart(2,'0') + '/' + String(total).padStart(2,'0');
  document.getElementById('sheetNum').textContent = label;
  document.getElementById('footSheet').textContent = label;

  closeMobileNav({ keepFocus:true });
  closeDropdown();
  updateBackBtn();
  document.body.style.overflow = '';
  // 'auto' resolves to the CSS scroll-behavior, which is smooth here, so the
  // jump never happened; 'instant' forces it
  window.scrollTo({ top: isBack ? (restoreY || 0) : 0, behavior:'instant' });

  /* History. Going forward stamps where we are leaving from onto the current
     entry, then pushes the new page — so the browser's own Back returns to the
     right page AND the right scroll offset. Going back must not push, or every
     step back would add another entry to come forward through. */
  try {
    if(isBack || !currentId || currentId === id){
      history.replaceState({ id, scrollY: isBack ? (restoreY || 0) : 0 }, '', '#' + id);
    } else {
      history.replaceState({ id: currentId, scrollY: leavingY }, '', '#' + currentId);
      history.pushState({ id, scrollY: 0 }, '', '#' + id);
    }
  } catch(err) { /* sandboxed preview: ignore */ }
}

/* The browser's Back and Forward, and anyone editing the hash by hand. Both
   route without pushing, or they would fight the entry they just moved to. */
addEventListener('popstate', (e) => {
  const raw = (e.state && e.state.id) || location.hash.replace('#','') || 'home';
  if(SECTION_HASHES[raw]){ goToSection(SECTION_HASHES[raw]); return; }
  if(!pageOrder.includes(raw)) return;
  goTo(raw, true, e.state ? e.state.scrollY : 0);
});

addEventListener('hashchange', () => {
  const id = location.hash.replace('#','');
  if(SECTION_HASHES[id]){ goToSection(SECTION_HASHES[id]); return; }
  const current = document.querySelector('.page.active');
  const activeId = current && current.id.replace('page-','');
  if(pageOrder.includes(id) && id !== activeId) goTo(id, true, 0);
});

/* ---------------- Dropdown ---------------- */
/* Go to the landing page and scroll to one of its sections. Returns false so
   an anchor's default jump does not fight the smooth scroll. */
function goToSection(sectionId){
  const active = document.querySelector('.page.active');
  const onHome = active && active.id === 'page-home';
  if(!onHome) goTo('home');
  const target = document.getElementById(sectionId);
  if(!target) return false;
  /* On a page change the section is only laid out after the swap, so wait a
     frame before measuring where to scroll to. */
  requestAnimationFrame(() => {
    const header = document.querySelector('header');
    const offset = (header ? header.offsetHeight : 0) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior:'smooth' });
  });
  try { history.pushState({ id:'home', section:sectionId }, '', '#' + sectionHash(sectionId)); } catch(e){}
  closeMobileNav({ keepFocus:true });
  closeDropdown();
  return false;
}

function sectionHash(sectionId){
  const hit = Object.keys(SECTION_HASHES).find(k => SECTION_HASHES[k] === sectionId);
  return hit || sectionId;
}

function toggleDropdown(e){
  e.preventDefault();
  const dd = document.getElementById('utilDropdown');
  setDropdown(!dd.classList.contains('open'));
}

function setDropdown(open){
  const dd = document.getElementById('utilDropdown');
  const btn = document.getElementById('utilDropdownBtn');
  dd.classList.toggle('open', open);
  if(btn) btn.setAttribute('aria-expanded', String(open));
}

function closeDropdown(){ setDropdown(false); }

/* ---------------- Mobile nav ---------------- */
function setMobileNav(open, opts){
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('menuToggle');
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if(open){
    const first = nav.querySelector('a, button');
    if(first) first.focus();
  } else if(!(opts && opts.keepFocus)){
    btn.focus();
  }
}

function toggleMobileNav(){
  const nav = document.getElementById('navLinks');
  setMobileNav(!nav.classList.contains('open'));
}

function closeMobileNav(opts){
  const nav = document.getElementById('navLinks');
  if(!nav.classList.contains('open')) return;
  setMobileNav(false, opts);
}

/* Click outside either menu closes it */
document.addEventListener('click', (e) => {
  const dd = document.getElementById('utilDropdown');
  if(!dd.contains(e.target)) closeDropdown();

  const nav = document.getElementById('navLinks');
  const toggleBtn = document.getElementById('menuToggle');
  if(nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggleBtn){
    closeMobileNav({ keepFocus:true });
  }
});

/* Escape closes whichever menu is open, and hands focus back to its trigger */
document.addEventListener('keydown', (e) => {
  if(e.key !== 'Escape') return;
  const dd = document.getElementById('utilDropdown');
  if(dd.classList.contains('open')){
    closeDropdown();
    document.getElementById('utilDropdownBtn').focus();
  }
  closeMobileNav();
});

/* Tabbing out of the dropdown closes it, so it never hangs open behind you */
document.addEventListener('focusin', (e) => {
  const dd = document.getElementById('utilDropdown');
  if(dd.classList.contains('open') && !dd.contains(e.target)) closeDropdown();
});

/* ---------------- Header shadow on scroll ---------------- */
(function initHeaderShadow(){
  const header = document.querySelector('header');
  if(!header) return;
  let queued = false;
  const update = () => { queued = false; header.classList.toggle('scrolled', window.scrollY > 8); };
  addEventListener('scroll', () => {
    if(queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive:true });
  update();
})();

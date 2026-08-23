/* The home page card decks: one card on screen at a time, replaced by the next
   with a 3D swap. Drives Recent builds, Tools and Games from the same code.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> deck -> tools -> games
   -> forms -> ui -> feedback -> main. Nothing here needs a build step. */

const DECK_INTERVAL = 5000;   /* how long a card holds before the next replaces it */
const DECK_SWAP = 700;        /* must match --deck-swap in the stylesheet */
const SWIPE_MIN = 40;         /* px of travel before a drag counts as a swipe */

/* What each deck shows, and what clicking a card does. */
function deckItems(key){
  if(key === 'projects'){
    return PROJECTS.map((p, i) => ({
      icon:p.icon, title:p.title, desc:p.desc,
      meta:p.tag, tags:p.stack,
      open:() => openProject(i),
    }));
  }
  return CATALOG.filter(it => it.page === key).map(it => ({
    icon:it.icon, title:it.title, desc:it.desc,
    meta:key === 'tools' ? 'Utility' : 'Game', tags:it.tags,
    open:() => openItem(it.panel, it.init),
  }));
}

function initDecks(){
  document.querySelectorAll('.deck').forEach(deck => initDeck(deck));
}

function initDeck(deck){
  const items = deckItems(deck.dataset.deck);
  if(!items.length) return;

  const stage = deck.querySelector('.deck-stage');
  const dotsBox = deck.querySelector('.deck-dots');
  let index = 0;
  let timer = null;
  let busy = false;

  /* One card. The whole card is the control — there is no separate Open
     button — so it is a <button> rather than a div with a click handler. */
  const build = (item, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'deck-card';
    card.setAttribute('aria-label', 'Open ' + item.title.replace(/&amp;/g, '&'));
    card.innerHTML = `
      <span class="deck-meta">${String(i+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} — ${item.meta}</span>
      <span class="deck-icon" aria-hidden="true">${item.icon}</span>
      <span class="deck-title">${item.title}</span>
      <span class="deck-desc">${item.desc}</span>
      <span class="deck-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</span>
      <span class="deck-cue">Open <span aria-hidden="true">↗</span></span>`;
    card.addEventListener('click', item.open);
    return card;
  };

  /* Swap `index` out and `next` in. `dir` is 1 for forward, -1 for back, and
     decides which side each card rotates through. */
  function go(next, dir){
    if(busy || next === index) return;
    busy = true;
    const outgoing = stage.querySelector('.deck-card.is-current');
    /* Read this before anything below touches the outgoing card: disabling a
       button drops focus immediately, so checking later always says false. */
    const hadFocus = outgoing && document.activeElement === outgoing;
    const incoming = build(items[next], next);
    incoming.classList.add('is-entering', dir > 0 ? 'from-right' : 'from-left');
    stage.appendChild(incoming);

    if(outgoing){
      outgoing.classList.remove('is-current');
      outgoing.classList.add('is-leaving', dir > 0 ? 'to-left' : 'to-right');
      outgoing.disabled = true;
    }

    // next frame, so the browser has the entering transform to animate from
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        incoming.classList.remove('is-entering', 'from-right', 'from-left');
        incoming.classList.add('is-current');
      });
    });

    // if the outgoing card held focus, hand it to the card replacing it, or the
    // next arrow key lands on the body instead of inside the deck
    setTimeout(() => {
      if(outgoing) outgoing.remove();
      if(hadFocus) incoming.focus();
      busy = false;
    }, DECK_SWAP);

    index = next;
    paintDots();
  }

  const step = (dir) => go((index + dir + items.length) % items.length, dir);

  function paintDots(){
    [...dotsBox.children].forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('on', on);
      dot.setAttribute('aria-selected', String(on));
      dot.tabIndex = on ? 0 : -1;
    });
  }

  /* Auto-advance, paused whenever someone is actually looking at or touching
     this deck — and never running at all when the page is hidden. */
  function play(){
    stop();
    if(document.hidden) return;
    timer = setInterval(() => step(1), DECK_INTERVAL);
  }
  function stop(){
    if(timer){ clearInterval(timer); timer = null; }
  }

  // --- dots
  items.forEach((item, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'deck-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', item.title.replace(/&amp;/g, '&'));
    dot.addEventListener('click', () => { go(i, i > index ? 1 : -1); play(); });
    dotsBox.appendChild(dot);
  });

  // --- arrows
  deck.querySelectorAll('.deck-nav').forEach(btn => {
    btn.addEventListener('click', () => { step(+btn.dataset.dir); play(); });
  });

  // --- keyboard, once focus is anywhere inside the deck
  deck.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight'){ e.preventDefault(); step(1); play(); }
    else if(e.key === 'ArrowLeft'){ e.preventDefault(); step(-1); play(); }
  });

  // --- swipe. Pointer events cover touch, pen and mouse-drag in one path.
  let startX = null, startY = null, dragging = false, swiped = false;
  stage.addEventListener('pointerdown', e => {
    startX = e.clientX; startY = e.clientY; dragging = true;
    swiped = false;
    stop();
  });
  stage.addEventListener('pointermove', e => {
    if(!dragging) return;
    const dx = e.clientX - startX;
    // a mostly-vertical drag is the page scrolling, not a swipe
    if(Math.abs(dx) < Math.abs(e.clientY - startY)) return;
    const card = stage.querySelector('.deck-card.is-current');
    if(card) card.style.setProperty('--drag', dx + 'px');
  });
  const endDrag = (e) => {
    if(!dragging) return;
    dragging = false;
    const card = stage.querySelector('.deck-card.is-current');
    if(card) card.style.removeProperty('--drag');
    const dx = (e.clientX || 0) - startX;
    // pointerup is followed by a click, and the card IS the open button — so a
    // swipe would both turn the card and open the item underneath it
    if(Math.abs(dx) > 8) swiped = true;
    if(Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs((e.clientY || 0) - startY)){
      step(dx < 0 ? 1 : -1);
    }
    play();
  };
  stage.addEventListener('pointerup', endDrag);
  /* Capture phase, so it runs before the card's own click handler. */
  stage.addEventListener('click', e => {
    if(!swiped) return;
    swiped = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', endDrag);

  // --- hold still while someone is reading or tabbing through it
  deck.addEventListener('mouseenter', stop);
  deck.addEventListener('mouseleave', play);
  deck.addEventListener('focusin', stop);
  deck.addEventListener('focusout', e => {
    if(!deck.contains(e.relatedTarget)) play();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());

  // --- first card, no animation
  const first = build(items[0], 0);
  first.classList.add('is-current');
  stage.appendChild(first);
  paintDots();
  play();
}

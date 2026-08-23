/* The home page card decks: a coverflow of three cards — one centred and full
   size, one falling away to each side, turned and pushed back so they read as
   sitting behind it. Drives Recent builds, Tools and Games from the same code.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> deck -> tools -> games
   -> forms -> ui -> feedback -> main. Nothing here needs a build step. */

const DECK_INTERVAL = 5000;   /* how long a card holds before the deck moves on */
const SWIPE_MIN = 40;         /* px of travel before a drag counts as a swipe */

/* What each deck shows, and what opening a card does. */
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

  /* Every card is built once and stays in the DOM; moving the deck only
     re-labels them, so the browser transitions the same elements between
     positions instead of animating elements in and out. */
  const cards = items.map((item, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'deck-card';
    card.innerHTML = `
      <span class="deck-meta">${String(i+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')} — ${item.meta}</span>
      <span class="deck-icon" aria-hidden="true">${item.icon}</span>
      <span class="deck-title">${item.title}</span>
      <span class="deck-desc">${item.desc}</span>
      <span class="deck-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</span>
      <span class="deck-cue">Open <span aria-hidden="true">↗</span></span>`;
    /* The centre card opens its item; a side card steps across to the centre
       first, the way a coverflow is expected to behave. */
    card.addEventListener('click', () => {
      if(i === index) item.open();
      else { go(i); play(); }
    });
    stage.appendChild(card);
    return card;
  });

  /* Shortest way round the loop, so stepping past the last card slides the
     first one in from the right rather than rewinding through the whole set. */
  function offsetOf(i){
    const n = items.length;
    let d = (i - index + n) % n;
    if(d > n / 2) d -= n;
    return d;
  }

  function paint(){
    cards.forEach((card, i) => {
      const d = offsetOf(i);
      card.classList.toggle('is-current', d === 0);
      card.classList.toggle('is-prev', d === -1);
      card.classList.toggle('is-next', d === 1);
      card.classList.toggle('is-hidden', Math.abs(d) > 1);
      // only the centre card is a real stop for the keyboard and a screen reader
      card.tabIndex = d === 0 ? 0 : -1;
      card.setAttribute('aria-hidden', String(d !== 0));
      card.setAttribute('aria-label',
        d === 0 ? 'Open ' + items[i].title.replace(/&amp;/g, '&')
                : 'Show ' + items[i].title.replace(/&amp;/g, '&'));
    });
    [...dotsBox.children].forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('on', on);
      dot.setAttribute('aria-selected', String(on));
      dot.tabIndex = on ? 0 : -1;
    });
  }

  function go(next){
    const n = items.length;
    index = ((next % n) + n) % n;
    paint();
  }
  const step = (dir) => go(index + dir);

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
    dot.addEventListener('click', () => { go(i); play(); });
    dotsBox.appendChild(dot);
  });

  // --- arrows
  deck.querySelectorAll('.deck-nav').forEach(btn => {
    btn.addEventListener('click', () => { step(+btn.dataset.dir); play(); });
  });

  // --- keyboard, once focus is anywhere inside the deck
  deck.addEventListener('keydown', e => {
    if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const onCard = document.activeElement && document.activeElement.classList.contains('deck-card');
    step(e.key === 'ArrowRight' ? 1 : -1);
    play();
    // the card that was focused is no longer the centre one, so follow it over
    if(onCard) cards[index].focus();
  });

  // --- swipe. Pointer events cover touch, pen and mouse-drag in one path.
  let startX = 0, startY = 0, dragging = false, swiped = false;
  stage.addEventListener('pointerdown', e => {
    startX = e.clientX; startY = e.clientY; dragging = true; swiped = false;
    stop();
  });
  stage.addEventListener('pointermove', e => {
    if(!dragging) return;
    const dx = e.clientX - startX;
    // a mostly-vertical drag is the page scrolling, not a swipe
    if(Math.abs(dx) < Math.abs(e.clientY - startY)) return;
    stage.style.setProperty('--drag', dx + 'px');
  });
  const endDrag = (e) => {
    if(!dragging) return;
    dragging = false;
    stage.style.removeProperty('--drag');
    const dx = (e.clientX || 0) - startX;
    // pointerup is followed by a click, and the card IS the open button — so a
    // swipe would both turn the deck and open the item underneath it
    if(Math.abs(dx) > 8) swiped = true;
    if(Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs((e.clientY || 0) - startY)){
      step(dx < 0 ? 1 : -1);
    }
    play();
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('pointerleave', endDrag);
  /* Capture phase, so it runs before a card's own click handler. */
  stage.addEventListener('click', e => {
    if(!swiped) return;
    swiped = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // --- hold still while someone is reading or tabbing through it
  deck.addEventListener('mouseenter', stop);
  deck.addEventListener('mouseleave', play);
  deck.addEventListener('focusin', stop);
  deck.addEventListener('focusout', e => {
    if(!deck.contains(e.relatedTarget)) play();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());

  paint();
  play();
}

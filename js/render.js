/* Renderers: turn the data arrays into DOM.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
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

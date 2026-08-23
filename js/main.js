/* Boot: everything that actually runs on page load, in one place.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> deck -> forms -> ui -> feedback -> main. Nothing here needs a build step. */

/* Content into the page */
renderProjectCards('projectGrid', PROJECTS);
renderServiceRows('homeServiceRows', SERVICES);
renderTicker('capTicker', CAPABILITIES);
renderTicker('heroTicker', CAPABILITIES);
renderQuotes('homeQuoteGrid', TESTIMONIALS.slice(0,3));
renderProcess('homeProcess', PROCESS);
renderRating('homeRating', REVIEW_SCORE);
renderItemRows('toolRows', 'tools');
renderItemRows('gameRows', 'games');
renderFooterLinks();

/* Behaviour */
initDecks();
initRowHighlight();
syncFooterDropdowns();
initReveal();
initCounters();
tickRole();
convertUnit();

/* Footer stamp */
document.getElementById('footYear').textContent = new Date().getFullYear();
document.getElementById('footDate').textContent =
  new Date().toLocaleDateString('en-US', { month:'short', year:'numeric' });

/* Open the page named in the URL hash, or home */
window.addEventListener('load', () => {
  const hash = location.hash.replace('#','');
  if(SECTION_HASHES[hash]){ goTo('home'); goToSection(SECTION_HASHES[hash]); return; }
  goTo(pageOrder.includes(hash) ? hash : 'home');
});

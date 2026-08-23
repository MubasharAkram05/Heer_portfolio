/* The popup that tools and games open in.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
let modalPanel = null, modalReturnFocus = null;

/* The panel is moved into the dialog, so it works from wherever you are — no
   page change needed. That is deliberate: opening a tool from the home page
   used to navigate to the Tools page first, which left you stranded there
   when you closed it. Now closing puts you back exactly where you started. */
function openItem(panelId, initName){
  const entry = CATALOG.find(it => it.panel === panelId);
  const panel = document.getElementById(panelId);
  if(!panel) return;

  // If something is already open, put it back first. Clearing the body with
  // innerHTML would delete that panel outright, and it is the only copy — the
  // item would be dead for the rest of the session.
  if(modalPanel && modalPanel !== panel) returnPanel();

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
  const first = body.querySelector(FOCUSABLE);
  (first || document.querySelector('.modal-close')).focus();
}

/* Everything Tab can reach inside the dialog */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

/* Keep Tab inside the dialog while it is open — outside it the page is inert
   to the mouse but not to the keyboard, so it has to be handled here. */
function trapFocus(e){
  const backdrop = document.getElementById('itemModal');
  if(backdrop.hidden || e.key !== 'Tab') return;
  const items = [...backdrop.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if(!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', trapFocus);

/* Move whatever is in the dialog back to the store it came from. */
function returnPanel(){
  if(!modalPanel) return;
  modalPanel.classList.remove('open');
  document.getElementById('panelStore').appendChild(modalPanel);
  modalPanel = null;
}

function closeItem(){
  const backdrop = document.getElementById('itemModal');
  if(backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.style.overflow = '';
  returnPanel();
  if(modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
  modalReturnFocus = null;
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeItem();
});

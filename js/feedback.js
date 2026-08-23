/* Toasts, the back-to-top button, and the skip link.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> feedback -> main. Nothing here needs a build step. */

/* ---------------- Toast ----------------
   One shared place for "it worked" / "that failed" feedback, so actions never
   just silently succeed. The region is aria-live, so screen readers announce it. */
const TOAST_MS = 2600;

function showToast(message, kind){
  const region = document.getElementById('toastRegion');
  if(!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast' + (kind ? ' toast-' + kind : '');
  toast.innerHTML =
    '<span class="toast-icon" aria-hidden="true">' + (kind === 'error' ? '!' : '✓') + '</span>' +
    '<span>' + message + '</span>';
  region.appendChild(toast);
  // let the element land before transitioning it in
  requestAnimationFrame(() => toast.classList.add('in'));
  setTimeout(() => {
    toast.classList.remove('in');
    toast.addEventListener('transitionend', () => toast.remove(), { once:true });
    // a display:none tab never fires transitionend, so sweep up regardless
    setTimeout(() => toast.remove(), 600);
  }, TOAST_MS);
}

/* ---------------- Back to top ----------------
   Long pages only: it appears once you are a screen and a half down. */
function scrollToTop(){
  window.scrollTo({ top:0, behavior:'smooth' });
  document.getElementById('menuToggle').focus();
}

(function initToTop(){
  const btn = document.getElementById('toTop');
  if(!btn) return;
  let queued = false;
  const update = () => {
    queued = false;
    btn.hidden = window.scrollY < window.innerHeight * 1.5;
  };
  addEventListener('scroll', () => {
    if(queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive:true });
  update();
})();

/* ---------------- Skip link ----------------
   Jumping to a section that is not focusable leaves the caret behind, so move
   focus explicitly. */
function focusMain(e){
  e.preventDefault();
  const main = document.querySelector('main');
  if(!main) return;
  main.setAttribute('tabindex', '-1');
  main.focus();
  main.scrollIntoView({ behavior:'smooth', block:'start' });
}

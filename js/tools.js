/* The eight utilities.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
/* ---------------- Shared: debounce ----------------
   Wraps a function so it runs once the input stops, not on every keystroke. */
function debounce(fn, wait){
  let timer;
  return function(){
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ---------------- Tool: word counter ---------------- */
function countText(){
  const text = document.getElementById('counterInput').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim()?1:0);
  document.getElementById('cWords').textContent = words;
  document.getElementById('cChars').textContent = chars;
  document.getElementById('cSentences').textContent = sentences;
}

/* Typing fires this on every key; 120ms is below the threshold where a counter
   stops feeling live, and it skips the work for a held-down key or a paste. */
const runCount = debounce(countText, 120);
function updateCounter(){ runCount(); }

/* ---------------- Tool: palette ---------------- */
function genPalette(){
  const row = document.getElementById('swatchRow');
  row.innerHTML = '';
  for(let i=0;i<5;i++){
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'swatch';
    sw.style.background = hex;
    sw.textContent = hex;
    sw.setAttribute('aria-label', 'Copy ' + hex);
    sw.onclick = () => copyHex(hex);
    row.appendChild(sw);
  }
}

function copyHex(hex){
  const msg = document.getElementById('copyMsg');
  const say = (text) => {
    msg.textContent = text;
    msg.classList.remove('pop');
    void msg.offsetWidth;
    msg.classList.add('pop');
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(hex)
      .then(() => { say('Copied ' + hex); showToast('Copied ' + hex); })
      .catch(() => { say('Could not copy ' + hex); showToast('Could not copy — your browser blocked it', 'error'); });
  } else {
    say('Copying is not available here');
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
  // crypto is the right source for anything anyone might actually use
  if(window.crypto && window.crypto.getRandomValues){
    const bytes = new Uint32Array(len);
    window.crypto.getRandomValues(bytes);
    for(let i=0;i<len;i++){ out += chars[bytes[i] % chars.length]; }
  } else {
    for(let i=0;i<len;i++){ out += chars[Math.floor(Math.random()*chars.length)]; }
  }
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
/* ---------------- Shared: copy helper ---------------- */
function copyFrom(id, btn){
  const el = document.getElementById(id);
  if(!el) return;
  const text = 'value' in el ? el.value : el.innerText;
  if(!text) return;
  const done = () => {
    const was = btn.textContent;
    btn.textContent = 'Copied';
    btn.classList.add('is-done');
    setTimeout(() => { btn.textContent = was; btn.classList.remove('is-done'); }, 1200);
    showToast('Copied to clipboard');
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => {
      showToast('Could not copy — your browser blocked it', 'error');
    });
  } else {
    showToast('Copying is not available in this browser', 'error');
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


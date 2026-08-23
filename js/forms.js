/* Contact form: validation and submit.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> feedback -> main. Nothing here needs a build step. */

/* One rule per field, so submit and blur check exactly the same thing. */
const CONTACT_RULES = [
  { id:'cName',  label:'Name',    test:v => v.length >= 2,
    message:'Enter at least 2 characters.' },
  { id:'cEmail', label:'Email',   test:v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message:'Enter a valid email address.' },
  { id:'cMsg',   label:'Message', test:v => v.length >= 10,
    message:'Message should be at least 10 characters.' },
];

/* Paint one field's state. `force` shows the error even on an untouched field,
   which is what submit needs and what typing does not. */
function validateField(rule, force){
  const input = document.getElementById(rule.id);
  if(!input) return true;
  const field = input.closest('.field');
  const hint = field.querySelector('.field-hint');
  const value = input.value.trim();
  const ok = rule.test(value);
  const show = !ok && (force || value.length > 0);

  field.classList.toggle('field-valid', ok && value.length > 0);
  field.classList.toggle('field-invalid', show);
  input.setAttribute('aria-invalid', String(show));
  if(hint) hint.textContent = show ? rule.message : '';
  return ok;
}

function attachInlineValidation(rule){
  const input = document.getElementById(rule.id);
  if(!input) return;
  const field = input.closest('.field');
  let hint = field.querySelector('.field-hint');
  if(!hint){
    hint = document.createElement('small');
    hint.className = 'field-hint';
    hint.id = rule.id + 'Hint';
    field.appendChild(hint);
  }
  input.setAttribute('aria-describedby', hint.id);
  input.addEventListener('input', () => validateField(rule, false));
  input.addEventListener('blur', () => validateField(rule, true));
}

/* Submit: check every field first, and only then hand off to the mail client.
   The button locks while that happens so a double tap cannot fire twice. */
function sendMail(e){
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  if(button && button.disabled) return false;

  const results = CONTACT_RULES.map(rule => ({ rule, ok:validateField(rule, true) }));
  const firstBad = results.find(r => !r.ok);
  if(firstBad){
    const input = document.getElementById(firstBad.rule.id);
    input.focus();
    showToast(firstBad.rule.label + ': ' + firstBad.rule.message, 'error');
    return false;
  }

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  const subject = encodeURIComponent('Portfolio contact from ' + name);
  const body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');

  setSubmitting(button, true);
  window.location.href = `mailto:hello@hiraiqbal.dev?subject=${subject}&body=${body}`;
  showToast('Opening your mail app…');
  // handing off to a mail client leaves the page as it is, so release the button
  setTimeout(() => setSubmitting(button, false), 1500);
  return false;
}

function setSubmitting(button, busy){
  if(!button) return;
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  if(busy){
    button.dataset.label = button.textContent;
    button.textContent = 'Sending…';
  } else if(button.dataset.label){
    button.textContent = button.dataset.label;
  }
}

(function initContactValidation(){
  if(!document.getElementById('cName')) return;
  CONTACT_RULES.forEach(attachInlineValidation);
})();

/* ═══════════════════════════════════════
   SkillSwap — Auth Page Logic
   script.js
════════════════════════════════════════ */

/* ─── State ─── */
let currentMode = 'login';
let currentStep = 1;
let selectedCat = '';

/* ─── Category Data ─── */
const categories = [
  { name: 'Music',       bg: '#FFF3E0', text: '#E65100' },
  { name: 'Language',    bg: '#E8F5E9', text: '#2E7D32' },
  { name: 'Tech',        bg: '#E3F2FD', text: '#1565C0' },
  { name: 'Cooking',     bg: '#FCE4EC', text: '#880E4F' },
  { name: 'Wellness',    bg: '#F3E5F5', text: '#6A1B9A' },
  { name: 'Design',      bg: '#E0F7FA', text: '#00695C' },
  { name: 'Mind',        bg: '#FFF8E1', text: '#F57F17' },
  { name: 'Art',         bg: '#FEE2E2', text: '#991B1B' },
  { name: 'Sports',      bg: '#DCFCE7', text: '#166534' },
  { name: 'Writing',     bg: '#EDE9FE', text: '#4C1D95' },
  { name: 'Photography', bg: '#FEF9C3', text: '#713F12' },
  { name: 'Business',    bg: '#E0F2FE', text: '#0C4A6E' },
  { name: 'Other',       bg: '#F5F3EF', text: '#57534E' },
];

/* ════════════════════════════════════════
   BUILD CATEGORY GRID (runs on page load)
════════════════════════════════════════ */
(function buildCats() {
  const grid = document.getElementById('catGrid');
  categories.forEach(function(c) {
    const btn = document.createElement('button');
    btn.className       = 'cat-btn';
    btn.textContent     = c.name;
    btn.dataset.cat     = c.name;
    btn.dataset.bg      = c.bg;
    btn.dataset.text    = c.text;
    btn.addEventListener('click', function() { selectCat(c.name); });
    grid.appendChild(btn);
  });
})();

/* ════════════════════════════════════════
   SELECT SKILL CATEGORY
════════════════════════════════════════ */
function selectCat(name) {
  selectedCat = name;
  document.querySelectorAll('.cat-btn').forEach(function(b) {
    const active = b.dataset.cat === name;
    b.style.background  = active ? b.dataset.bg   : '#fff';
    b.style.color       = active ? b.dataset.text : '#78716C';
    b.style.borderColor = active ? b.dataset.text : '#EDE9E3';
  });
}

/* ════════════════════════════════════════
   SWITCH BETWEEN LOGIN & SIGNUP
════════════════════════════════════════ */
function switchMode(mode) {
  currentMode = mode;
  currentStep = 1;

  /* Tabs */
  document.getElementById('tabLogin').classList.toggle('active', mode === 'login');
  document.getElementById('tabSignup').classList.toggle('active', mode === 'signup');

  /* Show / hide forms */
  document.getElementById('loginForm').classList.toggle('hidden', mode !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', mode !== 'signup');

  /* Reset signup steps */
  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('step2').classList.add('hidden');
  resetStepUI(1);

  /* Update intro text */
  const titles = { login: 'Welcome back 👋', signup: 'Join the swap ⟳' };
  const subs   = {
    login:  'Pick up where you left off — skills are waiting.',
    signup: 'Create your account and start teaching or learning today.'
  };
  document.getElementById('introTitle').textContent = titles[mode];
  document.getElementById('introSub').textContent   = subs[mode];

  /* Update switch-mode link */
  document.getElementById('switchText').innerHTML = mode === 'login'
    ? 'Don\'t have an account? <span class="link-amber" onclick="switchMode(\'signup\')">Sign Up</span>'
    : 'Already have an account? <span class="link-amber" onclick="switchMode(\'login\')">Log In</span>';

  clearAllErrors();
}

/* ════════════════════════════════════════
   TOGGLE PASSWORD VISIBILITY
════════════════════════════════════════ */
function togglePass(inputId, btn) {
  const inp  = document.getElementById(inputId);
  const show = inp.type === 'password';
  inp.type        = show ? 'text'     : 'password';
  btn.textContent = show ? '🙈'       : '👁';
}

/* ════════════════════════════════════════
   PASSWORD STRENGTH METER
════════════════════════════════════════ */
function updateStrength() {
  const pass = document.getElementById('s_pass').value;
  const bar  = document.getElementById('strengthBar');

  if (!pass) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';

  const checks = [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/];
  const score  = checks.filter(function(r) { return r.test(pass); }).length;
  const colors = ['', '#EF4444', '#F59E0B', '#84CC16', '#22C55E'];
  const labels = ['', 'Weak',    'Fair',    'Good',    'Strong' ];

  for (let i = 1; i <= 4; i++) {
    document.getElementById('seg' + i).style.background =
      i <= score ? colors[score] : '#EDE9E3';
  }

  const lbl       = document.getElementById('strengthLabel');
  lbl.textContent = labels[score];
  lbl.style.color = colors[score] || '#A8A29E';
}

/* ════════════════════════════════════════
   ERROR HELPERS
════════════════════════════════════════ */
function showErr(inputId, errId, msg) {
  document.getElementById(inputId).classList.add('err');
  const el       = document.getElementById(errId);
  el.textContent = '⚠ ' + msg;
  el.classList.add('show');
}

function clearErr(inputId) {
  document.getElementById(inputId).classList.remove('err');
  const el = document.getElementById(inputId + '_err');
  if (el) el.classList.remove('show');
}

function clearAllErrors() {
  document.querySelectorAll('.err').forEach(function(e) { e.classList.remove('err'); });
  document.querySelectorAll('.err-msg').forEach(function(e) { e.classList.remove('show'); });
}

/* ════════════════════════════════════════
   VALIDATION HELPERS
════════════════════════════════════════ */
function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validatePhone(v) {
  return /^\+?[\d\s\-()\u0000]{7,15}$/.test(v);
}

/* ════════════════════════════════════════
   LOGIN HANDLER
════════════════════════════════════════ */
function handleLogin() {
  var ok      = true;
  var email   = document.getElementById('l_email').value.trim();
  var pass    = document.getElementById('l_pass').value;

  if (!email) {
    showErr('l_email', 'l_email_err', 'Email is required'); ok = false;
  } else if (!validateEmail(email)) {
    showErr('l_email', 'l_email_err', 'Enter a valid email'); ok = false;
  }

  if (!pass) {
    showErr('l_pass', 'l_pass_err', 'Password is required'); ok = false;
  } else if (pass.length < 6) {
    showErr('l_pass', 'l_pass_err', 'At least 6 characters'); ok = false;
  }

  if (ok) showSuccess('login');
}

/* ════════════════════════════════════════
   SIGNUP — STEP 1 (Personal Info)
════════════════════════════════════════ */
function handleNext() {
  var ok      = true;
  var name    = document.getElementById('s_name').value.trim();
  var email   = document.getElementById('s_email').value.trim();
  var contact = document.getElementById('s_contact').value.trim();
  var pass    = document.getElementById('s_pass').value;

  if (!name) {
    showErr('s_name', 's_name_err', 'Full name is required'); ok = false;
  }
  if (!email) {
    showErr('s_email', 's_email_err', 'Email is required'); ok = false;
  } else if (!validateEmail(email)) {
    showErr('s_email', 's_email_err', 'Enter a valid email'); ok = false;
  }
  if (!contact) {
    showErr('s_contact', 's_contact_err', 'Contact number is required'); ok = false;
  } else if (!validatePhone(contact)) {
    showErr('s_contact', 's_contact_err', 'Enter a valid phone number'); ok = false;
  }
  if (!pass) {
    showErr('s_pass', 's_pass_err', 'Password is required'); ok = false;
  } else if (pass.length < 6) {
    showErr('s_pass', 's_pass_err', 'At least 6 characters'); ok = false;
  }

  if (ok) goToStep2();
}

/* ════════════════════════════════════════
   SIGNUP — STEP 2 (Skill & Address)
════════════════════════════════════════ */
function handleSignup() {
  var ok      = true;
  var skill   = document.getElementById('s_skill').value.trim();
  var address = document.getElementById('s_address').value.trim();

  if (!skill) {
    showErr('s_skill', 's_skill_err', 'Skill name is required'); ok = false;
  }
  if (!address) {
    showErr('s_address', 's_address_err', 'Address is required'); ok = false;
  }

  if (ok) showSuccess('signup');
}

/* ════════════════════════════════════════
   STEP NAVIGATION
════════════════════════════════════════ */
function goToStep2() {
  currentStep = 2;
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
  resetStepUI(2);
  clearAllErrors();
}

function goBack() {
  currentStep = 1;
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
  resetStepUI(1);
  clearAllErrors();
}

function resetStepUI(step) {
  var done2 = step >= 2;
  document.getElementById('s_circle1').classList.add('done');
  document.getElementById('s_label1').classList.add('done');
  document.getElementById('s_circle2').classList.toggle('done', done2);
  document.getElementById('s_label2').classList.toggle('done', done2);
  document.getElementById('s_line').classList.toggle('done', done2);
}

/* ════════════════════════════════════════
   SUCCESS SCREEN
════════════════════════════════════════ */
function showSuccess(mode) {
  document.getElementById('mainWrapper').style.display = 'none';
  var sc = document.getElementById('successScreen');
  sc.classList.add('show');

  if (mode === 'login') {
    document.getElementById('successTitle').textContent = 'Welcome back! 👋';
    document.getElementById('successSub').textContent   = 'Redirecting you to SkillSwap…';
  } else {
    document.getElementById('successTitle').textContent = "You're in! 🎉";
    document.getElementById('successSub').textContent   = 'Your account is ready. Start swapping skills!';
  }
}

function resetAll() {
  document.getElementById('successScreen').classList.remove('show');
  document.getElementById('mainWrapper').style.display = '';

  /* Clear all input values */
  document.querySelectorAll('input, textarea').forEach(function(i) { i.value = ''; });

  /* Clear errors */
  clearAllErrors();

  /* Reset category selection */
  selectedCat = '';
  document.querySelectorAll('.cat-btn').forEach(function(b) {
    b.style.background  = '#fff';
    b.style.color       = '#78716C';
    b.style.borderColor = '#EDE9E3';
  });

  /* Hide strength bar */
  document.getElementById('strengthBar').style.display = 'none';

  /* Back to login tab */
  switchMode('login');
}

/* ════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════ */
function showToast(msg) {
  var t       = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}
/* ===== CURSOR ===== */
const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
  ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,button,.skill-card,.project-card,.cert-card,.highlight-item,.contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '24px'; cur.style.height = '24px'; ring.style.width = '55px'; ring.style.height = '55px'; ring.style.opacity = '.8'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '14px'; cur.style.height = '14px'; ring.style.width = '38px'; ring.style.height = '38px'; ring.style.opacity = '.5'; });
});

/* ===== PARTICLES ===== */
const canvas = document.getElementById('particles-canvas'), ctx = canvas.getContext('2d');
let particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.r = Math.random() * 1.5 + .3;
  this.vx = (Math.random() - .5) * .35;
  this.vy = (Math.random() - .5) * .35;
  this.alpha = Math.random() * .4 + .1;
}
Particle.prototype.update = function () {
  this.x += this.vx; this.y += this.vy;
  if (this.x < 0) this.x = canvas.width;
  if (this.x > canvas.width) this.x = 0;
  if (this.y < 0) this.y = canvas.height;
  if (this.y > canvas.height) this.y = 0;
};
for (let i = 0; i < 80; i++) particles.push(new Particle());
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  particles.forEach(p => {
    p.update();
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `rgba(79,255,176,${p.alpha})` : `rgba(14,165,116,${p.alpha * .6})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===== SCROLL PROGRESS ===== */
const prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const s = document.documentElement.scrollTop, h = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (s / h * 100) + '%';
});

/* ===== SCROLL REVEAL ===== */
const revObs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ===== ACTIVE NAV ===== */
const navLinks = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute('id');
      navLinks.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + id) l.classList.add('active'); });
    }
  });
}, { threshold: .35 });
document.querySelectorAll('#about,#skills,#projects,#resume,#education,#contact').forEach(s => secObs.observe(s));

/* ===== TYPING EFFECT ===== */
const phrases = ['Data Analyst', 'Power BI Developer', 'Python Enthusiast', 'Dashboard Designer', 'Problem Solver'];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');
function type() {
  const word = phrases[pi];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1600); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 55 : 95);
}
type();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = target >= 1000 ? 'K+' : target === 3 ? '+' : '+';
  const displayTarget = target >= 1000 ? target / 1000 : target;
  const duration = 1800, step = 20, steps = duration / step;
  let current = 0, count = 0;
  const timer = setInterval(() => {
    count++; current = Math.min(displayTarget, displayTarget * (count / steps));
    el.textContent = (target >= 1000 ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (count >= steps) clearInterval(timer);
  }, step);
}
const counterObs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
}), { threshold: .5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ===== SKILL TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.panel).classList.add('active');
    document.querySelectorAll('.pbar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
  });
});
/* Trigger progress bars on scroll if proficiency tab is active */
const barObs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) document.querySelectorAll('.pbar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
}), { threshold: .3 });
document.querySelector('.progress-list') && barObs.observe(document.querySelector('.progress-list'));

/* ===== THEME TOGGLE ===== */
const toggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const savedTheme = localStorage.getItem('vm-theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'light') { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
}
toggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('vm-theme', next);
  if (next === 'light') { sunIcon.style.display = 'block'; moonIcon.style.display = 'none'; }
  else { sunIcon.style.display = 'none'; moonIcon.style.display = 'block'; }
});

/* ===== BACK TO TOP ===== */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 400));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== STAGGER SKILL CARDS ===== */
document.querySelectorAll('.skill-card').forEach((el, i) => el.style.animationDelay = `${i * .07}s`);

/* Yusheng Xia — Academic Site · main.js */

/* ---------- theme (dark / light) ---------- */
(function () {
  const saved = localStorage.getItem('site-theme');
  document.documentElement.dataset.theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
  updateIcon();

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'theme-toggle') {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('site-theme', next);
      updateIcon();
    }
  });

  function updateIcon() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';
  }
})();

/* ---------- language toggle ---------- */
(function () {
  const saved = localStorage.getItem('site-lang');
  if (saved === 'en' || saved === 'zh') {
    document.documentElement.dataset.lang = saved;
  }
  updateToggleLabel();

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'lang-toggle') {
      const next = document.documentElement.dataset.lang === 'zh' ? 'en' : 'zh';
      document.documentElement.dataset.lang = next;
      localStorage.setItem('site-lang', next);
      updateToggleLabel();
      document.dispatchEvent(new CustomEvent('langchange', { detail: next }));
    }
  });

  function updateToggleLabel() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = document.documentElement.dataset.lang === 'zh' ? 'EN' : '中';
  }
})();

/* ---------- scroll reveal ---------- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
})();

/* ---------- scroll progress bar ---------- */
(function () {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---------- blog helpers ---------- */

// A post markdown file holds Chinese first, then English after the marker.
const LANG_MARKER = '<!--lang:en-->';

function currentLang() {
  return document.documentElement.dataset.lang || 'zh';
}

function loadPostList() {
  const listEl = document.getElementById('post-list');
  if (!listEl) return;

  fetch('posts/posts.json')
    .then(r => r.json())
    .then(posts => {
      posts.sort((a, b) => b.date.localeCompare(a.date));
      render(posts);
      document.addEventListener('langchange', () => render(posts));
    })
    .catch(() => {
      listEl.innerHTML = '<p class="page-sub">No posts yet.</p>';
    });

  function render(posts) {
    const lang = currentLang();
    listEl.innerHTML = posts.map(p => `
      <a class="post-card" href="post.html?p=${encodeURIComponent(p.slug)}">
        <p class="post-card-date">${p.date}</p>
        <h2 class="post-card-title">${lang === 'zh' ? p.title_zh : p.title_en}</h2>
        <p class="post-card-summary">${lang === 'zh' ? p.summary_zh : p.summary_en}</p>
      </a>
    `).join('');
  }
}

function loadPost() {
  const el = document.getElementById('post-content');
  if (!el) return;

  const slug = new URLSearchParams(location.search).get('p');
  if (!slug) { el.innerHTML = '<p>Post not found.</p>'; return; }

  fetch('posts/' + encodeURIComponent(slug) + '.md')
    .then(r => {
      if (!r.ok) throw new Error('not found');
      return r.text();
    })
    .then(md => {
      const parts = md.split(LANG_MARKER);
      const zh = parts[0];
      const en = parts.length > 1 ? parts.slice(1).join(LANG_MARKER) : parts[0];

      const render = () => {
        const src = currentLang() === 'zh' ? zh : en;
        el.innerHTML = marked.parse(src);
        const h1 = el.querySelector('h1');
        if (h1) document.title = h1.textContent + ' — Yusheng Xia';
      };
      render();
      document.addEventListener('langchange', render);
    })
    .catch(() => {
      el.innerHTML = '<p>Post not found.</p>';
    });
}

// ============================
// NAVIGATION SCROLL EFFECT
// ============================
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ============================
// SCROLL REVEAL
// ============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================
// COUNTER ANIMATION
// ============================
function animateCounter(el) {
  const target = el.dataset.target;
  const isDecimal = target.includes('.');
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
  const suffix = target.replace(/[0-9.]/g, '');
  const duration = 1800;
  const step = 16;
  const steps = duration / step;
  const increment = numericTarget / steps;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= numericTarget) {
      current = numericTarget;
      clearInterval(timer);
    }
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ============================
// ACTIVE NAV LINK
// ============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ============================
// SMOOTH SCROLL
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ============================
// MOBILE MENU
// ============================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============================
// CURSOR GLOW (desktop)
// ============================
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(79,158,255,0.06) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:opacity 0.3s ease;`;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ============================
// BEHANCE PROJECTS INTEGRATION
// ============================

/** Behance profile URL */
const BEHANCE_USERNAME = 'raleskip';
const BEHANCE_PROFILE_URL = `https://www.behance.net/${BEHANCE_USERNAME}`;
const PROXY_BASE = 'https://api.allorigins.win/get?url=';
const CACHE_KEY = 'behance_projects_v2';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/** Seed data — all known projects.
 *  Renders instantly. Live fetch merges & extends this list automatically. */
const BEHANCE_SEED = [
  {
    id: '246057653',
    title: 'Awareness Web Page, Emailers & Newsletters',
    desc: 'End-to-end digital communication design spanning web pages, email templates, and newsletters for integrated campaign touchpoints.',
    url: 'https://www.behance.net/gallery/246057653/Awareness-Web-Page-Emailers-Newsletters',
    tags: ['Web Design', 'Email', 'Newsletter'],
    emoji: '📧'
  },
  {
    id: '192156193',
    title: 'JHH App UI — Banners, Interstitials & Push Notifications',
    desc: 'In-app banners and mobile push notification campaigns for JioHealthHub, displayed across the JioHealthHub & MyJio apps.',
    url: 'https://www.behance.net/gallery/192156193/JHH-App-UI-Banners-Interstitials-Push-notifications',
    tags: ['App UI', 'Mobile', 'Push Notifications'],
    emoji: '📱'
  },
  {
    id: '204807987',
    title: 'Communication Playbooks',
    desc: 'Strategic communication frameworks translating brand vision into actionable, multi-channel playbooks for consistent execution at scale.',
    url: 'https://www.behance.net/gallery/204807987/Communication-Playbooks',
    tags: ['Strategy', 'Frameworks', 'Playbook'],
    emoji: '📋'
  },
  {
    id: '94266629',
    title: 'Mahindra Rise — Hardest Workers Digital Campaign',
    desc: 'A digital-first brand campaign celebrating hard work as the foundational identity of Mahindra Rise — spanning social, video, and performance.',
    url: 'https://www.behance.net/gallery/94266629/Mahindra-Rise-Digital-Campaign-(Hardest-Workers)',
    tags: ['Campaign', 'Brand', 'Digital'],
    emoji: '🏗️'
  },
  {
    id: '94845951',
    title: 'Mahindra Rise — CutTheCrap',
    desc: 'A bold social and digital campaign championing authenticity — cutting through noise to celebrate real action over performative communication.',
    url: 'https://www.behance.net/gallery/94845951/Mahindra-Rise-CutTheCrap',
    tags: ['Social', 'Campaign', 'Brand'],
    emoji: '✂️'
  },
  {
    id: '196200251',
    title: 'Smart Ambulance Services — Jio True 5G',
    desc: 'Marketing and content campaign showcasing life-saving smart ambulance technology powered by Jio True 5G connectivity across India.',
    url: 'https://www.behance.net/gallery/196200251/Smart-Ambulance-Services-powered-by-Jio-True-5G',
    tags: ['5G', 'Health-Tech', 'Campaign'],
    emoji: '🚑'
  },
  {
    id: '68200589',
    title: 'Amazon',
    desc: 'Digital design and campaign work for Amazon India — covering brand communication, performance creatives, and consumer engagement assets.',
    url: 'https://www.behance.net/gallery/68200589/Amazon',
    tags: ['E-commerce', 'Brand', 'Digital'],
    emoji: '📦'
  },
  {
    id: '88243965',
    title: 'MONASH UNIVERSITY — #changeit',
    desc: 'Social-first campaign for Monash University driving awareness and action around systemic change through participatory digital storytelling.',
    url: 'https://www.behance.net/gallery/88243965/MONASH-UNIVERSITY-changeit',
    tags: ['Social', 'Campaign', 'Education'],
    emoji: '🎓'
  },
  {
    id: '85544291',
    title: 'HUGGIES — Case Study',
    desc: 'Full-funnel digital marketing case study for Huggies — from brand positioning and audience segmentation through to conversion strategy.',
    url: 'https://www.behance.net/gallery/85544291/HUGGIES-CASE-STUDY',
    tags: ['FMCG', 'Case Study', 'Strategy'],
    emoji: '👶'
  },
  {
    id: '80466463',
    title: 'PUBG (Digital)',
    desc: 'Digital campaign and content strategy for PUBG India — building community, sustaining hype, and driving deep player engagement at launch.',
    url: 'https://www.behance.net/gallery/80466463/PUBG-(DIGITAL)',
    tags: ['Gaming', 'Digital', 'Community'],
    emoji: '🎮'
  },
  {
    id: '198754149',
    title: 'JHH — Social Media Creatives',
    desc: 'A comprehensive suite of social media creatives amplifying JioHealthHub\'s brand presence across health, wellness, and lifestyle touchpoints.',
    url: 'https://www.behance.net/gallery/198754149/JHH-Social-Media-Creatives',
    tags: ['Social Media', 'Creative', 'Health'],
    emoji: '❤️'
  },
  {
    id: '193688327',
    title: 'JioHealthHub — Videos',
    desc: 'Video content strategy and production for JioHealthHub — driving brand awareness, education, and activation across digital channels.',
    url: 'https://www.behance.net/gallery/193688327/JioHealthHub-Videos',
    tags: ['Video', 'Content', 'Health-Tech'],
    emoji: '🎬'
  }
];

/** Behance CDN thumbnail URL — tries project cover at 808px wide */
function behanceCoverUrl(projectId) {
  return `https://mir-s3-cdn-cf.behance.net/projects/${projectId}/covers/808/${projectId}.jpg`;
}

/** Render a single project card */
function createProjectCard(project, index) {
  const a = document.createElement('a');
  a.className = 'project-card reveal' + (index % 3 !== 0 ? ` reveal-delay-${index % 3}` : '');
  a.href = project.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', `View Behance project: ${project.title}`);

  const gradClass = `g${index % 12}`;

  a.innerHTML = `
    <div class="project-thumb-wrap">
      <div class="project-thumb-gradient ${gradClass}" aria-hidden="true">${project.emoji || '🎨'}</div>
      <img
        class="project-thumb"
        src="${project.coverUrl || behanceCoverUrl(project.id)}"
        alt="${project.title}"
        loading="lazy"
        decoding="async"
      />
      <div class="project-overlay" aria-hidden="true">
        <div class="project-overlay-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="project-body">
      <div class="project-tags">
        ${(project.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <div class="project-title">${project.title}</div>
      <p class="project-desc">${project.desc}</p>
      <span class="project-cta">
        View Case Study
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </span>
    </div>
  `;

  // Lazy-load image: fade in on load, keep gradient on error
  const img = a.querySelector('.project-thumb');
  img.addEventListener('load', () => img.classList.add('loaded'));
  img.addEventListener('error', () => img.style.display = 'none'); // gradient placeholder stays visible

  return a;
}

/** Render skeleton placeholders while fetching */
function renderSkeletons(grid, count = 6) {
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    grid.insertAdjacentHTML('beforeend', `
      <div class="project-skeleton">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-body">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    `);
  }
}

/** Render project cards into the grid */
function renderProjects(projects, grid, isLive = false) {
  grid.innerHTML = '';
  if (!projects || projects.length === 0) {
    grid.innerHTML = `<div class="projects-status">No projects found. <a href="${BEHANCE_PROFILE_URL}" target="_blank" rel="noopener" style="color:var(--accent-teal)">View on Behance →</a></div>`;
    return;
  }
  projects.forEach((p, i) => grid.appendChild(createProjectCard(p, i)));

  // Re-observe newly added reveal elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Show live badge
  const badge = document.getElementById('projects-live-badge');
  if (badge) badge.style.display = isLive ? 'inline-flex' : 'none';
}

/** Parse project links from Behance profile HTML */
function parseProjectsFromHtml(html, seedMap) {
  const galleryRegex = /https?:\/\/www\.behance\.net\/gallery\/(\d+)\/([^"'\s]+)/g;
  const seen = new Set();
  const projects = [];
  let match;
  while ((match = galleryRegex.exec(html)) !== null) {
    const id = match[1];
    if (seen.has(id)) continue;
    seen.add(id);
    // Merge with seed data if available (seed has titles/desc/tags)
    const seed = seedMap.get(id);
    if (seed) {
      projects.push({ ...seed });
    } else {
      // New project not in seed — minimal info from URL slug
      const slug = decodeURIComponent(match[2]).replace(/-/g, ' ');
      projects.push({
        id,
        title: slug,
        desc: 'View the full case study on Behance.',
        url: `https://www.behance.net/gallery/${id}/${match[2]}`,
        tags: ['Behance'],
        emoji: '🎨'
      });
    }
  }
  return projects;
}

/** Main: fetch live data from Behance via CORS proxy, merge with seed */
async function loadBehanceProjects(grid) {
  const seedMap = new Map(BEHANCE_SEED.map(p => [p.id, p]));

  // 1. Render seed data immediately (no flicker)
  renderProjects(BEHANCE_SEED, grid, false);

  // 2. Check cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, projects } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL_MS && Array.isArray(projects) && projects.length > 0) {
        renderProjects(projects, grid, true);
        return;
      }
    }
  } catch (_) { /* ignore parse errors */ }

  // 3. Live fetch via CORS proxy
  try {
    const proxyUrl = PROXY_BASE + encodeURIComponent(BEHANCE_PROFILE_URL);
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
    const data = await res.json();
    const html = data.contents || '';
    const liveProjects = parseProjectsFromHtml(html, seedMap);
    if (liveProjects.length > 0) {
      // Save to cache
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), projects: liveProjects }));
      renderProjects(liveProjects, grid, true);
    }
    // If no projects parsed, keep seed data (already rendered)
  } catch (err) {
    // Network/timeout — seed data already rendered, silently fail
    console.info('[Behance] Live fetch skipped, showing seed data:', err.message);
  }
}

/** Init projects section */
function initBehanceSection() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  loadBehanceProjects(grid);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBehanceSection);
} else {
  initBehanceSection();
}

// ============================
// JOURNEY MODE
// ============================
(function() {

  /* ---- Data per role from HTML data-* attributes ---- */
  const PHASE_LABELS = {
    '1': 'Foundation',
    '2': 'Scale Building',
    '3': 'Leadership & Ecosystem Impact'
  };

  /* ---- DOM references built on first use ---- */
  let overlay, progressBar, exitBtn, counter, scrollHint;
  let chapters = [];
  let currentChapter = -1;
  let scrollObserver = null;
  let isActive = false;

  /** Build the Journey Mode overlay from existing timeline items */
  function buildOverlay() {
    if (document.getElementById('jm-overlay')) return; // already built

    // Collect all timeline items in DOM order
    const items = Array.from(document.querySelectorAll('.timeline-item'));
    if (!items.length) return;

    // ── Build overlay shell ──
    overlay = document.createElement('div');
    overlay.id = 'jm-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Journey Mode — Guided Career Story');

    // Progress bar
    progressBar = document.createElement('div');
    progressBar.id = 'jm-progress-bar';

    // Exit button
    exitBtn = document.createElement('button');
    exitBtn.id = 'jm-exit';
    exitBtn.setAttribute('aria-label', 'Exit Journey Mode');
    exitBtn.innerHTML = `<span>✕</span><span>Exit Story</span>`;

    // Chapter dot counter
    counter = document.createElement('div');
    counter.id = 'jm-counter';

    // Scroll hint
    scrollHint = document.createElement('div');
    scrollHint.className = 'jm-scroll-hint';
    scrollHint.innerHTML = `<div class="jm-scroll-hint-arrow"></div><span class="jm-scroll-hint-label">Scroll</span>`;

    document.body.appendChild(progressBar);
    document.body.appendChild(exitBtn);
    document.body.appendChild(counter);
    document.body.appendChild(scrollHint);
    document.body.appendChild(overlay);

    // ── Build one chapter per timeline item ──
    items.forEach((item, idx) => {
      const card     = item.querySelector('.timeline-card');
      const company  = card.querySelector('.role-company')?.textContent || '';
      const role     = card.querySelector('.role-title-text')?.textContent || '';
      const duration = card.querySelectorAll('.role-meta-item')[0]?.textContent || '';
      const location = card.querySelectorAll('.role-meta-item')[1]?.textContent || '';
      const context  = card.querySelector('.journey-context')?.innerHTML || '';
      const impact   = card.querySelector('.impact-summary')?.innerHTML || '';
      const bullets  = Array.from(card.querySelectorAll('.achievement-bullet')).map(li => li.textContent);
      const tags     = Array.from(card.querySelectorAll('.journey-tag')).map(t => t.textContent);
      const phase    = item.dataset.phase || '2';
      const milestone = item.dataset.milestone === 'true';
      const scale    = item.dataset.scale || '';
      const capability = item.dataset.capability || '';
      const focus    = item.dataset.focus || '';

      // Chapter element
      const ch = document.createElement('div');
      ch.className = 'jm-chapter';
      ch.dataset.phase = phase;
      ch.dataset.milestone = milestone ? 'true' : 'false';
      ch.dataset.scale = scale;
      ch.dataset.capability = capability;
      ch.dataset.focus = focus;
      ch.dataset.idx = idx;

      // Milestone badge HTML
      const milestoneBadge = milestone
        ? `<div class="jm-layer jm-milestone-badge">⚡ Peak Scale — Milestone Role</div>`
        : '';

      // Achievements HTML (max 4 for visual clarity)
      const achievementHtml = bullets.slice(0, 4)
        .map(b => `<li class="jm-achievement">${b}</li>`)
        .join('');

      // Tags HTML (max 6)
      const tagHtml = tags.slice(0, 6)
        .map(t => `<span class="jm-tag">${t}</span>`)
        .join('');

      // Build chapter inner HTML
      ch.innerHTML = `
        <div class="jm-content">
          ${milestoneBadge}
          <div class="jm-layer jm-company">${company}</div>
          <div class="jm-layer jm-role">${role}</div>
          <div class="jm-layer jm-meta">
            <span>${duration}</span>
            <span class="jm-meta-sep">·</span>
            <span>${location}</span>
          </div>
          <div class="jm-layer jm-context">${context}</div>
          <div class="jm-layer jm-impact">${impact}</div>
          <div class="jm-layer">
            <ul class="jm-achievements">${achievementHtml}</ul>
            <div class="jm-tags">${tagHtml}</div>
          </div>
        </div>
        <aside class="jm-insight-panel" aria-hidden="true">
          <div class="jm-insight-title">Live Signals</div>
          <div class="jm-signal">
            <div class="jm-signal-label">Scale</div>
            <div class="jm-signal-value" id="jm-sig-scale-${idx}">${scale || '—'}</div>
          </div>
          <div class="jm-signal">
            <div class="jm-signal-label">Capability</div>
            <div class="jm-signal-value" id="jm-sig-cap-${idx}">${capability || '—'}</div>
          </div>
          <div class="jm-signal">
            <div class="jm-signal-label">Focus Areas</div>
            <div class="jm-signal-value" id="jm-sig-focus-${idx}">${focus || '—'}</div>
          </div>
          <div class="jm-phase-pill p${phase}" id="jm-phase-pill-${idx}">
            ${PHASE_LABELS[phase] || ''}
          </div>
        </aside>
      `;

      overlay.appendChild(ch);

      // Counter dot
      const dot = document.createElement('div');
      dot.className = 'jm-counter-dot';
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Chapter ${idx + 1}: ${company}`);
      dot.addEventListener('click', () => scrollToChapter(idx));
      counter.appendChild(dot);

      chapters.push({ el: ch, idx, phase, milestone });
    });

    // ── Set up scroll observer on overlay ──
    setupScrollObserver();

    // ── Exit button ──
    exitBtn.addEventListener('click', exitJourneyMode);

    // ── Keyboard ──
    document.addEventListener('keydown', (e) => {
      if (!isActive) return;
      if (e.key === 'Escape') exitJourneyMode();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollToChapter(currentChapter + 1);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  scrollToChapter(currentChapter - 1);
    });
  }

  /** Intersection observer inside the overlay for chapter tracking */
  function setupScrollObserver() {
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = parseInt(entry.target.dataset.idx, 10);
        activateChapter(idx);
      });
    }, {
      root: overlay,
      threshold: 0.55
    });
    chapters.forEach(c => scrollObserver.observe(c.el));
  }

  /** Activate (reveal) content for a chapter */
  function activateChapter(idx) {
    if (idx === currentChapter) return;
    currentChapter = idx;

    // Reset layers in all chapters
    chapters.forEach(c => {
      c.el.querySelectorAll('.jm-layer').forEach(l => l.classList.remove('jm-visible'));
    });

    // Reveal layers in current chapter sequentially (CSS handles the delays)
    const ch = chapters[idx].el;
    requestAnimationFrame(() => {
      ch.querySelectorAll('.jm-layer').forEach(l => l.classList.add('jm-visible'));
    });

    // Update progress bar
    const progress = chapters.length > 1 ? (idx / (chapters.length - 1)) * 100 : 100;
    progressBar.style.width = `${progress}%`;

    // Update counter dots
    document.querySelectorAll('.jm-counter-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  /** Scroll the overlay to a specific chapter */
  function scrollToChapter(idx) {
    if (idx < 0 || idx >= chapters.length) return;
    chapters[idx].el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Enter Journey Mode */
  function enterJourneyMode() {
    buildOverlay(); // no-op if already built

    // Show controls
    overlay.classList.add('jm-active');
    exitBtn.classList.add('jm-active');
    counter.classList.add('jm-active');
    isActive = true;

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Scroll to first chapter
    if (chapters.length) {
      overlay.scrollTop = 0;
      setTimeout(() => activateChapter(0), 100);
    }

    // Brief scroll hint animation
    scrollHint.style.display = 'flex';
    scrollHint.style.animation = '';
    void scrollHint.offsetWidth; // reflow
    scrollHint.style.animation = 'jm-hint-fade 3s ease 0.5s forwards';

    // Announce to screen readers
    overlay.focus && overlay.focus();
  }

  /** Exit Journey Mode */
  function exitJourneyMode() {
    overlay.classList.remove('jm-active');
    exitBtn.classList.remove('jm-active');
    counter.classList.remove('jm-active');
    isActive = false;

    // Restore body scroll
    document.body.style.overflow = '';

    // Reset state
    currentChapter = -1;
    chapters.forEach(c => {
      c.el.querySelectorAll('.jm-layer').forEach(l => l.classList.remove('jm-visible'));
    });
    progressBar.style.width = '0%';
    document.querySelectorAll('.jm-counter-dot').forEach(d => d.classList.remove('active'));

    // Scroll back to journey section in the main page
    const section = document.getElementById('journey');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Wire up the toggle button */
  function init() {
    const btn = document.getElementById('journey-mode-btn');
    if (btn) btn.addEventListener('click', enterJourneyMode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// =====================================
// DIGITAL GRAVITY — INTERACTION SYSTEM
// =====================================
(function() {
  'use strict';

  const isDesktop = window.matchMedia('(pointer: fine)').matches;

  /* ─────────────────────────────────────
     1. THEME SWITCHER
  ───────────────────────────────────── */
  const THEMES = ['dark', 'light', 'neon'];
  const html = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') html.removeAttribute('data-theme');
    else html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeTarget === theme);
    });
  }

  // Init from localStorage
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeTarget));
  });

  /* ─────────────────────────────────────
     2. CUSTOM CURSOR (lerp smoothing)
  ───────────────────────────────────── */
  if (isDesktop) {
    const ring = document.getElementById('cursor-ring');
    const dot  = document.getElementById('cursor-dot');
    let mx = 0, my = 0;       // mouse exact
    let rx = 0, ry = 0;       // ring lerped
    const LERP = 0.14;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      // dot snaps instantly
      if (dot) {
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
      }
      updateCursorContext(e.target);
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateCursor() {
      rx = lerp(rx, mx, LERP);
      ry = lerp(ry, my, LERP);
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Context-aware cursor state
    const CTX_MAP = {
      'A'        : 'ctx-explore',
      'BUTTON'   : 'ctx-view',
      '.project-card'    : 'ctx-view',
      '.timeline-card'   : 'ctx-explore',
      '.jm-cta-btn'      : 'ctx-expand',
      '[data-cursor="explore"]' : 'ctx-explore',
      '[data-cursor="view"]'    : 'ctx-view',
      '[data-cursor="drag"]'    : 'ctx-drag',
      '[data-cursor="expand"]'  : 'ctx-expand',
    };
    const CTX_CLASSES = ['ctx-explore','ctx-view','ctx-drag','ctx-expand'];

    function updateCursorContext(target) {
      if (!ring || !target) return;
      let ctx = '';
      if (target.closest('.jm-cta-btn') || target.closest('#journey-mode-btn')) ctx = 'ctx-expand';
      else if (target.closest('.project-card')) ctx = 'ctx-view';
      else if (target.closest('.timeline-card')) ctx = 'ctx-explore';
      else if (target.closest('[data-cursor]')) ctx = 'ctx-' + target.closest('[data-cursor]').dataset.cursor;
      else if (target.tagName === 'A' || target.tagName === 'BUTTON') ctx = 'ctx-view';

      CTX_CLASSES.forEach(c => ring.classList.toggle(c, c === ctx));
    }

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => { if (ring) ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { if (ring) ring.style.opacity = '1'; });

    // Click burst on dot
    document.addEventListener('mousedown', () => {
      if (ring) ring.style.transform = 'translate(-50%,-50%) scale(0.75)';
    });
    document.addEventListener('mouseup', () => {
      if (ring) ring.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  }

  /* ─────────────────────────────────────
     3. MAGNETIC HOVER PHYSICS
  ───────────────────────────────────── */
  function initMagnetic() {
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(el => {
      let animId;
      let cx = 0, cy = 0;

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        const strength = el.classList.contains('nav-cta') ? 0.45 : 0.3;
        const tx = Math.max(-14, Math.min(14, dx * strength));
        const ty = Math.max(-14, Math.min(14, dy * strength));

        cancelAnimationFrame(animId);
        cx = tx; cy = ty;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        el.style.transition = 'transform 0.12s linear';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'translate(0, 0)';
      });
    });
  }
  initMagnetic();

  /* ─────────────────────────────────────
     4. 3D CARD TILT
  ───────────────────────────────────── */
  function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width  - 0.5;
        const cy = (e.clientY - rect.top)  / rect.height - 0.5;
        const rotX = cy * -6;
        const rotY = cx *  6;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)';
        setTimeout(() => { card.style.transition = ''; }, 400);
      });
    });
  }
  initCardTilt();

  // Re-apply tilt to dynamically added project cards
  const projectGrid = document.getElementById('projects-grid');
  if (projectGrid) {
    new MutationObserver(() => {
      projectGrid.querySelectorAll('.project-card:not(.tilt-card)').forEach(c => {
        c.classList.add('tilt-card');
      });
      initCardTilt();
    }).observe(projectGrid, { childList: true });
  }

  /* ─────────────────────────────────────
     5. HERO TEXT SPLIT ANIMATION
  ───────────────────────────────────── */
  function splitAndAnimate(el, baseDelay = 0) {
    if (!el || el.dataset.split) return;
    el.dataset.split = 'true';
    const text = el.textContent;
    el.classList.add('char-split');
    el.innerHTML = text.split('').map((char, i) =>
      char === ' '
        ? '<span class="char" style="display:inline-block;min-width:0.3em">&nbsp;</span>'
        : `<span class="char" style="animation-delay:${baseDelay + i * 0.03}s">${char}</span>`
    ).join('');
  }

  // Animate hero name on load
  const heroName = document.querySelector('.hero-name');
  if (heroName) splitAndAnimate(heroName, 0.2);

  /* ─────────────────────────────────────
     6. SECTION ENTRY ANIMATION
  ───────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(s => {
    s.classList.add('section-hidden');
    sectionObserver.observe(s);
  });
  // hero is immediately visible
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.classList.remove('section-hidden');
    heroSection.classList.add('section-visible');
  }

  /* ─────────────────────────────────────
     7. SCROLL VELOCITY + PROGRESS
  ───────────────────────────────────── */
  const velBar = document.getElementById('scroll-velocity-bar');
  let lastScrollY = window.scrollY;
  let velTimeout;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    const pct = Math.min(100, (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

    if (velBar) {
      velBar.style.width = pct + '%';
      velBar.style.opacity = '1';
      clearTimeout(velTimeout);
      velTimeout = setTimeout(() => { velBar.style.opacity = '0'; }, 1200);
    }
  }, { passive: true });

  /* ─────────────────────────────────────
     8. HERO PARALLAX
  ───────────────────────────────────── */
  const heroAvatar = document.querySelector('.hero-avatar-wrap');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy > window.innerHeight) return;
    if (heroAvatar) heroAvatar.style.transform = `translateY(${sy * 0.12}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${sy * 0.05}px)`;
  }, { passive: true });

  /* ─────────────────────────────────────
     9. AMBIENT PARTICLE DOTS (canvas)
  ───────────────────────────────────── */
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.35;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create sparse floating dots
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: Math.random() * 1.2 + 0.3,
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const theme = html.getAttribute('data-theme') || 'dark';
      const dotColor = theme === 'neon' ? '0,245,212' : theme === 'light' ? '37,99,235' : '79,158,255';

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticles();

})();

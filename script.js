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

/* ============================================================
   DevX — Roblox Developer Portfolio
   script.js
   ============================================================ */

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top  = my - 6 + 'px';
});

function animRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

// Cursor scale on interactive elements
document.querySelectorAll(
  'a, button, .featured-card, .project-card, .contact-card, .filter-btn'
).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2)';
    ring.style.transform   = 'scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    ring.style.transform   = 'scale(1)';
  });
});

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.size  = Math.random() * 1.5 + 0.3;
    this.vx    = (Math.random() - 0.5) * 0.3;
    this.vy    = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#38bdf8' : '#a78bfa';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha  = this.alpha;
    ctx.fillStyle    = this.color;
    ctx.shadowBlur   = 6;
    ctx.shadowColor  = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.06;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

/* ============================================================
   SCROLL FADE-IN ANIMATIONS
   ============================================================ */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => fadeObs.observe(el));

/* ============================================================
   SKILL BARS  — animate when section scrolls into view
   ============================================================ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(el => skillObs.observe(el));

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function animCounter(el, target, suffix) {
  let start = 0;
  const dur  = 2000;
  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    el.textContent = Math.floor(prog * target) + (suffix || '');
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

/* ============================================================
   PROJECT FILTER
   ============================================================ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ============================================================
   MODAL — data & helpers
   ============================================================ */
const modalData = {
  nexus: {
    emoji: '<img src="img/NangRam.png">',
    bg:    'linear-gradient(135deg,#0f172a,#1e3a5f)',
    title: 'นางรํา NangRam',
    tags:  [
      { text: 'Game', cls: 'tag-blue'   },
      { text: 'Horror',   cls: 'tag-green'  },
    ],
    desc: 'This is my most successful horror game.',
    features: [
    ],
    tech: ['Lua', 'OOP', 'PathfindingService', 'RemoteEvents', 'DataStore'],
    Link: 'https://www.roblox.com/games/12127977817/NangRam'
  },

  stellar: {
    emoji: '<img src="img/Aksorn.mp4">',
    bg:    'linear-gradient(135deg,#1a0f2e,#2d1b69)',
    title: 'Stellar UI Framework',
    tags:  [
      { text: 'UI/UX',     cls: 'tag-purple' },
      { text: 'Plugin',    cls: 'tag-pink'   },
    ],
    desc: 'This is a plugin for creating 3D Thai text in Roblox!',
    features: [
      'รองรับฟอนต์ไทย',
      'Text → 3D',
      'Material & Color',
      'Preset Style',
      'Auto Weld / Group',
      'Developer Studio plugin included',
    ],
    tech: ['Luau', 'TweenService', 'OOP', 'ModuleScript'],
    Link: 'https://create.roblox.com/store/asset/16740039179/Aksorn-ThaiKP-V1'
  },

  dungeon: {
    emoji: '<img src="img/BEGOD.png">',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Weather God Simulator',
    tags:  [
      { text: 'Simulator',        cls: 'tag-green'  },
      { text: 'System',     cls: 'tag-blue'   },
      { text: 'TeamWork', cls: 'tag-purple' },
    ],
    desc: 'This is the latest game project we submitted as a team.',
    features: [
    ],
    tech: ['Lua', 'DataStore', 'OOP', 'Advance', 'RemoteEvents'],
    Link: 'https://www.roblox.com/games/80315656512713/Weather-God-Simulator'
  },

  Mononoke: {
    emoji: '<img src="img/MononokeTrump.png">',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Riase a Mononoke',
    tags:  [
      { text: 'Simulator',        cls: 'tag-purple'  },
      { text: 'FanMade ',     cls: 'tag-blue'   },
    ],
    desc: 'This Game Is FanMade of Channel Thanks For Watching.',
    features: [
    ],
    tech: ['Lua', 'DataStore', 'RemoteEvents'],
    Link: 'https://www.roblox.com/games/9722447659/Riase-a-Mononoke-Update-2'
  },

  Karaoke: {
    video: 'img/KaraokeSystem.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Karaoke System',
    tags:  [
      { text: 'System',    cls: 'tag-blue'   },
      { text: 'Karaoke',  cls: 'tag-purple' },
    ],
    desc: 'A karaoke system with real-time lyrics sync and word highlighting for interactive singing.',
    features: [],
    tech: ['Lua', 'Sound', 'Module', 'RemoteEvents'],
  },

  Notify: {
    video: 'img/Notify.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Notify System',
    tags:  [
      { text: 'System',    cls: 'tag-blue'   },
      { text: 'Notify',  cls: 'tag-purple' },
    ],
    desc: 'Custom notification UI system with animations and flexible message handling.',
    features: [],
    tech: ['Lua', 'UI/UX', 'TweenService', 'RemoteEvents'],
  },

  Global: {
    video: 'img/Global.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Global Market',
    tags:  [
      { text: 'System',    cls: 'tag-blue'   },
      { text: 'Global Market',  cls: 'tag-purple' },
    ],
    desc: 'A global trading system allowing players to buy and sell items across servers.',
    features: [],
    tech: ['Lua', 'UI/UX', 'TweenService', 'RemoteEvents', 'TimeTick', 'ConnectOtherServer'],
  },

  Garage: {
    video: 'img/Garage.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Garage System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'Garage',  cls: 'tag-purple' },
      { text: 'Car',  cls: 'tag-pink' },
    ],
    desc: 'Vehicle storage and management system with UI for selecting and customizing cars.',
    features: [],
    tech: ['Lua', 'UI/UX', 'RemoteEvents', 'Car'],
  },

  Refuel: {
    video: 'img/Refuel.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Refuel System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'Refuel',  cls: 'tag-purple' },
      { text: 'Car',  cls: 'tag-pink' },
    ],
    desc: 'Fuel management system for vehicles with realistic refueling mechanics.',
    features: [],
    tech: ['Lua', 'ProximityPrompt', 'RemoteEvents', 'Car'],
  },

  Inventory: {
    video: 'img/Inventory.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Inventory System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'Inventory',  cls: 'tag-purple' },
    ],
    desc: 'Flexible inventory system with item management, stacking, and UI support.',
    features: [],
    tech: ['Lua', 'UI/UX', 'RemoteEvents', 'Inventory', 'Tool', "DataStore"],
  },

  SpawnCar: {
    video: 'img/SpawnCar.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'SpawnCar System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'SpawnCar',  cls: 'tag-purple' },
    ],
    desc: 'Vehicle spawning system with selection UI and server-side validation.',
    features: [],
    tech: ['Lua', 'UI/UX', 'RemoteEvents', 'Inventory', 'Car', 'DataStore'],
  },

  Steal: {
    video: 'img/Steal.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Steal System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'StealTool',  cls: 'tag-purple' },
    ],
    desc: 'Interactive stealing system using proximity prompts and multiplayer sync.',
    features: [],
    tech: ['Lua', 'Tool', 'RemoteEvents', 'Timer'],
  },

  Dash: {
    video: 'img/Dash.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Dash System',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'Dash',  cls: 'tag-purple' },
      { text: 'Animation',  cls: 'tag-blue' },
    ],
    desc: 'Player dash mechanic with smooth animations and responsive input handling.',
    features: [],
    tech: ['Lua', 'PlayerInputService', 'Animation'],
  },

  Camera: {
    video: 'img/Camera.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Camera Angle Swip',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'Camera',  cls: 'tag-purple' },
    ],
    desc: 'Dynamic camera angle switching system for enhanced player perspective.',
    features: [],
    tech: ['Lua', 'PlayerInputService', 'Camera'],
  },

  Quiz: {
    video: 'img/Quiz.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Auto Generate Quiz',
    tags:  [
      { text: 'System',    cls: 'tag-green'   },
      { text: 'OOP',  cls: 'tag-purple' },
      { text: 'Module',  cls: 'tag-purple' },
      { text: 'Quiz',  cls: 'tag-pink' },
    ],
    desc: 'Automatic quiz generation system with modular question management.',
    features: [],
    tech: ['Lua', 'Module', 'OOP', 'Remote', 'Leaderstats'],
  },

  PaPang: {
    video: 'img/PaPang.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'ระบบปะแป้ง สงกรานต์',
    tags:  [
      { text: 'Event',    cls: 'tag-green'   },
      { text: 'MultiPlayer',  cls: 'tag-purple' },
    ],
    desc: 'Multiplayer interaction system with fun animations inspired by Thai festival gameplay.',
    features: [],
    tech: ['Lua', 'Remote', 'Image', 'MultiPlayer'],
  },

  WaterGun: {
    video: 'img/WaterGun.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'WaterGun',
    tags:  [
      { text: 'Event',    cls: 'tag-green'   },
      { text: 'MultiPlayer',  cls: 'tag-purple' },
    ],
    desc: 'Water gun system with shooting mechanics, particle effects, and multiplayer sync.',
    features: [],
    tech: ['Lua', 'Remote', 'ParticleEffect', 'MultiPlayer'],
  },

  Spotify: {
    video: 'img/Spotify.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Spotify System',
    tags:  [
      { text: 'Music',    cls: 'tag-green'   },
      { text: 'MultiPlayer',  cls: 'tag-blue' },
      { text: 'Advanced',  cls: 'tag-purple' },
    ],
    desc: 'A music streaming system with playlist management and synchronized playback for multiplayer experiences.',
    features: [],
    tech: ['Lua', 'Remote', 'Sound', 'MultiPlayer', 'Queue' ,'ParticleEffect', 'DataStore'],
  },

  TowerDefense: {
    video: 'img/TowerDefense.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Tower Defense',
    tags:  [
      { text: 'TowerDefense',    cls: 'tag-green'   },
      { text: 'Game',  cls: 'tag-blue' },
      { text: 'Advanced',  cls: 'tag-purple' },
    ],
    desc: 'A tower defense game system with strategic gameplay mechanics.',
    features: [],
    tech: ['Lua', 'Remote', 'Sound', 'MultiPlayer', 'Module' , 'OOP' ,'ParticleEffect', 'DataStore', 'FrameWork'],
  },

  Achievement: {
    video: 'img/Achievement.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Achievement',
    tags:  [
      { text: 'UI/UX',    cls: 'tag-green'   },
      { text: 'Game',  cls: 'tag-blue' },
      { text: 'Attiribute',  cls: 'tag-purple' },
    ],
    desc: 'An achievement tracking system with UI feedback.',
    features: [],
    tech: ['Lua', 'Remote', 'Attiribute' ,'DataStore', 'UI/UX'],
  },

  UIUX: {
    video: 'img/UIUX.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'UI/UX',
    tags:  [
      { text: 'UI/UX',    cls: 'tag-green'   },
      { text: 'Advance',  cls: 'tag-blue' },
      { text: 'TweenService',  cls: 'tag-purple' },
    ],
    desc: 'Add Animation For UI/UX.',
    features: [],
    tech: ['Lua', 'TweenService', 'RunService', 'UI/UX'],
  },

  MapGenerate: {
    video: 'img/MapGenerate.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Map Generate',
    tags:  [
      { text: 'Map',    cls: 'tag-green'   },
      { text: 'Advance',  cls: 'tag-blue' },
      { text: 'Model',  cls: 'tag-purple' },
    ],
    desc: 'Procedural map generation system that creates dynamic and replayable environments.',
    features: [],
    tech: ['Lua', 'Module', 'Check-Advance', 'RunService', 'Magnet', 'ScaleMap'],
  },

  AI: {
    video: 'img/AI.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'AI',
    tags:  [
      { text: 'AI',    cls: 'tag-green'   },
      { text: 'Advance',  cls: 'tag-blue' },
      { text: 'Character-NPC',  cls: 'tag-purple' },
    ],
    desc: 'Advanced AI system with behavior logic and decision-making for NPC interactions.',
    features: [],
    tech: ['Lua', 'PathFinding', 'RunService', 'StateMachine' ,'Animation'],
  },

  Zombie: {
    video: 'img/Zombie.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'Zombie',
    tags:  [
      { text: 'Character',    cls: 'tag-green'   },
      { text: 'Advance',  cls: 'tag-blue' },
      { text: 'Zombie',  cls: 'tag-purple' },
    ],
    desc: 'Creating AI zombies using various State Machine Events at an advanced level.',
    features: [],
    tech: ['Lua', 'PathFinding', 'RunService', 'StateMachine' ,'Module','OOP'],
  },

  SelectTeam: {
    video: 'img/SelectTeam.mp4',
    bg:    'linear-gradient(135deg,#0d1f0d,#1a4a1a)',
    title: 'SelectTeam',
    tags:  [
      { text: 'MulitiPlayer',    cls: 'tag-green'   },
      { text: 'SelectTeam',  cls: 'tag-blue' },
      { text: 'Teleport',  cls: 'tag-purple' },
    ],
    desc: 'This is Select Team System For Teleporting.',
    features: [],
    tech: ['Lua', 'SelectTeam', 'UIUX', 'TeleportService' ,'Remote','MulitiPlayer'],
  },
};

/* ── Open modal ── */
function openModal(id) {
  const d = modalData[id];
  if (!d) return;
  
  const thumbContent = d.video
    ? `<video
         src="${d.video}"
         autoplay loop muted playsinline
         style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;"
       ></video>`
    : `<span style="font-size:6rem;position:relative;z-index:1">${d.emoji}</span>`;

  // ── features list (ถ้ามี) ──
  const featureBlock = d.features && d.features.length
    ? `<div class="modal-section-title">Key Features</div>
       <ul class="modal-features">
         ${d.features.map(f => `<li>${f}</li>`).join('')}
       </ul>`
    : '';

    const playBtn = d.Link
  ? `<a href="${d.Link}" target="_blank" class="btn-primary">🎮 Play on Roblox</a>`
  : '';

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-thumb" style="background:${d.bg};position:relative;overflow:hidden;">
      ${thumbContent}
      <div class="modal-thumb-overlay" style="position:absolute;inset:0;z-index:2"></div>
    </div>
    <div class="modal-body">
      <h2 class="modal-title">${d.title}</h2>
      <div class="modal-tags">
        ${d.tags.map(t => `<span class="tag ${t.cls}">${t.text}</span>`).join('')}
      </div>
      <p class="modal-desc">${d.desc}</p>
      ${featureBlock}
      <div class="modal-section-title">Tech Stack</div>
      <div class="tech-tags" style="margin-bottom:24px">
        ${d.tech.map(t => `<span class="tag tag-blue">${t}</span>`).join('')}
      </div>
      <div class="modal-footer">
        ${playBtn}
        <button class="btn-ghost" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Close modal ── */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Close on backdrop click ── */
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ── Close on ESC key ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
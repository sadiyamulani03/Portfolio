/* Portfolio interactions (vanilla JS) */

(() => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  /* ---------- Boot sequence (home) ---------- */
  const bootEl = document.querySelector('.boot');
  const shouldBoot = document.body?.dataset?.intro === 'true' && bootEl && !prefersReducedMotion;
  if (shouldBoot) {
    document.body.classList.add('is-booting');
    window.setTimeout(() => {
      document.body.classList.add('boot-done');
      document.body.classList.remove('is-booting');
    }, 1150);
  } else {
    document.body.classList.add('boot-done');
  }

  /* ---------- Mobile nav drawer ---------- */
  const openNav = () => {
    document.body.classList.add('nav-open');
    const drawer = document.querySelector('.nav-drawer');
    const firstLink = drawer?.querySelector('a');
    firstLink?.focus?.();
  };

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    document.querySelector('.nav-toggle')?.focus?.();
  };

  document.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);

    if (target.closest?.('[data-nav-open]')) {
      openNav();
      return;
    }

    if (target.closest?.('[data-nav-close]')) {
      closeNav();
      return;
    }

    if (target.classList?.contains('nav-drawer-backdrop')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
    }
  });

  // Close drawer when clicking a drawer link
  document.querySelectorAll('.nav-drawer a').forEach((a) => {
    a.addEventListener('click', () => closeNav());
  });

  /* ---------- Page transition for internal page navigations ---------- */
  const transitionEl = document.querySelector('.page-transition');
  const activateTransition = () => {
    if (!transitionEl || prefersReducedMotion) return;
    transitionEl.classList.add('is-active');
  };
  const deactivateTransition = () => {
    if (!transitionEl) return;
    transitionEl.classList.remove('is-active');
  };

  // Intro transition (only when page opts in)
  if (document.body?.dataset?.intro === 'true' && transitionEl && !prefersReducedMotion) {
    // Keep it short so it feels �insane� but not annoying
    activateTransition();
    window.setTimeout(() => {
      deactivateTransition();
    }, 520);
  }

  // fade-in on load (helps perceived smoothness on GitHub Pages)
  window.addEventListener('pageshow', () => {
    deactivateTransition();
  });

  const isSameOrigin = (url) => {
    try {
      const u = new URL(url, window.location.href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  document.addEventListener('click', (e) => {
    const a = /** @type {HTMLAnchorElement | null} */ (e.target instanceof Element ? e.target.closest('a') : null);
    if (!a) return;

    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return; // in-page anchors keep instant
    if (a.target === '_blank') return;
    if (!isSameOrigin(href)) return;

    // Let download/mailto/tel go
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

    // Transition then navigate
    e.preventDefault();
    activateTransition();
    window.setTimeout(() => {
      window.location.href = href;
    }, prefersReducedMotion ? 0 : 240);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              window.setTimeout(() => entry.target.classList.add('visible'), i * 80);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  /* ---------- Typewriter (only if element exists) ---------- */
  const roleEl = document.getElementById('typewriter');
  if (roleEl) {
    const roles = [
      'BSc Blockchain Technology Student @ SPPU',
      'Solidity Developer & Web3 Explorer',
      'Data Science & Python Enthusiast',
      'Cryptography & Networking Learner',
      'Hackathon Builder & Researcher',
    ];
    let ri = 0;
    let ci = 0;
    let deleting = false;

    const tick = () => {
      const cur = roles[ri];
      if (!deleting) {
        roleEl.textContent = cur.slice(0, ci + 1);
        ci++;
        if (ci === cur.length) {
          deleting = true;
          window.setTimeout(tick, 1800);
          return;
        }
      } else {
        roleEl.textContent = cur.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      window.setTimeout(tick, deleting ? 38 : 68);
    };

    window.setTimeout(tick, 900);
  }

  /* ---------- Contact form "sent" microinteraction ---------- */
  window.handleFormSubmit = (btn) => {
    const sp = btn?.querySelector?.('span');
    if (!sp) return;
    sp.textContent = 'Message Sent! ?';
    btn.style.borderColor = 'var(--neon-green)';
    btn.style.color = 'var(--neon-green)';
    window.setTimeout(() => {
      sp.textContent = 'Transmit Message ?';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2400);
  };

  /* ---------- Custom cursor (desktop only) ---------- */
  const finePointer = window.matchMedia?.('(pointer: fine) and (hover: hover)')?.matches ?? false;
  if (finePointer && !prefersReducedMotion) {
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    if (cursor && cursorRing) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.transform = `translate(${mx - 6}px,${my - 6}px)`;
      });
      (function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
        requestAnimationFrame(animateRing);
      })();

      const hoverTargets = 'a,button,.project-card,.skill-category,.stat-card,.social-link,.achievement-card,.nav-toggle,.nav-drawer-close,.nav-drawer a';
      document.querySelectorAll(hoverTargets).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorRing.style.width = '56px';
          cursorRing.style.height = '56px';
          cursorRing.style.borderColor = 'var(--neon-pink)';
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.style.width = '36px';
          cursorRing.style.height = '36px';
          cursorRing.style.borderColor = 'var(--neon-cyan)';
        });
      });
    }
  }

  /* ---------- 3D tilt cards (next-level) ---------- */
  const tiltTargets = document.querySelectorAll('.project-card,.skill-category,.achievement-card,.stat-card,.social-link');
  if (!prefersReducedMotion && tiltTargets.length) {
    tiltTargets.forEach((el) => {
      el.classList.add('tilt');
      let raf = 0;
      const onMove = (ev) => {
        const rect = el.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width;
        const py = (ev.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -10;
        const ry = (px - 0.5) * 12;

        el.style.setProperty('--mx', `${Math.round(px * 100)}%`);
        el.style.setProperty('--my', `${Math.round(py * 100)}%`);

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.classList.add('is-tilting');
          el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        el.classList.remove('is-tilting');
        el.style.transform = '';
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- Magnetic buttons ---------- */
  const magneticTargets = document.querySelectorAll('.btn-primary,.btn-secondary,.nav-toggle');
  if (!prefersReducedMotion && finePointer && magneticTargets.length) {
    magneticTargets.forEach((el) => {
      let raf = 0;
      const strength = el.classList.contains('nav-toggle') ? 10 : 14;
      const onMove = (ev) => {
        const rect = el.getBoundingClientRect();
        const dx = ev.clientX - (rect.left + rect.width / 2);
        const dy = ev.clientY - (rect.top + rect.height / 2);
        const tx = (dx / rect.width) * strength;
        const ty = (dy / rect.height) * strength;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = '';
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  /* ---------- Parallax grid + orbs ---------- */
  const orbs = Array.from(document.querySelectorAll('.orb'));
  const grid = document.querySelector('.grid-bg');
  if (!prefersReducedMotion && (orbs.length || grid)) {
    let sx = 0;
    let sy = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const render = () => {
      sx += (tx - sx) * 0.08;
      sy += (ty - sy) * 0.08;
      if (grid) grid.style.transform = `translate3d(${sx * 8}px, ${sy * 8}px, 0)`;
      orbs.forEach((o, i) => {
        const mul = 18 + i * 10;
        o.style.transform = `translate3d(${sx * mul}px, ${sy * mul}px, 0)`;
      });
      raf = 0;
    };

    window.addEventListener(
      'mousemove',
      (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        tx = (e.clientX - cx) / cx;
        ty = (e.clientY - cy) / cy;
        if (!raf) raf = requestAnimationFrame(render);
      },
      { passive: true }
    );
  }

  /* ---------- Neon portrait glitch bursts (home) ---------- */
  const portrait = document.querySelector('[data-portrait]');
  if (!prefersReducedMotion && portrait) {
    const burst = () => {
      portrait.classList.add('is-glitching');
      window.setTimeout(() => portrait.classList.remove('is-glitching'), 520);
    };

    // Random bursts
    let timer = 0;
    const schedule = () => {
      const t = 2400 + Math.random() * 4200;
      timer = window.setTimeout(() => {
        burst();
        schedule();
      }, t);
    };
    schedule();

    // Burst on hover/tap
    portrait.addEventListener('mouseenter', burst);
    portrait.addEventListener('click', burst);
    window.addEventListener('pagehide', () => window.clearTimeout(timer));
  }

  /* ---------- Background particles ---------- */
  const canvas = document.getElementById('canvas-bg');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const colors = ['#00f5ff', '#bf00ff', '#ff006e', '#00ff88'];
    const pts = [];
    const count = Math.min(90, Math.max(45, Math.round(window.innerWidth / 18)));
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.5 + 0.4,
        o: Math.random() * 0.45 + 0.12,
        c: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,245,255,${0.07 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.o;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(draw);
    };
    draw();
  }
})();


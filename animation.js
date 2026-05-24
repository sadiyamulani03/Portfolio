/* ═══════════════════════════════════════════════════════════
   SHARED.JS — Sadiya Mulani Portfolio  |  v3 COMPLETE
   Every animation system fully wired. No stubs.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 0. HELPERS ──────────────────────────────────────────── */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const rand  = (lo, hi) => lo + Math.random() * (hi - lo);
  const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));

  /* Run after DOM ready */
  function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    initPageWipe();
    initCursor();
    initNavHighlight();
    initScrollReveal();
    initSectionTitles();
    initMagneticButtons();
    initCard3DTilt();
    initMatrixRain();
    initMouseTrail();
    initStatCounters();
    initHeroScramble();
    initTypewriter();
    initProjectFilter();
    initSendRipple();
    initScrollTop();
    initSkillBars();
    initTerminalSweep();
    initPageTransitionLinks();
  });

  /* ═══════════════════════════════════════════════════════════
     1. PAGE WIPE — cinematic reveal on load
     ═══════════════════════════════════════════════════════════ */
  function initPageWipe() {
    const wipe = $('#pg-wipe');
    if (!wipe) return;
    /* Reveal: shrink clip-path left → nothing */
    requestAnimationFrame(() =>
      setTimeout(() => wipe.classList.add('gone'), 60)
    );
  }

  /* ═══════════════════════════════════════════════════════════
     2. PAGE TRANSITION LINKS — wipe out before navigating
     ═══════════════════════════════════════════════════════════ */
  function initPageTransitionLinks() {
    const wipe = $('#pg-wipe');
    $$('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      /* Skip: anchors, external, mailto, tel */
      if (!href || href[0] === '#' ||
          href.startsWith('http') ||
          href.startsWith('mailto') ||
          href.startsWith('tel')) return;

      link.addEventListener('click', e => {
        e.preventDefault();
        if (!wipe) { location.href = href; return; }

        /* Wipe in from right */
        wipe.style.transition = 'clip-path .5s cubic-bezier(.77,0,.18,1)';
        wipe.style.clipPath   = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        setTimeout(() => { location.href = href; }, 520);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     3. CUSTOM CURSOR — dot + lagging ring + states
     ═══════════════════════════════════════════════════════════ */
  function initCursor() {
    const dot  = $('#cur');
    const ring = $('#cur-ring');
    if (!dot || !ring) return;
    if (!window.matchMedia('(pointer:fine)').matches) {
      dot.style.display = ring.style.display = 'none';
      return;
    }

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    /* Move dot instantly */
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    /* Ring lerps behind */
    (function lerpRing() {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    })();

    /* Hover state: interactive elements → big pink */
    const interactiveSelector =
      'a, button, .card, .tag, .proj-card, .skill-cat, .ach-card, ' +
      '.stat-card, .soc-link, .f-btn, .tl-card, .btn, .ql-card, ' +
      '.interest-chip, .sq-btn, .cert-item, .side-card, .tl-item';

    function attach(el) {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('big'); ring.classList.add('big');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('big'); ring.classList.remove('big');
      });
    }
    $$(interactiveSelector).forEach(attach);

    /* Text-cursor state over inputs */
    $$('input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('txt'));
      el.addEventListener('mouseleave', () => dot.classList.remove('txt'));
    });

    /* Hide when leaving window */
    document.addEventListener('mouseleave',  () => dot.classList.add('hide'));
    document.addEventListener('mouseenter',  () => dot.classList.remove('hide'));
  }

  /* ═══════════════════════════════════════════════════════════
     4. NAV HIGHLIGHT — mark current page link as active
     ═══════════════════════════════════════════════════════════ */
  function initNavHighlight() {
    const fname = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(a => {
      const h = a.getAttribute('href');
      if (h === fname || h === './' + fname) a.classList.add('active');
    });
  }

  /* ═══════════════════════════════════════════════════════════
     5. SCROLL REVEAL — IntersectionObserver with stagger
     ═══════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries, ob) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        const delay =
          parseInt(en.target.dataset.delay) ||
          (i % 6) * 90;
        setTimeout(() => en.target.classList.add('visible'), delay);
        ob.unobserve(en.target);
      });
    }, { threshold: 0.1 });

    $$('.reveal, .reveal-l, .reveal-r, .reveal-z, .reveal-up').forEach(el => obs.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     6. SECTION TITLES — label + underline animate on reveal
     ═══════════════════════════════════════════════════════════ */
  function initSectionTitles() {
    const obs = new IntersectionObserver((entries, ob) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('visible');
        ob.unobserve(en.target);
      });
    }, { threshold: 0.25 });

    $$('.s-label, .s-title').forEach(el => obs.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     7. MAGNETIC BUTTONS — elements warp toward cursor
     ═══════════════════════════════════════════════════════════ */
  function initMagneticButtons() {
    const sel = 'nav a, .btn, .form-btn, .nav-logo, .sq-btn, .f-btn';
    $$(sel).forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     8. CARD 3D TILT — perspective tilt + radial shine
     ═══════════════════════════════════════════════════════════ */
  function initCard3DTilt() {
    const sel = '.proj-card, .ach-card, .skill-cat, .card, .tl-card, .ql-card, .stat-card, .side-card';
    $$(sel).forEach(card => {
      /* Inject a shine overlay if not already present */
      let shine = card.querySelector('.card-shine-fx');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'card-shine-fx';
        shine.style.cssText =
          'position:absolute;inset:0;pointer-events:none;opacity:0;' +
          'background:radial-gradient(circle at 50% 50%,rgba(0,245,255,.1),transparent 55%);' +
          'transition:opacity .3s;border-radius:inherit;z-index:0;';
        card.appendChild(shine);
      }

      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top)  / r.height;
        const rx = (py - 0.5) * -10;
        const ry = (px - 0.5) *  10;
        card.style.transform =
          `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        shine.style.opacity = '1';
        shine.style.background =
          `radial-gradient(circle at ${px * 100}% ${py * 100}%,` +
          `rgba(0,245,255,.12),transparent 55%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        shine.style.opacity  = '0';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     9. MATRIX RAIN — Japanese + blockchain chars falling
     ═══════════════════════════════════════════════════════════ */
  function initMatrixRain() {
    const canvas = $('#matrix-rain');
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const W     = 180;
    canvas.width  = W;
    canvas.height = innerHeight;

    const CHARS = '01アイウエオカキクコサシスセソ#$%!<>ブロックチェーン暗号鍵分散型';
    const COLS  = Math.floor(W / 12);
    const drops = Array(COLS).fill(1);

    function draw() {
      ctx.fillStyle = 'rgba(2,4,8,.055)';
      ctx.fillRect(0, 0, W, canvas.height);
      ctx.fillStyle = '#00f5ff';
      ctx.font = "11px 'Share Tech Mono', monospace";
      drops.forEach((y, i) => {
        const ch = CHARS[randInt(0, CHARS.length - 1)];
        ctx.fillText(ch, i * 12, y * 12);
        if (y * 12 > canvas.height && Math.random() > 0.974) drops[i] = 0;
        drops[i]++;
      });
    }
    setInterval(draw, 55);
  }

  /* ═══════════════════════════════════════════════════════════
     10. MOUSE TRAIL — neon spark particles on canvas
     ═══════════════════════════════════════════════════════════ */
  function initMouseTrail() {
    const canvas = $('#trail-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#00f5ff', '#ff006e', '#bf00ff', '#00ff88', '#ffd700'];
    const sparks = [];

    document.addEventListener('mousemove', e => {
      if (Math.random() > 0.55) return;
      const count = randInt(1, 3);
      for (let i = 0; i < count; i++) {
        sparks.push({
          x:    e.clientX + rand(-4, 4),
          y:    e.clientY + rand(-4, 4),
          vx:   rand(-2, 2),
          vy:   rand(-2.5, -.5),
          life: 1,
          r:    rand(0.8, 2.6),
          c:    COLORS[randInt(0, COLORS.length - 1)],
        });
      }
    });

    (function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.06;    /* gravity */
        p.life -= 0.032;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.life * 0.65;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = p.c;
        ctx.fillStyle   = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ═══════════════════════════════════════════════════════════
     11. STAT COUNTERS — animated count-up on scroll reveal
     ═══════════════════════════════════════════════════════════ */
  function initStatCounters() {
    const obs = new IntersectionObserver((entries, ob) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el     = en.target;
        const target = parseFloat(el.dataset.count);
        if (isNaN(target)) return;

        const dur = 1500;
        const t0  = performance.now();
        (function tick(now) {
          const p    = clamp((now - t0) / dur, 0, 1);
          const ease = 1 - Math.pow(1 - p, 4);   /* easeOutQuart */
          el.textContent =
            target % 1 === 0
              ? Math.round(ease * target)
              : (ease * target).toFixed(2);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);

        ob.unobserve(el);
      });
    }, { threshold: 0.6 });

    $$('[data-count]').forEach(el => obs.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     12. HERO NAME SCRAMBLE — cyberpunk text glitch effect
     ═══════════════════════════════════════════════════════════ */
  function initHeroScramble() {
    const el = $('.hero-name .glitch') || $('.hero-scramble');
    if (!el) return;

    const CHARS = '!<>-_\\/[]{}=+*^?#█▓▒01@$暗号鍵';
    const orig  = el.textContent.trim();
    let   busy  = false;

    function scramble() {
      if (busy) return;
      busy = true;
      let f = 0;
      const TOTAL = 28;
      const timer = setInterval(() => {
        f++;
        el.textContent = orig.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (f > (i / orig.length) * TOTAL) return ch;
          return CHARS[randInt(0, CHARS.length - 1)];
        }).join('');
        if (f >= TOTAL) {
          el.textContent = orig;
          clearInterval(timer);
          busy = false;
        }
      }, 30);
    }

    /* Fire on load: two bursts */
    setTimeout(scramble, 700);
    setTimeout(scramble, 1800);

    /* Fire on hover */
    el.addEventListener('mouseenter', scramble);
    /* Also on click for fun */
    el.addEventListener('click', scramble);
  }

  /* ═══════════════════════════════════════════════════════════
     13. TYPEWRITER — multi-string cycling with cursor blink
     ═══════════════════════════════════════════════════════════ */
  function initTypewriter() {
    const el = $('#typewr');
    if (!el) return;

    let strings;
    try {
      strings = el.dataset.strings ? JSON.parse(el.dataset.strings) : [el.textContent.trim()];
    } catch (_) {
      strings = [el.textContent.trim()];
    }
    if (!strings.length) return;

    el.textContent = '';
    const cur = document.createElement('span');
    cur.textContent   = '_';
    cur.style.cssText = 'animation:blink 1s step-end infinite;display:inline-block;';
    el.appendChild(cur);

    let si = 0, ci = 0, deleting = false;

    function tick() {
      const str = strings[si % strings.length];

      if (!deleting) {
        el.insertBefore(document.createTextNode(str[ci]), cur);
        ci++;
        if (ci >= str.length) {
          deleting = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, 72);
      } else {
        const nodes = [...el.childNodes].filter(n => n.nodeType === 3);
        if (nodes.length) {
          const last = nodes[nodes.length - 1];
          last.textContent = last.textContent.slice(0, -1);
          if (!last.textContent) last.remove();
        }
        ci--;
        if (ci <= 0) {
          deleting = false; si++; ci = 0;
          setTimeout(tick, 440);
          return;
        }
        setTimeout(tick, 38);
      }
    }
    tick();
  }

  /* ═══════════════════════════════════════════════════════════
     14. PROJECT FILTER — animated show/hide by category
     ═══════════════════════════════════════════════════════════ */
  function initProjectFilter() {
    const bar = $('#proj-filters');
    if (!bar) return;

    bar.addEventListener('click', e => {
      const btn = e.target.closest('.f-btn');
      if (!btn) return;

      $$('.f-btn', bar).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.f;
      $$('.proj-card').forEach(card => {
        card.classList.toggle('hidden', f !== 'all' && card.dataset.cat !== f);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     15. SEND BUTTON RIPPLE — contact form CTA
     ═══════════════════════════════════════════════════════════ */
  function initSendRipple() {
    const btn = $('#send-btn');
    if (!btn) return;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', e => {
      const r  = btn.getBoundingClientRect();
      const rp = document.createElement('div');
      rp.className  = 'send-rp';
      rp.style.left = (e.clientX - r.left) + 'px';
      rp.style.top  = (e.clientY - r.top)  + 'px';
      btn.appendChild(rp);
      setTimeout(() => rp.remove(), 750);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     16. SCROLL TO TOP BUTTON
     ═══════════════════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = $('#scrolltop');
    if (!btn) return;
    window.addEventListener('scroll', () =>
      btn.classList.toggle('show', scrollY > 380)
    );
    btn.addEventListener('click', () =>
      scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ═══════════════════════════════════════════════════════════
     17. SKILL BARS — animated width on scroll reveal
     ═══════════════════════════════════════════════════════════ */
  function initSkillBars() {
    const obs = new IntersectionObserver((entries, ob) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$('.skill-bar-fill', en.target).forEach(bar => {
          /* Short delay so CSS transition fires visibly */
          setTimeout(() => {
            bar.style.width = (bar.dataset.width || 0) + '%';
          }, 120);
        });
        ob.unobserve(en.target);
      });
    }, { threshold: 0.25 });

    $$('.skill-cat, .skill-bar-wrap').forEach(el => obs.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════
     18. TERMINAL SWEEP — shimmer that travels across terminals
     ═══════════════════════════════════════════════════════════ */
  function initTerminalSweep() {
    $$('.terminal').forEach(term => {
      /* Ensure data-label is set */
      if (!term.dataset.label) term.dataset.label = '// PROFILE.JSON';

      /* Create sweep child if not already present */
      if (!term.querySelector('.t-sweep')) {
        const sw = document.createElement('div');
        sw.className = 't-sweep';
        term.appendChild(sw);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     EXPORTS — available to per-page inline scripts
     ═══════════════════════════════════════════════════════════ */
  window.SM = {
    /* confetti burst from a DOM element */
    confetti(fromEl) {
      const r = fromEl.getBoundingClientRect();
      const COLORS = ['#00f5ff','#ff006e','#bf00ff','#00ff88','#ffd700'];
      for (let i = 0; i < 42; i++) {
        const p = document.createElement('div');
        p.className = 'cf';
        p.style.cssText = [
          `left:${r.left + r.width  / 2}px`,
          `top: ${r.top  + r.height / 4}px`,
          `background:${COLORS[randInt(0, COLORS.length - 1)]}`,
          `--tx:${rand(-130, 130)}px`,
          `--ty:${rand(-220, -60)}px`,
          `--rot:${rand(-720, 720)}deg`,
          `--d:${rand(0.7, 1.5)}s`,
        ].join(';');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1800);
      }
    },

    /* re-attach cursor hover listeners to newly created elements */
    attachCursorHover(elements) {
      const dot  = document.getElementById('cur');
      const ring = document.getElementById('cur-ring');
      if (!dot || !ring) return;
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('big'); ring.classList.add('big'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
      });
    },

    /* observe a new element for scroll reveal */
    observeReveal(el, delay = 0) {
      el.dataset.delay = delay;
      const obs = new IntersectionObserver((entries, ob) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          setTimeout(() => en.target.classList.add('visible'), delay);
          ob.unobserve(en.target);
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    },

    rand, randInt, lerp, clamp,
  };

})();
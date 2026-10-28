import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initRoom } from './room';
import { initStarter } from './starter';
import { initGate } from './gate';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;

const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => reduceMq.matches;

const chrome = document.querySelector<HTMLElement>('[data-chrome]');
const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');

/* ---------- chrome: measured heights and compact state ---------- */
/* --chrome-full holds layout space for the expanded header, --chrome-h is the compact height
   used for scroll padding, so compacting on scroll never shifts the page. */
function measureChrome() {
  if (!chrome) return;
  const wasCompact = chrome.hasAttribute('data-compact');
  chrome.classList.add('measuring');
  chrome.removeAttribute('data-compact');
  const full = chrome.offsetHeight;
  chrome.setAttribute('data-compact', '');
  const compact = chrome.offsetHeight;
  if (!wasCompact) chrome.removeAttribute('data-compact');
  chrome.classList.remove('measuring');
  root.style.setProperty('--chrome-full', `${full}px`);
  root.style.setProperty('--chrome-h', `${compact}px`);
}
measureChrome();
window.addEventListener('resize', measureChrome);
document.fonts.ready.then(measureChrome);

function onScroll() {
  chrome?.toggleAttribute('data-compact', window.scrollY > 60);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduced()) {
  lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Midvora sample gate: hold scrolling and the demo until the visitor is let in ---------- */
let gated = false;
const afterOpen: Array<() => void> = [];
const whenOpen = (fn: () => void) => (gated ? afterOpen.push(fn) : fn());
gated = initGate(() => {
  gated = false;
  lenis?.start();
  window.scrollTo(0, 0);
  afterOpen.splice(0).forEach((fn) => fn());
});
if (gated) lenis?.stop();
if (!document.querySelector('[data-gate]') && import.meta.env.PROD) {
  console.warn('Sample gate disabled: VITE_GATE_KEY was not set at build time, so visitors are not being recorded.');
}

/* ---------- in-page anchors with focus management ---------- */
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href')!;
  const isTop = hash === '#top';
  const target = isTop ? document.body : document.querySelector<HTMLElement>(hash);
  if (!target) return;

  e.preventDefault();
  if (menu?.open) menu.open = false;

  /* Lenis honors the CSS scroll-padding-top, so no manual offset here */
  if (lenis) {
    lenis.scrollTo(isTop ? 0 : target, { duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  }
  history.replaceState(null, '', hash);

  if (!isTop) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu?.open) {
    menu.open = false;
    menu.querySelector<HTMLElement>('summary')?.focus();
  }
});

/* ---------- interactive pieces ---------- */
initRoom(reduced, whenOpen);
initStarter(reduced);

/* ---------- mobile action bar: after the hero, hidden over the visit block ---------- */
const mbar = document.querySelector<HTMLElement>('[data-mbar]');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const visit = document.getElementById('visit');
if (mbar && hero && visit) {
  let heroOut = false;
  let visitIn = false;
  const sync = () => mbar.classList.toggle('show', heroOut && !visitIn);
  new IntersectionObserver(([en]) => {
    heroOut = !en.isIntersecting;
    sync();
  }).observe(hero);
  new IntersectionObserver(([en]) => {
    visitIn = en.isIntersecting;
    sync();
  }, { threshold: 0.25 }).observe(visit);
}

/* ---------- motion ---------- */
if (!reduced()) {
  /* reveals */
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 34,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* headings split into masked lines */
  document.fonts.ready.then(() => {
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((h) => {
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.12,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          });
        },
      });
    });
  });

  /* category chips and season arches */
  gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
    const st = { trigger: card, start: 'top 90%', once: true };
    gsap.from(card, { opacity: 0, duration: 0.8, scrollTrigger: st });
    gsap.from(card.querySelector('.art'), { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: st });
    gsap.from(card.querySelector('.label'), { y: 26, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out', scrollTrigger: st });
  });
  gsap.utils.toArray<HTMLElement>('[data-arch]').forEach((arch, i) => {
    const st = { trigger: arch, start: 'top 90%', once: true };
    gsap.from(arch.querySelector('.shape'), { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'power3.out', delay: i * 0.08, scrollTrigger: st });
    gsap.from(arch.querySelector('.cap'), { y: 24, opacity: 0, duration: 0.9, delay: 0.25 + i * 0.08, ease: 'power3.out', scrollTrigger: st });
  });

  /* footer ribbon */
  gsap.from('.foot .ribbon i', {
    scaleY: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.07,
    scrollTrigger: { trigger: '.foot', start: 'top 95%', once: true },
  });

  /* hero: sun drifts, chips float with the pointer and the scroll */
  gsap.to('.hero .sun', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  const chips = gsap.utils.toArray<HTMLElement>('.pchip');
  chips.forEach((c) => {
    const depth = Number(c.dataset.depth ?? 1);
    gsap.to(c, {
      y: -60 * depth,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });
  if (window.matchMedia('(pointer: fine)').matches) {
    const movers = chips.map((c) => ({
      x: gsap.quickTo(c, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(c, 'rotation', { duration: 1.2, ease: 'power3.out' }),
      depth: Number(c.dataset.depth ?? 1),
    }));
    window.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      movers.forEach((m) => {
        m.x(nx * 36 * m.depth);
        m.y(nx * 6 * m.depth);
      });
    });
  }

  /* marquee reacts to scroll speed */
  const track = document.querySelector<HTMLElement>('.marquee .track');
  const anim = track?.getAnimations()[0];
  if (anim) {
    let boost = 0;
    gsap.ticker.add(() => {
      boost *= 0.94;
      anim.playbackRate = 1 + boost;
    });
    ScrollTrigger.create({
      onUpdate: (self) => {
        boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 260, 5));
      },
    });
  }
}

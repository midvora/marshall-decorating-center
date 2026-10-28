import gsap from 'gsap';

type Kind = 'wall' | 'floor' | 'textile';

/** Interactive room: pick a wall, floor and fabric. A paint roller repaints the wall. */
export function initRoom(reduced: () => boolean, whenOpen: (fn: () => void) => void = (fn) => fn()) {
  const studio = document.querySelector<HTMLElement>('[data-studio]');
  if (!studio) return;

  const base = studio.querySelector<SVGRectElement>('[data-wall-base]')!;
  const strips = Array.from(studio.querySelectorAll<SVGRectElement>('[data-wall-strips] rect'));
  const roller = studio.querySelector<SVGGElement>('[data-roller]')!;
  const rollerPaint = studio.querySelector<SVGRectElement>('[data-roller-paint]')!;
  const chipTag = studio.querySelector<HTMLElement>('.chip-tag');
  const chipSw = studio.querySelector<HTMLElement>('[data-chip-sw]');
  const chipName = studio.querySelector<HTMLElement>('[data-chip-name]');
  const titleEl = studio.querySelector<SVGTitleElement>('[data-room-title]');
  const live = studio.querySelector<HTMLElement>('[data-live]');
  const copyBtn = studio.querySelector<HTMLButtonElement>('[data-copy]');
  const copied = studio.querySelector<HTMLElement>('[data-copied]');

  const inputs = Array.from(studio.querySelectorAll<HTMLInputElement>('input[type="radio"][data-kind]'));

  const info = (input: HTMLInputElement) => {
    const label = input.closest('label') as HTMLElement;
    return {
      id: input.value,
      name: label.querySelector('.sr-only')!.textContent!.trim(),
      hex: label.style.getPropertyValue('--c').trim(),
    };
  };

  const current: Record<Kind, ReturnType<typeof info>> = {
    wall: info(inputs.find((i) => i.dataset.kind === 'wall' && i.checked)!),
    floor: info(inputs.find((i) => i.dataset.kind === 'floor' && i.checked)!),
    textile: info(inputs.find((i) => i.dataset.kind === 'textile' && i.checked)!),
  };

  let timeline: gsap.core.Timeline | null = null;
  let interacted = false;

  function paintWall(hex: string) {
    if (timeline) {
      timeline.progress(1, false);
      timeline = null;
    }
    if (reduced()) {
      base.setAttribute('fill', hex);
      return;
    }

    const W = 640;
    const H = 382;
    const n = strips.length;
    const stripW = W / n;

    strips.forEach((s) => s.setAttribute('fill', hex));
    rollerPaint.setAttribute('fill', hex);

    const tl = gsap.timeline({
      onComplete() {
        base.setAttribute('fill', hex);
        gsap.set(strips, { opacity: 0 });
        gsap.set(roller, { opacity: 0 });
        if (timeline === tl) timeline = null;
      },
    });
    timeline = tl;

    gsap.set(roller, { opacity: 0 });
    strips.forEach((strip, i) => {
      const down = i % 2 === 0;
      const at = i * 0.21;
      const rx = i * stripW + stripW / 2 - 54;
      tl.set(strip, { opacity: 1, scaleY: 0, transformOrigin: down ? '50% 0%' : '50% 100%' }, at);
      tl.set(roller, { opacity: 1 }, at);
      tl.fromTo(strip, { scaleY: 0 }, { scaleY: 1, duration: 0.36, ease: 'power1.inOut' }, at);
      tl.fromTo(
        roller,
        { x: rx, y: down ? -9 : H - 9 },
        { x: rx, y: down ? H - 9 : -9, duration: 0.36, ease: 'power1.inOut' },
        at,
      );
    });
    tl.to(roller, { opacity: 0, duration: 0.2 }, n * 0.21 + 0.1);
  }

  function describe() {
    const text = `A living room with ${current.wall.name} walls, a ${current.floor.name} floor and ${current.textile.name} fabric.`;
    if (titleEl) titleEl.textContent = text;
    if (live) live.textContent = text;
  }

  function apply(kind: Kind, input: HTMLInputElement) {
    const data = info(input);
    current[kind] = data;
    studio!.querySelector<HTMLElement>(`[data-now="${kind}"]`)!.textContent = data.name;
    studio!.dataset[kind] = data.id;

    if (kind === 'wall') {
      paintWall(data.hex);
      if (chipSw) chipSw.style.background = data.hex;
      if (chipName) chipName.textContent = data.name;
      if (chipTag && !reduced()) {
        gsap.fromTo(chipTag, { rotate: -9, y: 6 }, { rotate: -4, y: 0, duration: 0.9, ease: 'back.out(2.5)', delay: 0.9, overwrite: 'auto' });
      }
    } else if (kind === 'textile') {
      studio!.style.setProperty('--textile', data.hex);
    }
    describe();
    if (copied) copied.textContent = '';
  }

  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      interacted = true;
      apply(input.dataset.kind as Kind, input);
    });
  });

  copyBtn?.addEventListener('click', async () => {
    const text = `My room idea from the Marshall Decorating Center concept page: ${current.wall.name} walls, ${current.floor.name} floor, ${current.textile.name} fabric.`;
    try {
      await navigator.clipboard.writeText(text);
      if (copied) copied.textContent = 'Copied. Paste it into a note or text.';
    } catch {
      if (copied) copied.textContent = text;
    }
  });

  /* a short demo so visitors see the roller before they touch anything (starts once the gate, if any, is open) */
  if (!reduced()) {
    whenOpen(() => {
      window.setTimeout(() => {
        if (interacted) return;
        const target = inputs.find((i) => i.dataset.kind === 'wall' && i.value === 'sage');
        if (!target) return;
        target.checked = true;
        apply('wall', target);
      }, 2600);
    });
  }
}

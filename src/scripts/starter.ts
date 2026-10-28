import gsap from 'gsap';

type Mood = { id: string; label: string; palette: string[]; line: string };
type Room = { id: string; label: string; bring: string[] };
type Light = { id: string; label: string; ask: string };
type Data = {
  walls: Record<string, { name: string; hex: string }>;
  rooms: Room[];
  moods: Mood[];
  lights: Light[];
};

/** Three quick questions that end in a plan to bring to the store. Nothing is sent anywhere. */
export function initStarter(reduced: () => boolean) {
  const root = document.querySelector<HTMLElement>('[data-starter]');
  const raw = document.getElementById('starter-data')?.textContent;
  if (!root || !raw) return;

  const data: Data = JSON.parse(raw);
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-dot]'));
  const back = root.querySelector<HTMLButtonElement>('[data-back]')!;
  const restart = root.querySelector<HTMLButtonElement>('[data-restart]')!;
  const plan = root.querySelector<HTMLElement>('[data-plan]')!;
  const fine = root.querySelector<HTMLElement>('[data-fine]')!;

  const answers: { room?: string; mood?: string; light?: string } = {};
  let index = 0;

  function show(n: number, focus: boolean) {
    index = n;
    steps.forEach((s, k) => (s.hidden = k !== n));
    dots.forEach((d, k) => d.classList.toggle('on', n >= 3 ? true : k === n));
    back.hidden = !(n > 0 && n < 3);
    restart.hidden = n !== 3;
    plan.hidden = n !== 3;
    fine.hidden = n === 3;

    const step = steps[n];
    if (!reduced()) gsap.fromTo(step, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
    if (focus) step.querySelector<HTMLElement>('.q')?.focus({ preventScroll: true });
  }

  function buildResult() {
    const mood = data.moods.find((m) => m.id === answers.mood)!;
    const room = data.rooms.find((r) => r.id === answers.room)!;
    const light = data.lights.find((l) => l.id === answers.light)!;

    root!.querySelector('[data-r-line]')!.textContent = `${room.label}, ${mood.label.toLowerCase()}. ${mood.line}`;

    const chips = root!.querySelector('[data-r-chips]')!;
    chips.replaceChildren(
      ...mood.palette.map((id) => {
        const w = data.walls[id];
        const li = document.createElement('li');
        const sw = document.createElement('span');
        sw.className = 'sw';
        sw.style.background = w.hex;
        const nm = document.createElement('span');
        nm.className = 'nm';
        nm.textContent = w.name;
        li.append(sw, nm);
        return li;
      }),
    );

    const list = root!.querySelector('[data-r-bring]')!;
    list.replaceChildren(
      ...[...room.bring, 'Any paint chip, fabric or photo that inspires you'].map((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        return li;
      }),
    );
    root!.querySelector('[data-r-ask]')!.textContent = light.ask;
  }

  root.querySelectorAll<HTMLButtonElement>('[data-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      answers[btn.dataset.pick as 'room' | 'mood' | 'light'] = btn.dataset.value;
      if (index < 2) {
        show(index + 1, true);
      } else {
        buildResult();
        show(3, true);
      }
    });
  });

  back.addEventListener('click', () => show(Math.max(0, index - 1), true));
  restart.addEventListener('click', () => {
    delete answers.room;
    delete answers.mood;
    delete answers.light;
    show(0, true);
  });

  show(0, false);
}

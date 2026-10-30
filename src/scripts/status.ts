type Row = { days: number[]; openMin?: number; closeMin?: number; open?: string; close?: string; label: string };
type Info = { timezone: string; hours: Row[] };

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "Open now / Closed" and today's row in the hours table, computed in the store's own time zone. */
export function initStatus() {
  const raw = document.getElementById('store-hours')?.textContent;
  if (!raw) return;
  const info: Info = JSON.parse(raw);

  const rowFor = (day: number) => info.hours.find((r) => r.days.includes(day));

  function now() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: info.timezone,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(new Date());
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    const hour = Number(get('hour')) % 24;
    return { day, minutes: hour * 60 + Number(get('minute')) };
  }

  function next(from: number, minutes: number) {
    for (let i = 0; i < 8; i++) {
      const d = (from + i) % 7;
      const r = rowFor(d);
      if (!r || r.openMin === undefined) continue;
      if (i === 0 && minutes >= r.openMin) continue;
      return { d, label: i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY_NAMES[d], open: r.open! };
    }
    return null;
  }

  function paint() {
    const { day, minutes } = now();
    const r = rowFor(day);
    const isOpen = !!r && r.openMin !== undefined && minutes >= r.openMin && minutes < r.closeMin!;

    let text: string;
    if (isOpen) {
      const left = r!.closeMin! - minutes;
      text = left <= 60 ? `Open now · closes in ${left} min` : `Open now · until ${r!.close}`;
    } else {
      const n = next(day, minutes);
      text = n ? `Closed · opens ${n.label} at ${n.open}` : 'Closed right now';
    }

    document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => {
      el.dataset.state = isOpen ? 'open' : 'closed';
      const t = el.querySelector<HTMLElement>('[data-status-text]');
      if (t) t.textContent = text;
    });

    document.querySelectorAll<HTMLElement>('[data-hours-row]').forEach((row) => {
      const days = (row.dataset.hoursRow ?? '').split(',').map(Number);
      row.toggleAttribute('data-today', days.includes(day));
      if (days.includes(day)) row.setAttribute('aria-current', 'date');
      else row.removeAttribute('aria-current');
    });
  }

  paint();
  window.setInterval(paint, 60_000);
}

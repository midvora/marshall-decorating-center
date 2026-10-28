type Visitor = { name: string; email: string };

/** Behavior of the Midvora sample gate (kit version 2.1, ported from React). Returns true when the gate is showing. */
export function initGate(onOpen: () => void): boolean {
  const root = document.querySelector<HTMLElement>('[data-gate]');
  if (!root) return false;

  const html = document.documentElement;
  const client = root.dataset.client ?? '';
  const label = root.dataset.label ?? '';
  const key = root.dataset.key ?? '';
  const store = root.dataset.store ?? '';

  const site = document.getElementById('site');
  const formPanel = root.querySelector<HTMLElement>('[data-gate-form-panel]')!;
  const donePanel = root.querySelector<HTMLElement>('[data-gate-done-panel]')!;
  const form = root.querySelector<HTMLFormElement>('[data-gate-form]')!;
  const errorEl = root.querySelector<HTMLElement>('[data-gate-error]')!;
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-gate-submit]')!;
  const doneTitle = root.querySelector<HTMLElement>('[data-gate-done-title]')!;
  const doneLede = root.querySelector<HTMLElement>('[data-gate-done-lede]')!;
  const skipWrap = root.querySelector<HTMLElement>('[data-gate-skip-wrap]')!;

  // If the notification cannot be sent (ad blocker, network), offer a way in rather than trapping the client.
  const ALLOW_SKIP_ON_FAILURE = true;
  skipWrap.hidden = !ALLOW_SKIP_ON_FAILURE;

  const remember = (record: Visitor) => {
    try {
      localStorage.setItem(store, JSON.stringify(record));
    } catch {
      /* private mode: they just see the gate again next visit */
    }
  };

  const showSite = (inert: boolean) => {
    if (!site) return;
    site.toggleAttribute('inert', inert);
    if (inert) site.setAttribute('aria-hidden', 'true');
    else site.removeAttribute('aria-hidden');
  };

  function open(record: Visitor) {
    remember(record);
    html.classList.remove('gated');
    showSite(false);
    document.getElementById('main')?.focus({ preventScroll: true });
    onOpen();
  }

  async function notifyMidvora({ name, email }: Visitor) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: `Sample opened: ${name} (${client})`,
          from_name: 'Midvora sample gate',
          replyto: email,
          name,
          email,
          sample: label,
          page: window.location.href,
          opened_at: new Date().toISOString(),
          referrer: document.referrer || 'direct',
          browser: navigator.userAgent,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || `Web3Forms returned ${response.status}`);
    } finally {
      clearTimeout(timer);
    }
  }

  const currentRecord = (): Visitor => {
    const data = new FormData(form);
    return { name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? '').trim() };
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Honeypot: only a bot ticks the hidden checkbox.
    if (new FormData(form).get('botcheck')) return;

    const record = currentRecord();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    errorEl.hidden = true;
    let failed = false;

    try {
      if (key) await notifyMidvora(record);
      remember(record);
      const first = record.name ? record.name.split(' ')[0] : '';
      // Only claim we received something if it was really sent.
      doneTitle.textContent = key ? `We got your request${first ? `, ${first}` : ''}.` : `Welcome${first ? `, ${first}` : ''}.`;
      doneLede.textContent = `${key ? 'Thank you for your interest. ' : ''}Your ${client} sample is ready.`;
      donePanel.dataset.record = JSON.stringify(record);
      formPanel.hidden = true;
      donePanel.hidden = false;
      doneTitle.focus();
    } catch (error) {
      console.error('Sample gate could not send the request:', error);
      failed = true;
      errorEl.hidden = false;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = failed ? 'Try again' : 'View the sample';
  });

  root.querySelector('[data-gate-skip]')?.addEventListener('click', () => open(currentRecord()));
  root.querySelector('[data-gate-open]')?.addEventListener('click', () => {
    const raw = donePanel.dataset.record;
    open(raw ? (JSON.parse(raw) as Visitor) : currentRecord());
  });

  if (!html.classList.contains('gated')) return false;

  showSite(true);
  form.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
  return true;
}

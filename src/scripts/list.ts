type Entry = { id: string; name: string; dept: string; thumb: string };

const STORE = 'midvora-sample-list:marshall-decorating-center';

/** "My list": the e-commerce-lite piece. Add items from the shop, send the list as a quote or pickup request. */
export function initList(onToggle: (open: boolean) => void) {
  const drawer = document.querySelector<HTMLElement>('[data-drawer]');
  if (!drawer) return;

  const panel = drawer.querySelector<HTMLElement>('.panel')!;
  const itemsEl = drawer.querySelector<HTMLUListElement>('[data-list-items]')!;
  const emptyEl = drawer.querySelector<HTMLElement>('[data-list-empty]')!;
  const form = drawer.querySelector<HTMLFormElement>('[data-list-form]')!;
  const doneEl = drawer.querySelector<HTMLElement>('[data-list-done]')!;
  const doneName = drawer.querySelector<HTMLElement>('[data-done-name]')!;
  const clearBtn = drawer.querySelector<HTMLButtonElement>('[data-list-clear]')!;
  const counts = document.querySelectorAll<HTMLElement>('[data-list-count]');

  let list: Entry[] = [];
  try {
    list = JSON.parse(localStorage.getItem(STORE) ?? '[]');
  } catch {
    list = [];
  }
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch {
      /* private mode: the list lives for this page view only */
    }
  };

  const has = (id: string) => list.some((e) => e.id === id);

  function paintButtons() {
    document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((b) => {
      const on = has(b.dataset.id!);
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-added', on);
      const label = b.querySelector<HTMLElement>('.lbl');
      if (label) label.textContent = on ? 'On my list' : 'Add to my list';
    });
  }

  function render() {
    counts.forEach((c) => {
      c.textContent = String(list.length);
      c.hidden = list.length === 0;
    });
    emptyEl.hidden = list.length > 0;
    form.hidden = list.length === 0;
    clearBtn.hidden = list.length === 0;
    itemsEl.replaceChildren(
      ...list.map((e) => {
        const li = document.createElement('li');
        if (e.thumb) {
          const img = document.createElement('img');
          img.className = 'th';
          img.alt = '';
          img.src = e.thumb;
          li.append(img);
        } else {
          const ph = document.createElement('span');
          ph.className = 'th';
          li.append(ph);
        }
        const text = document.createElement('span');
        const nm = document.createElement('span');
        nm.className = 'nm';
        nm.textContent = e.name;
        const dp = document.createElement('span');
        dp.className = 'dp';
        dp.textContent = e.dept;
        text.append(nm, dp);
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'rm';
        rm.dataset.remove = e.id;
        rm.setAttribute('aria-label', `Remove ${e.name} from my list`);
        rm.textContent = '×';
        li.append(text, rm);
        return li;
      }),
    );
    paintButtons();
  }

  let opener: HTMLElement | null = null;

  function open(from?: HTMLElement | null) {
    opener = from ?? (document.activeElement as HTMLElement | null);
    doneEl.hidden = true;
    render();
    drawer!.hidden = false;
    onToggle(true);
    panel.focus({ preventScroll: true });
  }
  function close() {
    drawer!.hidden = true;
    onToggle(false);
    opener?.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const t = e.target as Element;

    const openBtn = t.closest<HTMLElement>('[data-list-open]');
    if (openBtn) {
      open(openBtn);
      return;
    }
    if (t.closest('[data-list-close]')) {
      close();
      return;
    }

    const add = t.closest<HTMLButtonElement>('[data-add]');
    if (add) {
      const id = add.dataset.id!;
      if (has(id)) {
        list = list.filter((x) => x.id !== id);
      } else {
        const img = add.closest('[data-item]')?.querySelector('img');
        list.push({
          id,
          name: add.dataset.name ?? id,
          dept: add.dataset.dept ?? '',
          thumb: img?.currentSrc || img?.src || '',
        });
      }
      save();
      render();
      return;
    }

    const rm = t.closest<HTMLElement>('[data-remove]');
    if (rm) {
      list = list.filter((x) => x.id !== rm.dataset.remove);
      save();
      render();
      /* the clicked button no longer exists: keep focus inside the dialog */
      (itemsEl.querySelector<HTMLElement>('.rm') ?? panel).focus({ preventScroll: true });
      return;
    }
    if (t.closest('[data-list-clear]')) {
      list = [];
      save();
      render();
      panel.focus({ preventScroll: true });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = String(new FormData(form).get('name') ?? '').trim().split(' ')[0];
    doneName.textContent = name ? `, ${name}` : '';
    form.hidden = true;
    emptyEl.hidden = true;
    itemsEl.replaceChildren();
    clearBtn.hidden = true;
    doneEl.hidden = false;
    list = [];
    save();
    counts.forEach((c) => {
      c.textContent = '0';
      c.hidden = true;
    });
    paintButtons();
    doneEl.focus();
  });

  /* Escape closes, Tab stays inside the panel. Listening on the document so it still works
     when focus has been dropped onto the page (for example after an item is removed). */
  document.addEventListener('keydown', (e) => {
    if (drawer.hidden) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, [tabindex="0"]'),
    ).filter((el) => !el.closest('[hidden]') && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!panel.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  render();
}

/** Department filter chips on the shop page. Works without JS too: every card shows by default. */
export function initShop() {
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  if (!chips.length) return;
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-item]'));
  const status = document.querySelector<HTMLElement>('[data-shop-status]');

  function apply(dept: string) {
    let shown = 0;
    cards.forEach((c) => {
      const match = dept === 'all' || c.dataset.dept === dept;
      c.hidden = !match;
      if (match) shown++;
    });
    chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === dept)));
    if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'display' : 'displays'}`;
  }

  chips.forEach((b) => b.addEventListener('click', () => {
    apply(b.dataset.filter!);
    const u = new URL(location.href);
    if (b.dataset.filter === 'all') u.searchParams.delete('dept');
    else u.searchParams.set('dept', b.dataset.filter!);
    history.replaceState(null, '', u);
  }));

  const wanted = new URL(location.href).searchParams.get('dept');
  apply(chips.some((b) => b.dataset.filter === wanted) ? wanted! : 'all');
}

/** Contact forms on the sample: nothing is sent. They show a thank-you so the flow can be judged. */
export function initSampleForms() {
  document.querySelectorAll<HTMLFormElement>('[data-sample-form]').forEach((form) => {
    const done = form.parentElement?.querySelector<HTMLElement>('[data-sample-done]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.hidden = true;
      if (done) {
        done.hidden = false;
        done.focus();
      }
    });
  });
}

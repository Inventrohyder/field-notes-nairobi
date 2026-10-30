const KEY = 'field-notes-theme';

function current(): 'light' | 'dark' {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function paint(): void {
  const dark = current() === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(dark));
    b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    const label = b.querySelector('[data-theme-label]');
    if (label) label.textContent = dark ? 'Light' : 'Dark';
  });
}

export function initTheme(): void {
  paint();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage unavailable */
      }
      paint();
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);
}

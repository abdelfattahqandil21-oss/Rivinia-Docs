const media = matchMedia('(prefers-color-scheme: dark)');
const buttons = [...document.querySelectorAll('[data-mode]')];
const status = document.querySelector('#status');

function updateStatus(mode) {
  const preference = media.matches ? 'Dark' : 'Light';
  status.textContent =
    mode === 'system'
      ? `Following system. Current OS preference: ${preference}.`
      : `Explicit ${mode} mode. Current OS preference: ${preference}.`;
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    if (mode === 'system') document.documentElement.removeAttribute('data-rv-theme');
    else document.documentElement.setAttribute('data-rv-theme', mode);
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    updateStatus(mode);
  });
}

media.addEventListener('change', () => {
  const mode = document.documentElement.getAttribute('data-rv-theme') ?? 'system';
  updateStatus(mode);
});

updateStatus('system');

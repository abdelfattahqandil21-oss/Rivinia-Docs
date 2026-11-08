const snippets = {
  css: "@import '@rivinia/theme';",
  tailwind: "@import 'tailwindcss';\n@import '@rivinia/theme/tailwind.css';",
  bootstrap: "@import '@rivinia/theme/bootstrap.css';",
  sass: "@use '@rivinia/theme/scss';",
  less: "@import (less) '@rivinia/theme/theme.css';",
};

const buttons = [...document.querySelectorAll('[data-stack]')];
const entry = document.querySelector('#entry');
for (const button of buttons) {
  button.addEventListener('click', () => {
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    entry.textContent = snippets[button.dataset.stack];
  });
}

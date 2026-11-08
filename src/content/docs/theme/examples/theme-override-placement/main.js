const messages = {
  default: 'Package defaults from the installed theme stylesheet.',
  global: 'An unlayered root override replaces the package defaults.',
  layered: 'The app layer loses because rivinia-theme is later in the declared layer order.',
  section: 'The section overrides semantic tokens while the page keeps its root values.',
  component: 'The root component token wins over the section semantic background.',
};

const buttons = [...document.querySelectorAll('[data-case]')];
const status = document.querySelector('#status');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const selected = button.dataset.case;
    document.documentElement.dataset.case = selected;
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    status.textContent = messages[selected];
  });
}

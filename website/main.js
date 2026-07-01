const copyButton = document.querySelector('[data-copy-bibtex]');
const bibtex = document.querySelector('#bibtex');

const copyText = async (text) => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  if (textarea.style) {
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
  }

  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
};

if (copyButton && bibtex) {
  copyButton.addEventListener('click', async () => {
    const label = copyButton.querySelector('strong');
    const original = label.textContent;

    const copied = await copyText(bibtex.textContent.trim());
    label.textContent = copied ? 'Copied' : 'Copy unavailable';

    window.setTimeout(() => {
      label.textContent = original;
    }, 1600);
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

  observedSections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.setAttribute('data-open', item.open ? 'true' : 'false');
  item.addEventListener('toggle', () => {
    item.setAttribute('data-open', item.open ? 'true' : 'false');
  });
});

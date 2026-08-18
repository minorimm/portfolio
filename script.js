const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.navigation a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const dialog = document.querySelector('.project-dialog');
const dialogTitle = dialog.querySelector('#project-title');
const dialogCategory = dialog.querySelector('.dialog-category');
const dialogDescription = dialog.querySelector('.dialog-description');
const galleryMain = dialog.querySelector('.gallery-main img');
const gallerySide = dialog.querySelectorAll('.gallery-side img');

document.querySelectorAll('.work-card').forEach((card) => {
  card.addEventListener('click', () => {
    dialogTitle.textContent = card.querySelector('h3').textContent;
    dialogCategory.textContent = card.querySelector('.work-info p').textContent;
    dialogDescription.textContent = card.dataset.description;
    const galleryImages = card.dataset.gallery.split(',');
    galleryMain.src = galleryImages[0];
    galleryMain.alt = `${card.querySelector('h3').textContent} のメイン画像`;
    gallerySide.forEach((galleryImage, index) => {
      galleryImage.src = galleryImages[index + 1];
      galleryImage.alt = `${card.querySelector('h3').textContent} のサブ画像 ${index + 1}`;
    });
    dialog.showModal();
  });
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function startCanvasRipples() {
  const hero = document.querySelector('.hero');
  const canvas = document.createElement('canvas');
  canvas.className = 'water-ripple';
  hero.append(canvas);
  const context = canvas.getContext('2d');
  const ripples = [];
  let width = 0;
  let height = 0;
  let lastRipple = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const bounds = hero.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function addRipple(clientX, clientY) {
    const bounds = hero.getBoundingClientRect();
    ripples.push({ x: clientX - bounds.left, y: clientY - bounds.top, radius: 5, opacity: 0.34 });
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index];
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(24, 132, 184, ${ripple.opacity})`;
      context.lineWidth = 1;
      context.stroke();
      ripple.radius += 1.8;
      ripple.opacity -= 0.008;
      if (ripple.opacity <= 0) ripples.splice(index, 1);
    }
    requestAnimationFrame(draw);
  }
  hero.addEventListener('pointermove', (event) => {
    if (performance.now() - lastRipple > 80) {
      addRipple(event.clientX, event.clientY);
      lastRipple = performance.now();
    }
  });
  hero.addEventListener('pointerdown', (event) => addRipple(event.clientX, event.clientY));
  window.addEventListener('resize', resize);
  resize();
  draw();
}

if (!prefersReducedMotion) {
  if (isSafari) {
    startCanvasRipples();
  } else if (window.jQuery && window.jQuery.fn.ripples) {
    try {
      window.jQuery('.hero').ripples({ perturbance: 0.015, resolution: 256, dropRadius: 20 });
    } catch (error) {
      startCanvasRipples();
    }
  } else {
    startCanvasRipples();
  }
}

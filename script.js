// Load upcoming event images from /images/events/
function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  const maxImages = 10;
  const promises  = [];

  for (let i = 1; i <= maxImages; i++) {
    const src = `images/events/UpcomingEvent${i}.png`;
    promises.push(
      new Promise(resolve => {
        const img = new Image();
        img.onload  = () => resolve({ src, index: i });
        img.onerror = () => resolve(null);
        img.src = src;
      })
    );
  }

  Promise.all(promises).then(results => {
    const found = results.filter(Boolean);
    container.innerHTML = '';

    if (found.length === 0) {
      container.innerHTML = `
        <div class="no-events">
          <i class="fas fa-calendar-times"></i>
          <p>No upcoming events scheduled at this time.</p>
          <p>Follow us on social media for the latest updates.</p>
        </div>`;
      return;
    }

    found.forEach(({ src, index }) => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="${src}" alt="Upcoming Event ${index}" loading="lazy">
        <div class="event-label">Upcoming Smagam / Event</div>`;
      card.addEventListener('click', () => openLightbox(src));
      container.appendChild(card);
    });
  });
}

// Lightbox
function openLightbox(src) {
  const modal = document.getElementById('lightboxModal');
  const img   = document.getElementById('lightboxImage');
  if (!modal || !img) return;
  img.src = src;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Mobile menu
function initMobileMenu() {
  const btn   = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('active'));
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  initMobileMenu();
  initSmoothScroll();

  // Lightbox close events
  const closeBtn = document.getElementById('lightboxClose');
  const modal    = document.getElementById('lightboxModal');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (modal)    modal.addEventListener('click', e => { if (e.target === modal) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});

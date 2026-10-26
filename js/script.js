// Swiss Residence — cinematic theme scripts

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav: solid background after scrolling past the hero.
  // Pages without a full-bleed hero (Rooms, Gallery) keep the nav solid always.
  const nav = document.getElementById('siteNav');
  const hasHero = document.querySelector('.hero');
  if (hasHero) {
    const onScroll = () => {
      if (window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // Scroll-reveal: fade/slide in elements with class "reveal"
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

 // Enquiry form: sends to hyzornapartments@gmail.com via Web3Forms
const form = document.getElementById('enquiryForm');
const note = document.getElementById('formNote');
const submitBtn = document.getElementById('submitBtn');

if (form && note) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();

    if (!name || !email) {
      note.textContent = 'Please fill in your name and email.';
      note.style.color = '#b34747';
      return;
    }

    const checkin = form.elements['checkin'].value;
    const checkout = form.elements['checkout'].value;
    if (checkin && checkout && checkout <= checkin) {
      note.textContent = 'Check-out must be after check-in.';
      note.style.color = '#b34747';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    note.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        note.textContent = `Thank you, ${name}. Your enquiry has been sent. We'll reply within one business day.`;
        note.style.color = '#2f6f77';
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      note.textContent = 'Sorry, something went wrong. Please email hyzornapartments@gmail.com or call +94 71 6022 128.';
      note.style.color = '#b34747';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send enquiry';
    }
  });
}
});

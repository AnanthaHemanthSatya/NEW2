(function () {
  'use strict';

  const BIRTHDAY_MONTH = 6; // July (0-indexed)
  const BIRTHDAY_DAY = 8;
  const BIRTHDAY_YEAR = 2026;
  const PREVIEW_PASSWORD = 'LOVEYOUBISH';

  const landing = document.getElementById('landing');
  const main = document.getElementById('main');
  const openBtn = document.getElementById('open-surprise');
  const btnLabel = document.getElementById('btn-label');
  const btnArrow = document.getElementById('btn-arrow');
  const lockPanel = document.getElementById('lock-panel');
  const unlockPanel = document.getElementById('unlock-panel');
  const lockMessage = document.getElementById('lock-message');
  const birthdayMessage = document.getElementById('birthday-message');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const prankScreen = document.getElementById('prank-screen');
  const prankJk = document.getElementById('prank-jk');

  const PRANK_DURATION_MS = 3500;
  const PRANK_JK_DELAY_MS = 2200;

  let confettiRunning = false;
  let confettiParticles = [];
  let isUnlocked = false;
  let hasTriggeredUnlock = false;
  let prankPlaying = false;

  const daysEl = document.getElementById('landing-days');
  const hoursEl = document.getElementById('landing-hours');
  const minutesEl = document.getElementById('landing-minutes');
  const secondsEl = document.getElementById('landing-seconds');

  const BILLI_PHOTOS = [
    { key: 'billi-01', src: 'assets/photos/billi/little-billi-spiderman-bed.jpg', label: 'Little BILLI', caption: 'Spider-Man bed, PRETTY shirt & chips — tiny you was already adorable' },
    { key: 'billi-02', src: 'assets/photos/billi/restaurant-pout-waiting.jpg', label: 'Restaurant pout', caption: 'Waiting for food with that famous BILLI pout' },
    { key: 'billi-03', src: 'assets/photos/billi/siblings-selfie.jpg', label: 'Siblings selfie', caption: 'You and your little partner-in-crime — pure joy' },
    { key: 'billi-04', src: 'assets/photos/billi/aesthetic-soft-portrait.jpg', label: 'Soft aesthetic', caption: 'Dreamy filter, heart & tulip stickers on your hair — effortlessly pretty' },
    { key: 'billi-05', src: 'assets/photos/billi/favourite-hearts-tulips.jpg', label: 'My favourite', caption: 'Hearts & tulips in your hair — this one lives in my head rent-free', featured: true },
    { key: 'billi-06', src: 'assets/photos/billi/flower-filter-rose-pillow.jpg', label: 'Flower filter', caption: 'Rose pillow, purple flower filter, that sweet little smile' },
    { key: 'billi-07', src: 'assets/photos/billi/blue-polo-plaid-blazer.jpg', label: 'Smart casual', caption: 'Blue polo & plaid blazer — elegant without even trying' },
    { key: 'billi-08', src: 'assets/photos/billi/gentle-heart-with-baby.jpg', label: 'Gentle heart', caption: 'Holding the baby so softly — your kindness shows in everything' },
    { key: 'billi-09', src: 'assets/photos/billi/calligraphy-wall-from-behind.jpg', label: 'From behind', caption: 'Even from behind, with calligraphy on the wall — I know it\'s you' },
    { key: 'billi-10', src: 'assets/photos/billi/mirror-selfie-elegant.jpg', label: 'Mirror selfie', caption: 'White shirt, full mirror fit — clean and beautiful' },
    { key: 'billi-11', src: 'assets/photos/billi/blue-polo-floral-pillow.jpg', label: 'Cozy on bed', caption: 'Blue polo on floral pillows — cozy BILLI hours' },
    { key: 'billi-12', src: 'assets/photos/billi/cute-pout-lavender.jpg', label: 'The pout', caption: 'Lavender wall, floral top, legendary pout — stole my heart here' },
    { key: 'billi-13', src: 'assets/photos/billi/sleepy-resting-moment.jpg', label: 'Sleepy BILLI', caption: 'Resting after long days — still the cutest sleepy face' },
    { key: 'billi-14', src: 'assets/photos/billi/little-red-traditional.jpg', label: 'Little red', caption: 'Tiny you in red traditional wear — so cute I can\'t handle it' },
    { key: 'billi-15', src: 'assets/photos/billi/stairs-aesthetic-pose.jpg', label: 'Stairs aesthetic', caption: 'White shirt, jeans, staircase pose — main character energy' },
  ];

  const ME_PHOTOS = [
    { key: 'me-01', src: 'assets/photos/me/01-motorcycle.jpg', label: 'ASH', caption: 'On the bike — the guy who saves your reels & stays up on Roblox with you' },
    { key: 'me-02', src: 'assets/photos/me/02-outdoors.jpg', label: 'ASH', caption: 'Hoping you see how much I mean every word on this page' },
    { key: 'me-03', src: 'assets/photos/me/03-bike-angle.jpg', label: 'ASH', caption: 'Ready for real adventures — with you' },
  ];

  function getBirthdayState() {
    const now = new Date();
    const birthdayStart = new Date(BIRTHDAY_YEAR, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
    const birthdayEnd = new Date(BIRTHDAY_YEAR, BIRTHDAY_MONTH, BIRTHDAY_DAY, 23, 59, 59, 999);

    if (now < birthdayStart) {
      return { state: 'locked', target: birthdayStart };
    }
    if (now <= birthdayEnd) {
      return { state: 'birthday' };
    }
    return { state: 'belated' };
  }

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function unlockSite(belated, fromPassword) {
    if (isUnlocked) return;
    isUnlocked = true;

    lockPanel.classList.add('hidden');
    unlockPanel.classList.remove('hidden');

    openBtn.disabled = false;
    openBtn.classList.remove('btn--locked');
    btnLabel.textContent = 'Open your surprise';
    btnArrow.classList.remove('hidden');
    openBtn.querySelector('.btn__lock-icon').classList.add('hidden');

    const passwordSection = document.querySelector('.password-unlock');
    if (passwordSection) passwordSection.classList.add('hidden');

    if (belated) {
      unlockPanel.querySelector('.unlock-panel__text').textContent =
        'Your surprise is waiting for you, BILLI!';
    } else if (fromPassword) {
      unlockPanel.querySelector('.unlock-panel__text').textContent =
        'Preview unlocked — take a look before the big day!';
    } else {
      unlockPanel.querySelector('.unlock-panel__text').textContent =
        'The wait is over — your surprise is ready!';
      if (!confettiRunning) {
        startConfetti();
      }
    }

    updateBirthdayMessage(belated);
  }

  function updateBirthdayMessage(belated) {
    if (!birthdayMessage) return;

    const title = birthdayMessage.querySelector('.birthday-message__title');
    const text = birthdayMessage.querySelector('.birthday-message__text');

    if (belated) {
      title.textContent = 'Belated Happy 67th Birthday, BILLI!';
      text.textContent = 'You deserve to be celebrated every day — but especially on July 8.';
    } else {
      title.textContent = 'Happy 67th Birthday, BILLI!';
      text.textContent = 'Today is all about you — the most special person I know.';
    }
  }

  function updateCountdown() {
    const { state, target } = getBirthdayState();

    if (state === 'birthday') {
      if (!hasTriggeredUnlock) {
        hasTriggeredUnlock = true;
        unlockSite(false);
      }
      return;
    }

    if (state === 'belated') {
      if (!hasTriggeredUnlock) {
        hasTriggeredUnlock = true;
        unlockSite(true);
      }
      return;
    }

    const diff = target - new Date();

    if (diff <= 0) {
      if (!hasTriggeredUnlock) {
        hasTriggeredUnlock = true;
        unlockSite(false);
      }
      return;
    }

    daysEl.textContent = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    hoursEl.textContent = pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    minutesEl.textContent = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    secondsEl.textContent = pad(Math.floor((diff % (1000 * 60)) / 1000));
  }

  function revealMainContent() {
    main.classList.remove('hidden');
    main.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      main.classList.add('visible');
    });

    initScrollReveal();
  }

  function openSurprise() {
    if (!isUnlocked || prankPlaying) return;
    prankPlaying = true;
    openBtn.disabled = true;

    landing.classList.add('fade-out');
    landing.setAttribute('aria-hidden', 'true');

    if (!prankScreen) {
      landing.style.display = 'none';
      revealMainContent();
      prankPlaying = false;
      return;
    }

    const prankGif = prankScreen.querySelector('.prank-screen__gif');
    if (prankGif && !prankGif.getAttribute('src')) {
      prankGif.removeAttribute('hidden');
      prankGif.src = prankGif.dataset.src || 'assets/prank-monkey.gif';
    }

    prankScreen.classList.remove('hidden');
    prankScreen.setAttribute('aria-hidden', 'false');
    if (prankJk) prankJk.classList.remove('visible');

    requestAnimationFrame(() => {
      prankScreen.classList.add('visible');
    });

    setTimeout(() => {
      if (prankJk) prankJk.classList.add('visible');
    }, PRANK_JK_DELAY_MS);

    setTimeout(() => {
      prankScreen.classList.remove('visible');

      setTimeout(() => {
        prankScreen.classList.add('hidden');
        prankScreen.setAttribute('aria-hidden', 'true');
        landing.style.display = 'none';
        revealMainContent();
        prankPlaying = false;
      }, 400);
    }, PRANK_DURATION_MS);
  }

  const STORAGE_KEY = 'billi-birthday-photos';

  function resolvePhoto(key, fallbackPath) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data[key]) return data[key];
      }
    } catch (e) {}

    if (window.PHOTOS_DATA && window.PHOTOS_DATA[key]) {
      return window.PHOTOS_DATA[key];
    }

    return fallbackPath;
  }

  function applyAllPhotos() {
    document.querySelectorAll('[data-photo-key]').forEach((img) => {
      const key = img.dataset.photoKey;
      const fallback = img.getAttribute('src');
      img.src = resolvePhoto(key, fallback);
    });

    document.querySelectorAll('.habit-card__media').forEach((btn) => {
      const img = btn.querySelector('img');
      if (img?.src) btn.dataset.src = img.src;
    });
  }

  function initImageFallbacks() {
    applyAllPhotos();
    document.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.addEventListener('error', () => {
        const label = img.getAttribute('data-fallback') || 'Photo';
        img.style.display = 'none';
        if (img.parentElement && !img.parentElement.querySelector('.img-fallback')) {
          const fallback = document.createElement('div');
          fallback.className = 'img-fallback';
          fallback.textContent = label;
          img.parentElement.appendChild(fallback);
        }
      });
    });
  }

  function renderGalleries() {
    const billiGallery = document.getElementById('billi-gallery');
    const meGallery = document.getElementById('me-gallery');

    if (billiGallery) {
      billiGallery.innerHTML = BILLI_PHOTOS.map((photo) => {
        const src = resolvePhoto(photo.key, photo.src);
        return `
        <button class="photo-card photo-card--polaroid${photo.featured ? ' photo-card--featured' : ''} reveal" type="button" data-src="${src}" data-caption="${photo.label} — ${photo.caption}">
          <div class="photo-card__frame">
            <div class="photo-card__image-wrap">
              <img class="photo-card__image" src="${src}" alt="${photo.label}" loading="lazy">
            </div>
            <div class="photo-card__text">
              <p class="photo-card__label">${photo.label}</p>
              <p class="photo-card__caption">${photo.caption}</p>
            </div>
          </div>
        </button>
      `;
      }).join('');
    }

    if (meGallery) {
      meGallery.innerHTML = ME_PHOTOS.map((photo) => {
        const src = resolvePhoto(photo.key, photo.src);
        const label = photo.label || 'ASH';
        return `
        <button class="photo-card photo-card--polaroid photo-card--me reveal" type="button" data-src="${src}" data-caption="${label} — ${photo.caption}">
          <div class="photo-card__frame">
            <div class="photo-card__image-wrap">
              <img class="photo-card__image" src="${src}" alt="${label}" loading="lazy">
            </div>
            <div class="photo-card__text">
              <p class="photo-card__label">${label}</p>
              <p class="photo-card__caption">${photo.caption}</p>
            </div>
          </div>
        </button>
      `;
      }).join('');
    }
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox) return;

    function openLightbox(src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-src][data-caption]');
      if (trigger) {
        openLightbox(trigger.dataset.src, trigger.dataset.caption);
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }

  function initProposal() {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const proposalButtons = document.getElementById('proposal-buttons');
    const proposalSuccess = document.getElementById('proposal-success');

    if (!btnYes || !btnNo) return;

    let noClicks = 0;
    const noTexts = ['No', 'Are you sure?', 'Really sure?', 'Think again!', 'Pretty please?', 'Last chance!'];

    btnYes.addEventListener('click', () => {
      proposalButtons.classList.add('hidden');
      proposalSuccess.classList.remove('hidden');
      if (!confettiRunning) startConfetti();

      const spyFinale = document.querySelector('.spyfinale-section');
      if (spyFinale) {
        setTimeout(() => {
          spyFinale.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1200);
      }
    });

    btnNo.addEventListener('click', () => {
      noClicks++;
      btnNo.textContent = noTexts[Math.min(noClicks, noTexts.length - 1)];

      const container = proposalButtons;
      const maxX = container.clientWidth - btnNo.offsetWidth - 20;
      const maxY = 40;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      btnNo.style.position = 'absolute';
      btnNo.style.left = `${x}px`;
      btnNo.style.top = `${y}px`;

      btnYes.style.transform = `scale(${1 + noClicks * 0.08})`;
    });

    btnNo.addEventListener('mouseover', () => {
      if (noClicks > 0) {
        const container = proposalButtons;
        const maxX = container.clientWidth - btnNo.offsetWidth - 20;
        btnNo.style.left = `${Math.random() * maxX}px`;
      }
    });
  }

  function initPasswordUnlock() {
    const passwordInput = document.getElementById('preview-password');
    const passwordBtn = document.getElementById('preview-unlock');
    const passwordError = document.getElementById('password-error');

    if (!passwordInput || !passwordBtn) return;

    function tryPasswordUnlock() {
      if (isUnlocked) return;

      if (passwordInput.value === PREVIEW_PASSWORD) {
        passwordError.classList.add('hidden');
        hasTriggeredUnlock = true;
        unlockSite(false, true);
      } else {
        passwordError.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.focus();
      }
    }

    passwordBtn.addEventListener('click', tryPasswordUnlock);
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryPasswordUnlock();
    });
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  function startConfetti() {
    if (!confettiCanvas) return;

    confettiRunning = true;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#ffffff', '#f4e4e4', '#c9a96e', '#e8d5b0', '#fce4ec', '#8b2942'];

    for (let i = 0; i < 120; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
        spin: Math.random() * 6 - 3,
      });
    }

    let frame = 0;
    const maxFrames = 300;

    function animate() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettiParticles.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.angle * 0.05) * 0.5;
        p.angle += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiRunning = false;
      }
    }

    animate();
  }

  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  openBtn.addEventListener('click', openSurprise);

  renderGalleries();
  initLightbox();
  initProposal();
  initPasswordUnlock();
  initImageFallbacks();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

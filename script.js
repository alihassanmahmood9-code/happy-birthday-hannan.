/* =====================================================
   MUHAMMAD HANNAN — 18TH BIRTHDAY WEBSITE
   All interactivity: loader, typing, particles, balloons,
   hearts, scan bars, cake, surprise (fireworks+confetti),
   gallery auto-detect, music player.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. CINEMATIC LOADING SCREEN
     ===================================================== */
  const loader        = document.getElementById('loader');
  const loaderBarFill  = document.getElementById('loaderBarFill');
  const loaderPercent  = document.getElementById('loaderPercent');
  const enterBtn       = document.getElementById('enterBtn');
  const siteEls        = document.querySelectorAll('.hidden-site');

  let progress = 0;
  const loadInterval = setInterval(() => {
    // Simulate a slightly uneven, cinematic loading progress
    progress += Math.random() * 12 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      enterBtn.classList.remove('hidden');
    }
    loaderBarFill.style.width = progress + '%';
    loaderPercent.textContent = Math.floor(progress) + '%';
  }, 220);

  enterBtn.addEventListener('click', () => {
    loader.classList.add('fade-out');
    siteEls.forEach(el => {
      el.classList.remove('hidden-site');
      el.style.transition = 'opacity 1.2s ease';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });
    // First user gesture -> safe to attempt music autoplay
    tryPlayMusic();
    startTypingEffect();
    setTimeout(() => loader.remove(), 1200);
  });


  /* =====================================================
     2. HERO — TYPING EFFECT
     ===================================================== */
  const typedTextEl = document.getElementById('typedText');
  const fullText = 'The legend turns 18 today.';
  let typingStarted = false;

  function startTypingEffect() {
    if (typingStarted) return;
    typingStarted = true;
    let i = 0;
    const typeSpeed = 65;
    function typeChar() {
      if (i <= fullText.length) {
        typedTextEl.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeChar, typeSpeed);
      }
    }
    typeChar();
  }


  /* =====================================================
     3. AMBIENT PARTICLE BACKGROUND (canvas)
     ===================================================== */
  const particleCanvas = document.getElementById('particleCanvas');
  const pCtx = particleCanvas.getContext('2d');
  let particles = [];

  function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
  resizeParticleCanvas();
  window.addEventListener('resize', resizeParticleCanvas);

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.3 + 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '77,216,255' : '178,75,255'
      });
    }
  }
  createParticles(90);

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = particleCanvas.height + 10; p.x = Math.random() * particleCanvas.width; }
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      pCtx.shadowBlur = 6;
      pCtx.shadowColor = `rgba(${p.color}, 0.8)`;
      pCtx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  /* =====================================================
     4. FLOATING BALLOONS
     ===================================================== */
  const balloonField = document.getElementById('balloonField');
  const balloonColors = [
    'linear-gradient(180deg,#b24bff,#7b2ff7)',
    'linear-gradient(180deg,#4dd8ff,#2f6fff)',
    'linear-gradient(180deg,#ff5fd8,#b24bff)',
    'linear-gradient(180deg,#ffd36e,#ff7a3d)'
  ];

  function spawnBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const left = Math.random() * 92;
    const duration = Math.random() * 6 + 10; // 10 - 16s
    const size = Math.random() * 16 + 40;
    balloon.style.left = left + 'vw';
    balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.style.width = size + 'px';
    balloon.style.height = (size * 1.25) + 'px';
    balloon.style.animationDuration = duration + 's';
    balloonField.appendChild(balloon);

    // Remove after it floats away to keep DOM light
    setTimeout(() => balloon.remove(), duration * 1000);
  }

  // Continuous stream of balloons
  setInterval(spawnBalloon, 1400);
  for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 500);


  /* =====================================================
     5. FLOATING HEARTS (occasional)
     ===================================================== */
  const heartField = document.getElementById('heartField');

  function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = Math.random() > 0.5 ? '💜' : '💙';
    heart.style.left = (Math.random() * 92) + 'vw';
    const duration = Math.random() * 3 + 6;
    heart.style.animationDuration = duration + 's';
    heartField.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
  }
  // Occasional hearts — not constant, every few seconds
  setInterval(spawnHeart, 2600);


  /* =====================================================
     6. HANNAN SCAN — animated stat bars on scroll into view
     ===================================================== */
  const scanSection = document.getElementById('scan');
  let scanAnimated = false;

  function animateScanBars() {
    if (scanAnimated) return;
    scanAnimated = true;

    document.querySelectorAll('.stat-fill[data-target]').forEach(fill => {
      const target = fill.dataset.target;
      requestAnimationFrame(() => {
        fill.style.width = target + '%';
      });
    });

    // Animate the numeric counters alongside the bars
    document.querySelectorAll('.stat-value[data-suffix]').forEach(valueEl => {
      const suffix = valueEl.dataset.suffix;
      const target = suffix === '+' ? 9999 : 100;
      const duration = 1600;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(elapsed * target);
        valueEl.textContent = current + suffix;
        if (elapsed < 1) requestAnimationFrame(tick);
        else valueEl.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }

  const scanObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateScanBars();
    });
  }, { threshold: 0.35 });
  if (scanSection) scanObserver.observe(scanSection);


  /* =====================================================
     7. BIRTHDAY CAKE — click to blow out candles
     ===================================================== */
  const cakeWrapper = document.getElementById('cakeWrapper');
  const cakeHint = document.getElementById('cakeHint');

  cakeWrapper.addEventListener('click', () => {
    const alreadyBlown = cakeWrapper.classList.contains('blown');
    if (alreadyBlown) {
      // Allow relighting for fun / repeat wishes
      cakeWrapper.classList.remove('blown');
      cakeHint.textContent = 'Tap the cake!';
    } else {
      cakeWrapper.classList.add('blown');
      cakeHint.textContent = '🎉 Wish made! Tap again to relight.';
      launchConfettiBurst(60); // small celebratory burst
    }
  });


  /* =====================================================
     8. FIREWORKS (canvas)
     ===================================================== */
  const fireworkCanvas = document.getElementById('fireworkCanvas');
  const fCtx = fireworkCanvas.getContext('2d');
  let fireworkParticles = [];
  let fireworksRunning = false;
  let fireworksTimer = null;

  function resizeFireworkCanvas() {
    fireworkCanvas.width = window.innerWidth;
    fireworkCanvas.height = window.innerHeight;
  }
  resizeFireworkCanvas();
  window.addEventListener('resize', resizeFireworkCanvas);

  const fireworkColors = ['#4dd8ff', '#b24bff', '#ff5fd8', '#ffd36e', '#2f6fff'];

  function createFireworkBurst(x, y) {
    const count = 55;
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 4 + 2;
      fireworkParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        gravity: 0.05
      });
    }
  }

  function animateFireworks() {
    fCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
    fireworkParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.012;
      fCtx.beginPath();
      fCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      fCtx.fillStyle = hexToRgba(p.color, Math.max(p.alpha, 0));
      fCtx.shadowBlur = 12;
      fCtx.shadowColor = p.color;
      fCtx.fill();
    });
    fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);

    if (fireworksRunning || fireworkParticles.length > 0) {
      requestAnimationFrame(animateFireworks);
    }
  }

  function hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function startFireworksShow(durationMs = 3200) {
    if (fireworksRunning) return;
    fireworksRunning = true;
    animateFireworks();

    fireworksTimer = setInterval(() => {
      const x = Math.random() * fireworkCanvas.width;
      const y = Math.random() * fireworkCanvas.height * 0.5 + 40;
      createFireworkBurst(x, y);
    }, 350);

    setTimeout(() => {
      clearInterval(fireworksTimer);
      fireworksRunning = false;
    }, durationMs);
  }


  /* =====================================================
     9. CONFETTI (canvas)
     ===================================================== */
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);

  const confettiColors = ['#4dd8ff', '#b24bff', '#ff5fd8', '#ffd36e', '#2f6fff', '#ffffff'];

  function launchConfettiBurst(count = 160) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        w: Math.random() * 8 + 5,
        h: Math.random() * 12 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 1
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > confettiCanvas.height * 0.85) p.life -= 0.02;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rotation * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(p.life, 0);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cCtx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.life > 0 && p.y < confettiCanvas.height + 40);

    if (confettiPieces.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
    }
  }


  /* =====================================================
     10. SURPRISE BUTTON — fireworks + confetti + reveal letter
     ===================================================== */
  const surpriseBtn = document.getElementById('surpriseBtn');
  const letterSection = document.getElementById('letterSection');
  let surpriseOpened = false;

  surpriseBtn.addEventListener('click', () => {
    startFireworksShow(3500);
    launchConfettiBurst(220);

    if (!surpriseOpened) {
      surpriseOpened = true;
      letterSection.classList.remove('hidden-letter');
      letterSection.classList.add('reveal');
      surpriseBtn.querySelector('.surprise-btn-text').textContent = '🎉 Surprise Opened!';

      setTimeout(() => {
        letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } else {
      // Repeated clicks just replay the celebration
      launchConfettiBurst(120);
    }
  });


  /* =====================================================
     11. PHOTO GALLERY — auto-detect photo1.jpg..photo8.jpg
     ===================================================== */
  const galleryGrid = document.getElementById('galleryGrid');
  const TOTAL_PHOTOS = 8;

  for (let i = 1; i <= TOTAL_PHOTOS; i++) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = new Image();
    img.src = `photos/photo${i}.jpg`;
    img.alt = `Memory ${i}`;
    img.loading = 'lazy';

    img.onload = () => {
      item.appendChild(img);
    };
    img.onerror = () => {
      item.innerHTML = `
        <div class="gallery-placeholder">
          <span>📷</span>
          Add your memory here
        </div>`;
    };

    galleryGrid.appendChild(item);
  }


  /* =====================================================
     12. MUSIC PLAYER
     ===================================================== */
  const bgMusic      = document.getElementById('bgMusic');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon     = document.getElementById('playIcon');
  const muteBtn      = document.getElementById('muteBtn');
  const muteIcon     = document.getElementById('muteIcon');
  const progressBar  = document.getElementById('progressBar');
  const volumeBar    = document.getElementById('volumeBar');

  bgMusic.volume = parseFloat(volumeBar.value);

  function tryPlayMusic() {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => { playIcon.textContent = '⏸'; })
        .catch(() => {
          // Autoplay blocked — user can press play manually
          playIcon.textContent = '▶';
        });
    }
  }

  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      playIcon.textContent = '⏸';
    } else {
      bgMusic.pause();
      playIcon.textContent = '▶';
    }
  });

  muteBtn.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteIcon.textContent = bgMusic.muted ? '🔇' : '🔊';
  });

  volumeBar.addEventListener('input', () => {
    bgMusic.volume = parseFloat(volumeBar.value);
    if (bgMusic.volume === 0) {
      muteIcon.textContent = '🔇';
    } else {
      muteIcon.textContent = '🔊';
      bgMusic.muted = false;
    }
  });

  bgMusic.addEventListener('timeupdate', () => {
    if (!isNaN(bgMusic.duration)) {
      progressBar.value = (bgMusic.currentTime / bgMusic.duration) * 100;
    }
  });

  progressBar.addEventListener('input', () => {
    if (!isNaN(bgMusic.duration)) {
      bgMusic.currentTime = (progressBar.value / 100) * bgMusic.duration;
    }
  });

  bgMusic.addEventListener('error', () => {
    // No song.mp3 found — quietly disable controls rather than break the UI
    playPauseBtn.disabled = true;
    muteBtn.disabled = true;
    progressBar.disabled = true;
    volumeBar.disabled = true;
    playIcon.textContent = '🎵';
  });

});

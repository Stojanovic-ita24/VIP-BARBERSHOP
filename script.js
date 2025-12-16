
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

qs('#year').textContent = new Date().getFullYear();

/* mobile nav toggle */
const burger = qs('#burger');
const nav = qs('#nav');
burger && burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('open');
  
});

qsa('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 1300) { 
      nav.classList.remove('open');
      burger.classList.remove('open');
    }
  });
});

qsa('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    nav.style.display = '';  
    nav.style.position = '';
  });
});


/* Smooth scrolling for nav anchors */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1 && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* Intersection Observer for reveal animations */
const revealElements = qsa('.reveal-up, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealElements.forEach(el => observer.observe(el));


const lightbox = qs('#lightbox');
const lbImg = qs('#lightbox img');
const lbClose = qs('#lightboxClose');

qsa('.gallery-item').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

if (lbClose) {
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

function closeLightbox() {
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lbImg.src = '';
}

/* Small parallax effect for hero portrait on scroll */
const portrait = qs('.hero-right .portrait');
if (portrait) {
  window.addEventListener('scroll', () => {
    const rect = portrait.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    const offset = (rect.top - mid) * 0.03;
    portrait.style.transform = `translateY(${Math.max(-12, Math.min(12, -offset))}px)`;
  }, { passive: true });
}

/* enhance CTA hover: tiny scale */
qsa('.btn').forEach(b => {
  b.addEventListener('mouseenter', () => b.style.transform = 'translateY(-3px) scale(1.01)');
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

/* ABOUT SECTION - IMAGE SLIDER */
const sliderImages = document.querySelectorAll('.about-slider .slider-images img');
const prevBtn = document.querySelector('.about-slider .prev');
const nextBtn = document.querySelector('.about-slider .next');

if (sliderImages.length > 0) {
  let current = 0;
  let autoSlideInterval;

  const showImage = (index) => {
    sliderImages.forEach(img => img.classList.remove('active'));
    sliderImages[index].classList.add('active');
  };

  const nextImage = () => {
    current = (current + 1) % sliderImages.length;
    showImage(current);
  };

  const prevImage = () => {
    current = (current - 1 + sliderImages.length) % sliderImages.length;
    showImage(current);
  };

  // ručne kontrole
  prevBtn.addEventListener('click', () => {
    prevImage();
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextImage();
    resetAutoSlide();
  });

  // automatska promena
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(nextImage, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  showImage(current);
  startAutoSlide();
}

/* ==================================== */
/*   FADE-IN EFEKAT PRI UCITAVANJU     */
/* ==================================== */
if ('scrollRestoration' in history) {
  try {
    history.scrollRestoration = 'manual';
  } catch (e) {
    // ignore if browser denies changing it
  }
}


window.addEventListener('beforeunload', () => {
  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch (e) {}
});


window.addEventListener('load', () => {

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 30);

  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 200);

  setTimeout(() => {
    document.querySelectorAll('section, header, footer').forEach(el => {
      el.classList.add('active');
    });
  }, 200);
});

function setHeroHeight() {
  const hero = document.querySelector('.hero');
  hero.style.minHeight = window.innerHeight + 'px';
}

window.addEventListener('resize', setHeroHeight);
window.addEventListener('load', setHeroHeight);


function fixHeroHeight() {
  const hero = document.querySelector('.hero');
  // Uzmi stvarnu vidljivu visinu
  const vh = window.innerHeight;
  hero.style.minHeight = vh + 'px';
}

// Pokreni na load i resize
window.addEventListener('load', fixHeroHeight);
window.addEventListener('resize', fixHeroHeight);

/* ENHANCED VIDEO CONTROLS WITH SEEK BAR */
const videoPlayer = document.querySelector('#mainVideo');
const videoPlayBtn = document.querySelector('#videoPlay');
const videoSoundBtn = document.querySelector('#videoSound');
const seekbarProgress = document.querySelector('#seekbarProgress');
const seekbarTrack = document.querySelector('.seekbar-track');
const currentTimeEl = document.querySelector('#currentTime');
const totalTimeEl = document.querySelector('#totalTime');
const videoOverlay = document.querySelector('.video-overlay');

if (videoPlayer && videoPlayBtn) {
  let isSeeking = false;
  let hideTimeout;

  // Formatiraj vreme (sekunde -> MM:SS)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Ažuriraj traku za vreme
  function updateSeekbar() {
    if (!isSeeking && !videoPlayer.paused) {
      const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
      seekbarProgress.style.width = `${percent}%`;
      currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
    }
  }

  // Postavi ukupno vreme kada se video učita
  videoPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(videoPlayer.duration);
  });

  // Ažuriraj traku tokom reprodukcije
  videoPlayer.addEventListener('timeupdate', updateSeekbar);

  // Play/Pause kontrola
  videoPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (videoPlayer.paused) {
      videoPlayer.play();
      videoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      videoPlayer.pause();
      videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });

  // Sound toggle
  videoSoundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    videoPlayer.muted = !videoPlayer.muted;
    videoSoundBtn.innerHTML = videoPlayer.muted 
      ? '<i class="fas fa-volume-mute"></i>' 
      : '<i class="fas fa-volume-up"></i>';
  });

  // Klik na video za play/pause
  videoPlayer.addEventListener('click', () => {
    if (videoPlayer.paused) {
      videoPlayer.play();
      videoPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      videoPlayer.pause();
      videoPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });

  // SEEK BAR FUNCTIONALITY - klik bilo gde na traci
  seekbarTrack.addEventListener('click', (e) => {
    const rect = seekbarTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoPlayer.currentTime = percent * videoPlayer.duration;
    seekbarProgress.style.width = `${percent * 100}%`;
    currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
  });

  // Drag za seek bar
  seekbarTrack.addEventListener('mousedown', () => {
    isSeeking = true;
    document.addEventListener('mousemove', handleSeek);
    document.addEventListener('mouseup', () => {
      isSeeking = false;
      document.removeEventListener('mousemove', handleSeek);
    });
  });

  seekbarTrack.addEventListener('touchstart', (e) => {
    isSeeking = true;
    e.preventDefault(); // Sprečava scroll tokom draga
    document.addEventListener('touchmove', handleSeekTouch);
    document.addEventListener('touchend', () => {
      isSeeking = false;
      document.removeEventListener('touchmove', handleSeekTouch);
    });
  });

  function handleSeek(e) {
    if (isSeeking) {
      const rect = seekbarTrack.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekbarProgress.style.width = `${percent * 100}%`;
      videoPlayer.currentTime = percent * videoPlayer.duration;
      currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
    }
  }

  function handleSeekTouch(e) {
    if (isSeeking && e.touches.length > 0) {
      const rect = seekbarTrack.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
      seekbarProgress.style.width = `${percent * 100}%`;
      videoPlayer.currentTime = percent * videoPlayer.duration;
      currentTimeEl.textContent = formatTime(videoPlayer.currentTime);
    }
  }

  // Auto-hide controls
  function showControls() {
    videoOverlay.style.opacity = '1';
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!videoPlayer.paused) {
        videoOverlay.style.opacity = '0';
      }
    }, 3000);
  }

  videoPlayer.addEventListener('mousemove', showControls);
  videoPlayer.addEventListener('touchstart', showControls);
  
  // Prikaži kontrole kada se video pauzira
  videoPlayer.addEventListener('pause', () => {
    videoOverlay.style.opacity = '1';
  });

  // Inicijalno prikaži kontrole
  showControls();
}

/* VIDEO AUTOPLAY ON SCROLL */
function setupVideoAutoplay() {
  const video = document.querySelector('#mainVideo');
  const videoContainer = document.querySelector('.video-container');
  
  if (!video || !videoContainer) return;
  
  // Zaustavi postojeći autoplay ako postoji
  video.pause();
  
  // Intersection Observer za detekciju kada je video u viewportu
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Video je vidljiv - pusti ga
        video.play().catch(e => {
          console.log('Autoplay nije moguć:', e);
          // Fallback: pokaži play dugme
          const playBtn = document.querySelector('#videoPlay');
          if (playBtn) playBtn.style.display = 'flex';
        });
      } else {
        // Video nije vidljiv - pauziraj
        video.pause();
      }
    });
  }, {
    threshold: 0.5, // Kada je 50% videa vidljivo
    rootMargin: '0px 0px -100px 0px' 
  });
  
  // Posmatraj video container
  observer.observe(videoContainer);
  
  // Fallback za starije browser-e
  if (!('IntersectionObserver' in window)) {
    // Ako browser ne podržava IntersectionObserver, pusti video odmah
    setTimeout(() => {
      video.play().catch(e => console.log('Fallback autoplay failed:', e));
    }, 1000);
  }
}

// Pokreni kada se stranica učita
window.addEventListener('load', () => {
  setTimeout(setupVideoAutoplay, 500); 
});

/* FLOATING BOOKING BUTTON - JOŠ JEDNOSTAVNIJE */
const floatingBtn = document.querySelector('#floatingBookingBtn');

if (floatingBtn) {
  floatingBtn.addEventListener('click', () => {
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
  
  window.addEventListener('scroll', () => {
    const bookingSection = document.querySelector('#booking');
    const heroSection = document.querySelector('#home');
    
    let shouldHide = false;
    
    // Proveri da li je booking sekcija vidljiva
    if (bookingSection) {
      const bookingRect = bookingSection.getBoundingClientRect();
      if (bookingRect.top < window.innerHeight * 0.4) {
        shouldHide = true;
      }
    }
    
    // Proveri da li smo na hero sekciji
    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      // Ako je hero sekcija većinom vidljiva (npr. top je iznad 20% ekrana)
      if (heroRect.top < window.innerHeight * 0.8 && heroRect.bottom > window.innerHeight * 0.2) {
        shouldHide = true;
      }
    }
    
    // Ažuriraj stanje dugmeta
    if (shouldHide) {
      floatingBtn.classList.add('hidden');
      floatingBtn.classList.remove('visible');
    } else {
      floatingBtn.classList.add('visible');
      floatingBtn.classList.remove('hidden');
    }
  });
  
  // Inicijalno proveri
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
}
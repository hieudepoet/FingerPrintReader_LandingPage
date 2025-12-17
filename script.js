// Configuration
const CONFIG = {
  websiteUrl: "https://thangtruong.danang.gov.vn",
  fanpageUrl: "https://www.facebook.com/xathangtruong",
  countdownDuration: 5,
  enableSound: true,
};

// State
let activatedButtons = new Set();
let isCountdownActive = false;
let countdownInterval = null;
let energySystem = null;

// DOM Elements
const mainScreen = document.getElementById("mainScreen");
const countdownScreen = document.getElementById("countdownScreen");
const finalScreen = document.getElementById("finalScreen");
const countdownNumber = document.getElementById("countdownNumber");
const touchButtons = document.querySelectorAll(".touch-btn");
const logoMocha35 = document.getElementById("logoMocha35");

// Audio
const bgMusic = document.getElementById("bgMusic");
const activateSound = document.getElementById("activateSound");
const countdownTickSound = document.getElementById("countdownTickSound");
const explosionSound = document.getElementById("explosionSound");

// ==================== PARTICLES ====================
function initParticles(containerId = "particles-js") {
  try {
    if (typeof particlesJS !== "undefined") {
      particlesJS(containerId, {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ["#FFD700", "#DC143C"] },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#FFD700",
            opacity: 0.3,
            width: 1.5,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            out_mode: "out",
          },
        },
        retina_detect: true,
      });
    } else {
      console.warn("ParticlesJS library not loaded");
    }
  } catch (error) {
    console.error("Error initializing particles:", error);
  }
}

// ==================== SIMPLIFIED ENERGY SYSTEM ====================
class EnergySystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.buttonTargets = {};
    this.isActive = true;
    this.buttonParticles = [];

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.animate = this.animate.bind(this);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addButtonTarget(id, x, y) {
    this.buttonTargets[id] = { x, y, active: false };
  }

  activateButton(id) {
    if (this.buttonTargets[id]) {
      this.buttonTargets[id].active = true;
      for (let i = 0; i < 180; i++) {
        this.createButtonParticle(id);
      }
      // Energize logo when any button is activated
      this.energizeLogo();
    }
  }

  energizeLogo() {
    const logo = document.getElementById("logoMocha35");
    if (logo && !logo.classList.contains("energized")) {
      logo.classList.add("energized");
      // Create particles flowing to logo from environment
      for (let i = 0; i < 50; i++) {
        this.createLogoParticle();
      }
    }
  }

  createLogoParticle() {
    const logo = document.getElementById("logoMocha35");
    if (!logo) return;
    const logoRect = logo.getBoundingClientRect();
    const targetX = logoRect.left + logoRect.width / 2;
    const targetY = logoRect.top + logoRect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 200 + 150;

    this.buttonParticles.push({
      buttonId: "logo",
      x: targetX + Math.cos(angle) * distance,
      y: targetY + Math.sin(angle) * distance,
      targetX: targetX,
      targetY: targetY,
      speed: Math.random() * 0.008 + 0.004,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      isLogoParticle: true,
      life: 0,
      maxLife: 150,
    });
  }

  createButtonParticle(buttonId) {
    const target = this.buttonTargets[buttonId];
    if (!target) return;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 200 + 100;
    this.buttonParticles.push({
      buttonId,
      x: target.x + Math.cos(angle) * distance,
      y: target.y + Math.sin(angle) * distance,
      targetX: target.x,
      targetY: target.y,
      speed: Math.random() * 0.006 + 0.003,
      size: Math.random() * 3 + 1.5,
      opacity: Math.random() * 0.5 + 0.3,
      life: 0,
      maxLife: 200,
    });
  }

  drawButtonParticles() {
    const particlesToKeep = [];

    for (let i = 0; i < this.buttonParticles.length; i++) {
      const p = this.buttonParticles[i];
      if (!p) continue;

      p.life++;

      // Handle logo particles differently
      if (p.isLogoParticle) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.x += dx * p.speed;
        p.y += dy * p.speed;

        // Yellow highlight particles for logo
        const gradient = this.ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 10
        );
        gradient.addColorStop(0, `rgba(255, 255, 200, ${p.opacity})`);
        gradient.addColorStop(0.3, `rgba(255, 215, 0, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, "transparent");

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 10, 0, Math.PI * 2);
        this.ctx.fill();

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= 20 && p.life < p.maxLife) {
          particlesToKeep.push(p);
        }
        continue;
      }

      // Regular button particles
      const target = this.buttonTargets[p.buttonId];
      if (!target || !target.active) {
        continue;
      }

      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      p.x += dx * p.speed;
      p.y += dy * p.speed;

      // Soft misty glow
      const gradient = this.ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.size * 8
      );
      gradient.addColorStop(0, `rgba(255, 240, 200, ${p.opacity})`);
      gradient.addColorStop(0.3, `rgba(255, 215, 0, ${p.opacity * 0.4})`);
      gradient.addColorStop(1, "transparent");

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
      this.ctx.fill();

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 15) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 80;
        p.x = target.x + Math.cos(angle) * distance;
        p.y = target.y + Math.sin(angle) * distance;
        p.life = 0;
      }

      if (p.life < p.maxLife) {
        particlesToKeep.push(p);
      }
    }

    this.buttonParticles = particlesToKeep;
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawButtonParticles();

    // Continuously add more particles to active buttons (higher rate)
    Object.keys(this.buttonTargets).forEach((id) => {
      if (this.buttonTargets[id].active && Math.random() < 0.4) {
        this.createButtonParticle(id);
      }
    });

    // Add occasional highlight particles to logo when energized (higher rate)
    const logo = document.getElementById("logoMocha35");
    if (logo && logo.classList.contains("energized") && Math.random() < 0.25) {
      this.createLogoParticle();
    }

    requestAnimationFrame(this.animate);
  }

  start() {
    this.animate();
  }

  stop() {
    this.isActive = false;
  }
}

// ==================== INITIALIZATION ====================
function init() {
  try {
    initParticles();

    const energyCanvas = document.getElementById("energySystemCanvas");
    if (!energyCanvas) {
      console.error("Energy canvas not found");
      return;
    }

    energySystem = new EnergySystem(energyCanvas);

    touchButtons.forEach((button) => {
      const id = button.getAttribute("data-id");
      const rect = button.getBoundingClientRect();
      energySystem.addButtonTarget(
        id,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      button.addEventListener("touchstart", handleButtonActivation);
      button.addEventListener("click", handleButtonActivation);
    });

    energySystem.start();

    const websiteLink = document.getElementById("websiteLink");
    const fanpageLink = document.getElementById("fanpageLink");
    if (websiteLink) websiteLink.href = CONFIG.websiteUrl;
    if (fanpageLink) fanpageLink.href = CONFIG.fanpageUrl;

    // Function to update button positions
    function updateButtonPositions() {
      touchButtons.forEach((button) => {
        const id = button.getAttribute("data-id");
        const rect = button.getBoundingClientRect();
        if (energySystem.buttonTargets[id]) {
          energySystem.buttonTargets[id].x = rect.left + rect.width / 2;
          energySystem.buttonTargets[id].y = rect.top + rect.height / 2;
        }
      });
    }

    // Debounced resize handler for better performance
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateButtonPositions();
        energySystem.resize();
      }, 150);
    });

    // Update positions after a short delay to ensure CSS is applied
    setTimeout(updateButtonPositions, 100);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// ==================== BUTTON ACTIVATION ====================
function handleButtonActivation(e) {
  e.preventDefault();
  console.log("Button clicked, isCountdownActive:", isCountdownActive);

  if (isCountdownActive) return;

  const button = e.currentTarget;
  const id = button.getAttribute("data-id");
  console.log("Button ID:", id, "Already activated:", activatedButtons.has(id));

  if (activatedButtons.has(id)) return;

  button.classList.add("activated");
  activatedButtons.add(id);
  energySystem.activateButton(id);

  console.log("Activated buttons count:", activatedButtons.size);

  // Increase logo-ring-3 border width
  const logoRing3 = document.querySelector(".logo-ring-3");
  if (logoRing3) {
    // Remove previous progress classes
    logoRing3.classList.remove(
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "progress-5",
      "progress-6"
    );
    // Add current progress class
    logoRing3.classList.add(`progress-${activatedButtons.size}`);
  }

  // Play activate sound - create new instance each time for overlapping
  if (CONFIG.enableSound && activateSound) {
    console.log("🔊 Attempting to play activate sound...");
    console.log("activateSound.src:", activateSound.src);

    const sound = new Audio(activateSound.src);
    sound.volume = 1.0;
    sound.preload = "auto";

    // Load then play
    sound.load();
    sound
      .play()
      .then(() => console.log("✅ Activate sound playing"))
      .catch((err) => {
        console.error("❌ Activate sound error:", err);
        // Fallback: try using original element
        activateSound.currentTime = 0;
        activateSound.play().catch((e) => console.error("Fallback failed:", e));
      });
  }

  if (activatedButtons.size === 6) {
    console.log("All 6 buttons activated! Triggering countdown in 500ms...");
    setTimeout(() => {
      console.log("Calling triggerLogoFlash now");
      triggerLogoFlash();
    }, 500);
  }
}

function triggerLogoFlash() {
  console.log("triggerLogoFlash called");

  const logo = document.getElementById("logoMocha35");
  console.log("Logo element:", logo);

  if (!logo) {
    console.error("Logo not found, starting countdown anyway");
    startCountdown();
    return;
  }

  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded, starting countdown anyway");
    startCountdown();
    return;
  }

  console.log("Starting logo flash animation with GSAP");

  // Flash effect from logo
  gsap.to(logo, {
    scale: 1.15,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      console.log("Logo scale up complete, scaling back down");
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: "power2.in",
      });
    },
  });

  // Create radial flash
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = "50%";
  flash.style.left = "50%";
  flash.style.transform = "translate(-50%, -50%)";
  flash.style.width = "18rem";
  flash.style.height = "18rem";
  flash.style.borderRadius = "50%";
  flash.style.background =
    "radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)";
  flash.style.zIndex = "50";
  flash.style.pointerEvents = "none";
  mainScreen.appendChild(flash);

  gsap.to(flash, {
    scale: 4,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    onComplete: () => {
      flash.remove();
      startCountdown();
    },
  });
}

// ==================== COUNTDOWN ====================
function startCountdown() {
  isCountdownActive = true;

  // Fade out bgMusic over 2 seconds then pause
  if (CONFIG.enableSound && bgMusic) {
    const fadeOutDuration = 2000;
    const fadeSteps = 20;
    const fadeInterval = fadeOutDuration / fadeSteps;
    const volumeStep = bgMusic.volume / fadeSteps;

    let currentStep = 0;
    const fadeOut = setInterval(() => {
      currentStep++;
      bgMusic.volume = Math.max(0, bgMusic.volume - volumeStep);

      if (currentStep >= fadeSteps) {
        clearInterval(fadeOut);
        bgMusic.pause();
        console.log("🎵 Background music faded out and paused");
      }
    }, fadeInterval);
  }

  // Clone activated buttons to countdown screen
  const leftGroup = document.getElementById("countdownButtonsLeft");
  const rightGroup = document.getElementById("countdownButtonsRight");

  touchButtons.forEach((button) => {
    const id = button.getAttribute("data-id");
    const buttonId = parseInt(id);
    const clone = button.cloneNode(true);
    clone.style.pointerEvents = "none";

    if (buttonId <= 3) {
      leftGroup.appendChild(clone);
    } else {
      rightGroup.appendChild(clone);
    }
  });

  gsap.to(mainScreen, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      mainScreen.classList.remove("active");
      countdownScreen.classList.add("active");
      gsap.to(countdownScreen, { opacity: 1, duration: 0.5 });
      runCountdown();
    },
  });
}

function runCountdown() {
  let count = CONFIG.countdownDuration;
  countdownNumber.textContent = count;
  animateCountdownNumber();

  countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownNumber.textContent = count;

      // Play tick sound FIRST for 3, 2, 1 to sync with number display
      if (CONFIG.enableSound && count <= 3) {
        countdownTickSound.currentTime = 0;
        countdownTickSound.volume = 1.0;
        countdownTickSound.playbackRate = 1.0; // Speed up to 1.5x to fit 2 second interval
        countdownTickSound
          .play()
          .catch((err) => console.log("Countdown tick error:", err));
      }

      // Animate number after a delay so sound and visual are in sync
      setTimeout(() => {
        animateCountdownNumber();
      }, 500);
    } else {
      clearInterval(countdownInterval);
      triggerExplosion();
    }
  }, 1500); // 1.5 seconds per number
}

function animateCountdownNumber() {
  gsap.fromTo(
    countdownNumber,
    { scale: 5, opacity: 0, rotation: -20, filter: "blur(20px)" },
    {
      scale: 1,
      opacity: 1,
      rotation: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    }
  );
  const logo = document.getElementById("countdownLogoMocha35");
  if (logo) {
    gsap.fromTo(
      logo,
      { scale: 1 },
      { scale: 1.1, duration: 0.4, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }
}

// ==================== TRANSITION TO FINAL ====================
function triggerExplosion() {
  // Play explosion sound
  if (CONFIG.enableSound) {
    explosionSound.volume = 1.0;
    explosionSound
      .play()
      .catch((err) => console.log("Explosion sound error:", err));
  }

  // Stop countdown tick sound after 1.5 seconds
  setTimeout(() => {
    if (CONFIG.enableSound) {
      countdownTickSound.pause();
      countdownTickSound.currentTime = 0;
    }
  }, 1500);

  // Create explosion effect
  const explosionFlash = document.createElement("div");
  explosionFlash.style.position = "fixed";
  explosionFlash.style.inset = "0";
  explosionFlash.style.background =
    "radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 0, 0, 0.6) 30%, transparent 70%)";
  explosionFlash.style.zIndex = "100";
  explosionFlash.style.pointerEvents = "none";
  explosionFlash.style.opacity = "0";
  countdownScreen.appendChild(explosionFlash);

  // Flash explosion
  gsap.to(explosionFlash, {
    opacity: 1,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(explosionFlash, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    },
  });

  // Fade out buttons with scale
  const countdownButtons = countdownScreen.querySelectorAll(".touch-btn");
  countdownButtons.forEach((btn, index) => {
    gsap.to(btn, {
      opacity: 0,
      scale: 0.5,
      rotation: Math.random() * 360 - 180,
      duration: 0.6,
      delay: index * 0.05,
      ease: "back.in(2)",
    });
  });

  // Blink countdown number then explode
  gsap.to(countdownNumber, {
    opacity: 0,
    scale: 1.3,
    duration: 0.1,
    repeat: 6,
    yoyo: true,
    onComplete: () => {
      gsap.to(countdownNumber, {
        scale: 3,
        opacity: 0,
        filter: "blur(30px)",
        duration: 0.5,
        ease: "power4.in",
      });
    },
  });

  // Scale up and fade out central logo with rotation
  const countdownLogo = document.getElementById("countdownLogoMocha35");
  setTimeout(() => {
    gsap.to(countdownLogo, {
      scale: 4,
      opacity: 0,
      rotation: 180,
      filter: "blur(40px)",
      duration: 1.5,
      ease: "power4.in",
      onComplete: showFinalScreen,
    });
  }, 800);
}

function showFinalScreen() {
  // Modern transition with scale and fade
  countdownScreen.classList.remove("active");

  // Set initial state for final screen
  finalScreen.style.opacity = "0";
  finalScreen.style.transform = "scale(0.8)";
  finalScreen.style.filter = "blur(20px)";
  finalScreen.classList.add("active");

  // Animate in with modern effect
  gsap.to(finalScreen, {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.2,
    ease: "power3.out",
  });

  // Animate cards in with stagger
  const cards = finalScreen.querySelectorAll(".page-card");
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotationY: -30,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationY: 0,
      duration: 1,
      stagger: 0.3,
      delay: 0.5,
      ease: "back.out(1.5)",
    }
  );

  initParticles("particles-final");
  initCarousels();
  setupCardClickHandlers();

  // Restart background music on final screen
  if (CONFIG.enableSound && bgMusic) {
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.3;
    bgMusic.loop = true;
    bgMusic
      .play()
      .then(() => console.log("✅ Background music restarted on final screen"))
      .catch((err) =>
        console.log("⚠️ Could not restart background music:", err)
      );
  }
}

// ==================== RESET ====================
function resetApp() {
  activatedButtons.clear();
  isCountdownActive = false;
  if (countdownInterval) clearInterval(countdownInterval);

  touchButtons.forEach((btn) => {
    btn.classList.remove("activated");
    gsap.to(btn, { scale: 1, duration: 0.3 });
  });

  Object.keys(energySystem.buttonTargets).forEach((id) => {
    energySystem.buttonTargets[id].active = false;
  });
  energySystem.buttonParticles = [];

  // Reset logo-ring-3
  const logoRing3 = document.querySelector(".logo-ring-3");
  if (logoRing3) {
    logoRing3.classList.remove(
      "progress-1",
      "progress-2",
      "progress-3",
      "progress-4",
      "progress-5",
      "progress-6"
    );
  }

  const logo = document.getElementById("logoMocha35");
  if (logo) {
    logo.classList.remove("energized");
  }

  countdownScreen.classList.remove("active");
  finalScreen.classList.remove("active");
  mainScreen.classList.add("active");
  gsap.to(mainScreen, { opacity: 1, duration: 0.5 });

  if (CONFIG.enableSound) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") resetApp();
});

// Start background music
let bgMusicStarted = false;

function startBackgroundMusic() {
  if (!CONFIG.enableSound || !bgMusic || bgMusicStarted) {
    return;
  }

  console.log("🎵 Starting background music...");
  bgMusic.volume = 0.3;
  bgMusic.loop = true;

  bgMusic
    .play()
    .then(() => {
      console.log("✅ Background music started successfully!");
      bgMusicStarted = true;
    })
    .catch((err) => {
      console.error("❌ Background music autoplay blocked:", err.message);
      console.log("💡 Will play on first user interaction...");

      // Play on first user interaction
      const playOnInteraction = () => {
        if (bgMusicStarted) return;

        bgMusic
          .play()
          .then(() => {
            console.log("✅ Background music started after user interaction");
            bgMusicStarted = true;
          })
          .catch((e) => console.error("❌ Still failed:", e));
      };

      // Listen for any user interaction
      document.addEventListener("click", playOnInteraction, { once: true });
      document.addEventListener("touchstart", playOnInteraction, {
        once: true,
      });
      document.addEventListener("keydown", playOnInteraction, { once: true });
    });
}

// Wait for GSAP to load
function waitForGSAP(callback) {
  if (typeof gsap !== "undefined") {
    callback();
  } else {
    console.log("Waiting for GSAP to load...");
    setTimeout(() => waitForGSAP(callback), 100);
  }
}

window.addEventListener("load", () => {
  waitForGSAP(() => {
    init();
    // Start background music after init
    setTimeout(startBackgroundMusic, 200);
  });
});

window.APP = { reset: resetApp, config: CONFIG };

// ==================== CAROUSEL ====================
function initCarousels() {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const dots = carousel.querySelectorAll(".carousel-dot");
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % dots.length;
      goToSlide(currentSlide);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goToSlide(index);
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 2000);
      });
    });

    // Auto-play
    autoplayInterval = setInterval(nextSlide, 2000);

    // Pause on hover
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval);
    });

    carousel.addEventListener("mouseleave", () => {
      autoplayInterval = setInterval(nextSlide, 2000);
    });
  });
}

function setupCardClickHandlers() {
  const cards = document.querySelectorAll(".page-card");

  cards.forEach((card) => {
    const link = card.getAttribute("data-link");
    if (link) {
      card.addEventListener("click", (e) => {
        // Don't navigate if clicking on URL badge or carousel dots
        if (
          e.target.closest(".page-card-url") ||
          e.target.closest(".carousel-dot")
        ) {
          return;
        }
        window.open(link, "_blank", "noopener,noreferrer");
      });
      card.style.cursor = "pointer";
    }
  });
}

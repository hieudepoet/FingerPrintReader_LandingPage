// Configuration
const CONFIG = {
  websiteUrl: "https://thangtuong.danang.gov.vn",
  fanpageUrl: "https://www.facebook.com/profile.php?id=61571173803476",
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
    });
  }

  drawButtonParticles() {
    this.buttonParticles.forEach((p, index) => {
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
        if (dist < 20) {
          this.buttonParticles[index] = null;
        }
        return;
      }

      // Regular button particles
      const target = this.buttonTargets[p.buttonId];
      if (!target || !target.active) {
        this.buttonParticles[index] = null;
        return;
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
      }
    });

    this.buttonParticles = this.buttonParticles.filter((p) => p !== null);
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
  initParticles();

  const energyCanvas = document.getElementById("energySystemCanvas");
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

  document.getElementById("websiteLink").href = CONFIG.websiteUrl;
  document.getElementById("fanpageLink").href = CONFIG.fanpageUrl;

  if (CONFIG.enableSound) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
  }

  window.addEventListener("resize", () => {
    touchButtons.forEach((button) => {
      const id = button.getAttribute("data-id");
      const rect = button.getBoundingClientRect();
      energySystem.buttonTargets[id].x = rect.left + rect.width / 2;
      energySystem.buttonTargets[id].y = rect.top + rect.height / 2;
    });
  });
}

// ==================== BUTTON ACTIVATION ====================
function handleButtonActivation(e) {
  e.preventDefault();
  if (isCountdownActive) return;

  const button = e.currentTarget;
  const id = button.getAttribute("data-id");
  if (activatedButtons.has(id)) return;

  button.classList.add("activated");
  activatedButtons.add(id);
  energySystem.activateButton(id);

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

  if (CONFIG.enableSound) {
    const sound = activateSound.cloneNode();
    sound.volume = 0.6;
    sound.play().catch(() => {});
  }

  if (activatedButtons.size === 6) {
    setTimeout(triggerLogoFlash, 500);
  }
}

function triggerLogoFlash() {
  const logo = document.getElementById("logoMocha35");

  // Flash effect from logo
  gsap.to(logo, {
    scale: 1.15,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
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
  flash.style.width = "300px";
  flash.style.height = "300px";
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
  if (CONFIG.enableSound) bgMusic.pause();

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
      animateCountdownNumber();
      if (CONFIG.enableSound) {
        const tick = countdownTickSound.cloneNode();
        tick.volume = 0.8;
        tick.play().catch(() => {});
      }
    } else {
      clearInterval(countdownInterval);
      triggerExplosion();
    }
  }, 1000);
}

function animateCountdownNumber() {
  gsap.fromTo(
    countdownNumber,
    { scale: 4, opacity: 0, rotation: -15 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2.5)" }
  );
  const logo = document.getElementById("countdownLogoMocha35");
  if (logo) {
    gsap.fromTo(
      logo,
      { scale: 1 },
      { scale: 1.05, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  }
}

// ==================== TRANSITION TO FINAL ====================
function triggerExplosion() {
  // Fade out buttons quickly
  const countdownButtons = countdownScreen.querySelectorAll(".touch-btn");
  countdownButtons.forEach((btn) => {
    gsap.to(btn, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });
  });

  // Blink countdown number then fade
  gsap.to(countdownNumber, {
    opacity: 0,
    duration: 0.15,
    repeat: 5,
    yoyo: true,
    onComplete: () => {
      gsap.to(countdownNumber, {
        opacity: 0,
        duration: 0.3,
      });
    },
  });

  // Scale up and fade out central logo
  const countdownLogo = document.getElementById("countdownLogoMocha35");
  setTimeout(() => {
    gsap.to(countdownLogo, {
      scale: 2.5,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      onComplete: showFinalScreen,
    });
  }, 1000);
}

function showFinalScreen() {
  countdownScreen.classList.remove("active");
  finalScreen.classList.add("active");
  gsap.fromTo(
    finalScreen,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: "power2.out" }
  );
  initParticles("particles-final");
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

window.addEventListener("load", init);
window.APP = { reset: resetApp, config: CONFIG };

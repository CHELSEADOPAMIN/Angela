/* global FLOWERS, BEE_DATA */

const stage = document.getElementById("stage");
const flowersEl = document.getElementById("flowers");
const beeEl = document.getElementById("bee");
const hudPill = document.getElementById("hudPill");

const beeModal = document.getElementById("beeModal");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const beeGrid = document.getElementById("beeGrid");

/** @typedef {{ id: string; name: string; beeIds: string[]; el?: HTMLElement; x?: number; y?: number }} Flower */
/** @type {Flower[]} */
const flowers = (window.FLOWERS || []).map((f) => ({ ...f }));

const beeById = new Map((window.BEE_DATA || []).map((b) => [b.id, b]));

const state = {
  mouseX: window.innerWidth * 0.5,
  mouseY: window.innerHeight * 0.5,
  activeFlowerId: null,
  targetX: window.innerWidth * 0.5,
  targetY: window.innerHeight * 0.62,
  charX: window.innerWidth * 0.5,
  charY: window.innerHeight * 0.62,
  lastTs: performance.now(),
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function createFlowerEl(flower) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "flower";
  btn.dataset.flowerId = flower.id;
  btn.setAttribute("aria-label", `Flower: ${flower.name}. Hover to meet a bee.`);

  const stem = document.createElement("div");
  stem.className = "flower__stem";
  const leafL = document.createElement("div");
  leafL.className = "flower__leaf flower__leaf--left";
  const leafR = document.createElement("div");
  leafR.className = "flower__leaf flower__leaf--right";

  const head = document.createElement("div");
  head.className = "flower__head";

  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    head.appendChild(p);
  }
  const center = document.createElement("div");
  center.className = "center";
  head.appendChild(center);

  const flowerBee = document.createElement("div");
  flowerBee.className = "flowerBee";
  flowerBee.setAttribute("aria-hidden", "true");
  flowerBee.innerHTML = `
    <div class="flowerBee__wings">
      <div class="flowerBee__wing flowerBee__wing--left"></div>
      <div class="flowerBee__wing flowerBee__wing--right"></div>
    </div>
    <div class="flowerBee__body">
      <div class="flowerBee__stripe flowerBee__stripe--1"></div>
      <div class="flowerBee__stripe flowerBee__stripe--2"></div>
      <div class="flowerBee__stripe flowerBee__stripe--3"></div>
      <div class="flowerBee__eye flowerBee__eye--left"></div>
      <div class="flowerBee__eye flowerBee__eye--right"></div>
    </div>
  `;

  const speech = document.createElement("div");
  speech.className = "flowerSpeech";
  speech.setAttribute("aria-hidden", "true");
  speech.textContent = "hello i am bee";

  btn.appendChild(stem);
  btn.appendChild(leafL);
  btn.appendChild(leafR);
  btn.appendChild(head);
  btn.appendChild(flowerBee);
  btn.appendChild(speech);

  return btn;
}

function layoutFlowers() {
  const rect = stage.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  // Soft “garden ring” layout that feels like it’s surrounding the center.
  const cx = w * 0.52;
  const cy = h * 0.58;
  const ring = Math.min(w, h) * 0.30;

  const angles = [-128, -42, 18, 92, 152].map((a) => (a * Math.PI) / 180);
  const jitter = Math.min(w, h) * 0.035;

  flowers.forEach((f, i) => {
    const a = angles[i % angles.length];
    const x = cx + Math.cos(a) * ring + (Math.sin(a * 2.1) * jitter);
    const y = cy + Math.sin(a) * ring * 0.92 + (Math.cos(a * 1.7) * jitter);
    f.x = clamp(x, 90, w - 90);
    f.y = clamp(y, 120, h - 90);
    if (f.el) {
      f.el.style.left = `${f.x}px`;
      f.el.style.top = `${f.y}px`;
    }
  });
}

function renderFlowers() {
  flowersEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const f of flowers) {
    const el = createFlowerEl(f);
    f.el = el;
    frag.appendChild(el);
  }
  flowersEl.appendChild(frag);
  layoutFlowers();
}

function setActiveFlower(id) {
  if (state.activeFlowerId === id) return;
  state.activeFlowerId = id;
  for (const f of flowers) {
    if (!f.el) continue;
    f.el.dataset.active = f.id === id ? "true" : "false";
  }
}

function nearestFlowerTo(x, y) {
  let best = null;
  let bestD = Infinity;
  for (const f of flowers) {
    if (typeof f.x !== "number" || typeof f.y !== "number") continue;
    const d = dist2(x, y, f.x, f.y);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

function updateTargetFromCursor() {
  const rect = stage.getBoundingClientRect();
  const mx = state.mouseX - rect.left;
  const my = state.mouseY - rect.top;

  // With one flower, we can just keep it active for clarity.
  const nf = flowers[0] ?? null;
  if (nf) setActiveFlower(nf.id);

  const padX = 70;
  const padTop = 140;
  const padBottom = 70;

  state.targetX = clamp(mx, padX, rect.width - padX);
  state.targetY = clamp(my, padTop, rect.height - padBottom);

  hudPill.textContent = nf ? `Hover “${nf.name}” — say hello` : "Move around…";
}

function setBeeTransform() {
  const x = state.charX;
  const y = state.charY;
  if (!beeEl) return;
  beeEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
}

function openBeeModal(flowerId) {
  const flower = flowers.find((f) => f.id === flowerId);
  if (!flower) return;

  modalTitle.textContent = flower.name;
  modalSubtitle.textContent = "Meet a few bees that might visit this flower.";

  beeGrid.innerHTML = "";
  const frag = document.createDocumentFragment();

  for (const beeId of flower.beeIds) {
    const bee = beeById.get(beeId);
    if (!bee) continue;

    const card = document.createElement("article");
    card.className = "card";

    const top = document.createElement("div");
    top.className = "card__top";

    const name = document.createElement("h3");
    name.className = "card__name";
    name.textContent = bee.name;

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = bee.type;

    top.appendChild(name);
    top.appendChild(tag);

    const desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = bee.whatItIs;

    const meta = document.createElement("div");
    meta.className = "card__meta";

    const rows = [
      ["Scientific name", bee.scientificName],
      ["From", bee.from],
      ["Fun fact", bee.funFact],
      ["Flower tip", bee.flowerTips]
    ];

    for (const [k, v] of rows) {
      const row = document.createElement("div");
      row.className = "metaRow";
      const kb = document.createElement("b");
      kb.textContent = `${k}:`;
      const vv = document.createElement("span");
      vv.textContent = v;
      row.appendChild(kb);
      row.appendChild(vv);
      meta.appendChild(row);
    }

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(meta);
    frag.appendChild(card);
  }

  beeGrid.appendChild(frag);

  if (typeof beeModal.showModal === "function") {
    beeModal.showModal();
  } else {
    // Fallback: older browsers
    beeModal.setAttribute("open", "true");
  }
}

function closeBeeModal() {
  if (typeof beeModal.close === "function") beeModal.close();
  else beeModal.removeAttribute("open");
}

function tick(ts) {
  const dt = Math.min(0.05, (ts - state.lastTs) / 1000);
  state.lastTs = ts;

  updateTargetFromCursor();

  const dx = state.targetX - state.charX;
  const dy = state.targetY - state.charY;
  const d = Math.hypot(dx, dy);

  // Stick the bee right on the cursor (no lag).
  state.charX = state.targetX;
  state.charY = state.targetY;

  if (beeEl) {
    beeEl.dataset.moving = d > 2 ? "true" : "false";

    if (dx < -2) {
      beeEl.classList.add("facing-left");
      beeEl.classList.remove("facing-right");
    } else if (dx > 2) {
      beeEl.classList.add("facing-right");
      beeEl.classList.remove("facing-left");
    }
  }

  setBeeTransform();
  requestAnimationFrame(tick);
}

function init() {
  renderFlowers();
  setBeeTransform();
  updateTargetFromCursor();

  window.addEventListener("resize", () => {
    layoutFlowers();
    updateTargetFromCursor();
  });

  // Pointer events are more reliable across mouse/pen/touch.
  window.addEventListener("pointermove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener("touchstart", (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    state.mouseX = t.clientX;
    state.mouseY = t.clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    state.mouseX = t.clientX;
    state.mouseY = t.clientY;
  }, { passive: true });

  beeModal.addEventListener("click", (e) => {
    // Click outside content closes the dialog
    const rect = beeModal.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (!inside) closeBeeModal();
  });

  beeModal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeBeeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBeeModal();
  });

  requestAnimationFrame((t) => {
    state.lastTs = t;
    requestAnimationFrame(tick);
  });
}

init();



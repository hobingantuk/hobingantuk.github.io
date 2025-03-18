/**
 * Matrix-style Perlin Noise Wave Animation
 */

const ClassicalNoise = function () {
  const r = Math; // Random number generator

  this.grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  this.p = [];
  for (let i = 0; i < 256; i++) {
    this.p[i] = Math.floor(r.random() * 256);
  }

  this.perm = [];
  for (let i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255];
  }
};

ClassicalNoise.prototype.dot = function (g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z;
};

ClassicalNoise.prototype.mix = function (a, b, t) {
  return (1.0 - t) * a + t * b;
};

ClassicalNoise.prototype.fade = function (t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

ClassicalNoise.prototype.noise = function (x, y, z) {
  let X = Math.floor(x),
    Y = Math.floor(y),
    Z = Math.floor(z);
  x -= X;
  y -= Y;
  z -= Z;

  X = X & 255;
  Y = Y & 255;
  Z = Z & 255;

  const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
  const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
  const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
  const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
  const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
  const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
  const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
  const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

  const n000 = this.dot(this.grad3[gi000], x, y, z);
  const n100 = this.dot(this.grad3[gi100], x - 1, y, z);
  const n010 = this.dot(this.grad3[gi010], x, y - 1, z);
  const n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
  const n001 = this.dot(this.grad3[gi001], x, y, z - 1);
  const n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
  const n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
  const n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);

  const u = this.fade(x);
  const v = this.fade(y);
  const w = this.fade(z);

  const nx00 = this.mix(n000, n100, u);
  const nx01 = this.mix(n001, n101, u);
  const nx10 = this.mix(n010, n110, u);
  const nx11 = this.mix(n011, n111, u);
  const nxy0 = this.mix(nx00, nx10, v);
  const nxy1 = this.mix(nx01, nx11, v);
  const nxyz = this.mix(nxy0, nxy1, w);

  return nxyz;
};

// --- Matrix-style Perlin Wave Animation ---
export function setupMatrixWave() {
  if (typeof document === "undefined") return; // Ensure it runs only in the browser

  const canvas = document.getElementById("waves");
  if (!canvas) return; // Prevent errors if canvas is missing

  const ctx = canvas.getContext("2d");
  const perlin = new ClassicalNoise();

  const characters = "ꦲꦤꦕꦫꦏꦢꦠꦱꦮꦭꦥꦣꦗꦪꦚꦩꦒꦧꦛꦔ";

  const spacing = 42;
  const variation = 0.008;
  const waveHeight = 30;
  const speed = 0.0002;
  const maxColumns = 60;

  let canvasWidth,
    canvasHeight,
    frameCount = 0;

  function getRandomCharacter() {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  function drawMatrixWave() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "18px monospace";
    ctx.fillStyle = "#b5a366";

    for (let i = 0; i < maxColumns; i++) {
      for (let j = 0; j < canvasHeight / spacing; j++) {
        let x = i * spacing;
        let noiseFactor = perlin.noise(x * variation, frameCount * speed, 0);
        let y = j * spacing + noiseFactor * waveHeight;

        ctx.globalAlpha = 0.5 + noiseFactor * 0.5;
        ctx.fillText(getRandomCharacter(), x, y);
      }
    }

    frameCount++;
    requestAnimationFrame(drawMatrixWave);
  }

  function resizeCanvas() {
    canvasWidth = window.innerWidth || document.documentElement.clientWidth;
    canvasHeight = window.innerHeight || document.documentElement.clientHeight;

    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
  }

  function startAnimation() {
    resizeCanvas();
    drawMatrixWave();
    window.addEventListener("resize", resizeCanvas);
  }

  startAnimation();
}

// Run the function initially
setupMatrixWave();

// Restart animation after Astro's page transitions
document.addEventListener("astro:page-load", setupMatrixWave);

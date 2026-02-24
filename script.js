const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');

let width, height;
let isCutting = false;
let currentPoints = [];

const activeBloodRuns = [];
const BLOOD_COLOR = '#aa0000';

class BloodRun {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius || (Math.random() * 2.0 + 2.0); // Thicker drips
        this.speed = Math.random() * 1.5 + 0.5;
        this.isDone = false;
        this.maxLife = 1200 + Math.random() * 2000; // Long runs
        this.life = 0;

        // Initial pooling blob - larger
        this.drawBlob(offCtx, this.x, this.y, this.radius * 1.5);
    }

    drawBlob(targetCtx, x, y, r) {
        targetCtx.beginPath();
        targetCtx.arc(x, y, r, 0, Math.PI * 2);
        targetCtx.fillStyle = BLOOD_COLOR;
        targetCtx.fill();
    }

    update() {
        this.life++;
        if (this.y > height + 20 || this.life > this.maxLife) {
            this.isDone = true;
            // Draw a final bulbous head on the offscreen canvas
            this.drawBlob(offCtx, this.x, this.y, this.radius);
            return;
        }

        // Draw the "neck" (trail) to offscreen - slightly thinner than the head
        offCtx.beginPath();
        offCtx.lineCap = 'round';
        offCtx.strokeStyle = BLOOD_COLOR;
        offCtx.lineWidth = this.radius * 1.4; // Trail is thinner than head
        offCtx.moveTo(this.x, this.y);

        // Organic wiggle
        this.x += (Math.random() - 0.5) * 0.15;
        this.y += this.speed;

        offCtx.lineTo(this.x, this.y);
        offCtx.stroke();
    }

    drawHead(targetCtx) {
        // Active bulbous head for temporary preview
        this.drawBlob(targetCtx, this.x, this.y, this.radius);
    }
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const tempImg = offCanvas.width > 0 ? offCanvas.toDataURL() : null;
    offCanvas.width = width * dpr;
    offCanvas.height = height * dpr;
    offCtx.scale(dpr, dpr);
    offCtx.fillStyle = '#ffffff';
    offCtx.fillRect(0, 0, width, height);

    if (tempImg) {
        let img = new Image();
        img.onload = () => offCtx.drawImage(img, 0, 0, width, height);
        img.src = tempImg;
    }
}

window.addEventListener('resize', resize);
resize();

function getSmoothedPoints(points) {
    if (points.length < 3) return points;
    const smoothed = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
        const p0 = points[i - 1], p1 = points[i], p2 = points[i + 1];
        smoothed.push({
            x: (p0.x + 2 * p1.x + p2.x) / 4,
            y: (p0.y + 2 * p1.y + p2.y) / 4
        });
    }
    smoothed.push(points[points.length - 1]);
    return smoothed;
}

function drawLenticularPath(rawPoints, targetCtx) {
    if (rawPoints.length < 2) return;
    const points = getSmoothedPoints(rawPoints);
    let strokeLen = 0;
    const distances = [0];
    for (let i = 1; i < points.length; i++) {
        strokeLen += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
        distances.push(strokeLen);
    }
    if (strokeLen < 1) return;

    const maxW = Math.min(strokeLen * 0.05, 4); // Keep thin cuts

    const poly = [];
    const lower = [];
    for (let i = 0; i < points.length; i++) {
        const t = distances[i] / strokeLen;
        let dx, dy;
        if (i === 0) { dx = points[1].x - points[0].x; dy = points[1].y - points[0].y; }
        else if (i === points.length - 1) { dx = points[i].x - points[i - 1].x; dy = points[i].y - points[i - 1].y; }
        else { dx = points[i + 1].x - points[i - 1].x; dy = points[i + 1].y - points[i - 1].y; }

        const mag = Math.hypot(dx, dy) || 1;
        const nx = -dy / mag;
        const ny = dx / mag;
        const w = maxW * Math.sin(t * Math.PI);
        poly.push({ x: points[i].x + nx * w, y: points[i].y + ny * w });
        lower.push({ x: points[i].x - nx * w, y: points[i].y - ny * w });
    }

    targetCtx.beginPath();
    targetCtx.fillStyle = BLOOD_COLOR;
    targetCtx.moveTo(poly[0].x, poly[0].y);
    for (let p of poly) targetCtx.lineTo(p.x, p.y);
    for (let i = lower.length - 1; i >= 0; i--) targetCtx.lineTo(lower[i].x, lower[i].y);
    targetCtx.closePath();
    targetCtx.fill();
}

function startCutting(e) {
    isCutting = true;
    currentPoints = [getPos(e)];
}

function stopCutting() {
    if (!isCutting) return;
    isCutting = false;

    if (currentPoints.length > 2) {
        drawLenticularPath(currentPoints, offCtx);

        // Spawn significantly more realistic drips (higher density)
        const numRuns = Math.floor(currentPoints.length / 5) + 2;
        for (let i = 0; i < numRuns; i++) {
            if (Math.random() > 0.1) {
                const idx = Math.floor(Math.random() * currentPoints.length);
                const p = currentPoints[idx];
                activeBloodRuns.push(new BloodRun(p.x, p.y));
            }
        }
    }
    currentPoints = [];
}

function cut(e) {
    if (!isCutting) return;
    const pos = getPos(e);
    const lastP = currentPoints[currentPoints.length - 1];
    if (Math.hypot(pos.x - lastP.x, pos.y - lastP.y) < 2) return;
    currentPoints.push(pos);
}

function getPos(e) {
    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    const rect = canvas.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
}

canvas.addEventListener('mousedown', startCutting);
window.addEventListener('mouseup', stopCutting);
window.addEventListener('mousemove', cut);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startCutting(e); });
window.addEventListener('touchend', stopCutting);
window.addEventListener('touchmove', (e) => { e.preventDefault(); cut(e); });

function loop() {
    ctx.drawImage(offCanvas, 0, 0, width, height);

    if (isCutting && currentPoints.length > 2) {
        drawLenticularPath(currentPoints, ctx);
    }

    for (let i = activeBloodRuns.length - 1; i >= 0; i--) {
        const run = activeBloodRuns[i];
        run.update();
        run.drawHead(ctx); // Draw the moving bulbous part
        if (run.isDone) {
            activeBloodRuns.splice(i, 1);
        }
    }

    requestAnimationFrame(loop);
}

loop();

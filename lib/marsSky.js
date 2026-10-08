export function createSky(canvas) {
  var cx = canvas.getContext('2d');
  if (!cx) return null;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 1, H = 1, dpr = 1, stars = [], shooters = [], band = null;
  var next = 1.4, raf = 0, visible = true, t0 = performance.now() / 1000, last = t0;
  var ANG = -0.38;
  function gauss() { return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2; }
  function buildBand() {
    band = document.createElement('canvas');
    band.width = Math.round(W * dpr); band.height = Math.round(H * dpr);
    var b = band.getContext('2d');
    b.scale(dpr, dpr); b.translate(W / 2, H / 2); b.rotate(ANG);
    var th = Math.min(W, H) * 0.2;
    var g = b.createLinearGradient(0, -th, 0, th);
    g.addColorStop(0, 'rgba(255,200,170,0)');
    g.addColorStop(.5, 'rgba(255,214,190,.05)');
    g.addColorStop(1, 'rgba(255,200,170,0)');
    b.fillStyle = g; b.fillRect(-W, -th, W * 2, th * 2);
  }
  function seed() {
    var n = Math.round(Math.min(420, W * H / 3800));
    stars = [];
    var cs = Math.cos(ANG), sn = Math.sin(ANG), sd = Math.min(W, H) * 0.09;
    for (var i = 0; i < n; i++) {
      var x, y;
      if (Math.random() < 0.34) {
        var u = (Math.random() - .5) * Math.hypot(W, H) * .95, v = gauss() * sd;
        x = W / 2 + u * cs - v * sn; y = H / 2 + u * sn + v * cs;
      } else { x = Math.random() * W; y = Math.random() * H; }
      var r = Math.random(), cr = Math.random();
      stars.push({ x: x, y: y, s: r > .975 ? 1.5 : (r > .86 ? 1 : .65), a: .22 + Math.random() * .6, tw: .5 + Math.random() * 1.6, ph: Math.random() * 6.283, c: cr < .16 ? '255,228,204' : (cr < .32 ? '255,214,190' : '255,255,255') });
    }
  }
  function size() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBand(); seed();
  }
  function spawn() {
    var ltr = Math.random() < .55;
    var ang = (14 + Math.random() * 26) * Math.PI / 180;
    shooters.push({ x: W * (.06 + Math.random() * .88), y: H * (.03 + Math.random() * .3), vx: Math.cos(ang) * (ltr ? 1 : -1), vy: Math.sin(ang), sp: 900 + Math.random() * 700, len: 130 + Math.random() * 120, life: 0, max: .55 + Math.random() * .45 });
  }
  function drawShooters(dt) {
    for (var i = shooters.length - 1; i >= 0; i--) {
      var s = shooters[i];
      s.life += dt;
      if (s.life >= s.max) { shooters.splice(i, 1); continue; }
      s.x += s.vx * s.sp * dt; s.y += s.vy * s.sp * dt;
      var k = s.life / s.max, a = k < .15 ? k / .15 : 1 - (k - .15) / .85;
      var tx = s.x - s.vx * s.len, ty = s.y - s.vy * s.len;
      var g = cx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,' + (.92 * a) + ')');
      cx.lineCap = 'round';
      cx.strokeStyle = 'rgba(255,170,110,' + (.18 * a) + ')'; cx.lineWidth = 3.4;
      cx.beginPath(); cx.moveTo(tx, ty); cx.lineTo(s.x, s.y); cx.stroke();
      cx.strokeStyle = g; cx.lineWidth = 1.3;
      cx.beginPath(); cx.moveTo(tx, ty); cx.lineTo(s.x, s.y); cx.stroke();
      cx.fillStyle = 'rgba(255,255,255,' + (.95 * a) + ')';
      cx.beginPath(); cx.arc(s.x, s.y, 1.4, 0, 6.283); cx.fill();
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var t = now / 1000, dt = Math.min(.05, t - last); last = t;
    if (!visible || document.hidden) return;
    cx.clearRect(0, 0, W, H);
    if (band) cx.drawImage(band, 0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], tw = reduce ? 1 : (.72 + .28 * Math.sin(t * s.tw + s.ph));
      cx.fillStyle = 'rgba(' + s.c + ',' + (s.a * tw) + ')';
      cx.fillRect(s.x - s.s / 2, s.y - s.s / 2, s.s, s.s);
    }
    if (!reduce) {
      if (t - t0 > next) { spawn(); next = (t - t0) + 2.4 + Math.random() * 5.6; }
      drawShooters(dt);
    }
  }
  size();
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas.parentElement);
  }
  var rt = 0;
  function onResize() { clearTimeout(rt); rt = setTimeout(size, 120); }
  window.addEventListener('resize', onResize);
  raf = requestAnimationFrame(frame);
  return {
    spawn: spawn,
    destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); if (io) io.disconnect(); }
  };
}

// Sahneler: arka planlar, engeller ve hikâye metinleri.
// Yeni sahne eklemek için defs'e bir kayıt, story'ye metin ekle.
const Scenes = (() => {
  const W = 960, H = 540, G = 450;
  let T = 0; // oyun zamanı (game.js günceller)

  const hash = k => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function tile(sc, f, period, fn) {
    const off = sc * f, k0 = Math.floor(off / period), base = -(off - k0 * period);
    for (let i = -1; base + i * period < W + period; i++) fn(base + i * period, k0 + i);
  }
  const rect = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const circ = (c, x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  const rr = (c, x, y, w, h, r, col) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  const ell = (c, x, y, rx, ry, col, rot = 0) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, 7); c.fill(); };
  function shamrock(c, x, y, r, col) {
    c.fillStyle = col;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 0.3]]) { c.beginPath(); c.arc(x + dx * r * 0.7, y + dy * r * 0.7, r * 0.7, 0, 7); c.fill(); }
    c.strokeStyle = col; c.lineWidth = r * 0.3; c.beginPath(); c.moveTo(x, y + r * .4); c.lineTo(x + r * .3, y + r * 1.7); c.stroke();
  }

  // ---------- ARKA PLANLAR ----------
  function floor(c, sc, top, dark, line) {
    rect(c, 0, G, W, H - G, top);
    rect(c, 0, G, W, 8, 'rgba(0,0,0,.18)');
    tile(sc, 1, 90, x => rect(c, x, G, 3, H - G, line));
    rect(c, 0, G + 40, W, 3, line);
  }

  function bgHomeZ(c, sc) {
    rect(c, 0, 0, W, G, '#f0d5dd');
    tile(sc, 0.2, 64, x => rect(c, x, 0, 30, G, '#ecc9d4'));
    rect(c, 0, G - 70, W, 70, '#e3b9c6');
    tile(sc, 0.4, 560, (x, k) => {
      const t = Math.abs(k) % 3;
      if (t === 0) { // makyaj masası + ayna
        rr(c, x + 60, G - 110, 220, 110, 6, '#8a5a44');
        rect(c, x + 70, G - 116, 200, 8, '#a8745a');
        ell(c, x + 170, G - 220, 74, 92, '#d9eef8');
        ell(c, x + 150, G - 240, 30, 50, 'rgba(255,255,255,.55)', 0.4);
        c.strokeStyle = '#d6a73a'; c.lineWidth = 6; c.beginPath(); c.ellipse(x + 170, G - 220, 74, 92, 0, 0, 7); c.stroke();
        for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; circ(c, x + 170 + Math.cos(a) * 86, G - 220 + Math.sin(a) * 104, 5, '#fff3b0'); }
        rr(c, x + 90, G - 136, 14, 20, 3, '#e8467c'); rr(c, x + 112, G - 130, 10, 14, 3, '#7a4bd1'); rr(c, x + 232, G - 134, 22, 18, 4, '#f4c0d0');
      } else if (t === 1) { // pencere + perde
        rr(c, x + 80, G - 340, 190, 220, 6, '#bfe3ff');
        c.strokeStyle = '#fff'; c.lineWidth = 8; c.strokeRect(x + 80, G - 340, 190, 220);
        rect(c, x + 172, G - 340, 6, 220, '#fff'); rect(c, x + 80, G - 232, 190, 6, '#fff');
        rr(c, x + 56, G - 350, 36, 250, 10, '#e66b97'); rr(c, x + 258, G - 350, 36, 250, 10, '#e66b97');
        rr(c, x + 320, G - 60, 40, 60, 8, '#b9602f'); circ(c, x + 340, G - 92, 26, '#3f9d56'); circ(c, x + 322, G - 76, 18, '#2f8a47');
      } else { // raf + poster + yatak başı
        rr(c, x + 70, G - 300, 130, 170, 4, '#fff'); rr(c, x + 80, G - 290, 110, 150, 2, '#ff6fb1');
        circ(c, x + 135, G - 240, 30, '#ffd34d'); rect(c, x + 80, G - 190, 110, 12, '#7a4bd1');
        rr(c, x + 250, G - 190, 150, 12, 3, '#8a5a44');
        rr(c, x + 268, G - 234, 18, 44, 4, '#e8467c'); rr(c, x + 296, G - 220, 26, 30, 6, '#ffd6e4'); rr(c, x + 332, G - 228, 14, 38, 3, '#111');
      }
    });
    floor(c, sc, '#b88a5c', '#9c7448', '#9c7448');
  }

  function bgHomeO(c, sc) {
    rect(c, 0, 0, W, G, '#cfd8e3');
    tile(sc, 0.2, 120, x => { rect(c, x, 0, 4, G, '#bfcad9'); });
    rect(c, 0, G - 60, W, 60, '#aebace');
    tile(sc, 0.4, 560, (x, k) => {
      const t = Math.abs(k) % 3;
      if (t === 0) { // açık gardırop
        rr(c, x + 50, G - 280, 190, 280, 6, '#7a5236');
        rect(c, x + 60, G - 268, 170, 6, '#3b2615');
        const cols = ['#e04b4b', '#4b8be0', '#e0c24b', '#4bc27a', '#9b59d0', '#ee8a3a'];
        for (let i = 0; i < 6; i++) { rr(c, x + 66 + i * 26, G - 262, 20, 90 - (i % 3) * 14, 4, cols[i]); }
        rect(c, x + 60, G - 130, 170, 6, '#3b2615');
        rr(c, x + 66, G - 120, 70, 40, 3, '#e8e2d0'); rr(c, x + 146, G - 116, 70, 36, 3, '#3a4f7a');
      } else if (t === 1) { // pencere
        rr(c, x + 80, G - 330, 200, 210, 6, '#9ed6ff');
        c.strokeStyle = '#fff'; c.lineWidth = 8; c.strokeRect(x + 80, G - 330, 200, 210);
        rect(c, x + 178, G - 330, 6, 210, '#fff');
        circ(c, x + 220, G - 270, 20, '#ffe27a');
        rr(c, x + 330, G - 190, 14, 190, 4, '#444'); ell(c, x + 337, G - 200, 32, 22, '#ffe9a8');
      } else { // koltuk + atılmış kıyafetler
        rr(c, x + 40, G - 100, 250, 100, 14, '#3f7d63'); rr(c, x + 40, G - 140, 250, 50, 14, '#37705a');
        rr(c, x + 80, G - 118, 70, 24, 8, '#e04b4b'); rr(c, x + 170, G - 112, 80, 20, 8, '#4b8be0');
        rr(c, x + 330, G - 70, 70, 70, 6, '#c9a46a'); rect(c, x + 330, G - 70, 70, 8, '#a98550');
      }
    });
    floor(c, sc, '#7b8aa0', '#69788e', '#69788e');
  }

  function bgOutdoor(c, sc, warm) {
    const g = c.createLinearGradient(0, 0, 0, G);
    if (warm) { g.addColorStop(0, '#ff8a5c'); g.addColorStop(0.6, '#ffc58a'); g.addColorStop(1, '#ffe7c4'); }
    else { g.addColorStop(0, '#5db8f2'); g.addColorStop(1, '#dff3ff'); }
    c.fillStyle = g; c.fillRect(0, 0, W, G);
    circ(c, warm ? 740 : 800, warm ? 250 : 90, warm ? 70 : 46, warm ? '#fff0a0' : '#fff7c2');
    tile(sc, 0.08, 420, (x, k) => {
      const y = 50 + hash(k) * 110;
      ell(c, x, y, 70, 22, 'rgba(255,255,255,.85)'); ell(c, x + 40, y - 14, 50, 22, 'rgba(255,255,255,.85)'); ell(c, x - 40, y - 8, 40, 16, 'rgba(255,255,255,.85)');
    });
    tile(sc, 0.25, 170, (x, k) => {
      const h = 130 + hash(k + 5) * 150, w = 120;
      rect(c, x, G - h, w, h, warm ? '#c98f9e' : '#9fb6d3');
      for (let wy = G - h + 16; wy < G - 30; wy += 30) for (let wx = x + 14; wx < x + w - 14; wx += 26) rect(c, wx, wy, 12, 16, warm ? '#ffe3a1' : '#e7f3ff');
    });
    tile(sc, 0.6, 380, (x, k) => {
      if (Math.abs(k) % 2) { // ağaç
        rect(c, x + 40, G - 120, 16, 120, '#7a5236'); circ(c, x + 48, G - 140, 48, '#3f9d56'); circ(c, x + 20, G - 118, 30, '#2f8a47'); circ(c, x + 76, G - 118, 30, '#4aae62');
      } else { // sokak lambası
        rect(c, x + 60, G - 190, 7, 190, '#3b3b44'); rect(c, x + 60, G - 190, 36, 6, '#3b3b44'); ell(c, x + 96, G - 182, 12, 7, '#ffe27a');
      }
    });
    rect(c, 0, G - 14, W, 14, warm ? '#c9b8a6' : '#c9ccd2');
    rect(c, 0, G, W, H - G, '#4a4d57');
    rect(c, 0, G, W, 6, 'rgba(0,0,0,.25)');
    tile(sc, 1, 140, x => rect(c, x, G + 55, 70, 7, '#e8e8e8'));
  }

  function bgBar(c, sc) {
    rect(c, 0, 0, W, G, '#2b1a12');
    rect(c, 0, G - 150, W, 150, '#12472b');
    rect(c, 0, G - 154, W, 6, '#d6a73a');
    tile(sc, 0.3, 380, (x, k) => {
      const t = Math.abs(k) % 3;
      if (t === 0) { // şişe rafı
        for (const sy of [G - 330, G - 250]) {
          rect(c, x + 40, sy, 260, 7, '#6a3d1f');
          for (let i = 0; i < 7; i++) rr(c, x + 52 + i * 35, sy - 46, 16, 46, 4, ['#3aa65a', '#c9772b', '#e8d27a', '#7a3b2a', '#4b8be0', '#3aa65a', '#c9772b'][i]);
        }
      } else if (t === 1) { // neon
        rr(c, x + 40, G - 330, 280, 100, 16, '#1a0f0a');
        c.shadowColor = '#3dff8a'; c.shadowBlur = 22; c.fillStyle = '#3dff8a';
        c.font = 'bold 44px "Trebuchet MS", sans-serif'; c.textAlign = 'center'; c.fillText('IRISH PUB', x + 180, G - 262);
        shamrock(c, x + 66, G - 280, 9, '#3dff8a'); shamrock(c, x + 296, G - 280, 9, '#3dff8a');
        c.shadowBlur = 0;
      } else { // dart + çerçeve
        circ(c, x + 100, G - 270, 52, '#111'); circ(c, x + 100, G - 270, 40, '#e8d27a'); circ(c, x + 100, G - 270, 26, '#c0392b'); circ(c, x + 100, G - 270, 12, '#3aa65a');
        rr(c, x + 220, G - 320, 110, 80, 4, '#d6a73a'); rr(c, x + 228, G - 312, 94, 64, 2, '#12472b'); shamrock(c, x + 275, G - 284, 14, '#3dff8a');
      }
    });
    tile(sc, 0.7, 520, (x, k) => { // bar taburesi + fıçı
      rr(c, x + 40, G - 100, 80, 100, 8, '#7a4a28'); rect(c, x + 40, G - 70, 80, 5, '#d6a73a'); rect(c, x + 40, G - 36, 80, 5, '#d6a73a');
      rr(c, x + 300, G - 56, 60, 8, 3, '#8a5a38'); rect(c, x + 326, G - 48, 8, 48, '#555');
    });
    tile(sc, 0.5, 130, (x, k) => { // asılı ışıklar
      const y = 22 + Math.sin(k) * 2;
      c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 10); c.quadraticCurveTo(x + 65, 40, x + 130, 10); c.stroke();
      const g = c.createRadialGradient(x + 65, 32, 2, x + 65, 32, 26); g.addColorStop(0, 'rgba(255,230,140,.95)'); g.addColorStop(1, 'rgba(255,230,140,0)');
      c.fillStyle = g; c.fillRect(x + 35, 8, 60, 50); circ(c, x + 65, 32, 5, '#fff3b0');
    });
    floor(c, sc, '#4b2d1b', '#3b2214', '#3b2214');
  }

  const bgs = { homeZ: bgHomeZ, homeO: bgHomeO, outZ: (c, s) => bgOutdoor(c, s, false), outO: (c, s) => bgOutdoor(c, s, true), bar: bgBar };

  // ---------- ENGELLER (çizim: sol üst köşe 0,0; boyut w×h) ----------
  const D = {
    ruj: (c, w, h) => { rr(c, 2, h * .55, w - 4, h * .45, 3, '#d6a73a'); rr(c, 4, h * .25, w - 8, h * .35, 2, '#222'); c.fillStyle = '#d3123a'; c.beginPath(); c.moveTo(5, h * .28); c.lineTo(w - 5, h * .28); c.lineTo(w - 7, 4); c.lineTo(8, 0); c.fill(); },
    parfum: (c, w, h) => { rr(c, 2, h * .25, w - 4, h * .75, 8, '#ff7eb6'); rr(c, 6, h * .32, w * .35, h * .5, 4, 'rgba(255,255,255,.5)'); rr(c, w * .3, 2, w * .4, h * .22, 3, '#d6a73a'); rect(c, w * .45, 0, 6, 6, '#999'); },
    palet: (c, w, h) => { rr(c, 0, 4, w, h - 4, 5, '#2b2b33'); rr(c, 4, 0, w - 8, 12, 3, '#cfe9f5'); ['#e8467c', '#7a4bd1', '#f4c04a', '#2bb6a8'].forEach((cl, i) => circ(c, 11 + i * 13, h - 11, 5, cl)); },
    kurutma: (c, w, h) => { ell(c, w * .4, h * .35, w * .4, h * .33, '#e8467c'); rr(c, w * .05, h * .12, w * .16, h * .46, 4, '#222'); rr(c, w * .5, h * .4, w * .16, h * .6, 6, '#444'); },
    firca: (c, w, h) => { rect(c, 0, h * .4, w * .65, h * .2, '#d6a73a'); rr(c, w * .62, 0, w * .38, h, 6, '#2b2b33'); for (let i = 0; i < 5; i++) rect(c, w * .66 + i * 6, h * .1, 3, h * .8, '#777'); },
    sprey: (c, w, h) => { rr(c, 0, h * .2, w, h * .8, 5, '#c9a6e8'); rr(c, 3, 0, w - 6, h * .26, 3, '#7a4bd1'); rect(c, w * .3, h * .45, w * .4, h * .2, '#fff'); },
    makyajSunger: (c, w, h) => { ell(c, w / 2, h / 2, w / 2, h / 2, '#f4c0d0'); ell(c, w / 2 - 4, h / 2 - 4, w / 3, h / 4, '#ffe3ec'); },

    koni: (c, w, h) => { c.fillStyle = '#ff7a1a'; c.beginPath(); c.moveTo(w * .5, 0); c.lineTo(w * .88, h * .88); c.lineTo(w * .12, h * .88); c.fill(); rect(c, w * .3, h * .35, w * .4, 7, '#fff'); rr(c, 0, h * .85, w, h * .15, 2, '#c85a00'); },
    cop: (c, w, h) => { rr(c, 2, h * .15, w - 4, h * .85, 4, '#6f7782'); rr(c, 0, 0, w, h * .18, 4, '#565d67'); for (let i = 0; i < 4; i++) rect(c, 8 + i * 9, h * .3, 3, h * .55, '#58606a'); },
    su: (c, w, h) => { ell(c, w / 2, h * .7, w / 2, h * .3, '#4aa3e0'); ell(c, w * .4, h * .6, w * .2, h * .1, 'rgba(255,255,255,.5)'); },
    bavul: (c, w, h) => { rr(c, 0, h * .12, w, h * .88, 6, '#d6455d'); rect(c, w * .25, 0, w * .5, h * .14, '#444'); rect(c, w * .25, h * .12, 4, h * .7, '#a52e44'); rect(c, w * .7, h * .12, 4, h * .7, '#a52e44'); },
    guvercin: (c, w, h) => { const f = Math.sin(T * 14) * 10; ell(c, w * .5, h * .55, w * .38, h * .3, '#8d939c'); circ(c, w * .85, h * .4, h * .22, '#6e747d'); c.fillStyle = '#f2a33a'; c.beginPath(); c.moveTo(w * .98, h * .38); c.lineTo(w * 1.1, h * .45); c.lineTo(w * .98, h * .5); c.fill(); ell(c, w * .45, h * .3 - f * .3, w * .22, h * .35, '#a9afb8', -0.5 + f * .02); },
    drone: (c, w, h) => { rr(c, w * .3, h * .35, w * .4, h * .35, 6, '#2b2b33'); circ(c, w * .5, h * .55, 4, '#ff3b3b'); for (const x of [0.05, 0.75]) { rect(c, w * x, h * .3, w * .2, 4, '#555'); ell(c, w * (x + .1), h * .22, w * .13 + Math.sin(T * 40) * 3, 3, 'rgba(120,120,120,.6)'); } },
    semsiye: (c, w, h) => { c.fillStyle = '#e8467c'; c.beginPath(); c.arc(w / 2, h * .6, w / 2, Math.PI, 0); c.fill(); rect(c, w / 2 - 1.5, h * .6, 3, h * .35, '#444'); },

    corap: (c, w, h) => { ell(c, w * .3, h * .65, w * .28, h * .35, '#e0c24b'); ell(c, w * .65, h * .6, w * .3, h * .38, '#4b8be0'); ell(c, w * .5, h * .4, w * .22, h * .3, '#e04b4b'); },
    kot: (c, w, h) => { rr(c, 0, h * .35, w, h * .65, 8, '#3a5a8a'); rr(c, w * .1, 0, w * .75, h * .5, 8, '#4a6fa5'); rect(c, w * .2, h * .2, w * .5, 3, '#c9d4e6'); },
    uti: (c, w, h) => { c.fillStyle = '#d9dde3'; c.beginPath(); c.moveTo(0, h); c.lineTo(w, h); c.lineTo(w * .8, h * .35); c.lineTo(w * .2, h * .35); c.fill(); rr(c, w * .2, 0, w * .5, h * .38, 8, '#e8467c'); rect(c, 0, h * .9, w, h * .1, '#8b929c'); },
    gomlek: (c, w, h) => { c.fillStyle = '#e04b4b'; c.beginPath(); c.moveTo(w * .3, 0); c.lineTo(w * .7, 0); c.lineTo(w, h * .3); c.lineTo(w * .82, h * .5); c.lineTo(w * .75, h * .38); c.lineTo(w * .75, h); c.lineTo(w * .25, h); c.lineTo(w * .25, h * .38); c.lineTo(w * .18, h * .5); c.lineTo(0, h * .3); c.fill(); rect(c, w * .47, 2, 3, h - 4, '#fff'); },
    aski: (c, w, h) => { c.strokeStyle = '#b0813f'; c.lineWidth = 3; c.beginPath(); c.moveTo(w / 2, h * .35); c.lineTo(w / 2, h * .1); c.arc(w / 2 + 4, h * .1, 4, Math.PI, 0.5 * Math.PI); c.moveTo(w / 2, h * .35); c.lineTo(w * .05, h * .95); c.lineTo(w * .95, h * .95); c.closePath(); c.stroke(); },

    kaykay: (c, w, h) => { rr(c, 0, 0, w, h * .45, h * .22, '#ff7a1a'); circ(c, w * .22, h * .75, h * .22, '#222'); circ(c, w * .78, h * .75, h * .22, '#222'); },
    muslu: (c, w, h) => { rr(c, w * .12, h * .2, w * .76, h * .8, 6, '#d3392b'); rr(c, w * .22, 0, w * .56, h * .3, 8, '#d3392b'); rect(c, w * .02, h * .4, w * .96, 6, '#8e1f16'); },
    top: (c, w, h) => { circ(c, w / 2, h / 2, w / 2, '#fff'); c.fillStyle = '#222'; c.beginPath(); c.arc(w / 2, h / 2, w * .18, 0, 7); c.fill(); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; circ(c, w / 2 + Math.cos(a) * w * .35, h / 2 + Math.sin(a) * h * .35, 3, '#222'); } },
    bank: (c, w, h) => { rr(c, 0, 0, w, h * .35, 3, '#8a5a38'); rect(c, 3, h * .45, w - 6, h * .15, '#8a5a38'); rect(c, 6, h * .5, 5, h * .5, '#444'); rect(c, w - 11, h * .5, 5, h * .5, '#444'); },
    martı: (c, w, h) => { const f = Math.sin(T * 10) * 12; ell(c, w * .5, h * .55, w * .34, h * .2, '#fff'); circ(c, w * .86, h * .42, h * .18, '#fff'); c.fillStyle = '#f2a33a'; c.beginPath(); c.moveTo(w, h * .38); c.lineTo(w * 1.1, h * .44); c.lineTo(w, h * .5); c.fill(); c.fillStyle = '#c9ced6'; c.beginPath(); c.moveTo(w * .2, h * .5); c.lineTo(w * .4, h * .5 - 14 - f); c.lineTo(w * .62, h * .5); c.fill(); c.beginPath(); c.moveTo(w * .2, h * .5); c.lineTo(w * .05, h * .5 + 8 + f * .4); c.lineTo(w * .4, h * .55); c.fill(); },
    frizbi: (c, w, h) => { ell(c, w / 2, h / 2, w / 2, h / 2, '#ff4d6d'); ell(c, w / 2, h / 2 - 2, w * .3, h * .22, '#ff93a8'); },
    ucurtma: (c, w, h) => { c.fillStyle = '#4b8be0'; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w, h * .45); c.lineTo(w / 2, h); c.lineTo(0, h * .45); c.fill(); c.fillStyle = '#ffe27a'; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w, h * .45); c.lineTo(w / 2, h * .45); c.fill(); },

    bira: (c, w, h) => { rr(c, 2, 0, w - 12, h, 5, 'rgba(255,255,255,.35)'); rr(c, 4, h * .3, w - 16, h * .68, 4, '#f2a81d'); rr(c, 2, 0, w - 12, h * .32, 6, '#fff'); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 4; c.beginPath(); c.arc(w - 8, h * .5, h * .22, -1.4, 1.4); c.stroke(); },
    shot: (c, w, h) => { for (const x of [0, w * .52]) { c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + w * .46, 0); c.lineTo(x + w * .38, h); c.lineTo(x + w * .08, h); c.fill(); c.fillStyle = '#c98a1e'; c.beginPath(); c.moveTo(x + 2, h * .35); c.lineTo(x + w * .44, h * .35); c.lineTo(x + w * .37, h - 2); c.lineTo(x + w * .09, h - 2); c.fill(); } },
    fici: (c, w, h) => { rr(c, 0, 0, w, h, 10, '#8a5a38'); rect(c, 0, h * .2, w, 5, '#3a2214'); rect(c, 0, h * .72, w, 5, '#3a2214'); shamrock(c, w / 2, h * .5, 6, '#3dff8a'); },
    kasa: (c, w, h) => { rr(c, 0, h * .35, w, h * .65, 4, '#d6a73a'); for (let i = 0; i < 4; i++) { rr(c, 5 + i * 13, 0, 9, h * .5, 3, i % 2 ? '#3aa65a' : '#7a3b2a'); } },
    ucanBira: (c, w, h) => D.bira(c, w, h),
    gozluk: (c, w, h) => { for (const x of [0, w * .52]) { rr(c, x, 2, w * .46, h - 4, h * .4, '#111'); ell(c, x + w * .15, h * .35, w * .1, h * .12, 'rgba(255,255,255,.45)', -.5); } rect(c, w * .44, h * .28, w * .12, 4, '#111'); },
  };

  // [çizim, w, h, hava?]. Hava engelleri: lift (yerden yükseklik) ve h altı
  const O = (draw, w, h, name, air) => ({ draw: D[draw], w, h, name, air: !!air, lift: air ? 54 : 0 });
  const obstacles = {
    homeZ: [O('ruj', 26, 52, 'ruj'), O('parfum', 36, 54, 'parfüm'), O('palet', 62, 32, 'far paleti'), O('kurutma', 64, 46, 'saç kurutma'), O('firca', 66, 22, 'fırça', 1), O('sprey', 24, 44, 'sprey', 1), O('makyajSunger', 44, 30, 'pudra süngeri', 1)],
    outZ: [O('koni', 38, 50, 'koni'), O('cop', 40, 56, 'çöp kutusu'), O('su', 84, 22, 'su birikintisi'), O('bavul', 52, 46, 'bavul'), O('guvercin', 54, 36, 'güvercin', 1), O('drone', 60, 36, 'drone', 1), O('semsiye', 56, 40, 'şemsiye', 1)],
    homeO: [O('corap', 54, 30, 'çoraplar'), O('kot', 64, 42, 'kot yığını'), O('uti', 56, 38, 'ütü'), O('gomlek', 54, 48, 'gömlek', 1), O('aski', 50, 44, 'askı', 1)],
    outO: [O('kaykay', 66, 22, 'kaykay'), O('muslu', 38, 56, 'yangın musluğu'), O('top', 34, 34, 'top'), O('bank', 74, 44, 'bank'), O('martı', 58, 36, 'martı', 1), O('frizbi', 40, 14, 'frizbi', 1), O('ucurtma', 46, 52, 'uçurtma', 1)],
    bar: [O('bira', 44, 56, 'bira'), O('shot', 46, 32, 'shot'), O('fici', 54, 58, 'fıçı'), O('kasa', 60, 40, 'bira kasası'), O('ucanBira', 46, 52, 'uçan bira', 1), O('gozluk', 66, 28, 'uçan gözlük', 1), O('shot', 46, 32, 'uçan shot', 1)],
  };

  const defs = {
    Z1: { who: 'Z', bg: 'homeZ', obs: 'homeZ', title: 'Sahne 1 · Zeliha: Makyaj Masası' },
    Z2: { who: 'Z', bg: 'outZ', obs: 'outZ', title: 'Sahne 2 · Zeliha: Şehir Sokakları' },
    O1: { who: 'O', bg: 'homeO', obs: 'homeO', title: 'Sahne 1 · Okan: Dolap Kaosu' },
    O2: { who: 'O', bg: 'outO', obs: 'outO', title: 'Sahne 2 · Okan: Gün Batımı Yolu' },
    BAR: { who: 'DUO', bg: 'bar', obs: 'bar', title: 'Sahne 3 · Irish Bar: Zeliha & Okan' },
  };

  // ---------- HİKÂYE (seçilen karaktere göre farklı) ----------
  const story = {
    Z: {
      Z1: ['Zeliha hazırlanıyor', 'Bu akşam Okan’la buluşacak. Ama makyaj masası isyan etti: rujlar, parfümler, fırçalar üstüne uçuyor! 15 nesneden kaç, yanma!'],
      Z2: ['Zeliha sokakta', 'Kırmızı ceketi, leopar fularıyla evden çıktı. Şehir ona bir şeyler fırlatıyor: güvercinler, drone’lar, koniler… Buluşmaya yetişmeli!'],
      O1: ['Şimdi sıra Okan’da', 'Okan da hazırlanıyor ama dolabı dağıldı. Kot yığınları, gömlekler, ütü… Kot ceketini bulabilmesi için kaçmalı!'],
      O2: ['Okan yola çıkıyor', 'Gün batarken Zeliha’ya doğru koşuyor. Kaykaylar, martılar ve yangın muslukları yolunu kesiyor.'],
      BAR: ['Irish Bar’da buluşma', 'Sonunda kavuştular! İkisi el ele, ikisinin de koca gözlüğü var. Bardaklardan birlikte kaçın. Tek kontrol, iki kişi!'],
    },
    O: {
      O1: ['Okan geç kaldı!', 'Zeliha ile buluşmaya geç kalıyor ve evdeki kıyafetler peşinde. Kot, çorap, ütü… 15 tanesinden kaçıp kapıdan çıkmalı!'],
      O2: ['Okan Zeliha’ya koşuyor', 'Kot ceketi sırtında, gün batımında sokaklarda koşuyor. Yoldaki tehlikelerden kaçıp buluşma yerine ulaşmalı.'],
      Z1: ['Şimdi sıra Zeliha’da', 'Okan yola çıkarken Zeliha da hazırlanıyor. Ama makyaj masası isyan etti: rujlar, parfümler, fırçalar üstüne uçuyor! 15 nesneden kaç!'],
      Z2: ['Zeliha buluşmaya gidiyor', 'Kırmızı ceketi ve leopar fularıyla sokağa çıktı. Güvercinler, drone’lar, koniler… Irish Bar’a yetişmeli!'],
      BAR: ['Zeliha bekliyordu', 'Zeliha bardaki masada gülümsüyor! Okan yanına kavuştu, el ele tutuştular. İkisinin de koca gözlüğü var. bardaklardan birlikte kaçın!'],
    },
  };
  const ending = {
    Z: ['Dünya Turu Tamam!', 'Zeliha önce kendini, sonra Okan’ı bulup Irish Bar’da kavuştu. El ele, şerefe!'],
    O: ['Buluşma Tamam!', 'Okan geç kalmadı, Zeliha’ya. El ele şerefe dedi. Yeni bölümler için hazır ol!'],
  };

  return { W, H, G, defs, obstacles, bgs, story, ending, setT: v => { T = v; }, paths: { Z: ['Z1', 'Z2', 'O1', 'O2', 'BAR'], O: ['O1', 'O2', 'Z1', 'Z2', 'BAR'] }, shamrock, hash };
})();

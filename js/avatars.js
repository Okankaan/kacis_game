// Zeliha ve Okan avatarları: görsel dosyası yok, hepsi canvas ile çizilir.
// Orijin = ayakların tabanı (x ortada). Yukarı = negatif y. Boy ≈ 100 birim.
const Avatars = (() => {
  const rnd = (() => { let s = 11; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

  // Zeliha: kıvırcık, hacimli saç
  const hairCols = ['#8f5420', '#b87a32', '#cf9448', '#6f3b14'];
  const curls = [];
  for (let i = 0; i < 48; i++) {
    const a = rnd() * Math.PI * 2, r = 9 + rnd() * 9;
    curls.push({ x: Math.cos(a) * r * 1.05, y: -86 + Math.sin(a) * r, r: 4 + rnd() * 3.5, c: rnd() });
  }
  for (let i = 0; i < 26; i++) {
    const s = i % 2 ? 1 : -1;
    curls.push({ x: s * (11 + rnd() * 9), y: -82 + rnd() * 26, r: 4 + rnd() * 3.5, c: rnd() });
  }

  // Okan: acid-wash kot ceket benekleri
  const specks = [];
  for (let i = 0; i < 70; i++) {
    specks.push({ x: -17 + rnd() * 34, y: -71 + rnd() * 31, r: 0.8 + rnd() * 2.2, l: rnd() > 0.45 });
  }

  const SKIN_Z = '#f1c9a5', SKIN_O = '#e8b994';

  function legs(ctx, o, color, shoe) {
    const ph = o.phase || 0;
    for (const s of [-1, 1]) {
      let fx, fy;
      if (o.jump) { fx = s * 8 + 4; fy = -20 - (s > 0 ? 7 : 0); }
      else {
        const q = ph + (s > 0 ? 0 : Math.PI);
        fx = s * 4 + Math.sin(q) * 14;
        fy = -Math.max(0, Math.cos(q)) * 6;
      }
      ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s * 5, -40); ctx.lineTo(fx, fy - 6); ctx.stroke();
      ctx.fillStyle = shoe; ctx.beginPath(); ctx.ellipse(fx + 3, fy - 3, 9, 5, 0, 0, 7); ctx.fill();
    }
  }

  // s=-1 arka kol, s=+1 ön kol. hold: 'back' (arkadakinin elini tutar) | 'front'
  function arm(ctx, s, o, sleeve, skin, width) {
    const ph = o.phase || 0;
    let hx, hy;
    if (o.hold === 'back' && s === -1) { hx = -27; hy = -52; }
    else if (o.hold === 'front' && s === 1) { hx = 27; hy = -52; }
    else if (o.jump) { hx = s * 21; hy = -68; }
    else { hx = s * 18 + Math.sin(ph + (s > 0 ? Math.PI : 0)) * 11; hy = -50; }
    ctx.strokeStyle = sleeve; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 16, -68); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hx, hy + 1, 4.2, 0, 7); ctx.fill();
    return { hx, hy };
  }

  function glasses(ctx, big, kind) {
    const k = big ? 1.45 : 1;
    ctx.save(); ctx.translate(0, -85); ctx.scale(k, k);
    ctx.fillStyle = kind === 'z' ? '#3b2412' : '#111';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      if (kind === 'z') ctx.ellipse(s * 6.6, 0, 6.6, 5.4, s * -0.12, 0, 7);
      else ctx.roundRect(s * 6.8 - 6, -4.5, 12, 9.5, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.ellipse(s * 6.6 - 2, -1.5, 2.2, 1, -0.5, 0, 7); ctx.fill();
      ctx.fillStyle = kind === 'z' ? '#3b2412' : '#111';
    }
    ctx.strokeStyle = kind === 'z' ? '#7a4a22' : '#222'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-1, -1); ctx.lineTo(1, -1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-13, -1); ctx.lineTo(-15, 1); ctx.moveTo(13, -1); ctx.lineTo(15, 1); ctx.stroke();
    ctx.restore();
  }

  function zeliha(ctx, o) {
    // saç (arka)
    ctx.fillStyle = '#85491a';
    ctx.beginPath(); ctx.ellipse(0, -82, 20, 21, 0, 0, 7); ctx.fill();
    for (const c of curls) {
      ctx.fillStyle = hairCols[Math.floor(c.c * 4)];
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill();
    }
    legs(ctx, o, '#1b1b22', '#2a1c18');
    arm(ctx, -1, o, '#a50f27', SKIN_Z, 8);
    // blazer
    ctx.fillStyle = '#b3122b'; ctx.beginPath(); ctx.roundRect(-17, -73, 34, 34, 7); ctx.fill();
    ctx.fillStyle = '#f6f3ee'; ctx.beginPath();
    ctx.moveTo(-8, -73); ctx.lineTo(8, -73); ctx.lineTo(6, -43); ctx.lineTo(-6, -43); ctx.fill();
    ctx.strokeStyle = '#7d0a1c'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-8, -73); ctx.lineTo(-4, -50); ctx.moveTo(8, -73); ctx.lineTo(4, -50); ctx.stroke();
    // kemer
    ctx.fillStyle = '#111'; ctx.fillRect(-16, -44, 32, 5);
    ctx.fillStyle = '#d6a73a'; ctx.fillRect(-4, -45.5, 8, 8);
    ctx.fillStyle = '#111'; ctx.fillRect(-2.2, -43.5, 4.4, 4.4);
    // altın zincir + leopar fular
    ctx.strokeStyle = '#d6a73a'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(0, -72, 8, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#d9bd8a'; ctx.beginPath();
    ctx.moveTo(-5, -73); ctx.lineTo(6, -71); ctx.lineTo(12, -50); ctx.lineTo(4, -47); ctx.lineTo(-3, -62); ctx.fill();
    ctx.fillStyle = '#3a2412';
    for (const [x, y] of [[0, -68], [5, -62], [8, -55], [3, -52], [-1, -64], [9, -60]]) {
      ctx.beginPath(); ctx.ellipse(x, y, 1.8, 1.2, 0.6, 0, 7); ctx.fill();
    }
    // yüz
    ctx.fillStyle = SKIN_Z; ctx.beginPath(); ctx.ellipse(0, -84, 12, 13, 0, 0, 7); ctx.fill();
    // ön bukleler
    for (const [x, y, r, c] of [[-8, -96, 5, 1], [0, -98, 5.5, 2], [8, -96, 5, 0], [-12, -90, 4, 3], [12, -90, 4, 1]]) {
      ctx.fillStyle = hairCols[c]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    glasses(ctx, o.bigGlasses, 'z');
    // ruj + gülüş
    ctx.fillStyle = '#c4122f'; ctx.beginPath(); ctx.ellipse(0, -76, 5.4, 2.8, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -76.3, 3.8, 1.4, 0, 0, Math.PI); ctx.fill();
    // altın halka küpe
    ctx.strokeStyle = '#d6a73a'; ctx.lineWidth = 1.8;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 12.8, -77, 4, 0, 7); ctx.stroke(); }
    arm(ctx, 1, o, '#b3122b', SKIN_Z, 8);
  }

  function okan(ctx, o) {
    legs(ctx, o, '#31405f', '#f1f1f1');
    arm(ctx, -1, o, '#7391b6', SKIN_O, 9);
    // beyaz tişört (çizgili)
    ctx.fillStyle = '#f6f3ee'; ctx.beginPath(); ctx.roundRect(-14, -73, 28, 34, 5); ctx.fill();
    ctx.fillStyle = '#17a398'; ctx.fillRect(-8, -60, 16, 2.4);
    ctx.fillStyle = '#f2762e'; ctx.fillRect(-8, -56, 16, 2.4);
    ctx.fillStyle = '#17a398'; ctx.fillRect(-8, -52, 16, 2.4);
    // kot ceket: iki yan panel
    ctx.fillStyle = '#7391b6';
    ctx.beginPath(); ctx.roundRect(-19, -73, 12, 34, 5); ctx.fill();
    ctx.beginPath(); ctx.roundRect(7, -73, 12, 34, 5); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(-19, -73, 12, 34, 5); ctx.roundRect(7, -73, 12, 34, 5); ctx.clip();
    for (const sp of specks) {
      ctx.fillStyle = sp.l ? 'rgba(200,218,238,.85)' : 'rgba(52,86,134,.75)';
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.r, 0, 7); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = '#d4a017'; ctx.beginPath(); ctx.arc(-10, -50, 1.4, 0, 7); ctx.arc(10, -50, 1.4, 0, 7); ctx.fill();
    // yaka
    ctx.fillStyle = '#5f7fa6'; ctx.beginPath();
    ctx.moveTo(-9, -74); ctx.lineTo(-2, -72); ctx.lineTo(-7, -64); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9, -74); ctx.lineTo(2, -72); ctx.lineTo(7, -64); ctx.fill();
    // yüz
    ctx.fillStyle = SKIN_O; ctx.beginPath(); ctx.ellipse(0, -84, 12.5, 13.2, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(-12.3, -84, 2.6, 0, 7); ctx.arc(12.3, -84, 2.6, 0, 7); ctx.fill();
    // kirli sakal (alt yüz)
    ctx.fillStyle = 'rgba(70,48,34,.38)'; ctx.beginPath();
    ctx.moveTo(-12, -86); ctx.quadraticCurveTo(-12, -70, 0, -70.5); ctx.quadraticCurveTo(12, -70, 12, -86);
    ctx.quadraticCurveTo(7, -79, 0, -80); ctx.quadraticCurveTo(-7, -79, -12, -86); ctx.fill();
    // kısa dik kahverengi saç
    ctx.fillStyle = '#4a2f1c'; ctx.beginPath(); ctx.ellipse(0, -92, 12.8, 8, 0, Math.PI, 0); ctx.fill();
    for (let i = 0; i < 7; i++) {
      const x = -11 + i * 3.7;
      ctx.beginPath(); ctx.moveTo(x - 2.3, -94); ctx.lineTo(x + (i % 2 ? 1.5 : -1), -102 - (i % 3)); ctx.lineTo(x + 2.3, -94); ctx.fill();
    }
    // gözler, kaşlar, gülüş
    if (o.bigGlasses) glasses(ctx, true, 'o');
    else {
      ctx.fillStyle = '#fff';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 4.8, -85, 2.6, 1.9, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#4a6a82';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 4.8, -85, 1.3, 0, 7); ctx.fill(); }
      ctx.strokeStyle = '#3a2615'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-8, -89); ctx.lineTo(-2.5, -88.5); ctx.moveTo(8, -89); ctx.lineTo(2.5, -88.5); ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -76, 5.6, 3, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = '#7a3b2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, -76, 5.6, 3, 0, 0, Math.PI); ctx.stroke();
    const h = arm(ctx, 1, o, '#7391b6', SKIN_O, 9);
    // dijital saat
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(h.hx - 4.5, h.hy + 2, 9, 6, 1.5); ctx.fill();
    ctx.fillStyle = '#8ab59a'; ctx.fillRect(h.hx - 2.8, h.hy + 3.3, 5.6, 3);
  }

  // who: 'Z' | 'O'; o: {phase, duck, jump, bigGlasses, hold, scale}
  function draw(ctx, who, x, y, o = {}) {
    const s = o.scale || 1;
    ctx.save();
    ctx.translate(x, y); ctx.scale(s, s);
    if (!o.noShadow) {
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      ctx.beginPath(); ctx.ellipse(0, 1, 18, 4, 0, 0, 7); ctx.fill();
    }
    if (o.duck) ctx.scale(1.1, 0.56);
    if (who === 'Z') zeliha(ctx, o); else okan(ctx, o);
    ctx.restore();
  }

  return { draw };
})();

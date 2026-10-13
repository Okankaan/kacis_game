// Ana oyun: giriş animasyonu, karakter seçimi, hikâye kartları, oyun döngüsü.
(() => {
  const { W, H, G, defs, obstacles, bgs, story, ending, paths } = Scenes;
  const cv = document.getElementById('game');
  const ctx = cv.getContext('2d');
  const GOAL = 15;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => t * t * (3 - 2 * t);
  const FONT = '"Trebuchet MS", "Segoe UI", sans-serif';

  let state = 'intro', T = 0, introT = 0, sel = 0, chosen = null, seqI = 0, sceneId = null;
  let play = null, stateT = 0, fire = [], confetti = [];
  const keys = {};
  const pressed = {};

  // ---------- ses (WebAudio, dosyasız) ----------
  let ac = null;
  function sfx(f, d = 0.12, type = 'square', f2) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, ac.currentTime);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, ac.currentTime + d);
      g.gain.setValueAtTime(0.06, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
    } catch (e) { /* ses yoksa sessiz devam */ }
  }

  // ---------- giriş ----------
  const stars = Array.from({ length: 160 }, (_, i) => ({ x: Scenes.hash(i) * W, y: Scenes.hash(i + 300) * H, r: 0.5 + Scenes.hash(i + 600) * 1.5 }));
  const blobs = [];
  for (let i = 0; i < 70; i++) blobs.push({ lon: Scenes.hash(i + 9) * 6.283, lat: (Scenes.hash(i + 99) - 0.5) * 2.4, s: 0.06 + Scenes.hash(i + 199) * 0.1 });

  function drawGlobe(cx, cy, R, rot) {
    const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    halo.addColorStop(0, 'rgba(120,190,255,.6)'); halo.addColorStop(1, 'rgba(120,190,255,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    const oc = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    oc.addColorStop(0, '#3a8fe0'); oc.addColorStop(1, '#0b3a82');
    ctx.fillStyle = oc; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    for (const b of blobs) {
      const lon = b.lon + rot, cl = Math.cos(lon);
      if (cl <= 0.05) continue;
      const x = cx + R * Math.cos(b.lat) * Math.sin(lon), y = cy - R * Math.sin(b.lat);
      ctx.fillStyle = Scenes.hash(b.lon * 50) > 0.5 ? '#4aa05a' : '#8cb35a';
      ctx.beginPath(); ctx.ellipse(x, y, b.s * R * cl, b.s * R * 1.1, 0, 0, 7); ctx.fill();
    }
    const sh = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.2, cx, cy, R * 1.05);
    sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,20,.7)');
    ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
  }

  function drawIntro(t) {
    const p = clamp(t / 6.4, 0, 1);
    ctx.fillStyle = '#02030a'; ctx.fillRect(0, 0, W, H);
    const k = 1 + p * p * 4;
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(t * 3 + s.x)})`;
      ctx.beginPath(); ctx.arc(W / 2 + (s.x - W / 2) * k, H / 2 + (s.y - H / 2) * k, s.r, 0, 7); ctx.fill();
    }
    const R = 120 * Math.exp(p * 3.4);
    drawGlobe(W / 2, H / 2 + p * 60, R, t * 0.7);
    if (t < 3.2) {
      ctx.globalAlpha = clamp(1 - (t - 2) / 1.2, 0, 1) * clamp(t / 0.8, 0, 1);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = `bold 54px ${FONT}`; ctx.shadowColor = '#5fb6ff'; ctx.shadowBlur = 20;
      ctx.fillText('KAÇIŞ GECESİ', W / 2, 90);
      ctx.shadowBlur = 0; ctx.font = `20px ${FONT}`; ctx.fillText('Zeliha & Okan', W / 2, 125);
      ctx.globalAlpha = 1;
    }
    if (p > 0.55) { // bulutlar yukarı kayar: kamera alçalıyor
      const a = clamp((p - 0.55) / 0.35, 0, 1);
      ctx.globalAlpha = a * (p > 0.92 ? 1 - (p - 0.92) / 0.08 : 1);
      for (let i = 0; i < 18; i++) {
        const sp = 0.4 + Scenes.hash(i) * 1.2, x = Scenes.hash(i + 40) * W;
        const y = (H + 200) - ((t * 260 * sp + i * 97) % (H + 400));
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        ctx.beginPath(); ctx.ellipse(x, y, 140, 38, 0, 0, 7); ctx.ellipse(x + 70, y - 22, 100, 36, 0, 0, 7); ctx.ellipse(x - 80, y - 10, 90, 28, 0, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (t > 5.2) { // gökyüzü ve seçim sahnesi belirir
      ctx.globalAlpha = clamp((t - 5.2) / 1.2, 0, 1);
      drawSelect(t);
      ctx.globalAlpha = 1;
    }
  }

  const cardX = [300, 660];
  function drawSelect(t) {
    bgs.outZ(ctx, t * 25);
    const dp = clamp((t - 6.2) / 1.6, 0, 1), landed = dp >= 1;
    const names = ['ZELİHA', 'OKAN'], who = ['Z', 'O'];
    const desc = ['Önce Zeliha’nın hikâyesi', 'Doğrudan Okan’ın hikâyesi'];
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 8;
    ctx.font = `bold 40px ${FONT}`; ctx.fillText('Karakterini seç', W / 2, 62);
    ctx.shadowBlur = 0;
    for (let i = 0; i < 2; i++) {
      const on = i === sel && landed;
      const drop = (1 - ease(dp)) * -520;
      const bob = landed ? Math.sin(t * 2 + i) * 3 : 0;
      ctx.fillStyle = on ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.18)';
      ctx.beginPath(); ctx.roundRect(cardX[i] - 150, 110, 300, 340, 22); ctx.fill();
      if (on) { ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 5; ctx.stroke(); }
      Avatars.draw(ctx, who[i], cardX[i], 420 + drop + bob, { scale: 2.7, phase: t * 3 * (on ? 1.6 : 0.8) + (landed ? 0 : dp * 20) });
      ctx.fillStyle = '#fff'; ctx.font = `bold 30px ${FONT}`; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 6;
      if (landed) { ctx.fillText(names[i], cardX[i], 480); ctx.font = `16px ${FONT}`; ctx.fillText(desc[i], cardX[i], 504); }
      ctx.shadowBlur = 0;
    }
    if (landed) {
      ctx.fillStyle = '#fff'; ctx.font = `18px ${FONT}`; ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4);
      ctx.fillText('← → ile seç · Enter ile başla', W / 2, 96); ctx.globalAlpha = 1;
    }
  }

  // ---------- akış ----------
  function pathNow() { return paths[chosen]; }
  function beginPath(who) {
    chosen = who; seqI = 0; sceneId = pathNow()[0];
    setState('story');
  }
  function setState(s) { state = s; stateT = 0; }
  function startScene() {
    const d = defs[sceneId];
    play = { x: 220, y: 0, vy: 0, duck: false, sc: 0, obs: [], next: 1.2, dodged: 0, d };
    fire = []; setState('play');
  }
  function nextScene() {
    seqI++;
    if (seqI >= pathNow().length) { setState('end'); confetti = []; sfx(660, .5, 'triangle', 1320); return; }
    sceneId = pathNow()[seqI]; setState('story');
  }

  // ---------- oyun ----------
  function spawn() {
    const list = obstacles[play.d.obs];
    const air = Math.random() < 0.38;
    // bir önceki engelle aynı çizimi kullananlar (ör. yerdeki ve havadaki shot) seçilmez
    let pool = list.filter(o => o.air === air && o.draw !== play.last);
    if (!pool.length) pool = list.filter(o => o.draw !== play.last);
    const t = pool[Math.floor(Math.random() * pool.length)];
    play.last = t.draw;
    play.obs.push({ t, x: W + 40, ph: Math.random() * 6, counted: false });
  }

  function hitbox() {
    const d = play.d, P = play;
    const h = P.duck ? 44 : 90;
    const w = d.who === 'DUO' ? 92 : 28;
    const left = d.who === 'DUO' ? P.x - 54 - 14 : P.x - 14;
    return { l: left, r: left + w, b: P.y, t: P.y + h };
  }

  function updatePlay(dt) {
    const P = play, d = P.d;
    const dir = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    P.x = clamp(P.x + dir * 270 * dt, d.who === 'DUO' ? 150 : 90, 600);
    P.duck = !!keys.ArrowDown && P.y === 0;
    if ((pressed.ArrowUp || pressed.Space) && P.y === 0 && !P.duck) { P.vy = 840; P.y = 0.01; sfx(380, .18, 'square', 760); }
    if (P.y > 0) {
      P.vy -= (keys.ArrowDown ? 4200 : 2300) * dt; P.y += P.vy * dt;
      if (P.y <= 0) { P.y = 0; P.vy = 0; }
    }
    const S = 340 + P.dodged * 9;
    P.sc += S * dt; P.next -= dt;
    if (P.next <= 0) { spawn(); P.next = (0.95 + Math.random() * 0.8) * (360 / S) + 0.15; }
    const hb = hitbox();
    for (const o of P.obs) {
      o.x -= S * dt;
      const oy = o.t.lift + (o.t.air ? Math.sin(Scenes.T * 4 + o.ph) * 5 : 0);
      const ob = { l: o.x + 6, r: o.x + o.t.w - 6, b: oy + 4, t: oy + o.t.h - 4 };
      if (hb.l < ob.r && hb.r > ob.l && hb.b < ob.t && hb.t > ob.b) { die(); return; }
      if (!o.counted && o.x + o.t.w < hb.l) {
        o.counted = true; P.dodged++; sfx(520 + P.dodged * 20, .08, 'triangle');
        if (P.dodged >= GOAL) { win(); return; }
      }
    }
    P.obs = P.obs.filter(o => o.x > -120);
  }

  let deadSel = 0;
  const DEAD_BTNS = [
    { x: W / 2 - 240, y: 330, w: 230, h: 52, label: '▶ Bu sahneden devam' },
    { x: W / 2 + 10, y: 330, w: 230, h: 52, label: '🏠 Ana Sayfa' },
  ];
  function chooseDead(i) { if (i === 0) startScene(); else goHome(); }
  function die() {
    sfx(200, .6, 'sawtooth', 50);
    setState('dead'); fire = []; deadSel = 0;
  }
  function win() {
    play.obs = []; confetti = [];
    for (let i = 0; i < 70; i++) confetti.push({ x: Math.random() * W, y: -Math.random() * H, v: 120 + Math.random() * 200, c: `hsl(${Math.random() * 360},90%,60%)`, r: Math.random() * 6 });
    sfx(523, .12, 'triangle'); setTimeout(() => sfx(659, .12, 'triangle'), 120); setTimeout(() => sfx(784, .25, 'triangle'), 240);
    setState('clear');
  }

  function drawPlayers(t, ph, P, d) {
    const o = { phase: ph, duck: P.duck, jump: P.y > 0, bigGlasses: d.who === 'DUO' };
    const y = G - P.y;
    if (d.who === 'DUO') {
      Avatars.draw(ctx, 'Z', P.x - 54, y, { ...o, hold: 'front' });
      Avatars.draw(ctx, 'O', P.x, y, { ...o, hold: 'back' });
      // el ele: kalp
      const hx = P.x - 27, hy = y - (P.duck ? 30 : 52) - 14 + Math.sin(t * 5) * 2;
      ctx.fillStyle = '#ff3b6b'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♥', hx, hy);
    } else Avatars.draw(ctx, d.who, P.x, y, o);
  }

  function drawObstacles(P) {
    for (const o of P.obs) {
      const oy = o.t.lift + (o.t.air ? Math.sin(Scenes.T * 4 + o.ph) * 5 : 0);
      ctx.save(); ctx.translate(o.x, G - oy - o.t.h);
      if (o.t.air) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(o.t.w / 2, o.t.h + oy, o.t.w / 3, 4, 0, 0, 7); ctx.fill(); }
      o.t.draw(ctx, o.t.w, o.t.h);
      // kırmızı uyarı çizgisi: bu bir engel
      ctx.strokeStyle = '#ff2b2b'; ctx.lineWidth = 3; ctx.shadowColor = '#ff2b2b'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.roundRect(-3, -3, o.t.w + 6, o.t.h + 6, 8); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  function drawHud() {
    const P = play;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(14, 12, 400, 62, 12); ctx.fill();
    ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `bold 16px ${FONT}`; ctx.fillText(P.d.title, 28, 36);
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(28, 46, 260, 12);
    ctx.fillStyle = '#ffd34d'; ctx.fillRect(28, 46, 260 * P.dodged / GOAL, 12);
    ctx.fillStyle = '#fff'; ctx.font = `bold 15px ${FONT}`; ctx.fillText(`Kaçılan: ${P.dodged} / ${GOAL}`, 300, 58);
  }

  function drawFire(dt, cx, cy) {
    for (let i = 0; i < 5; i++) fire.push({ x: cx + (Math.random() - .5) * 40, y: cy, vx: (Math.random() - .5) * 40, vy: -60 - Math.random() * 120, l: 0.6 + Math.random() * 0.5, m: 1 });
    for (const f of fire) { f.x += f.vx * dt; f.y += f.vy * dt; f.l -= dt; }
    fire = fire.filter(f => f.l > 0);
    for (const f of fire) {
      ctx.globalAlpha = clamp(f.l * 1.6, 0, 1);
      ctx.fillStyle = f.l > 0.6 ? '#ffe27a' : f.l > 0.3 ? '#ff8a1a' : '#e0301a';
      ctx.beginPath(); ctx.arc(f.x, f.y, 5 + f.l * 14, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function overlay(title, lines, hint) {
    ctx.fillStyle = 'rgba(8,6,20,.82)'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffd34d'; ctx.font = `bold 44px ${FONT}`; ctx.fillText(title, W / 2, 200);
    ctx.fillStyle = '#fff'; ctx.font = `22px ${FONT}`;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, 262 + i * 34));
    if (hint) { ctx.globalAlpha = 0.6 + 0.4 * Math.sin(T * 5); ctx.font = `18px ${FONT}`; ctx.fillText(hint, W / 2, 440); ctx.globalAlpha = 1; }
  }
  function wrap(text, max) {
    const out = []; let line = '';
    ctx.font = `22px ${FONT}`;
    for (const w of text.split(' ')) {
      if (ctx.measureText(line + w).width > max) { out.push(line.trim()); line = ''; }
      line += w + ' ';
    }
    out.push(line.trim()); return out;
  }

  // ---------- ana döngü ----------
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    T += dt; stateT += dt; Scenes.setT(T);
    ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    ctx.textAlign = 'left';

    if (state === 'intro') {
      introT += dt;
      drawIntro(introT);
      if (introT > 7.8 && pressed.ArrowLeft) sel = 0;
      if (introT > 7.8 && pressed.ArrowRight) sel = 1;
      if (pressed.Enter || pressed.Space) {
        if (introT < 7.8) introT = 7.9; else { sfx(660, .15, 'triangle'); beginPath(sel === 0 ? 'Z' : 'O'); }
      }
    } else if (state === 'story') {
      const d = defs[sceneId], s = story[chosen][sceneId];
      bgs[d.bg](ctx, T * 20);
      overlay(s[0], wrap(s[1], 700), 'Enter ile başla');
      ctx.textAlign = 'center'; ctx.fillStyle = '#9fd0ff'; ctx.font = `16px ${FONT}`;
      ctx.fillText('↑ zıpla · ↓ eğil · ← → ileri/geri · 15 engelden kaç', W / 2, 400);
      if (d.who === 'DUO') {
        Avatars.draw(ctx, 'Z', 120, G + 70, { scale: 1.1, phase: T * 6, hold: 'front', bigGlasses: true, noShadow: true });
        Avatars.draw(ctx, 'O', 180, G + 70, { scale: 1.1, phase: T * 6, hold: 'back', bigGlasses: true, noShadow: true });
      } else Avatars.draw(ctx, d.who, 150, G + 70, { scale: 1.1, phase: T * 6, noShadow: true });
      if (pressed.Enter || pressed.Space) { sfx(520, .1, 'triangle'); startScene(); }
    } else if (state === 'play' || state === 'dead' || state === 'clear') {
      const P = play, d = P.d;
      if (state === 'play') updatePlay(dt);
      bgs[d.bg](ctx, P.sc);
      drawObstacles(P);
      const ph = state === 'play' ? P.sc / 28 : 0;
      drawPlayers(T, ph, P, d);
      drawHud();
      if (state === 'dead') {
        drawFire(dt, d.who === 'DUO' ? P.x - 27 : P.x, G - P.y - 30);
        if (stateT > 0.5) {
          ctx.fillStyle = 'rgba(40,0,0,.6)'; ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center'; ctx.fillStyle = '#ff6a3a'; ctx.font = `bold 60px ${FONT}`; ctx.fillText('YANDIN! 🔥', W / 2, 250);
          ctx.fillStyle = '#fff'; ctx.font = `22px ${FONT}`; ctx.fillText('Ne yapmak istersin?', W / 2, 296);
          DEAD_BTNS.forEach((b, i) => {
            const on = i === deadSel;
            ctx.fillStyle = on ? '#ffd34d' : 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 14); ctx.fill();
            ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = on ? '#2a1600' : '#fff'; ctx.font = `bold 20px ${FONT}`;
            ctx.fillText(b.label, b.x + b.w / 2, b.y + 33);
          });
          ctx.fillStyle = '#ddd'; ctx.font = `15px ${FONT}`; ctx.fillText('← → ile seç · Enter ile onayla', W / 2, 410);
          if (pressed.ArrowLeft) deadSel = 0;
          if (pressed.ArrowRight) deadSel = 1;
          if (pressed.Enter || pressed.Space) chooseDead(deadSel);
        }
      } else if (state === 'clear') {
        for (const c of confetti) { c.y += c.v * dt; if (c.y > H) c.y = -10; ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y, c.r, c.r * 1.6); }
        ctx.textAlign = 'center'; ctx.fillStyle = '#ffd34d'; ctx.font = `bold 58px ${FONT}`;
        ctx.shadowColor = '#000'; ctx.shadowBlur = 10; ctx.fillText('BÖLÜM TAMAM! ✨', W / 2, 220); ctx.shadowBlur = 0;
        if (stateT > 2 || (stateT > 0.6 && (pressed.Enter || pressed.Space))) nextScene();
      }
    } else if (state === 'end') {
      bgs.bar(ctx, T * 30);
      const e = ending[chosen];
      Avatars.draw(ctx, 'Z', W / 2 - 40, G, { phase: 0, bigGlasses: true, hold: 'front', scale: 1.3 });
      Avatars.draw(ctx, 'O', W / 2 + 40, G, { phase: 0, bigGlasses: true, hold: 'back', scale: 1.3 });
      for (const c of confetti) { c.y += c.v * dt; if (c.y > H) c.y = -10; ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y, c.r, c.r * 1.6); }
      if (!confetti.length) for (let i = 0; i < 70; i++) confetti.push({ x: Math.random() * W, y: -Math.random() * H, v: 100 + Math.random() * 180, c: `hsl(${Math.random() * 360},90%,60%)`, r: Math.random() * 6 });
      ctx.fillStyle = 'rgba(8,6,20,.7)'; ctx.fillRect(120, 70, 720, 190);
      ctx.textAlign = 'center'; ctx.fillStyle = '#ffd34d'; ctx.font = `bold 44px ${FONT}`; ctx.fillText(e[0], W / 2, 130);
      ctx.fillStyle = '#fff'; ctx.font = `22px ${FONT}`; wrap(e[1], 640).forEach((l, i) => ctx.fillText(l, W / 2, 175 + i * 30));
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(T * 5); ctx.font = `18px ${FONT}`; ctx.fillText('Enter: baştan oyna', W / 2, 240); ctx.globalAlpha = 1;
      if (pressed.Enter) { introT = 7.9; sel = 0; setState('intro'); }
    }
    if (state !== 'intro') {
      if (pressed.Escape) goHome();
      else drawHomeButton();
    }
    for (const k in pressed) delete pressed[k];
    requestAnimationFrame(frame);
  }

  // ---------- Ana Sayfa butonu (tüm bölümlerde) ----------
  const HOME_BTN = { x: W - 158, y: 12, w: 146, h: 38 };
  function goHome() {
    play = null; fire = []; confetti = []; sel = 0; introT = 7.9; setState('intro');
  }
  function drawHomeButton() {
    const b = HOME_BTN;
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 12); ctx.fill();
    ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 2; ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = `bold 16px ${FONT}`;
    ctx.fillText('🏠 Ana Sayfa', b.x + b.w / 2, b.y + 25);
    ctx.textAlign = 'left';
  }

  // ---------- girdi & boyut ----------
  const GAMEKEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'Escape'];
  addEventListener('keydown', e => {
    const k = e.code === 'Space' ? 'Space' : e.key === 'Enter' ? 'Enter' : e.key;
    if (GAMEKEYS.includes(k)) { e.preventDefault(); if (!keys[k]) pressed[k] = true; keys[k] = true; }
    if (ac && ac.state === 'suspended') ac.resume();
  });
  addEventListener('keyup', e => { const k = e.code === 'Space' ? 'Space' : e.key; keys[k] = false; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
  cv.addEventListener('click', e => {
    const x = (e.offsetX / cv.clientWidth) * W, y = (e.offsetY / cv.clientHeight) * H;
    const PAD = 14; // parmak için tıklama alanını genişlet
    if (state === 'dead' && stateT > 0.5) {
      const i = DEAD_BTNS.findIndex(b => x >= b.x - PAD && x <= b.x + b.w + PAD && y >= b.y - PAD && y <= b.y + b.h + PAD);
      if (i >= 0) { chooseDead(i); return; }
    }
    if (state !== 'intro') {
      const b = HOME_BTN;
      if (x >= b.x - PAD && x <= b.x + b.w + PAD && y >= b.y - PAD && y <= b.y + b.h + PAD) { goHome(); return; }
      // hikâye, bölüm sonu ve final ekranlarında dokunmak = Enter
      if (state === 'story' || state === 'clear' || state === 'end') pressed.Enter = true;
      return;
    }
    if (introT < 7.8) { introT = 7.9; return; }
    if (Math.abs(x - cardX[0]) < 150) { sel = 0; beginPath('Z'); } else if (Math.abs(x - cardX[1]) < 150) { sel = 1; beginPath('O'); }
  });
  // Dokunmatik düğmeler: klavye ok tuşlarıyla aynı durumu değiştirir
  document.querySelectorAll('#touch button').forEach(btn => {
    const k = btn.dataset.key;
    const press = e => {
      e.preventDefault(); btn.setPointerCapture(e.pointerId);
      if (!keys[k]) pressed[k] = true;
      keys[k] = true; btn.classList.add('on');
      if (ac && ac.state === 'suspended') ac.resume();
    };
    const release = e => { e.preventDefault(); keys[k] = false; btn.classList.remove('on'); };
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('contextmenu', e => e.preventDefault());
  });
  document.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointerdown', () => { if (ac && ac.state === 'suspended') ac.resume(); });

  function resize() {
    const s = Math.min(innerWidth / W, innerHeight / H), dpr = window.devicePixelRatio || 1;
    cv.style.width = W * s + 'px'; cv.style.height = H * s + 'px';
    cv.width = Math.round(W * s * dpr); cv.height = Math.round(H * s * dpr);
  }
  addEventListener('resize', resize); resize();

  // Test için: #sahne=BAR gibi bir adresle doğrudan sahneye atlanır
  const m = location.hash.match(/sahne=(Z1|Z2|O1|O2|BAR)/);
  if (m) { chosen = m[1].startsWith('Z') ? 'Z' : 'O'; seqI = paths[chosen].indexOf(m[1]); sceneId = m[1]; state = 'story'; }

  requestAnimationFrame(frame);
})();

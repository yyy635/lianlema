/* =========================================================
   练了吗 · app
   纯前端，数据存 localStorage，不依赖任何后端。
   ========================================================= */
(() => {
  'use strict';

  /* ----------------------------- 常量 ----------------------------- */

  const GROUPS = { chest: '胸', back: '背', shoulder: '肩', arm: '手臂', legs: '腿', core: '核心' };

  const FOCUS = {
    push: { label: '推 · 胸肩', primary: ['chest'], secondary: ['shoulder', 'arm'], next: 'pull' },
    pull: { label: '拉 · 背', primary: ['back'], secondary: ['arm', 'shoulder'], next: 'legs' },
    legs: { label: '腿', primary: ['legs'], secondary: ['core', 'chest'], next: 'push' },
    full: { label: '全身', primary: ['legs', 'chest', 'back'], secondary: ['shoulder', 'arm', 'core'], next: 'push' }
  };

  const GEARS = [
    { id: 'barbell', label: '杠铃' },
    { id: 'dumbbell', label: '哑铃' },
    { id: 'machine', label: '固定器械' },
    { id: 'bodyweight', label: '自重' }
  ];

  const TIMES = [20, 40, 60];

  const GOALS = ['增肌', '减脂', '保持'];

  const EX = [
    // 胸
    { id: 'bench', name: '杠铃卧推', g: 'chest', gear: 'barbell', sets: 4, reps: 8, unit: '次', rest: 120, compound: true, tip: '肩胛后收下沉，杠铃触胸不弹起。' },
    { id: 'incline-db', name: '上斜哑铃卧推', g: 'chest', gear: 'dumbbell', sets: 4, reps: 10, unit: '次', rest: 90, compound: true, tip: '靠背 30°，肘部 45° 内收。' },
    { id: 'cable-fly', name: '绳索夹胸', g: 'chest', gear: 'machine', sets: 3, reps: 12, unit: '次', rest: 60, tip: '手肘微屈固定，末端挤压一秒。' },
    { id: 'pushup', name: '俯卧撑', g: 'chest', gear: 'bodyweight', sets: 3, reps: 15, unit: '次', rest: 60, tip: '核心收紧，身体一条直线。' },
    { id: 'dip', name: '双杠臂屈伸', g: 'chest', gear: 'bodyweight', sets: 3, reps: 10, unit: '次', rest: 90, compound: true, tip: '身体略前倾，别耸肩。' },
    // 背
    { id: 'pullup', name: '引体向上', g: 'back', gear: 'bodyweight', sets: 4, reps: 6, unit: '次', rest: 120, compound: true, tip: '先沉肩再发力，别摆腿。' },
    { id: 'lat-pulldown', name: '高位下拉', g: 'back', gear: 'machine', sets: 4, reps: 10, unit: '次', rest: 90, compound: true, tip: '拉到锁骨，别后仰借力。' },
    { id: 'seated-row', name: '坐姿划船', g: 'back', gear: 'machine', sets: 4, reps: 10, unit: '次', rest: 90, compound: true, tip: '肘往腰后拉，肩胛夹紧。' },
    { id: 'bb-row', name: '杠铃划船', g: 'back', gear: 'barbell', sets: 4, reps: 8, unit: '次', rest: 120, compound: true, tip: '背角 45°，别用腰甩。' },
    { id: 'db-row', name: '单臂哑铃划船', g: 'back', gear: 'dumbbell', sets: 3, reps: 10, unit: '次', rest: 75, tip: '肘贴身体拉，顶端停半秒。' },
    { id: 'inverted-row', name: '反向划船', g: 'back', gear: 'bodyweight', sets: 3, reps: 10, unit: '次', rest: 75, tip: '身体绷直，胸口碰杠。' },
    { id: 'shrug', name: '哑铃耸肩', g: 'back', gear: 'dumbbell', sets: 3, reps: 15, unit: '次', rest: 60, tip: '只上下，不转圈。' },
    // 肩
    { id: 'ohp', name: '站姿杠铃推举', g: 'shoulder', gear: 'barbell', sets: 4, reps: 8, unit: '次', rest: 120, compound: true, tip: '核心收紧，杠过下巴再推。' },
    { id: 'lateral', name: '哑铃侧平举', g: 'shoulder', gear: 'dumbbell', sets: 4, reps: 12, unit: '次', rest: 60, tip: '小重量，抬到与肩同高。' },
    { id: 'face-pull', name: '绳索面拉', g: 'shoulder', gear: 'machine', sets: 3, reps: 15, unit: '次', rest: 60, tip: '拉向额头，肘高于手腕。' },
    { id: 'rev-fly', name: '俯身反向飞鸟', g: 'shoulder', gear: 'dumbbell', sets: 3, reps: 12, unit: '次', rest: 60, tip: '小臂下压，别耸肩。' },
    { id: 'pike-pushup', name: '派克俯卧撑', g: 'shoulder', gear: 'bodyweight', sets: 3, reps: 10, unit: '次', rest: 75, tip: '臀部抬高，头顶快落地。' },
    // 手臂
    { id: 'bb-curl', name: '杠铃弯举', g: 'arm', gear: 'barbell', sets: 3, reps: 10, unit: '次', rest: 60, tip: '肘固定，别甩。' },
    { id: 'hammer', name: '锤式弯举', g: 'arm', gear: 'dumbbell', sets: 3, reps: 12, unit: '次', rest: 60, tip: '掌心相对，控制下放。' },
    { id: 'pushdown', name: '绳索下压', g: 'arm', gear: 'machine', sets: 3, reps: 12, unit: '次', rest: 60, tip: '肘夹紧，末端伸直手臂。' },
    // 腿
    { id: 'squat', name: '杠铃深蹲', g: 'legs', gear: 'barbell', sets: 4, reps: 6, unit: '次', rest: 150, compound: true, tip: '脚掌三点发力，膝盖跟脚尖同向。' },
    { id: 'leg-press', name: '腿举', g: 'legs', gear: 'machine', sets: 4, reps: 10, unit: '次', rest: 120, compound: true, tip: '别把腰拱离靠背。' },
    { id: 'rdl', name: '罗马尼亚硬拉', g: 'legs', gear: 'barbell', sets: 3, reps: 8, unit: '次', rest: 120, compound: true, tip: '屈髋不屈腰，感受腿后侧拉长。' },
    { id: 'bulgarian', name: '保加利亚分腿蹲', g: 'legs', gear: 'dumbbell', sets: 3, reps: 10, unit: '次', rest: 90, compound: true, tip: '前脚踩稳，下到后膝接近地面。' },
    { id: 'goblet', name: '高脚杯深蹲', g: 'legs', gear: 'dumbbell', sets: 3, reps: 12, unit: '次', rest: 75, tip: '手肘在身体两侧，蹲到大腿平行。' },
    { id: 'leg-curl', name: '腿弯举', g: 'legs', gear: 'machine', sets: 3, reps: 12, unit: '次', rest: 60, tip: '离心慢放，别甩小腿。' },
    { id: 'calf', name: '站姿提踵', g: 'legs', gear: 'machine', sets: 3, reps: 15, unit: '次', rest: 45, tip: '顶端停一秒，下到底。' },
    { id: 'bw-squat', name: '徒手深蹲', g: 'legs', gear: 'bodyweight', sets: 3, reps: 20, unit: '次', rest: 60, tip: '动作放慢，蹲到底。' },
    { id: 'lunge', name: '箭步蹲', g: 'legs', gear: 'bodyweight', sets: 3, reps: 12, unit: '次', rest: 60, tip: '每次膝盖轻触地面。' },
    { id: 'bridge', name: '单腿臀桥', g: 'legs', gear: 'bodyweight', sets: 3, reps: 12, unit: '次', rest: 45, tip: '臀发力顶住，别用腰。' },
    // 核心
    { id: 'leg-raise', name: '悬垂举腿', g: 'core', gear: 'bodyweight', sets: 3, reps: 12, unit: '次', rest: 60, tip: '骨盆后倾，别摆腿。' },
    { id: 'plank', name: '平板支撑', g: 'core', gear: 'bodyweight', sets: 3, reps: 40, unit: '秒', rest: 45, tip: '屁股别翘，全程收腹。' }
  ];

  const EX_BY_ID = Object.fromEntries(EX.map(e => [e.id, e]));

  /* ----------------------------- 状态 ----------------------------- */

  const KEY = 'lianlema.v1';

  function defaults() {
    return {
      v: 1,
      profile: { name: '训练者', height: 175, weight: 65, goal: '增肌' },
      prefs: { focus: 'push', minutes: 40, gear: ['barbell', 'dumbbell', 'machine', 'bodyweight'] },
      sessions: [],
      weights: [],
      draft: null,
      pending: null,
      lastSessionId: null
    };
  }

  let S = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return Object.assign(defaults(), parsed, {
        profile: Object.assign(defaults().profile, parsed.profile || {}),
        prefs: Object.assign(defaults().prefs, parsed.prefs || {})
      });
    } catch {
      return defaults();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch {
      toast('存不下了，检查浏览器空间');
    }
  }

  /* ----------------------------- 工具 ----------------------------- */

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const pad = n => String(n).padStart(2, '0');

  const iso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = s => {
    const [y, m, d] = String(s).split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const dayDiff = (a, b) => Math.round((fromISO(a) - fromISO(b)) / 86400000);

  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  function fmtDate(isoStr) {
    const d = fromISO(isoStr);
    return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 周${WEEK[d.getDay()]}`;
  }

  function relDay(isoStr) {
    const n = dayDiff(iso(), isoStr);
    if (n === 0) return '今天';
    if (n === 1) return '昨天';
    if (n === 2) return '前天';
    if (n < 7) return `${n} 天前`;
    const d = fromISO(isoStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function fmtVol(kg) {
    return kg >= 1000 ? (kg / 1000).toFixed(1) + 't' : Math.round(kg) + 'kg';
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function buzz(ms = 12) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  /* 简单的提示音：休息结束时响两声 */
  let audioCtx = null;
  function chime() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      [0, 0.22].forEach((offset, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t0 = audioCtx.currentTime + offset;
        osc.type = 'sine';
        osc.frequency.value = i === 0 ? 880 : 1160;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.2);
      });
    } catch { /* 静音环境就算了 */ }
  }

  /* ----------------------------- 计算 ----------------------------- */

  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /** 每个动作最近一次练的时间戳，用来优先推荐久没练的 */
  function usageMap() {
    const map = {};
    for (const s of S.sessions) {
      for (const set of s.sets) {
        const t = fromISO(s.date).getTime();
        if (!map[set.exId] || map[set.exId] < t) map[set.exId] = t;
      }
    }
    return map;
  }

  function lastSetOf(exId) {
    for (let i = S.sessions.length - 1; i >= 0; i--) {
      const s = S.sessions[i];
      const sets = s.sets.filter(x => x.exId === exId);
      if (sets.length) {
        const best = sets.reduce((a, b) => (a.w * a.r >= b.w * b.r ? a : b));
        return { ...best, date: s.date };
      }
    }
    return null;
  }

  function buildPlan() {
    const { focus, minutes, gear } = S.prefs;
    const f = FOCUS[focus];
    const pool = EX.filter(e => gear.includes(e.gear));
    const n = minutes <= 20 ? 3 : minutes <= 40 ? 5 : 7;

    // 久没练的排前面；同等条件下复合动作优先；再加一点抖动，让「换一套」真的会变
    const used = usageMap();
    const ordered = pool
      .map(e => {
        const u = used[e.id] || 0;
        return { e, key: u / 1e9 + Math.random() * 0.9 + (e.compound ? 0 : 0.35) };
      })
      .sort((a, b) => a.key - b.key)
      .map(x => x.e);

    const picks = [];
    const countG = () => picks.reduce((m, e) => ((m[e.g] = (m[e.g] || 0) + 1), m), {});

    // 1) 每个主肌群先来一个，同一个肌群优先大重量复合动作
    for (const g of f.primary) {
      const cands = ordered
        .filter(e => e.g === g && !picks.includes(e))
        .sort((a, b) => (b.compound ? 1 : 0) - (a.compound ? 1 : 0) || b.sets - a.sets);
      if (cands[0] && picks.length < n) picks.push(cands[0]);
    }

    // 2) 主肌群补到 2~3 个
    const primaryCap = minutes >= 40 ? 3 : 2;
    let guard = 0;
    while (picks.length < n && guard++ < 40) {
      const counts = countG();
      const cand = ordered.find(e =>
        !picks.includes(e) && f.primary.includes(e.g) && (counts[e.g] || 0) < primaryCap);
      if (!cand) break;
      picks.push(cand);
    }

    // 3) 辅助肌群补满
    guard = 0;
    while (picks.length < n && guard++ < 40) {
      const counts = countG();
      const cand = ordered.find(e =>
        !picks.includes(e) && f.secondary.includes(e.g) && (counts[e.g] || 0) < 2);
      if (!cand) break;
      picks.push(cand);
    }

    // 4) 还不够就随便补（器械选得太少时会走到这里）
    guard = 0;
    while (picks.length < n && guard++ < 40) {
      const cand = ordered.find(e => !picks.includes(e));
      if (!cand) break;
      picks.push(cand);
    }

    // 5) 复合动作排前面，重的先做
    picks.sort((a, b) => (b.compound ? 1 : 0) - (a.compound ? 1 : 0) || b.sets - a.sets);

    const restCap = minutes <= 20 ? 60 : minutes <= 40 ? 90 : 999;

    const plan = picks.slice(0, n).map(e => {
      let sets = e.sets;
      if (minutes <= 20) sets = Math.min(sets, 3);
      return {
        exId: e.id,
        name: e.name,
        g: e.g,
        gear: e.gear,
        sets,
        reps: e.reps,
        unit: e.unit,
        rest: Math.min(e.rest, restCap)
      };
    });

    const est = estimate(plan);
    return { focus, minutes, plan, est };
  }

  function estimate(plan) {
    const work = plan.reduce((sum, p) => sum + p.sets * (40 + p.rest), 0);
    return Math.round(6 + work / 60);
  }

  /* ----------------------------- 路由 ----------------------------- */

  const TABS = ['today', 'records', 'me'];
  let currentView = 'today';
  let skipHash = false;

  function go(view, { replace = false } = {}) {
    if (!['today', 'plan', 'workout', 'done', 'records', 'me'].includes(view)) view = 'today';
    currentView = view;

    for (const v of ['today', 'plan', 'workout', 'done', 'records', 'me']) {
      $('#view-' + v).hidden = v !== view;
    }

    const isTab = TABS.includes(view);
    $('.app').classList.toggle('sub', !isTab);
    $$('.tabbar button').forEach(b => {
      if (b.dataset.tab === view) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    const target = '#/' + view;
    if (!replace && location.hash !== target) {
      skipHash = true;
      location.hash = target;
    }

    document.scrollingElement.scrollTop = 0;
    render(view);
  }

  window.addEventListener('hashchange', () => {
    if (skipHash) { skipHash = false; return; }
    const view = (location.hash || '').replace(/^#\/?/, '') || 'today';
    if (view !== currentView) go(view, { replace: true });
  });

  function render(view) {
    if (view === 'today') renderToday();
    else if (view === 'plan') renderPlan();
    else if (view === 'workout') renderWorkout();
    else if (view === 'done') renderDone();
    else if (view === 'records') renderRecords();
    else if (view === 'me') renderMe();
  }

  /* ----------------------------- 今日 ----------------------------- */

  function renderToday() {
    $('#today-date').textContent = fmtDate(iso());

    const streak = calcStreak();
    $('#today-streak').lastElementChild.textContent = streak > 0 ? `连续 ${streak} 天` : '今天还没练';
    $('#today-streak').style.opacity = streak > 0 ? '1' : '.7';

    // 上次练什么，今天该轮到什么
    const last = S.sessions[S.sessions.length - 1];
    if (!last) {
      $('#today-lead').textContent = '第一次来？随便选一个，先练起来。';
    } else {
      const next = FOCUS[last.focus] ? FOCUS[last.focus].next : 'push';
      $('#today-lead').textContent = `上次练${FOCUS[last.focus] ? FOCUS[last.focus].label : '训练'}，${relDay(last.date)}。今天轮到${FOCUS[next].label}。`;
    }

    // 续练
    const card = $('#resume-card');
    if (S.draft) {
      const d = S.draft;
      const p = d.plan[d.i];
      card.hidden = false;
      card.classList.remove('hidden');
      $('#resume-sub').textContent = `${FOCUS[d.focus].label} · ${d.log.length} 组 / ${d.plan.reduce((a, x) => a + x.sets, 0)} 组，还卡在「${p ? p.name : '最后一个'}」`;
    } else {
      card.hidden = true;
      card.classList.add('hidden');
    }

    // chips
    $('#chips-focus').innerHTML = Object.entries(FOCUS)
      .map(([k, f]) => `<button class="chip" type="button" data-focus="${k}" aria-pressed="${S.prefs.focus === k}">${f.label}</button>`)
      .join('');

    $('#chips-time').innerHTML = TIMES
      .map(t => `<button class="chip" type="button" data-minutes="${t}" aria-pressed="${S.prefs.minutes === t}">${t} 分钟</button>`)
      .join('');

    $('#chips-gear').innerHTML = GEARS
      .map(g => `<button class="chip" type="button" data-gear="${g.id}" aria-pressed="${S.prefs.gear.includes(g.id)}">${g.label}</button>`)
      .join('');

    // 本周概览
    const week = weekSessions();
    const vol = week.reduce((a, s) => a + s.volume, 0);
    const sets = week.reduce((a, s) => a + s.sets.length, 0);
    $('#today-stats').innerHTML = `
      <div><b class="num">${week.length}</b><span>本周训练</span></div>
      <div><b class="num">${vol >= 1000 ? (vol / 1000).toFixed(1) + '<small>t</small>' : Math.round(vol) + '<small> kg</small>'}</b><span>总容量</span></div>
      <div><b class="num">${sets}</b><span>完成组数</span></div>`;
  }

  function calcStreak() {
    const days = new Set(S.sessions.map(s => s.date));
    if (!days.size) return 0;
    const today = iso();
    let cursor = today;
    if (!days.has(cursor)) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      cursor = iso(y);
      if (!days.has(cursor)) return 0;
    }
    let n = 0;
    while (days.has(cursor)) {
      n++;
      const d = fromISO(cursor);
      d.setDate(d.getDate() - 1);
      cursor = iso(d);
    }
    return n;
  }

  function weekSessions() {
    const start = startOfWeek(new Date());
    return S.sessions.filter(s => fromISO(s.date) >= start);
  }

  function startOfWeek(date) {
    const d = new Date(date);
    const off = (d.getDay() + 6) % 7; // 周一为一周开始
    d.setDate(d.getDate() - off);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /* ----------------------------- 计划 ----------------------------- */

  function renderPlan() {
    const p = S.pending;
    if (!p) { go('today'); return; }

    $('#plan-focus').textContent = FOCUS[p.focus].label;
    const totalSets = p.plan.reduce((a, x) => a + x.sets, 0);
    $('#plan-title').textContent = `${p.plan.length} 个动作，刚好 ${p.est} 分钟`;

    const muscles = [...new Set(p.plan.map(x => x.g))].map(g => GROUPS[g]).join(' + ');
    $('#plan-tags').innerHTML = `
      <span class="tag accent">约 ${p.est} 分钟</span>
      <span class="tag">${totalSets} 组</span>
      <span class="tag">${muscles}</span>`;

    $('#plan-list').innerHTML = p.plan.map((x, i) => `
      <div class="ex-card">
        <span class="ex-idx">${pad(i + 1)}</span>
        <div class="ex-body">
          <div class="ex-name">${x.name}</div>
          <div class="ex-meta">
            <span>${x.sets} 组 × ${x.reps} ${x.unit}</span>
            <span class="sep">·</span>
            <span>休息 ${x.rest}s</span>
            <span class="sep">·</span>
            <span>${gearLabel(x.gear)}</span>
          </div>
          <p class="ex-tip">${EX_BY_ID[x.exId] ? EX_BY_ID[x.exId].tip : ''}</p>
        </div>
      </div>`).join('');

    $('#dock-time').textContent = p.est;
  }

  const gearLabel = id => (GEARS.find(g => g.id === id) || { label: '' }).label;

  /* ----------------------------- 训练 ----------------------------- */

  function defaultLoad(ex) {
    if (ex.gear === 'barbell') return 20;
    if (ex.gear === 'dumbbell') return 10;
    if (ex.gear === 'machine') return 20;
    return 0;
  }

  function renderWorkout() {
    const d = S.draft;
    if (!d) { go('today'); return; }

    const p = d.plan[d.i];
    if (!p) { finish(); return; }

    const doneHere = d.log.filter(l => l.pi === d.i).length;
    const totalDone = d.log.length;

    $('#wk-count').textContent = `${d.i + 1} / ${d.plan.length}`;
    $('#wk-seg').innerHTML = d.plan
      .map((x, i) => `<i class="${i < d.i ? 'on' : ''}"></i>`).join('');

    $('#wk-kicker').textContent = `第 ${d.i + 1} 个动作 · ${GROUPS[p.g]}`;
    $('#wk-name').textContent = p.name;

    $('#wk-tags').innerHTML = `
      <span class="tag">${gearLabel(p.gear)}</span>
      <span class="tag accent">${p.sets} 组 × ${p.reps} ${p.unit}</span>
      <span class="tag">休息 ${p.rest}s</span>`;

    $('#wk-pips').innerHTML = Array.from({ length: p.sets }, (_, i) => {
      const cls = i < doneHere ? 'done' : i === doneHere ? 'now' : '';
      return `<i class="${cls}"></i>`;
    }).join('');

    $('#wk-wlabel').textContent = p.gear === 'bodyweight' ? '负重 KG' : '重量 KG';
    $('#wk-rlabel').textContent = p.unit === '秒' ? '秒数' : '次数';

    const prev = lastSetOf(p.exId);
    const draftPrev = [...d.log].reverse().find(l => l.exId === p.exId);
    const w = draftPrev ? draftPrev.w : prev ? prev.w : defaultLoad(p);
    const r = draftPrev ? draftPrev.r : p.reps;

    if (document.activeElement !== $('#wk-w')) $('#wk-w').value = w;
    if (document.activeElement !== $('#wk-r')) $('#wk-r').value = r;

    $('#wk-last').textContent = prev
      ? `上次 ${prev.w ? prev.w + ' kg' : '自重'} × ${prev.r}${p.unit === '秒' ? ' 秒' : ' 次'}，${relDay(prev.date)}`
      : '第一次练这个动作，保守一点';

    const ex = EX_BY_ID[p.exId];
    $('#wk-tip').textContent = ex ? ex.tip : '控制离心，别甩重量。';

    $('#btn-set').textContent = doneHere + 1 >= p.sets
      ? (d.i + 1 >= d.plan.length ? '练完了' : '这组做完，换动作')
      : '完成这组';

    if (totalDone === 0) $('#wk-count').textContent = `1 / ${d.plan.length}`;
  }

  function createDraft(p) {
    return {
      id: 'w' + Date.now(),
      startedAt: Date.now(),
      focus: p.focus,
      minutes: p.minutes,
      plan: p.plan,
      i: 0,
      log: [],
      rest: null
    };
  }

  function startWorkout() {
    const p = S.pending;
    if (!p || !p.plan.length) { toast('先生成计划'); return; }
    S.draft = createDraft(p);
    S.pending = null;
    save();
    go('workout');
  }

  function completeSet() {
    const d = S.draft;
    if (!d) return;
    const p = d.plan[d.i];

    const w = Math.max(0, Number($('#wk-w').value) || 0);
    const r = Math.max(1, Math.round(Number($('#wk-r').value) || p.reps));

    d.log.push({ pi: d.i, exId: p.exId, name: p.name, g: p.g, w, r, unit: p.unit });

    const doneHere = d.log.filter(l => l.pi === d.i).length;

    if (doneHere >= p.sets) {
      if (d.i + 1 >= d.plan.length) {
        save();
        finish();
        return;
      }
      d.i += 1;
      save();
      renderWorkout();
      startRest(d.plan[d.i].rest);
    } else {
      save();
      renderWorkout();
      startRest(p.rest);
    }

    buzz(14);
  }

  /* ----------------------------- 休息 ----------------------------- */

  const RING_C = 2 * Math.PI * 106;
  let tickId = null;

  function startRest(seconds) {
    if (!S.draft) return;
    S.draft.rest = { endAt: Date.now() + seconds * 1000, total: seconds };
    save();
    showRest();
    if (!tickId) tickId = setInterval(tick, 200);
  }

  function showRest() {
    const r = S.draft && S.draft.rest;
    if (!r) return;
    const left = Math.max(0, (r.endAt - Date.now()) / 1000);
    paintRest(left, r.total);

    const p = S.draft.plan[S.draft.i];
    const doneHere = S.draft.log.filter(l => l.pi === S.draft.i).length;
    let nextText = '收工';
    if (p && doneHere > 0 && doneHere < p.sets) {
      nextText = `接着第 ${doneHere + 1} 组 · ${p.name}`;
    } else if (p) {
      nextText = `下一个：${p.name} · ${p.sets} 组`;
    }
    $('#rest-next').textContent = nextText;

    $('#rest').hidden = false;
    document.body.style.overflow = 'hidden';
    chimePrime();
  }

  function paintRest(leftSec, total) {
    const left = Math.max(0, Math.ceil(leftSec));
    $('#rest-time').textContent = left;
    const progress = total > 0 ? Math.min(1, left / total) : 0;
    $('#ring-fg').setAttribute('stroke-dashoffset', String(RING_C * (1 - progress)));
  }

  function tick() {
    const r = S.draft && S.draft.rest;
    if (!r) { stopTick(); return; }
    const left = (r.endAt - Date.now()) / 1000;
    if (left <= 0) {
      endRest(true);
      return;
    }
    paintRest(left, r.total);
  }

  function stopTick() {
    if (tickId) { clearInterval(tickId); tickId = null; }
  }

  function endRest(chimeOn) {
    stopTick();
    if (S.draft) {
      S.draft.rest = null;
      save();
    }
    $('#rest').hidden = true;
    document.body.style.overflow = '';
    if (chimeOn) { chime(); buzz(200); }
  }

  /** 用户第一次点击时把 AudioContext 解锁，休息结束才响得出来 */
  function chimePrime() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch { /* ignore */ }
  }

  /* ----------------------------- 完成 ----------------------------- */

  function finish() {
    const d = S.draft;
    if (!d) { go('today'); return; }

    const bodyweight = Number(S.profile.weight) || 65;
    let volume = 0;
    for (const l of d.log) {
      const ex = EX_BY_ID[l.exId];
      if (!ex || ex.unit === '秒') continue;
      const load = ex.gear === 'bodyweight' ? bodyweight * 0.65 : 0;
      volume += (load + l.w) * l.r;
    }

    const session = {
      id: d.id,
      date: iso(new Date(d.startedAt)),
      startedAt: d.startedAt,
      endedAt: Date.now(),
      focus: d.focus,
      minutes: Math.max(1, Math.round((Date.now() - d.startedAt) / 60000)),
      planCount: d.plan.length,
      sets: d.log,
      volume
    };

    S.sessions.push(session);
    S.lastSessionId = session.id;
    S.draft = null;
    stopTick();
    $('#rest').hidden = true;
    save();

    go('done');
  }

  function renderDone() {
    const s = S.sessions.find(x => x.id === S.lastSessionId) || S.sessions[S.sessions.length - 1];
    if (!s) { go('today'); return; }

    const muscles = [...new Set(s.sets.map(x => x.g))].map(g => GROUPS[g]).join(' · ') || '—';
    const planCount = s.planCount || new Set(s.sets.map(x => x.exId)).size;
    $('#done-sub').textContent = `${muscles} · ${s.sets.length} 组 · ${planCount} 个动作`;

    $('#done-grid').innerHTML = `
      <div><b class="num">${(s.volume / 1000).toFixed(1)}<small>t</small></b><span>总容量</span></div>
      <div><b class="num">${s.sets.length}</b><span>完成组数</span></div>
      <div><b class="num">${s.minutes}</b><span>用时（分钟）</span></div>
      <div><b class="num">${calcStreak()}</b><span>连续天数</span></div>`;

    $('#done-bars').innerHTML = groupBars(s.sets);
  }

  function groupBars(sets) {
    const vol = {};
    for (const x of sets) {
      const ex = EX_BY_ID[x.exId];
      if (ex && ex.unit === '秒') continue;
      const bodyweight = Number(S.profile.weight) || 65;
      const load = ex && ex.gear === 'bodyweight' ? bodyweight * 0.65 : 0;
      vol[x.g] = (vol[x.g] || 0) + (load + x.w) * x.r;
    }
    const rows = Object.entries(vol).sort((a, b) => b[1] - a[1]);
    if (!rows.length) return '<p class="empty">这次没记录带重量的组</p>';
    const max = rows[0][1];
    return rows.map(([g, v]) => `
      <div class="bar-row">
        <span>${GROUPS[g] || g}</span>
        <span class="track"><span class="fill" style="width:${Math.max(6, (v / max) * 100)}%"></span></span>
        <span class="v">${fmtVol(v)}</span>
      </div>`).join('');
  }

  function shareCard() {
    const s = S.sessions.find(x => x.id === S.lastSessionId);
    if (!s) return;
    const d = fromISO(s.date);
    const lines = [
      `练了吗 · ${d.getMonth() + 1} 月 ${d.getDate()} 日`,
      `${FOCUS[s.focus] ? FOCUS[s.focus].label : ''} · ${s.planCount || new Set(s.sets.map(x => x.exId)).size} 个动作 · ${s.minutes} 分钟`,
      `总容量 ${(s.volume / 1000).toFixed(1)}t · ${s.sets.length} 组`,
      '',
      ...[...new Set(s.sets.map(x => x.name))].map(n => {
        const sets = s.sets.filter(x => x.name === n);
        return `${n} ${sets.length}×${sets[0].r}${sets[0].unit === '秒' ? '秒' : ''}`;
      })
    ];
    const text = lines.join('\n');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toast('训练卡复制好了'), () => toast('复制失败'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('训练卡复制好了'); }
      catch { toast('复制失败'); }
      ta.remove();
    }
  }

  /* ----------------------------- 记录 ----------------------------- */

  function renderRecords() {
    // 本周日历
    const start = startOfWeek(new Date());
    const trained = new Set(S.sessions.map(s => s.date));
    const todayStr = iso();

    $('#rec-week').innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = iso(d);
      const cls = ['day', trained.has(key) ? 'trained' : '', key === todayStr ? 'today' : ''].join(' ');
      return `<div class="${cls}">
        <span class="d">${WEEK[d.getDay()]}</span>
        <span class="n num">${d.getDate()}</span>
        <span class="dot"></span>
      </div>`;
    }).join('');

    // 本月统计
    const now = new Date();
    const monthSessions = S.sessions.filter(s => {
      const d = fromISO(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalMin = monthSessions.reduce((a, s) => a + s.minutes, 0);
    $('#rec-stats').innerHTML = `
      <div><b class="num">${monthSessions.length}</b><span>本月训练</span></div>
      <div><b class="num">${(totalMin / 60).toFixed(1)}<small>h</small></b><span>总时长</span></div>
      <div><b class="num">${monthSessions.length ? Math.round(totalMin / monthSessions.length) : 0}</b><span>平均分钟</span></div>`;

    // 最近 7 天的部位
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    const recentSets = S.sessions
      .filter(s => fromISO(s.date) >= weekAgo)
      .flatMap(s => s.sets);

    const perGroup = {};
    for (const x of recentSets) perGroup[x.g] = (perGroup[x.g] || 0) + 1;
    const rows = Object.entries(perGroup).sort((a, b) => b[1] - a[1]);
    $('#rec-bars').innerHTML = rows.length
      ? rows.map(([g, n]) => {
        const max = rows[0][1];
        return `<div class="bar-row">
          <span>${GROUPS[g] || g}</span>
          <span class="track"><span class="fill" style="width:${Math.max(6, (n / max) * 100)}%"></span></span>
          <span class="v">${n}</span>
        </div>`;
      }).join('')
      : '<p class="empty">这周还没练</p>';

    // 历史
    const list = S.sessions.slice().reverse().slice(0, 12);
    $('#rec-list').innerHTML = list.length
      ? list.map(s => {
        const names = [...new Set(s.sets.map(x => x.name))].slice(0, 3).join(' · ');
        return `<div class="log-row">
          <span class="when">${relDay(s.date)}</span>
          <div class="what">
            <b>${FOCUS[s.focus] ? FOCUS[s.focus].label : '训练'}</b>
            <span>${names || '没有记录动作'}</span>
          </div>
          <span class="vol">${fmtVol(s.volume)}</span>
        </div>`;
      }).join('')
      : '<p class="empty">还没有记录。练完一次就出现在这里。</p>';
  }

  /* ----------------------------- 我的 ----------------------------- */

  function renderMe() {
    const p = S.profile;
    $('#me-avatar').textContent = (p.name || '我').slice(0, 1);
    $('#me-name').textContent = p.name;

    const latest = S.weights[S.weights.length - 1];
    const kg = latest ? latest.kg : p.weight;
    $('#me-sub').textContent = `${kg} kg · ${p.height} cm · 目标 ${p.goal}`;

    $('#me-weight').textContent = kg;
    $('#me-delta').textContent = weightDeltaText();
    $('#me-delta').className = 'delta' + (weightDeltaText().startsWith('—') ? ' flat' : '');

    $('#me-spark').innerHTML = sparkline(S.weights.slice(-24));

    $('#me-rows').innerHTML = `
      <button class="me-row" data-set="goal">
        <span>训练目标</span>
        <span class="v">${p.goal}<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
      </button>
      <button class="me-row" data-set="height">
        <span>身高</span>
        <span class="v">${p.height} cm<svg viewBox="0 0 24 24" width="16" height="16"><path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
      </button>
      <div class="me-row">
        <span>累计训练</span>
        <span class="v">${S.sessions.length} 次</span>
      </div>
      <div class="me-row">
        <span>体重记录</span>
        <span class="v">${S.weights.length} 条</span>
      </div>`;
  }

  function weightDeltaText() {
    if (!S.weights.length) return '还没有记录';
    if (S.weights.length === 1) return '再记几次就能看趋势';
    const last = S.weights[S.weights.length - 1];
    const first = S.weights[0];
    const diff = +(last.kg - first.kg).toFixed(1);
    if (Math.abs(diff) < 0.05) return '和第一次记录一样重';
    return `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)} kg / 共 ${S.weights.length} 次`;
  }

  function sparkline(list) {
    if (list.length < 2) {
      return '<p class="empty" style="padding:10px 0 0">再记两次就有曲线了</p>';
    }
    const W = 300, H = 56, P = 6;
    const vals = list.map(x => x.kg);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = Math.max(max - min, 0.8);
    const pts = list.map((x, i) => {
      const px = P + (i * (W - P * 2)) / (list.length - 1);
      const py = H - P - ((x.kg - min) / span) * (H - P * 2);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    });
    const lastPt = pts[pts.length - 1].split(',');
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${pts.join(' ')}" fill="none" stroke="var(--lime)" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
      <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="3" fill="var(--lime)"/>
    </svg>`;
  }

  /* ----------------------------- 弹层 ----------------------------- */

  function askNumber(title, unit, value, opts = {}) {
    return new Promise(resolve => {
      const dlg = $('#ask');
      const input = $('#ask-input');
      $('#ask-title').textContent = title;
      $('#ask-unit').textContent = unit;
      input.value = value;
      input.step = opts.step || 1;
      input.min = opts.min != null ? opts.min : 0;

      const onClose = () => {
        dlg.removeEventListener('close', onClose);
        if (dlg.returnValue === 'ok') {
          const v = Number(input.value);
          resolve(Number.isFinite(v) && v > 0 ? v : null);
        } else {
          resolve(null);
        }
      };

      dlg.addEventListener('close', onClose);
      dlg.returnValue = '';
      dlg.showModal();
      setTimeout(() => { input.focus(); input.select(); }, 30);
    });
  }

  /* ----------------------------- 数据 ----------------------------- */

  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lianlema-${iso()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('已导出');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || !Array.isArray(data.sessions)) throw new Error('bad');
        S = Object.assign(defaults(), data);
        save();
        render(currentView);
        toast(`导入 ${S.sessions.length} 次训练`);
      } catch {
        toast('文件不对，导入失败');
      }
    };
    reader.readAsText(file);
  }

  /* ----------------------------- 事件 ----------------------------- */

  document.addEventListener('click', async e => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) {
      go(goBtn.dataset.go);
      return;
    }

    const focusBtn = e.target.closest('[data-focus]');
    if (focusBtn) {
      S.prefs.focus = focusBtn.dataset.focus;
      save();
      renderToday();
      return;
    }

    const timeBtn = e.target.closest('[data-minutes]');
    if (timeBtn) {
      S.prefs.minutes = Number(timeBtn.dataset.minutes);
      save();
      renderToday();
      return;
    }

    const gearBtn = e.target.closest('[data-gear]');
    if (gearBtn) {
      const id = gearBtn.dataset.gear;
      const on = S.prefs.gear.includes(id);
      if (on && S.prefs.gear.length === 1) { toast('至少留一个'); return; }
      S.prefs.gear = on ? S.prefs.gear.filter(x => x !== id) : [...S.prefs.gear, id];
      save();
      renderToday();
      return;
    }

    const stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      const which = stepBtn.dataset.step;
      const dir = Number(stepBtn.dataset.dir);
      const input = which === 'w' ? $('#wk-w') : $('#wk-r');
      const step = which === 'w' ? 2.5 : 1;
      const min = which === 'w' ? 0 : 1;
      input.value = Math.max(min, (Number(input.value) || 0) + dir * step);
      return;
    }

    const setBtn = e.target.closest('[data-set]');
    if (setBtn) {
      const key = setBtn.dataset.set;
      if (key === 'goal') {
        const i = GOALS.indexOf(S.profile.goal);
        S.profile.goal = GOALS[(i + 1) % GOALS.length];
        save();
        renderMe();
        toast('目标：' + S.profile.goal);
      } else if (key === 'height') {
        const v = await askNumber('身高', 'cm', S.profile.height, { step: 1, min: 100 });
        if (v) { S.profile.height = Math.round(v); save(); renderMe(); }
      }
      return;
    }
  });

  $('#btn-generate').addEventListener('click', () => {
    S.pending = buildPlan();
    save();
    go('plan');
  });

  $('#btn-resume').addEventListener('click', () => go('workout'));

  $('#btn-shuffle').addEventListener('click', () => {
    S.pending = buildPlan();
    save();
    renderPlan();
    toast('换了一套');
  });

  $('#btn-start').addEventListener('click', startWorkout);

  $('#btn-set').addEventListener('click', completeSet);

  $('#btn-quit').addEventListener('click', () => {
    if (!S.draft) { go('today'); return; }
    const any = S.draft.log.length > 0;
    if (any && !confirm('结束这次训练？已经做完的组会保存。')) return;
    if (any) finish();
    else {
      S.draft = null;
      stopTick();
      $('#rest').hidden = true;
      save();
      go('today');
    }
  });

  $('#btn-skip').addEventListener('click', () => endRest(false));
  $('#btn-add30').addEventListener('click', () => {
    if (!S.draft || !S.draft.rest) return;
    S.draft.rest.endAt += 30000;
    S.draft.rest.total += 30;
    save();
    paintRest((S.draft.rest.endAt - Date.now()) / 1000, S.draft.rest.total);
  });

  $('#btn-share').addEventListener('click', shareCard);

  $('#ask-cancel').addEventListener('click', () => $('#ask').close('cancel'));

  $('#btn-weigh').addEventListener('click', async () => {
    const latest = S.weights[S.weights.length - 1];
    const v = await askNumber('今天的体重', 'kg', latest ? latest.kg : S.profile.weight, { step: 0.1, min: 20 });
    if (!v) return;
    const today = iso();
    const idx = S.weights.findIndex(w => w.date === today);
    const entry = { date: today, kg: +v.toFixed(1) };
    if (idx >= 0) S.weights[idx] = entry;
    else S.weights.push(entry);
    S.weights.sort((a, b) => (a.date < b.date ? -1 : 1));
    S.profile.weight = entry.kg;
    save();
    renderMe();
    toast('记下了 ' + entry.kg + ' kg');
  });

  $('#btn-export').addEventListener('click', exportData);
  $('#btn-import').addEventListener('click', () => $('#file-import').click());
  $('#file-import').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (f) importData(f);
    e.target.value = '';
  });

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('清空所有训练和体重记录？这个操作不能撤销。')) return;
    S = defaults();
    save();
    render(currentView);
    toast('已清空');
  });

  /* 手动输入后同步校验 */
  $('#wk-w').addEventListener('blur', e => {
    e.target.value = Math.max(0, Number(e.target.value) || 0);
  });
  $('#wk-r').addEventListener('blur', e => {
    e.target.value = Math.max(1, Math.round(Number(e.target.value) || 1));
  });

  /* 回到前台时，如果休息应该已经结束了，补上 */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    const r = S.draft && S.draft.rest;
    if (r && Date.now() >= r.endAt) endRest(true);
  });

  /* ----------------------------- 启动 ----------------------------- */

  /* 用 ?demo=1 看一眼「有数据时长什么样」，只在本次打开有效，不会写进存储 */
  function seedDemo() {
    const demo = new URLSearchParams(location.search).get('demo');
    if (!demo) return;

    const first = !S.sessions.length;

    if (first) {
      [0, 2, 4, 6, 8, 11].forEach((off, idx) => {
        const focus = ['push', 'pull', 'legs', 'full'][idx % 4];
        const f = FOCUS[focus];
        const pool = EX.filter(e => f.primary.includes(e.g) || f.secondary.includes(e.g));
        const picks = shuffle(pool).slice(0, 4);
        const sets = [];
        picks.forEach(e => {
          const n = 3 + (idx % 2);
          for (let k = 0; k < n; k++) {
            sets.push({
              pi: 0, exId: e.id, name: e.name, g: e.g,
              w: e.gear === 'bodyweight' ? 0 : 20 + idx * 2.5,
              r: e.reps, unit: e.unit
            });
          }
        });
        const date = new Date();
        date.setDate(date.getDate() - off);
        const volume = sets.reduce((a, x) => {
          const ex = EX_BY_ID[x.exId];
          return a + ((ex.gear === 'bodyweight' ? 42 : 0) + x.w) * x.r;
        }, 0);
        S.sessions.push({
          id: 'demo' + idx,
          date: iso(date),
          startedAt: date.getTime() - 45 * 60000,
          endedAt: date.getTime(),
          focus,
          minutes: 40 + idx * 3,
          planCount: picks.length,
          sets,
          volume
        });
      });

      S.sessions.sort((a, b) => (a.date < b.date ? -1 : 1));

      S.weights = [62.4, 62.9, 62.6, 62.8, 62.3, 62.1].map((kg, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (30 - i * 6));
        return { date: iso(d), kg };
      });
      S.profile.weight = 62.1;
      S.profile.name = '姚同学';
      S.prefs.focus = 'push';
    }

    S.lastSessionId = S.sessions[S.sessions.length - 1].id;
    if (demo !== 'workout' && demo !== 'rest') S.draft = null;
    if (!S.pending && !S.draft) S.pending = buildPlan();
    if ((demo === 'workout' || demo === 'rest') && !S.draft) {
      S.draft = createDraft(S.pending);
      S.draft.log.push({ pi: 0, exId: S.draft.plan[0].exId, name: S.draft.plan[0].name, g: S.draft.plan[0].g, w: 40, r: 8, unit: '次' });
      S.pending = null;
    }
    if (demo === 'rest' && !S.draft.rest) setTimeout(() => startRest(75), 60);
  }

  function boot() {
    seedDemo();
    const hashView = (location.hash || '').replace(/^#\/?/, '');
    let view = ['today', 'plan', 'workout', 'done', 'records', 'me'].includes(hashView) ? hashView : 'today';

    // 有没做完的训练，优先回去继续
    if (S.draft && (view === 'workout' || view === 'today')) {
      // 停在今天是故意的：让人自己决定继不继续
    }
    if (view === 'workout' && !S.draft) view = 'today';
    if (view === 'plan' && !S.pending) view = 'today';
    if (!S.lastSessionId && view === 'done') view = 'today';

    go(view, { replace: true });

    // 休息计时如果还在跑，恢复它
    if (S.draft && S.draft.rest) {
      if (Date.now() < S.draft.rest.endAt) {
        showRest();
        if (!tickId) tickId = setInterval(tick, 200);
      } else {
        S.draft.rest = null;
        save();
      }
    }
  }

  boot();
})();

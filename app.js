// ============================================================
// ACT MATH PREP — Main App
// ============================================================

// ---- STATE ----
let progress = loadProgress();
let currentQ = null;
let sessionCorrect = 0;
let sessionTotal = 0;
let questionNumber = 0;
let answered = false;
let reviewMode = null;      // "problem-areas" | "easy-wins" | "all"
let topicFilter = null;
let skillFilter = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let progressChartMode = "count"; // "count" | "percent"
let progressChartTopic = null;   // null = all, topicId = specific

// ---- ROUTING ----
const PAGES = ["home", "progress", "review-mode", "practice", "topic-detail"];

function showPage(id) {
  PAGES.forEach(p => document.getElementById("page-" + p)?.classList.remove("active"));
  document.getElementById("page-" + id)?.classList.add("active");
}

// ---- HOME ----
function goHome() {
  stopTimer();
  topicFilter = null;
  skillFilter = null;
  reviewMode = null;
  showPage("home");
}

// ---- PROGRESS PAGE ----
function showProgress() {
  showPage("progress");
  renderProgressPage();
}

function renderProgressPage() {
  const all = getAllTimeStats(progress);
  document.getElementById("stat-total").textContent = all.total;
  document.getElementById("stat-correct").textContent = all.correct;
  document.getElementById("stat-pct").textContent = all.pct + "%";

  drawProgressChart();
  renderTopicBreakdown();
}

function drawProgressChart() {
  const canvas = document.getElementById("progress-chart");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
  canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  ctx.clearRect(0, 0, W, H);

  let sessions = [...progress.sessions].sort((a,b) => a.date.localeCompare(b.date));
  
  if (progressChartTopic) {
    sessions = sessions.filter(s => s.topicBreakdown && s.topicBreakdown[progressChartTopic]);
  }

  if (sessions.length === 0) {
    ctx.fillStyle = "#7A7570";
    ctx.font = "14px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data yet — start practicing!", W/2, H/2);
    return;
  }

  const pad = { top: 20, right: 20, bottom: 44, left: 44 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const vals = sessions.map(s => {
    if (progressChartTopic) {
      const tb = s.topicBreakdown[progressChartTopic];
      return progressChartMode === "count" ? tb.correct : (tb.total > 0 ? Math.round(tb.correct/tb.total*100) : 0);
    }
    return progressChartMode === "count" ? s.correct : (s.total > 0 ? Math.round(s.correct/s.total*100) : 0);
  });

  const maxVal = Math.max(...vals, progressChartMode === "percent" ? 100 : 10);
  
  // Grid lines
  ctx.strokeStyle = "#EDEAE3";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + cH - (i / 4) * cH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
    ctx.fillStyle = "#7A7570";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal * i / 4) + (progressChartMode === "percent" ? "%" : ""), pad.left - 6, y + 4);
  }

  // X axis labels
  sessions.forEach((s, i) => {
    const x = pad.left + (sessions.length === 1 ? cW/2 : (i / (sessions.length - 1)) * cW);
    const label = s.date.slice(5); // MM-DD
    ctx.fillStyle = "#7A7570";
    ctx.font = "10px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x, H - pad.bottom + 16);
  });

  // Line
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad.left + (sessions.length === 1 ? cW/2 : (i / (sessions.length - 1)) * cW);
    const y = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#C84B31";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.stroke();

  // Fill under
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad.left + (sessions.length === 1 ? cW/2 : (i / (sessions.length - 1)) * cW);
    const y = pad.top + cH - (v / maxVal) * cH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + cW, pad.top + cH);
  ctx.lineTo(pad.left, pad.top + cH);
  ctx.closePath();
  ctx.fillStyle = "rgba(200,75,49,0.08)";
  ctx.fill();

  // Dots
  vals.forEach((v, i) => {
    const x = pad.left + (sessions.length === 1 ? cW/2 : (i / (sessions.length - 1)) * cW);
    const y = pad.top + cH - (v / maxVal) * cH;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#C84B31";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Value label
    ctx.fillStyle = "#1A1814";
    ctx.font = "bold 11px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(v + (progressChartMode === "percent" ? "%" : ""), x, y - 10);
  });
}

function renderTopicBreakdown() {
  const container = document.getElementById("topic-breakdown-list");
  container.innerHTML = "";

  const topicIds = Object.keys(TOPICS);
  topicIds.forEach(topicId => {
    const topic = TOPICS[topicId];
    const s = progress.topicStats[topicId] || { correct: 0, total: 0 };
    const pct = s.total > 0 ? Math.round(s.correct / s.total * 100) : null;
    const pctFill = pct !== null ? pct : 0;

    const row = document.createElement("div");
    row.className = "topic-row";
    row.innerHTML = `
      <div>
        <div class="topic-row-name">${topic.label}</div>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill ${pctFill < 50 ? 'low' : pctFill < 75 ? 'mid' : ''}" style="width:${pctFill}%"></div>
      </div>
      <div class="topic-row-stats">
        ${s.total > 0 ? `${s.correct}/${s.total}<br><span style="font-size:0.78rem">${pct}%</span>` : '<span style="color:#bbb">No data</span>'}
      </div>
    `;
    row.onclick = () => showTopicDetail(topicId);
    container.appendChild(row);
  });
}

function showTopicDetail(topicId) {
  progressChartTopic = topicId;
  const topic = TOPICS[topicId];
  document.getElementById("topic-detail-title").textContent = topic.label;
  showPage("topic-detail");
  renderTopicDetail(topicId);
}

function renderTopicDetail(topicId) {
  const topic = TOPICS[topicId];
  const s = progress.topicStats[topicId] || { correct: 0, total: 0, skillStats: {} };
  
  document.getElementById("topic-detail-overall").textContent =
    s.total > 0 ? `${s.correct}/${s.total} (${Math.round(s.correct/s.total*100)}%)` : "No attempts yet";

  // Skill breakdown
  const skillList = document.getElementById("topic-skill-list");
  skillList.innerHTML = "";
  topic.skills.forEach(skill => {
    const ss = (s.skillStats || {})[skill] || { correct: 0, total: 0 };
    const div = document.createElement("div");
    div.className = "topic-row";
    div.style.cursor = "default";
    div.innerHTML = `
      <div style="font-size:0.88rem">${skill}</div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill ${ss.total > 0 && ss.correct/ss.total < 0.5 ? 'low' : ss.total > 0 && ss.correct/ss.total < 0.75 ? 'mid' : ''}" style="width:${ss.total > 0 ? Math.round(ss.correct/ss.total*100) : 0}%"></div>
      </div>
      <div class="topic-row-stats" style="font-size:0.82rem">
        ${ss.total > 0 ? `${ss.correct}/${ss.total}` : '—'}
      </div>
    `;
    skillList.appendChild(div);
  });

  // Draw chart for this topic
  setTimeout(() => {
    drawTopicChart(topicId);
  }, 50);
}

// ---- REVIEW MODE ----
function showReviewMode() {
  showPage("review-mode");
  renderReviewTopicChips();
}

function renderReviewTopicChips() {
  const container = document.getElementById("review-topic-chips");
  container.innerHTML = "";
  const all = document.createElement("span");
  all.className = "topic-chip active";
  all.textContent = "All Topics";
  all.dataset.topic = "";
  all.onclick = () => selectTopicChip(all, "");
  container.appendChild(all);

  Object.entries(TOPICS).forEach(([id, t]) => {
    const chip = document.createElement("span");
    chip.className = "topic-chip";
    chip.textContent = t.label;
    chip.dataset.topic = id;
    chip.onclick = () => selectTopicChip(chip, id);
    container.appendChild(chip);
  });

  // Skill chips container
  document.getElementById("review-skill-chips").innerHTML = "";
}

function selectTopicChip(el, topicId) {
  document.querySelectorAll("#review-topic-chips .topic-chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  topicFilter = topicId || null;
  skillFilter = null;

  // Show skill chips for selected topic
  const skillContainer = document.getElementById("review-skill-chips");
  skillContainer.innerHTML = "";
  if (topicId && TOPICS[topicId]) {
    TOPICS[topicId].skills.forEach(skill => {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = skill;
      chip.onclick = () => selectSkillChip(chip, skill);
      skillContainer.appendChild(chip);
    });
  }
}

function selectSkillChip(el, skill) {
  document.querySelectorAll("#review-skill-chips .skill-chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  skillFilter = skill;
}

function selectMode(mode) {
  reviewMode = mode;
  document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("selected"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("selected");
}

function startPractice() {
  if (!reviewMode) {
    reviewMode = "all";
    document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("selected"));
    const allCard = document.querySelector('[data-mode="all"]');
    if (allCard) allCard.classList.add("selected");
  }
  sessionCorrect = 0;
  sessionTotal = 0;
  questionNumber = 0;
  showPage("practice");
  loadNextQuestion();
}

// ---- PRACTICE ----
function loadNextQuestion() {
  stopTimer();
  answered = false;
  questionNumber++;
  updateSessionBar();

  let q;
  if (skillFilter) {
    const tid = SKILL_TO_TOPIC[skillFilter];
    q = tid ? generateQuestion(tid, skillFilter) : null;
  } else if (topicFilter) {
    q = generateQuestion(topicFilter);
  } else if (reviewMode === "problem-areas") {
    const hardTopics = getTopicsSortedByDifficulty(progress, true);
    if (hardTopics.length > 0) {
      const pick = hardTopics[Math.floor(Math.random() * Math.min(5, hardTopics.length))];
      q = generateQuestion(pick.topicId);
    } else {
      q = getAdaptiveQuestion(progress.topicStats || {}, null, null);
    }
  } else if (reviewMode === "easy-wins") {
    const easyTopics = getTopicsSortedByDifficulty(progress, false);
    if (easyTopics.length > 0) {
      const pick = easyTopics[Math.floor(Math.random() * Math.min(5, easyTopics.length))];
      q = generateQuestion(pick.topicId);
    } else {
      q = getAdaptiveQuestion(progress.topicStats || {}, null, null);
    }
  } else {
    // "all" — adaptive (easy wins appear ~25% of time)
    const roll = Math.random();
    if (roll < 0.25 && getTopicsSortedByDifficulty(progress, false).length > 0) {
      const easyTopics = getTopicsSortedByDifficulty(progress, false);
      const pick = easyTopics[Math.floor(Math.random() * Math.min(3, easyTopics.length))];
      q = generateQuestion(pick.topicId);
    } else {
      q = getAdaptiveQuestion(progress.topicStats || {}, null, null);
    }
  }

  if (!q) {
    q = getAdaptiveQuestion(progress.topicStats || {}, null, null);
  }

  currentQ = q;
  renderQuestion(q);
}

function renderQuestion(q) {
  document.getElementById("q-number").textContent = `Q${questionNumber}`;
  document.getElementById("q-topic-badge").textContent = q.topicLabel + " · " + q.skill;
  document.getElementById("q-text").textContent = q.question;

  const letters = ["A", "B", "C", "D"];
  const grid = document.getElementById("choices-grid");
  grid.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<span class="choice-letter">${letters[i]}</span><span>${choice}</span>`;
    btn.onclick = () => selectAnswer(btn, choice, i);
    grid.appendChild(btn);
  });

  document.getElementById("feedback-box").innerHTML = "";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("timer-display").textContent = "0:00";
  timerSeconds = 0;
}

function selectAnswer(btn, choice, idx) {
  if (answered) return;
  answered = true;
  stopTimer();

  const isCorrect = String(choice) === String(currentQ.answer);
  sessionTotal++;
  if (isCorrect) sessionCorrect++;
  progress = recordAnswer(progress, currentQ.topic, currentQ.skill, isCorrect);
  updateSessionBar();

  // Highlight choices
  const allBtns = document.querySelectorAll(".choice-btn");
  allBtns.forEach(b => {
    b.disabled = true;
    const label = b.querySelector("span:last-child").textContent;
    if (String(label) === String(currentQ.answer)) b.classList.add("correct");
    else if (b === btn && !isCorrect) b.classList.add("wrong");
  });

  // Feedback
  const fb = document.getElementById("feedback-box");
  fb.className = "feedback-box " + (isCorrect ? "correct-fb" : "wrong-fb");
  fb.innerHTML = `
    <h3>${isCorrect ? "✓ That's correct!" : "✗ Not quite..."}</h3>
    <p class="explanation"><strong>Step-by-step:</strong> ${currentQ.explanation}</p>
    ${!isCorrect ? `<p style="margin-top:8px;font-size:0.88rem;color:#7A7570">The correct answer was: <strong>${currentQ.answer}</strong></p>` : ""}
  `;

  document.getElementById("next-btn").style.display = "inline-flex";
  fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateSessionBar() {
  document.getElementById("session-score").textContent = `${sessionCorrect}/${sessionTotal} correct`;
}

// ---- TIMER ----
function toggleTimer() {
  if (timerRunning) {
    stopTimer();
    document.getElementById("btn-timer").classList.remove("running");
    document.getElementById("btn-timer").textContent = "▶ Start Stopwatch";
  } else {
    startTimer();
    document.getElementById("btn-timer").classList.add("running");
    document.getElementById("btn-timer").textContent = "⏹ Stop Stopwatch";
  }
}

function startTimer() {
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    document.getElementById("timer-display").textContent = `${m}:${s.toString().padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  const btn = document.getElementById("btn-timer");
  if (btn) {
    btn.classList.remove("running");
    btn.textContent = "▶ Start Stopwatch";
  }
}

function drawTopicChart(topicId) {
  const canvas = document.getElementById("topic-chart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
  canvas.height = 200 * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  const W = canvas.offsetWidth, H = 200;
  ctx.clearRect(0, 0, W, H);

  let sessions = [...progress.sessions]
    .sort((a,b) => a.date.localeCompare(b.date))
    .filter(s => s.topicBreakdown && s.topicBreakdown[topicId]);

  if (sessions.length === 0) {
    ctx.fillStyle = "#7A7570";
    ctx.font = "14px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data yet for this topic.", W/2, H/2);
    return;
  }

  const pad = { top: 20, right: 20, bottom: 44, left: 44 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;
  const vals = sessions.map(s => {
    const tb = s.topicBreakdown[topicId];
    return progressChartMode === "count" ? tb.correct : (tb.total > 0 ? Math.round(tb.correct/tb.total*100) : 0);
  });
  const maxVal = Math.max(...vals, progressChartMode === "percent" ? 100 : 5);

  ctx.strokeStyle = "#EDEAE3"; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + cH - (i/4)*cH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left+cW, y); ctx.stroke();
    ctx.fillStyle = "#7A7570"; ctx.font = "11px JetBrains Mono, monospace"; ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal*i/4)+(progressChartMode==="percent"?"%":""), pad.left-6, y+4);
  }
  sessions.forEach((s,i) => {
    const x = pad.left+(sessions.length===1?cW/2:(i/(sessions.length-1))*cW);
    ctx.fillStyle="#7A7570"; ctx.font="10px DM Sans, sans-serif"; ctx.textAlign="center";
    ctx.fillText(s.date.slice(5), x, H-pad.bottom+16);
  });
  ctx.beginPath();
  vals.forEach((v,i) => {
    const x = pad.left+(sessions.length===1?cW/2:(i/(sessions.length-1))*cW);
    const y = pad.top+cH-(v/maxVal)*cH;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.strokeStyle="#2D6A4F"; ctx.lineWidth=2.5; ctx.lineJoin="round"; ctx.stroke();
  vals.forEach((v,i) => {
    const x = pad.left+(sessions.length===1?cW/2:(i/(sessions.length-1))*cW);
    const y = pad.top+cH-(v/maxVal)*cH;
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fillStyle="#2D6A4F"; ctx.fill();
    ctx.strokeStyle="white"; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle="#1A1814"; ctx.font="bold 11px DM Sans,sans-serif"; ctx.textAlign="center";
    ctx.fillText(v+(progressChartMode==="percent"?"%":""), x, y-10);
  });
}


function setChartMode(mode) {
  progressChartMode = mode;
  document.querySelectorAll(".toggle-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  drawProgressChart();
}

// ---- INIT ----
window.addEventListener("DOMContentLoaded", () => {
  showPage("home");
  window.addEventListener("resize", () => {
    if (document.getElementById("page-progress").classList.contains("active")) drawProgressChart();
    if (document.getElementById("page-topic-detail").classList.contains("active")) drawProgressChart();
  });
});

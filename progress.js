// ============================================================
// ACT MATH PREP - Progress & Storage Engine
// ============================================================

const STORAGE_KEY = "act_math_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultProgress();
  } catch(e) {
    return defaultProgress();
  }
}

function defaultProgress() {
  return {
    sessions: [],        // [{date, correct, total, topicBreakdown:{topicId:{correct,total}}}]
    topicStats: {},      // {topicId: {correct, total, skillStats: {skill: {correct, total}}}}
    lastUpdated: null
  };
}

function saveProgress(progress) {
  try {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch(e) {
    console.error("Save failed:", e);
  }
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function recordAnswer(progress, topicId, skill, isCorrect) {
  const todayKey = getTodayKey();

  // Find or create today's session
  let session = progress.sessions.find(s => s.date === todayKey);
  if (!session) {
    session = { date: todayKey, correct: 0, total: 0, topicBreakdown: {} };
    progress.sessions.push(session);
  }

  session.total++;
  if (isCorrect) session.correct++;

  // Topic breakdown for today
  if (!session.topicBreakdown[topicId]) session.topicBreakdown[topicId] = { correct: 0, total: 0 };
  session.topicBreakdown[topicId].total++;
  if (isCorrect) session.topicBreakdown[topicId].correct++;

  // All-time topic stats
  if (!progress.topicStats[topicId]) progress.topicStats[topicId] = { correct: 0, total: 0, skillStats: {} };
  progress.topicStats[topicId].total++;
  if (isCorrect) progress.topicStats[topicId].correct++;

  // Skill stats
  if (!progress.topicStats[topicId].skillStats[skill]) progress.topicStats[topicId].skillStats[skill] = { correct: 0, total: 0 };
  progress.topicStats[topicId].skillStats[skill].total++;
  if (isCorrect) progress.topicStats[topicId].skillStats[skill].correct++;

  saveProgress(progress);
  return progress;
}

function getTopicsSortedByDifficulty(progress, ascending = true) {
  return Object.keys(TOPICS).map(topicId => {
    const s = progress.topicStats[topicId] || { correct: 0, total: 0 };
    const pct = s.total > 0 ? s.correct / s.total : 0.5;
    return { topicId, pct, total: s.total, correct: s.correct };
  }).filter(t => t.total > 0)
    .sort((a, b) => ascending ? a.pct - b.pct : b.pct - a.pct);
}

function getAllTimeStats(progress) {
  const total = progress.sessions.reduce((s, d) => s + d.total, 0);
  const correct = progress.sessions.reduce((s, d) => s + d.correct, 0);
  return { total, correct, pct: total > 0 ? Math.round(correct / total * 100) : 0 };
}

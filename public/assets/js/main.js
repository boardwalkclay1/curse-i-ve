// main.js
import { letters, wordMeta, totalWords } from "./words.js";
import { createTracer } from "./tracing.js";

const body = document.body;

// Theme elements
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

// Tabs
const tabLetters = document.getElementById("tabLetters");
const tabWords = document.getElementById("tabWords");

// Controls
const letterSelect = document.getElementById("letterSelect");
const difficultySelect = document.getElementById("difficultySelect");
const wordListEl = document.getElementById("wordList");
const wordProgressEl = document.getElementById("wordProgress");
const wordCountLabel = document.getElementById("wordCountLabel");

// Canvas + labels
const traceCanvas = document.getElementById("traceCanvas");
const traceTarget = document.getElementById("traceTarget");
const currentTargetLabel = document.getElementById("currentTargetLabel");
const strokeStatus = document.getElementById("strokeStatus");
const strokeCountLabel = document.getElementById("strokeCountLabel");
const sessionTimeLabel = document.getElementById("sessionTimeLabel");
const clearBtn = document.getElementById("clearBtn");
const dynamicTip = document.getElementById("dynamicTip");

// State
const state = {
  mode: "letters",
  currentLetter: "A",
  currentWord: null,
  practicedWords: new Set(),
  strokes: 0,
  startTime: null,
  timerInterval: null,
};

let tracer = null;

// ---------- INIT ----------
function init() {
  // Letters
  letters.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    letterSelect.appendChild(opt);
  });
  letterSelect.value = state.currentLetter;

  // Word count
  wordCountLabel.textContent = totalWords.toString();

  // Word list
  renderWordList();

  // Tracer
  tracer = createTracer(traceCanvas, {
    onStrokeStart: handleStrokeStart,
    onStrokeEnd: handleStrokeEnd,
  });

  // Events
  themeToggle.addEventListener("click", toggleTheme);
  tabLetters.addEventListener("click", () => switchMode("letters"));
  tabWords.addEventListener("click", () => switchMode("words"));
  letterSelect.addEventListener("change", onLetterChange);
  difficultySelect.addEventListener("change", renderWordList);
  clearBtn.addEventListener("click", () => clearCanvas(true));

  updateTargetDisplay();
  startTimer();
}

// ---------- THEME ----------
function toggleTheme() {
  const current = body.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  body.setAttribute("data-theme", next);
  if (next === "light") {
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "Pencil (Light)";
  } else {
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "Night (Dark)";
  }
  // Refresh stroke color
  tracer.resize();
}

// ---------- MODE ----------
function switchMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  tabLetters.classList.toggle("active", mode === "letters");
  tabWords.classList.toggle("active", mode === "words");
  updateTargetDisplay();
  clearCanvas(true);
  if (mode === "letters") {
    dynamicTip.textContent =
      "Trace each letter slowly. Focus on the starting point and the direction of each stroke.";
  } else {
    dynamicTip.textContent =
      "Watch how letters connect. Keep your strokes flowing without lifting your finger too often.";
  }
}

// ---------- LETTERS ----------
function onLetterChange() {
  state.currentLetter = letterSelect.value;
  updateTargetDisplay();
  clearCanvas(true);
}

// ---------- WORDS ----------
function renderWordList() {
  const difficulty = difficultySelect.value;
  wordListEl.innerHTML = "";
  const filtered = wordMeta.filter((w) =>
    difficulty === "all" ? true : w.level === difficulty
  );

  filtered.forEach((entry) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "word-pill";
    pill.textContent = entry.word;
    pill.dataset.word = entry.word;
    pill.addEventListener("click", () => {
      state.currentWord = entry.word;
      state.mode = "words";
      tabLetters.classList.remove("active");
      tabWords.classList.add("active");
      updateTargetDisplay();
      clearCanvas(true);
      markWordPracticed(entry.word);
      highlightActiveWord(entry.word);
    });
    if (entry.word === state.currentWord) {
      pill.classList.add("active");
    }
    wordListEl.appendChild(pill);
  });

  updateWordProgress();
}

function highlightActiveWord(word) {
  const pills = wordListEl.querySelectorAll(".word-pill");
  pills.forEach((p) => {
    p.classList.toggle("active", p.dataset.word === word);
  });
}

function markWordPracticed(word) {
  if (!word) return;
  state.practicedWords.add(word);
  updateWordProgress();
}

function updateWordProgress() {
  const practiced = state.practicedWords.size;
  const percent = totalWords > 0 ? (practiced / totalWords) * 100 : 0;
  wordProgressEl.style.width = `${percent.toFixed(1)}%`;
}

// ---------- TARGET DISPLAY ----------
function updateTargetDisplay() {
  if (state.mode === "letters") {
    traceTarget.textContent = state.currentLetter;
    currentTargetLabel.textContent = `Letter: ${state.currentLetter}`;
  } else {
    const word = state.currentWord || wordMeta[0].word;
    state.currentWord = word;
    traceTarget.textContent = word;
    currentTargetLabel.textContent = `Word: ${word}`;
    highlightActiveWord(word);
  }
}

// ---------- CANVAS / STROKES ----------
function clearCanvas(resetStats) {
  tracer.clear(true);
  if (resetStats) {
    state.strokes = 0;
    strokeCountLabel.textContent = "Strokes: 0";
    strokeStatus.textContent = "Ready to trace";
  }
}

function handleStrokeStart() {
  state.strokes += 1;
  strokeCountLabel.textContent = `Strokes: ${state.strokes}`;
  strokeStatus.textContent = "Tracing… keep your motion smooth.";
}

function handleStrokeEnd() {
  strokeStatus.textContent = "Stroke complete. Start the next one when ready.";
  if (state.mode === "words" && state.currentWord) {
    markWordPracticed(state.currentWord);
  }
}

// ---------- TIMER ----------
function startTimer() {
  state.startTime = Date.now();
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - state.startTime) / 1000);
    sessionTimeLabel.textContent = `Time: ${seconds}s`;
  }, 1000);
}

// ---------- BOOT ----------
init();

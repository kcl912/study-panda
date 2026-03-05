// StudyPanda MVP - JavaScript

// ============ I18n TEXT ============
const texts = {
  zhHant: {
    appTitle: "補習小天地 / StudyPanda",
    appSubtitle: "小學英文數學練習平台",
    language: "語言",
    subject: "科目",
    grade: "年級",
    startBtn: "開始練習",
    progressTitle: "學習進度",
    totalSessions: "總練習次數",
    averageScore: "平均分數",
    bestScore: "目前選項最佳分數",
    lastSession: "最近一次",
    quizTitle: "題目",
    quizTip: "請完成 10 題後提交。",
    submitBtn: "提交答案",
    resultTitle: "結果",
    correct: "正確",
    wrong: "錯誤",
    math: "數學",
    english: "英文",
    p1: "小一",
    p2: "小二",
    p3: "小三",
    p4: "小四",
    p5: "小五",
    p6: "小六",
  },
  zhHans: {
    appTitle: "补习小天地 / StudyPanda",
    appSubtitle: "小学英文数学练习平台",
    language: "语言",
    subject: "科目",
    grade: "年级",
    startBtn: "开始练习",
    progressTitle: "学习进度",
    totalSessions: "总练习次数",
    averageScore: "平均分数",
    bestScore: "当前选项最佳分数",
    lastSession: "最近一次",
    quizTitle: "题目",
    quizTip: "请完成 10 题后提交。",
    submitBtn: "提交答案",
    resultTitle: "结果",
    correct: "正确",
    wrong: "错误",
    math: "数学",
    english: "英语",
    p1: "小一",
    p2: "小二",
    p3: "小三",
    p4: "小四",
    p5: "小五",
    p6: "小六",
  },
  en: {
    appTitle: "StudyPanda",
    appSubtitle: "Primary School Math & English Practice",
    language: "Language",
    subject: "Subject",
    grade: "Grade",
    startBtn: "Start Practice",
    progressTitle: "Progress",
    totalSessions: "Total Sessions",
    averageScore: "Average Score",
    bestScore: "Best Score",
    lastSession: "Last Session",
    quizTitle: "Questions",
    quizTip: "Complete all 10 questions before submitting.",
    submitBtn: "Submit Answers",
    resultTitle: "Results",
    correct: "Correct",
    wrong: "Wrong",
    math: "Math",
    english: "English",
    p1: "P1",
    p2: "P2",
    p3: "P3",
    p4: "P4",
    p5: "P5",
    p6: "P6",
  },
};

let currentLang = "zhHant";
let currentSubject = "math";
let currentGrade = "p1";
let questions = [];

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initUI();
  loadProgress();
  bindEvents();
});

function bindEvents() {
  document.getElementById("language-select").addEventListener("change", (e) => {
    currentLang = e.target.value;
    updateTexts();
    loadProgress();
  });
  document.getElementById("subject-select").addEventListener("change", (e) => {
    currentSubject = e.target.value;
  });
  document.getElementById("grade-select").addEventListener("change", (e) => {
    currentGrade = e.target.value;
  });
  document.getElementById("start-btn").addEventListener("click", startQuiz);
  document.getElementById("quiz-form").addEventListener("submit", submitQuiz);
}

function initLanguage() {
  const langMap = {
    "zh-Hant": "繁體中文",
    "zh-Hans": "简体中文",
    en: "English",
  };
  const select = document.getElementById("language-select");
  Object.entries(langMap).forEach(([code, name]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = name;
    select.appendChild(opt);
  });
  // Try detect
  const browserLang = navigator.language;
  if (browserLang.startsWith("zh-Hant") || browserLang.startsWith("zh-TW")) {
    select.value = "zh-Hant";
    currentLang = "zh-Hant";
  } else if (browserLang.startsWith("zh")) {
    select.value = "zh-Hans";
    currentLang = "zh-Hans";
  } else {
    select.value = "en";
    currentLang = "en";
  }
}

function initUI() {
  // Subject
  const subjectSelect = document.getElementById("subject-select");
  subjectSelect.innerHTML = "";
  ["math", "english"].forEach((sub) => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = texts[currentLang][sub];
    subjectSelect.appendChild(opt);
  });
  // Grade
  const gradeSelect = document.getElementById("grade-select");
  gradeSelect.innerHTML = "";
  ["p1", "p2", "p3", "p4", "p5", "p6"].forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = texts[currentLang][g];
    gradeSelect.appendChild(opt);
  });
}

function updateTexts() {
  const t = texts[currentLang];
  document.getElementById("app-title").textContent = t.appTitle;
  document.getElementById("app-subtitle").textContent = t.appSubtitle;
  document.getElementById("language-label").textContent = t.language;
  document.getElementById("subject-label").textContent = t.subject;
  document.getElementById("grade-label").textContent = t.grade;
  document.getElementById("start-btn").textContent = t.startBtn;
  document.getElementById("progress-title").textContent = t.progressTitle;
  document.getElementById("sessions-label").textContent = t.totalSessions;
  document.getElementById("average-label").textContent = t.averageScore;
  document.getElementById("best-label").textContent = t.bestScore;
  document.getElementById("last-label").textContent = t.lastSession;
  document.getElementById("quiz-title").textContent = t.quizTitle;
  document.getElementById("quiz-tip").textContent = t.quizTip;
  document.getElementById("submit-btn").textContent = t.submitBtn;
  document.getElementById("result-title").textContent = t.resultTitle;
  // Update selects
  initUI();
}

// ============ QUIZ LOGIC ============
function startQuiz() {
  questions = generateQuestions(currentSubject, currentGrade, currentLang, 10);
  renderQuestions();
  document.getElementById("quiz-section").classList.remove("hidden");
  document.getElementById("result-section").classList.add("hidden");
}

function generateQuestions(subject, grade, lang, count) {
  const qs = [];
  for (let i = 0; i < count; i++) {
    if (subject === "math") {
      qs.push(generateMathQuestion(grade, lang));
    } else {
      qs.push(generateEnglishQuestion(grade, lang));
    }
  }
  return qs;
}

function generateMathQuestion(grade, lang) {
  const g = parseInt(grade[1]);
  let a, b, op, answer, question;

  if (g <= 2) {
    // P1-P2: basic +-
    a = randInt(1, 20 + g * 10);
    b = randInt(1, 20 + g * 10);
    op = Math.random() > 0.5 ? "+" : "-";
    if (op === "-" && a < b) [a, b] = [b, a];
    answer = op === "+" ? a + b : a - b;
    question = `${a} ${op} ${b} = ?`;
  } else if (g <= 4) {
    // P3-P4: *, /
    a = randInt(2, 9 + (g - 2) * 2);
    b = randInt(2, 12);
    op = Math.random() > 0.5 ? "×" : "÷";
    if (op === "×") {
      answer = a * b;
      question = `${a} ${op} ${b} = ?`;
    } else {
      answer = a;
      question = `${a * b} ${op} ${b} = ?`;
    }
  } else {
    // P5-P6: fractions, decimals, word problems
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      // fraction
      a = randInt(1, 9);
      b = randInt(2, 10);
      answer = (a / b).toFixed(2).replace(/\.00$/, "");
      question = `${a}/${b} = ? (小數)`;
    } else if (type === 1) {
      // percentage
      a = randInt(1, 9) * 10;
      b = randInt(2, 5) * 10;
      answer = (a * b / 100);
      question = `${a}% of ${b} = ?`;
    } else {
      // word problem
      const items = ["蘋果", "書", "筆", "糖果", "氣球"];
      const item = items[randInt(0, items.length - 1)];
      a = randInt(5, 20);
      b = randInt(3, 10);
      answer = a * b;
      question = `小明有${a}個${item}，佢既朋友比咗${b}倍佢。小明總共有幾多個${item}？`;
    }
  }
  return { question, answer: String(answer), userAnswer: "" };
}

function generateEnglishQuestion(grade, lang) {
  const g = parseInt(grade[1]);
  const types = [
    () => {
      const vocab = {
        1: ["red", "blue", "green", "yellow"],
        2: ["cat", "dog", "bird", "fish"],
        3: ["apple", "banana", "orange", "grape"],
        4: ["happy", "sad", "big", "small"],
        5: ["run", "eat", "sleep", "play"],
        6: ["school", "house", "park", "library"],
      };
      const words = vocab[g] || vocab[1];
      const word = words[randInt(0, words.length - 1)];
      const q = lang === "zhHant" 
        ? `「${word}」既中文係咩？`
        : lang === "zh-Hans"
        ? `「${word}」的中文是什么？`
        : `What is the meaning of "${word}"?`;
      const answer = word;
      return { question: q, answer, userAnswer: "" };
    },
    () => {
      const q = lang === "zhHant" 
        ? `填空：I ___ a student. (am/is/are)`
        : lang === "zh-Hans"
        ? `填空：I ___ a student. (am/is/are)`
        : `Fill in the blank: I ___ a student.`;
      return { question: q, answer: "am", userAnswer: "" };
    },
    () => {
      const q = lang === "zhHant"
        ? `改正：She go to school yesterday.`
        : lang === "zh-Hans"
        ? `改正：She go to school yesterday.`
        : `Fix: She go to school yesterday.`;
      return { question: q, answer: "went", userAnswer: "" };
    },
  ];
  const fn = types[randInt(0, types.length - 1)];
  return fn();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderQuestions() {
  const list = document.getElementById("question-list");
  list.innerHTML = "";
  questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
      <p>${i + 1}. ${q.question}</p>
      <div class="question-row">
        <label>Answer:</label>
        <input type="text" class="question-input" data-index="${i}" autocomplete="off" />
      </div>
    `;
    list.appendChild(card);
  });
}

function submitQuiz(e) {
  e.preventDefault();
  const inputs = document.querySelectorAll(".question-input");
  let correct = 0;
  const results = [];
  inputs.forEach((input, i) => {
    const userAns = input.value.trim().toLowerCase();
    const correctAns = String(questions[i].answer).toLowerCase();
    const isCorrect = userAns === correctAns;
    if (isCorrect) correct++;
    results.push({
      question: questions[i].question,
      userAnswer: input.value,
      correctAnswer: questions[i].answer,
      isCorrect,
    });
  });
  const score = Math.round((correct / questions.length) * 100);
  showResult(score, correct, results);
  saveProgress(score);
}

function showResult(score, correct, results) {
  document.getElementById("quiz-section").classList.add("hidden");
  const resultSec = document.getElementById("result-section");
  resultSec.classList.remove("hidden");
  const t = texts[currentLang];
  document.getElementById("result-text").textContent = `${correct}/10 = ${score}%`;
  
  let feedback = "";
  if (score >= 90) feedback = "Excellent! 🌟";
  else if (score >= 70) feedback = "Good job! 👍";
  else feedback = "Keep practicing! 💪";
  document.getElementById("result-feedback").textContent = feedback;

  const breakdown = document.getElementById("result-breakdown");
  breakdown.innerHTML = "";
  results.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = `answer-row ${r.isCorrect ? "correct" : "wrong"}`;
    row.innerHTML = `
      <strong>${i + 1}. ${r.question}</strong><br/>
      ${t.correct}: <span class="status ok">${r.correctAnswer}</span> | 
      ${t.wrong}: <span class="status bad">${r.userAnswer || "(empty)"}</span>
    `;
    breakdown.appendChild(row);
  });
}

// ============ PROGRESS (localStorage) ============
function saveProgress(score) {
  const key = `${currentSubject}-${currentGrade}`;
  const data = JSON.parse(localStorage.getItem("studyPanda") || "{}");
  if (!data[key]) data[key] = [];
  data[key].push({ score, date: Date.now() });
  localStorage.setItem("studyPanda", JSON.stringify(data));
  loadProgress();
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("studyPanda") || "{}");
  const key = `${currentSubject}-${currentGrade}`;
  const sessions = data[key] || [];
  const t = texts[currentLang];
  
  document.getElementById("sessions-value").textContent = sessions.length;
  
  if (sessions.length > 0) {
    const avg = Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length);
    document.getElementById("average-value").textContent = avg + "%";
    const best = Math.max(...sessions.map(s => s.score));
    document.getElementById("best-value").textContent = best + "%";
    const last = sessions[sessions.length - 1];
    const date = new Date(last.date);
    document.getElementById("last-value").textContent = 
      `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else {
    document.getElementById("average-value").textContent = "0%";
    document.getElementById("best-value").textContent = "-";
    document.getElementById("last-value").textContent = "-";
  }
}

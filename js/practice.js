(function () {
  "use strict";

  var STORAGE_KEY = "ielts-practice-history";

  var TASK_CONFIG = {
    task1: { minutes: 20, minWords: 150, label: "Task 1" },
    task2: { minutes: 40, minWords: 250, label: "Task 2" }
  };

  var SAMPLE_QUESTIONS = {
    task1: [
      "The graph below shows the number of visitors to three museums in a European city between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      "The charts below show the proportion of household spending in a European country in 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      "The diagram below shows the process of recycling plastic bottles. Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
    ],
    task2: [
      "Some people believe that children should begin learning a foreign language as soon as they start primary school, rather than waiting until secondary school. To what extent do you agree or disagree?",
      "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways to reduce crime. Discuss both views and give your own opinion.",
      "In many countries, more and more people are choosing to work from home. Do the advantages of this trend outweigh the disadvantages?",
      "Traffic congestion is becoming a serious problem in many major cities. What are the causes of this problem, and what solutions can you suggest?",
      "In many countries, the amount of food wasted by households and restaurants is increasing every year. Why is this happening? Is it a positive or negative development?"
    ]
  };

  var SELF_CHECK_ITEMS = [
    "Đã paraphrase đề bài ở mở bài, không copy nguyên văn",
    "Có overview/thesis statement rõ ràng",
    "Mỗi đoạn thân bài chỉ tập trung 1 ý chính, có giải thích + ví dụ",
    "Dùng ít nhất 2-3 cấu trúc câu khác nhau (mệnh đề quan hệ, câu điều kiện, bị động...)",
    "Từ nối đa dạng, không lặp lại máy móc",
    "Đủ số từ tối thiểu theo yêu cầu",
    "Đọc lại và kiểm tra lỗi chính tả / thì / số ít số nhiều"
  ];

  var taskSelect = document.getElementById("task-select");
  var questionSelect = document.getElementById("question-select");
  var questionInput = document.getElementById("question-input");
  var essayInput = document.getElementById("essay-input");
  var wordCountEl = document.getElementById("word-count");
  var minWordsHint = document.getElementById("min-words-hint");
  var timerDisplay = document.getElementById("timer-display");
  var timerToggle = document.getElementById("timer-toggle");
  var timerReset = document.getElementById("timer-reset");
  var saveBtn = document.getElementById("save-btn");
  var clearBtn = document.getElementById("clear-btn");
  var exportBtn = document.getElementById("export-btn");
  var selfCheckList = document.getElementById("self-check-list");
  var historyList = document.getElementById("history-list");

  // ---------- Self-check checklist ----------
  SELF_CHECK_ITEMS.forEach(function (text, i) {
    var li = document.createElement("li");
    var id = "check-" + i;
    li.innerHTML = '<input type="checkbox" id="' + id + '"><label for="' + id + '">' + text + "</label>";
    selfCheckList.appendChild(li);
  });

  // ---------- Question bank dropdown ----------
  function populateQuestions(task) {
    questionSelect.innerHTML = '<option value="">— Tự nhập đề riêng bên dưới —</option>';
    SAMPLE_QUESTIONS[task].forEach(function (q) {
      var opt = document.createElement("option");
      opt.value = q;
      opt.textContent = q.length > 70 ? q.slice(0, 70) + "…" : q;
      questionSelect.appendChild(opt);
    });
  }

  questionSelect.addEventListener("change", function () {
    if (questionSelect.value) {
      questionInput.value = questionSelect.value;
    }
  });

  // ---------- Word count ----------
  function countWords(text) {
    var trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  function updateWordCount() {
    var task = taskSelect.value;
    var count = countWords(essayInput.value);
    var min = TASK_CONFIG[task].minWords;
    wordCountEl.textContent = count + " từ";
    wordCountEl.className = "count " + (count >= min ? "ok" : "low");
    minWordsHint.textContent = "Tối thiểu " + min + " từ";
  }

  essayInput.addEventListener("input", updateWordCount);

  // ---------- Task switch ----------
  function applyTaskConfig() {
    var task = taskSelect.value;
    populateQuestions(task);
    resetTimer();
    updateWordCount();
  }

  taskSelect.addEventListener("change", applyTaskConfig);

  // ---------- Timer ----------
  var remainingSeconds = TASK_CONFIG.task1.minutes * 60;
  var timerInterval = null;
  var isRunning = false;

  function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function renderTimer() {
    timerDisplay.textContent = formatTime(Math.max(remainingSeconds, 0));
    timerDisplay.style.color = remainingSeconds <= 60 && remainingSeconds > 0 ? "var(--color-danger)" : "";
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerToggle.textContent = "Tạm dừng";
    timerInterval = setInterval(function () {
      remainingSeconds--;
      renderTimer();
      if (remainingSeconds <= 0) {
        pauseTimer();
        showToast("Hết giờ! Hãy kiểm tra lại bài viết của bạn.");
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    timerToggle.textContent = "Tiếp tục";
    clearInterval(timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    var task = taskSelect.value;
    remainingSeconds = TASK_CONFIG[task].minutes * 60;
    timerToggle.textContent = "Bắt đầu";
    renderTimer();
  }

  timerToggle.addEventListener("click", function () {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  timerReset.addEventListener("click", resetTimer);

  // ---------- Clear ----------
  clearBtn.addEventListener("click", function () {
    if (essayInput.value.trim() && !confirm("Xóa toàn bộ nội dung đang viết?")) return;
    essayInput.value = "";
    updateWordCount();
  });

  // ---------- Export ----------
  exportBtn.addEventListener("click", function () {
    var content = "Đề bài:\n" + (questionInput.value || "(chưa nhập đề)") + "\n\n" + essayInput.value;
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "ielts-essay-" + Date.now() + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // ---------- Storage ----------
  function loadHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      showToast("Không thể lưu — bộ nhớ trình duyệt bị chặn hoặc đầy.");
    }
  }

  function renderHistory() {
    var items = loadHistory();
    if (items.length === 0) {
      historyList.innerHTML = '<p class="empty-state">Chưa có bài viết nào được lưu.</p>';
      return;
    }
    historyList.innerHTML = "";
    items.slice().reverse().forEach(function (item) {
      var div = document.createElement("div");
      div.className = "history-item";
      var date = new Date(item.savedAt);
      var dateStr = date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      div.innerHTML =
        '<div class="hmeta"><span>' + TASK_CONFIG[item.task].label + " · " + item.wordCount + ' từ</span><span>' + dateStr + "</span></div>" +
        '<div style="font-weight:600; font-size:0.85rem;">' + escapeHtml(truncate(item.question || "(không có đề)", 90)) + "</div>" +
        '<div class="history-actions">' +
        '<button class="btn btn-ghost btn-sm" data-action="load" data-id="' + item.id + '">Mở lại</button>' +
        '<button class="btn btn-danger btn-sm" data-action="delete" data-id="' + item.id + '">Xóa</button>' +
        "</div>";
      historyList.appendChild(div);
    });
  }

  function truncate(str, len) {
    return str.length > len ? str.slice(0, len) + "…" : str;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  historyList.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var items = loadHistory();
    var item = items.find(function (it) { return String(it.id) === id; });
    if (!item) return;

    if (btn.getAttribute("data-action") === "load") {
      taskSelect.value = item.task;
      applyTaskConfig();
      questionInput.value = item.question || "";
      essayInput.value = item.content || "";
      updateWordCount();
      showToast("Đã mở lại bài viết đã lưu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (btn.getAttribute("data-action") === "delete") {
      if (!confirm("Xóa bài viết này khỏi lịch sử?")) return;
      items = items.filter(function (it) { return String(it.id) !== id; });
      saveHistory(items);
      renderHistory();
    }
  });

  saveBtn.addEventListener("click", function () {
    var content = essayInput.value.trim();
    if (!content) {
      showToast("Chưa có nội dung để lưu.");
      return;
    }
    var items = loadHistory();
    items.push({
      id: Date.now(),
      task: taskSelect.value,
      question: questionInput.value.trim(),
      content: content,
      wordCount: countWords(content),
      savedAt: new Date().toISOString()
    });
    saveHistory(items);
    renderHistory();
    showToast("Đã lưu bài viết!");
  });

  // ---------- Init ----------
  populateQuestions(taskSelect.value);
  renderTimer();
  updateWordCount();
  renderHistory();
})();

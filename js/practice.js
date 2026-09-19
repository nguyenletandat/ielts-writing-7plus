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
  var chartReference = document.getElementById("chart-reference");
  var statsBox = document.getElementById("stats-box");
  var exportHistoryBtn = document.getElementById("export-history-btn");
  var importHistoryBtn = document.getElementById("import-history-btn");
  var importHistoryFile = document.getElementById("import-history-file");

  // ---------- Reference chart (Task 1 sample questions ship with an image) ----------
  function updateChartReference() {
    if (!window.IELTS_TASK1_CHARTS) return;
    var task = taskSelect.value;
    var idx = task === "task1" ? SAMPLE_QUESTIONS.task1.indexOf(questionInput.value.trim()) : -1;
    var chart = idx >= 0 ? window.IELTS_TASK1_CHARTS[idx] : null;
    if (chart) {
      chartReference.innerHTML = chart.html;
      chartReference.style.display = "";
    } else {
      chartReference.innerHTML = "";
      chartReference.style.display = "none";
    }
  }

  questionInput.addEventListener("input", updateChartReference);

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
    updateChartReference();
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
    updateChartReference();
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

  // ---------- Progress stats ----------
  function dayKey(iso) {
    var d = new Date(iso);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function computeStreak(items) {
    if (items.length === 0) return 0;
    var days = {};
    items.forEach(function (it) { days[dayKey(it.savedAt)] = true; });
    var cursor = new Date();
    if (!days[dayKey(cursor)]) {
      cursor.setDate(cursor.getDate() - 1); // no essay today yet — see if yesterday keeps the streak alive
    }
    var streak = 0;
    while (days[dayKey(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function renderStats() {
    if (!statsBox) return;
    var items = loadHistory();
    var totalEssays = items.length;
    var totalWords = items.reduce(function (sum, it) { return sum + (it.wordCount || 0); }, 0);
    var avgWords = totalEssays ? Math.round(totalWords / totalEssays) : 0;
    var streak = computeStreak(items);

    var last7 = [];
    var today = new Date();
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today);
      d.setDate(d.getDate() - i);
      var key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      var count = items.filter(function (it) { return dayKey(it.savedAt) === key; }).length;
      last7.push({ label: d.toLocaleDateString("vi-VN", { weekday: "short" }), count: count });
    }
    var maxCount = Math.max(1, Math.max.apply(null, last7.map(function (d) { return d.count; })));

    var barsHtml = last7.map(function (d) {
      var h = Math.round((d.count / maxCount) * 48) + 4;
      return '<div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">' +
        '<div style="width:100%; max-width:22px; height:52px; display:flex; align-items:flex-end;">' +
        '<div style="width:100%; height:' + h + 'px; background:var(--chart-series-1); border-radius:3px 3px 0 0;" title="' + d.count + ' bài"></div>' +
        "</div>" +
        '<span style="font-size:0.65rem; color:var(--color-text-muted);">' + d.label + "</span>" +
        "</div>";
    }).join("");

    statsBox.innerHTML =
      '<div class="stats-grid">' +
        '<div class="stat-box"><div class="stat-value">' + totalEssays + '</div><div class="stat-label">Bài đã viết</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + streak + '</div><div class="stat-label">Ngày liên tục</div></div>' +
        '<div class="stat-box"><div class="stat-value">' + avgWords + '</div><div class="stat-label">Từ TB/bài</div></div>' +
      "</div>" +
      '<div style="display:flex; gap:4px; align-items:flex-end; margin-top:4px;">' + barsHtml + "</div>" +
      '<p style="font-size:0.72rem; color:var(--color-text-muted); text-align:center; margin:8px 0 0;">Số bài viết 7 ngày gần nhất</p>';
  }

  // ---------- Export / import progress ----------
  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener("click", function () {
      var items = loadHistory();
      if (items.length === 0) {
        showToast("Chưa có dữ liệu để xuất.");
        return;
      }
      var blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), history: items }, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      var today = new Date().toISOString().slice(0, 10);
      a.download = "ielts-progress-" + today + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  if (importHistoryBtn && importHistoryFile) {
    importHistoryBtn.addEventListener("click", function () {
      importHistoryFile.click();
    });

    importHistoryFile.addEventListener("change", function () {
      var file = importHistoryFile.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result);
          var incoming = Array.isArray(parsed) ? parsed : parsed.history;
          if (!Array.isArray(incoming)) throw new Error("invalid format");
          var existing = loadHistory();
          var byId = {};
          existing.forEach(function (it) { byId[it.id] = it; });
          incoming.forEach(function (it) {
            if (it && it.id && it.content) byId[it.id] = it;
          });
          var merged = Object.keys(byId).map(function (k) { return byId[k]; }).sort(function (a, b) { return a.id - b.id; });
          saveHistory(merged);
          renderHistory();
          renderStats();
          showToast("Đã nhập " + incoming.length + " bài, tổng cộng " + merged.length + " bài trong lịch sử.");
        } catch (e) {
          showToast("File không hợp lệ — hãy chọn đúng file .json đã xuất từ trang này.");
        }
        importHistoryFile.value = "";
      };
      reader.readAsText(file);
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
      updateChartReference();
      showToast("Đã mở lại bài viết đã lưu.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (btn.getAttribute("data-action") === "delete") {
      if (!confirm("Xóa bài viết này khỏi lịch sử?")) return;
      items = items.filter(function (it) { return String(it.id) !== id; });
      saveHistory(items);
      renderHistory();
      renderStats();
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
    renderStats();
    showToast("Đã lưu bài viết!");
  });

  // ---------- Init ----------
  populateQuestions(taskSelect.value);
  renderTimer();
  updateWordCount();
  renderHistory();
  renderStats();
  updateChartReference();

  // Pre-fill from a "Luyện đề này" link, e.g. practice.html?task=task2&q=...
  (function applyQueryParams() {
    var params = new URLSearchParams(location.search);
    var task = params.get("task");
    var question = params.get("q");
    if (task && TASK_CONFIG[task]) {
      taskSelect.value = task;
      applyTaskConfig();
    }
    if (question) {
      questionInput.value = question;
      updateChartReference();
    }

    // A "Luyện đề này" link from the real question bank can carry its chart
    // along as JSON, e.g. practice.html?task=task1&q=...&chart={"type":"bar",...}
    var chartParam = params.get("chart");
    if (chartParam && window.ChartRender) {
      try {
        var html = window.ChartRender.renderSpec(JSON.parse(chartParam));
        if (html) {
          chartReference.innerHTML = html;
          chartReference.style.display = "";
        }
      } catch (e) {
        /* malformed chart param — ignore, question text still works */
      }
    }
  })();
})();

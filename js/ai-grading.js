// AI grading via Google AI Studio (Gemini API), called directly from the
// browser with the visitor's own free API key. This site has no backend and
// never sees or stores the key anywhere but the visitor's own localStorage.
(function () {
  "use strict";

  var SETTINGS_KEY = "ielts-ai-settings";
  var DEFAULT_MODEL = "gemini-2.5-flash";

  var GRADE_SCHEMA = {
    type: "OBJECT",
    properties: {
      overallBand: { type: "NUMBER" },
      taskAchievement: {
        type: "OBJECT",
        properties: { band: { type: "NUMBER" }, comment: { type: "STRING" } },
        required: ["band", "comment"]
      },
      coherenceCohesion: {
        type: "OBJECT",
        properties: { band: { type: "NUMBER" }, comment: { type: "STRING" } },
        required: ["band", "comment"]
      },
      lexicalResource: {
        type: "OBJECT",
        properties: { band: { type: "NUMBER" }, comment: { type: "STRING" } },
        required: ["band", "comment"]
      },
      grammaticalRange: {
        type: "OBJECT",
        properties: { band: { type: "NUMBER" }, comment: { type: "STRING" } },
        required: ["band", "comment"]
      },
      strengths: { type: "ARRAY", items: { type: "STRING" } },
      improvements: { type: "ARRAY", items: { type: "STRING" } },
      correctedExamples: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: { original: { type: "STRING" }, suggestion: { type: "STRING" } },
          required: ["original", "suggestion"]
        }
      }
    },
    required: ["overallBand", "taskAchievement", "coherenceCohesion", "lexicalResource", "grammaticalRange", "strengths", "improvements"]
  };

  function loadSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      /* ignore */
    }
  }

  function maskKey(key) {
    if (key.length <= 10) return key.slice(0, 3) + "…";
    return key.slice(0, 6) + "…" + key.slice(-4);
  }

  function buildPrompt(task, question, essay, wordCount) {
    var taskLabel = task === "task1"
      ? "Task 1 (báo cáo/miêu tả số liệu từ biểu đồ, bảng, quy trình hoặc bản đồ)"
      : "Task 2 (bài luận nghị luận)";
    var minWords = task === "task1" ? 150 : 250;
    return "Bạn là giám khảo chấm thi IELTS Writing giàu kinh nghiệm, chấm nghiêm túc theo đúng band descriptor chính thức của IELTS " + taskLabel + ".\n\n" +
      "Đề bài: \"" + (question || "(không có đề bài cụ thể)") + "\"\n\n" +
      "Yêu cầu tối thiểu: " + minWords + " từ. Bài viết hiện có khoảng " + wordCount + " từ.\n\n" +
      "Bài viết của thí sinh:\n\"\"\"\n" + essay + "\n\"\"\"\n\n" +
      "Hãy chấm điểm 4 tiêu chí (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy) theo thang 0-9 (cho phép .5), và overallBand là điểm trung bình làm tròn theo quy tắc IELTS. " +
      "Viết nhận xét bằng tiếng Việt, thẳng thắn, cụ thể, chỉ ra rõ điểm mạnh/điểm yếu thực sự trong bài — không chấm điểm dễ dãi hay chung chung. " +
      "Phần correctedExamples: trích 2-3 câu gốc có lỗi hoặc chưa hay từ bài viết (giữ nguyên tiếng Anh) kèm câu gợi ý sửa (tiếng Anh). " +
      "Chỉ trả lời đúng theo schema JSON đã cho, không thêm chữ nào khác ngoài JSON.";
  }

  async function callGemini(settings, task, question, essay, wordCount) {
    var model = settings.model || DEFAULT_MODEL;
    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(settings.apiKey);
    var prompt = buildPrompt(task, question, essay, wordCount);

    var resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: GRADE_SCHEMA,
          temperature: 0.3
        }
      })
    });

    if (!resp.ok) {
      var errText = "";
      try {
        var errJson = await resp.json();
        errText = errJson.error && errJson.error.message ? errJson.error.message : JSON.stringify(errJson);
      } catch (e) {
        errText = await resp.text();
      }
      if (resp.status === 400 || resp.status === 403) {
        throw new Error("API key không hợp lệ hoặc chưa được cấp quyền. Chi tiết: " + errText);
      }
      if (resp.status === 429) {
        throw new Error("Đã vượt giới hạn miễn phí của API key (rate limit). Hãy thử lại sau ít phút.");
      }
      throw new Error("Lỗi từ Google AI Studio (HTTP " + resp.status + "): " + errText);
    }

    var data = await resp.json();
    var candidate = data.candidates && data.candidates[0];
    var text = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;
    if (!text) {
      if (candidate && candidate.finishReason === "SAFETY") {
        throw new Error("Nội dung bị chặn bởi bộ lọc an toàn của Gemini. Hãy thử lại với bài viết khác.");
      }
      throw new Error("Không nhận được phản hồi hợp lệ từ Gemini.");
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Không thể đọc kết quả JSON trả về từ Gemini.");
    }
  }

  function bandBadgeColor(band) {
    if (band >= 7) return "var(--color-success)";
    if (band >= 5.5) return "var(--color-warn)";
    return "var(--color-danger)";
  }

  function renderResult(container, result) {
    var criteria = [
      { key: "taskAchievement", label: "Task Achievement / Response" },
      { key: "coherenceCohesion", label: "Coherence & Cohesion" },
      { key: "lexicalResource", label: "Lexical Resource" },
      { key: "grammaticalRange", label: "Grammatical Range & Accuracy" }
    ];

    var html = '<div class="ai-overall">' +
      '<div class="ai-overall-value">' + result.overallBand + '</div>' +
      '<div class="ai-overall-label">Điểm ước lượng tổng quát</div>' +
      "</div>";

    criteria.forEach(function (c) {
      var item = result[c.key];
      if (!item) return;
      html += '<div class="ai-band-row">' +
        '<div class="ai-band-head"><span class="ai-band-name">' + c.label + '</span><span class="ai-band-score" style="color:' + bandBadgeColor(item.band) + '">' + item.band + '</span></div>' +
        '<div class="ai-band-comment"></div>' +
        "</div>";
    });

    if (result.strengths && result.strengths.length) {
      html += '<div class="ai-section-title">Điểm mạnh</div><ul class="ai-list" id="ai-strengths"></ul>';
    }
    if (result.improvements && result.improvements.length) {
      html += '<div class="ai-section-title">Cần cải thiện</div><ul class="ai-list" id="ai-improvements"></ul>';
    }
    if (result.correctedExamples && result.correctedExamples.length) {
      html += '<div class="ai-section-title">Gợi ý sửa câu</div><div id="ai-examples"></div>';
    }

    container.innerHTML = html;

    // Fill text content via textContent (never innerHTML) to avoid XSS from model output.
    var bandRows = container.querySelectorAll(".ai-band-row .ai-band-comment");
    criteria.forEach(function (c, i) {
      var item = result[c.key];
      if (item && bandRows[i]) bandRows[i].textContent = item.comment;
    });

    if (result.strengths) {
      var sList = container.querySelector("#ai-strengths");
      if (sList) result.strengths.forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s;
        sList.appendChild(li);
      });
    }
    if (result.improvements) {
      var iList = container.querySelector("#ai-improvements");
      if (iList) result.improvements.forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s;
        iList.appendChild(li);
      });
    }
    if (result.correctedExamples) {
      var exBox = container.querySelector("#ai-examples");
      if (exBox) result.correctedExamples.forEach(function (ex) {
        var div = document.createElement("div");
        div.className = "ai-example";
        var o = document.createElement("div");
        o.className = "ai-example-original";
        o.textContent = ex.original;
        var s = document.createElement("div");
        s.className = "ai-example-suggestion";
        s.textContent = "→ " + ex.suggestion;
        div.appendChild(o);
        div.appendChild(s);
        exBox.appendChild(div);
      });
    }

    container.style.display = "";
  }

  function init() {
    var setupPanel = document.getElementById("ai-key-setup");
    var readyPanel = document.getElementById("ai-key-ready");
    var keyInput = document.getElementById("ai-key-input");
    var keySaveBtn = document.getElementById("ai-key-save");
    var keyMasked = document.getElementById("ai-key-masked");
    var keyChangeBtn = document.getElementById("ai-key-change");
    var modelSelect = document.getElementById("ai-model-select");
    var gradeBtn = document.getElementById("ai-grade-btn");
    var resultBox = document.getElementById("ai-result");

    if (!setupPanel) return; // not on this page

    function showReady(settings) {
      setupPanel.style.display = "none";
      readyPanel.style.display = "";
      keyMasked.textContent = maskKey(settings.apiKey);
      modelSelect.value = settings.model || DEFAULT_MODEL;
    }

    function showSetup(existingKey) {
      setupPanel.style.display = "";
      readyPanel.style.display = "none";
      if (existingKey) keyInput.value = existingKey;
    }

    var settings = loadSettings();
    if (settings && settings.apiKey) {
      showReady(settings);
    } else {
      showSetup();
    }

    keySaveBtn.addEventListener("click", function () {
      var key = keyInput.value.trim();
      if (!key) {
        showToast("Vui lòng dán API key trước.");
        return;
      }
      var newSettings = { apiKey: key, model: (modelSelect && modelSelect.value) || DEFAULT_MODEL };
      saveSettings(newSettings);
      showReady(newSettings);
      showToast("Đã lưu API key trên trình duyệt này.");
    });

    keyChangeBtn.addEventListener("click", function () {
      var s = loadSettings();
      showSetup(s ? s.apiKey : "");
    });

    modelSelect.addEventListener("change", function () {
      var s = loadSettings() || {};
      s.model = modelSelect.value;
      saveSettings(s);
    });

    gradeBtn.addEventListener("click", async function () {
      var s = loadSettings();
      if (!s || !s.apiKey) {
        showToast("Chưa có API key.");
        return;
      }
      var essayInput = document.getElementById("essay-input");
      var questionInput = document.getElementById("question-input");
      var taskSelect = document.getElementById("task-select");
      var essay = essayInput.value.trim();
      if (!essay) {
        showToast("Hãy viết bài trước khi chấm điểm.");
        return;
      }
      var wordCount = essay.trim().split(/\s+/).length;

      resultBox.style.display = "";
      resultBox.innerHTML = '<div class="ai-loading"><span class="ai-spinner"></span>Đang gửi bài viết tới Gemini để chấm điểm…</div>';
      gradeBtn.disabled = true;

      try {
        var result = await callGemini(s, taskSelect.value, questionInput.value.trim(), essay, wordCount);
        renderResult(resultBox, result);
      } catch (err) {
        resultBox.innerHTML = '<div class="ai-error">' + (err && err.message ? err.message : "Đã có lỗi xảy ra khi gọi Gemini API.") + "</div>";
      } finally {
        gradeBtn.disabled = false;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function () {
  "use strict";

  var PROGRESS_KEY = "ielts-vocab-progress";
  var INTERVALS_DAYS = [1, 2, 4, 7, 14, 30, 60];

  var deckGrid = document.getElementById("deck-grid");
  var deckView = document.getElementById("deck-view");
  var studyView = document.getElementById("study-view");
  var backBtn = document.getElementById("back-to-decks");
  var flashCard = document.getElementById("flash-card");
  var flashTerm = document.getElementById("flash-term");
  var flashMeaning = document.getElementById("flash-meaning");
  var flashExample = document.getElementById("flash-example");
  var flashHint = document.getElementById("flash-hint");
  var flashProgress = document.getElementById("flash-progress");
  var flashRateRow = document.getElementById("flash-rate-row");

  var queue = [];
  var queueIndex = 0;
  var currentDeckId = null;

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      /* ignore */
    }
  }

  function isDue(record) {
    if (!record) return true;
    return record.due <= todayStr();
  }

  function countDue(deck, progress) {
    return deck.words.filter(function (w) { return isDue(progress[w.term]); }).length;
  }

  function renderDecks() {
    var progress = loadProgress();
    deckGrid.innerHTML = "";
    window.IELTS_VOCAB_DECKS.forEach(function (deck) {
      var due = countDue(deck, progress);
      var card = document.createElement("div");
      card.className = "deck-card";
      card.innerHTML =
        "<h3>" + deck.name + "</h3>" +
        '<div class="deck-count">' + deck.words.length + "</div>" +
        '<div style="font-size:0.75rem; color:var(--color-text-muted); margin-bottom:8px;">thẻ trong bộ</div>' +
        (due > 0 ? '<div class="deck-due">' + due + " thẻ cần ôn hôm nay</div>" : '<div style="font-size:0.78rem; color:var(--color-success); font-weight:700;">Đã ôn hết hôm nay ✓</div>') +
        '<button class="btn btn-primary btn-sm" style="margin-top:12px; width:100%;" data-deck="' + deck.id + '">Bắt đầu ôn tập</button>';
      deckGrid.appendChild(card);
    });
  }

  deckGrid.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-deck]");
    if (!btn) return;
    startStudy(btn.getAttribute("data-deck"));
  });

  function startStudy(deckId) {
    var deck = window.IELTS_VOCAB_DECKS.find(function (d) { return d.id === deckId; });
    if (!deck) return;
    var progress = loadProgress();
    var due = deck.words.filter(function (w) { return isDue(progress[w.term]); });
    var pool = due.length > 0 ? due : deck.words.slice(); // nothing due — allow reviewing ahead
    queue = pool.slice().sort(function () { return Math.random() - 0.5; });
    queueIndex = 0;
    currentDeckId = deckId;
    deckView.style.display = "none";
    studyView.style.display = "";
    showCard();
  }

  function showCard() {
    if (queueIndex >= queue.length) {
      flashCard.classList.remove("flipped");
      flashCard.innerHTML = '<div class="flash-done">🎉 Đã ôn xong bộ thẻ này!<br><button class="btn btn-primary btn-sm" style="margin-top:14px;" id="study-again">Ôn lại từ đầu</button></div>';
      flashRateRow.style.display = "none";
      flashProgress.textContent = "";
      document.getElementById("study-again").addEventListener("click", function () { startStudy(currentDeckId); });
      return;
    }
    var word = queue[queueIndex];
    flashCard.classList.remove("flipped");
    flashCard.innerHTML =
      '<div class="flash-term">' + escapeHtml(word.term) + "</div>" +
      '<div class="flash-meaning">' + escapeHtml(word.meaning) + "</div>" +
      '<div class="flash-example">' + escapeHtml(word.example) + "</div>" +
      '<div class="flash-hint">Bấm vào thẻ để xem nghĩa</div>';
    flashRateRow.style.display = "none";
    flashProgress.textContent = "Thẻ " + (queueIndex + 1) + " / " + queue.length;

    flashCard.addEventListener("click", flipCard, { once: true });
  }

  function flipCard() {
    flashCard.classList.add("flipped");
    var hint = flashCard.querySelector(".flash-hint");
    if (hint) hint.textContent = "Bạn nhớ từ này đến mức nào?";
    flashRateRow.style.display = "flex";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  flashRateRow.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-rate]");
    if (!btn) return;
    rateCurrentCard(btn.getAttribute("data-rate"));
  });

  function addDays(dateStr, days) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function rateCurrentCard(rating) {
    var word = queue[queueIndex];
    var progress = loadProgress();
    var record = progress[word.term] || { box: 0, reps: 0 };

    if (rating === "again") {
      record.box = 0;
    } else if (rating === "good") {
      record.box = Math.min(record.box + 1, INTERVALS_DAYS.length - 1);
    } else {
      record.box = Math.min(record.box + 2, INTERVALS_DAYS.length - 1);
    }
    record.reps = (record.reps || 0) + 1;
    record.due = addDays(todayStr(), INTERVALS_DAYS[record.box]);
    record.lastReviewed = new Date().toISOString();

    progress[word.term] = record;
    saveProgress(progress);

    queueIndex++;
    showCard();
  }

  backBtn.addEventListener("click", function () {
    studyView.style.display = "none";
    deckView.style.display = "";
    renderDecks();
  });

  renderDecks();
})();

// Lets a learner type in their own numbers and get a Task 1 chart to
// describe — useful once the 3 bundled sample charts have been used up.
// Reuses the same categorical palette tokens and layout conventions as
// chart-data.js so generated charts look consistent with the site.
(function () {
  "use strict";

  var SERIES_COLORS = ["var(--chart-series-1)", "var(--chart-series-2)", "var(--chart-series-3)"];
  var PIE_SLOT_VARS = ["--chart-series-1", "--chart-series-2", "--chart-series-3", "--chart-series-4", "--chart-series-5", "--chart-series-6"];
  var PIE_TEXT_COLOR = ["#ffffff", "#ffffff", "#ffffff", "#12141c", "#12141c", "#ffffff"];

  function niceAxis(max) {
    if (max <= 0) max = 1;
    var ticks = 5;
    var rough = max / ticks;
    var mag = Math.pow(10, Math.floor(Math.log10(rough)));
    var norm = rough / mag;
    var step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    step = step * mag;
    return { max: step * ticks, step: step, ticks: ticks };
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderLineChart(categories, series) {
    var axis = niceAxis(Math.max.apply(null, series.flatMap(function (s) { return s.values; })));
    var left = 60, right = 600, top = 20, bottom = 300;
    var xStep = (right - left) / (categories.length - 1);

    function xAt(i) { return left + i * xStep; }
    function yAt(v) { return bottom - (v / axis.max) * (bottom - top); }

    var gridHtml = "", yLabelsHtml = "";
    for (var t = 0; t <= axis.ticks; t++) {
      var val = t * axis.step;
      var y = yAt(val);
      gridHtml += '<line class="viz-grid" x1="' + left + '" y1="' + y + '" x2="' + right + '" y2="' + y + '"/>';
      yLabelsHtml += '<text x="' + (left - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11">' + val + "</text>";
    }

    var xLabelsHtml = categories.map(function (c, i) {
      return '<text x="' + xAt(i) + '" y="' + (bottom + 18) + '" text-anchor="middle" font-size="11">' + escapeHtml(c) + "</text>";
    }).join("");

    var linesHtml = "", dotsHtml = "", endLabelsHtml = "", legendHtml = "";
    series.forEach(function (s, si) {
      var color = SERIES_COLORS[si % SERIES_COLORS.length];
      var points = s.values.map(function (v, i) { return xAt(i) + "," + yAt(v); }).join(" ");
      linesHtml += '<polyline class="viz-line" stroke="' + color + '" points="' + points + '"/>';
      s.values.forEach(function (v, i) {
        dotsHtml += '<circle class="viz-dot" cx="' + xAt(i) + '" cy="' + yAt(v) + '" r="4" fill="' + color + '"/>';
      });
      var lastV = s.values[s.values.length - 1];
      var lastY = yAt(lastV);
      endLabelsHtml += '<rect x="' + (right + 8) + '" y="' + (lastY - 4) + '" width="8" height="8" fill="' + color + '"/>' +
        '<text class="viz-endlabel" x="' + (right + 20) + '" y="' + (lastY + 5) + '">' + lastV + "</text>";
      legendHtml += '<span class="viz-legend-item"><span class="viz-legend-dot" style="background:' + color + '"></span>' + escapeHtml(s.name) + "</span>";
    });

    return '<figure class="viz-figure">' +
      '<svg class="viz-root" viewBox="0 0 700 340" role="img">' +
      gridHtml + yLabelsHtml +
      '<line class="viz-axis" x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '"/>' +
      '<line class="viz-axis" x1="' + left + '" y1="' + top + '" x2="' + left + '" y2="' + bottom + '"/>' +
      xLabelsHtml + linesHtml + dotsHtml + endLabelsHtml +
      "</svg>" +
      '<div class="viz-legend">' + legendHtml + "</div>" +
      "</figure>";
  }

  function renderBarChart(categories, series) {
    var axis = niceAxis(Math.max.apply(null, series.flatMap(function (s) { return s.values; })));
    var left = 60, right = 600, top = 20, bottom = 300;
    var groupWidth = (right - left) / categories.length;
    var n = series.length;
    var barWidth = Math.min(24, (groupWidth - 14) / n);
    var gap = 3;
    var clusterWidth = barWidth * n + gap * (n - 1);

    function yAt(v) { return bottom - (v / axis.max) * (bottom - top); }

    var gridHtml = "", yLabelsHtml = "";
    for (var t = 0; t <= axis.ticks; t++) {
      var val = t * axis.step;
      var y = yAt(val);
      gridHtml += '<line class="viz-grid" x1="' + left + '" y1="' + y + '" x2="' + right + '" y2="' + y + '"/>';
      yLabelsHtml += '<text x="' + (left - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11">' + val + "</text>";
    }

    var barsHtml = "", xLabelsHtml = "", legendHtml = "";
    categories.forEach(function (cat, ci) {
      var groupStart = left + ci * groupWidth + (groupWidth - clusterWidth) / 2;
      xLabelsHtml += '<text x="' + (left + ci * groupWidth + groupWidth / 2) + '" y="' + (bottom + 18) + '" text-anchor="middle" font-size="11">' + escapeHtml(cat) + "</text>";
      series.forEach(function (s, si) {
        var v = s.values[ci];
        var barX = groupStart + si * (barWidth + gap);
        var barY = yAt(v);
        var h = bottom - barY;
        var color = SERIES_COLORS[si % SERIES_COLORS.length];
        barsHtml += '<rect x="' + barX + '" y="' + barY + '" width="' + barWidth + '" height="' + h + '" rx="3" fill="' + color + '"/>';
      });
    });
    series.forEach(function (s, si) {
      legendHtml += '<span class="viz-legend-item"><span class="viz-legend-dot" style="background:' + SERIES_COLORS[si % SERIES_COLORS.length] + '"></span>' + escapeHtml(s.name) + "</span>";
    });

    return '<figure class="viz-figure">' +
      '<svg class="viz-root" viewBox="0 0 700 340" role="img">' +
      gridHtml + yLabelsHtml +
      '<line class="viz-axis" x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '"/>' +
      '<line class="viz-axis" x1="' + left + '" y1="' + top + '" x2="' + left + '" y2="' + bottom + '"/>' +
      xLabelsHtml + barsHtml +
      "</svg>" +
      '<div class="viz-legend">' + legendHtml + "</div>" +
      "</figure>";
  }

  function polarToCartesian(cx, cy, r, angleDeg) {
    var a = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function renderPieChart(categories, values) {
    var total = values.reduce(function (a, b) { return a + b; }, 0) || 1;
    var cx = 130, cy = 130, r = 110;
    var angle = 0;
    var pathsHtml = "", labelsHtml = "", legendHtml = "";

    categories.forEach(function (cat, i) {
      var pct = values[i] / total * 100;
      var sweep = pct / 100 * 360;
      var start = polarToCartesian(cx, cy, r, angle);
      var end = polarToCartesian(cx, cy, r, angle + sweep);
      var largeArc = sweep > 180 ? 1 : 0;
      var colorVar = "var(" + PIE_SLOT_VARS[i % PIE_SLOT_VARS.length] + ")";
      var textColor = PIE_TEXT_COLOR[i % PIE_TEXT_COLOR.length];
      var labelPos = polarToCartesian(cx, cy, r * 0.62, angle + sweep / 2);

      pathsHtml += '<path d="M ' + cx + "," + cy + " L " + start.x.toFixed(2) + "," + start.y.toFixed(2) +
        " A " + r + "," + r + " 0 " + largeArc + " 1 " + end.x.toFixed(2) + "," + end.y.toFixed(2) +
        ' Z" fill="' + colorVar + '"/>';
      labelsHtml += '<text class="viz-slice-label" x="' + labelPos.x.toFixed(1) + '" y="' + labelPos.y.toFixed(1) + '" text-anchor="middle" fill="' + textColor + '">' + Math.round(pct) + "%</text>";
      legendHtml += '<span class="viz-legend-item"><span class="viz-legend-dot" style="background:' + colorVar + '"></span>' + escapeHtml(cat) + "</span>";

      angle += sweep;
    });

    return '<figure class="viz-figure">' +
      '<div class="viz-pies">' +
      '<div class="viz-pie-block">' +
      '<svg class="viz-root" viewBox="0 0 260 260" width="260" height="260" role="img">' + pathsHtml + labelsHtml + "</svg>" +
      "</div></div>" +
      '<div class="viz-legend">' + legendHtml + "</div>" +
      "</figure>";
  }

  function init() {
    var toggleWrap = document.getElementById("chart-builder-toggle-wrap");
    var toggleBtn = document.getElementById("chart-builder-toggle");
    var panel = document.getElementById("chart-builder-panel");
    var taskSelectEl = document.getElementById("task-select");
    var typeSelect = document.getElementById("cb-type");
    var categoriesLabel = document.getElementById("cb-categories-label");
    var categoriesInput = document.getElementById("cb-categories");
    var titleInput = document.getElementById("cb-title");
    var seriesContainer = document.getElementById("cb-series-container");
    var addSeriesBtn = document.getElementById("cb-add-series");
    var generateBtn = document.getElementById("cb-generate");
    var clearBtn = document.getElementById("cb-clear");
    var chartReference = document.getElementById("chart-reference");
    var questionInput = document.getElementById("question-input");

    if (!toggleWrap) return; // not on this page

    function syncVisibility() {
      var isTask1 = taskSelectEl.value === "task1";
      toggleWrap.style.display = isTask1 ? "" : "none";
      if (!isTask1) panel.style.display = "none";
    }
    taskSelectEl.addEventListener("change", syncVisibility);
    syncVisibility();

    toggleBtn.addEventListener("click", function () {
      panel.style.display = panel.style.display === "none" ? "" : "none";
    });

    typeSelect.addEventListener("change", function () {
      var isPie = typeSelect.value === "pie";
      categoriesLabel.textContent = isPie ? "Tên các phần" : "Nhãn trục X";
      categoriesInput.placeholder = isPie ? "VD: Housing,Food,Leisure,Transport,Other" : "VD: 2015,2016,2017,2018,2019,2020";
      addSeriesBtn.style.display = isPie ? "none" : "";
    });

    addSeriesBtn.addEventListener("click", function () {
      var rows = seriesContainer.querySelectorAll(".builder-series-row");
      if (rows.length >= 3) {
        showToast("Tối đa 3 chuỗi dữ liệu.");
        return;
      }
      var row = document.createElement("div");
      row.className = "builder-series-row";
      row.innerHTML = '<input type="text" class="builder-series-name" placeholder="Tên chuỗi ' + (rows.length + 1) + '">' +
        '<input type="text" class="builder-series-values" placeholder="Giá trị, cách nhau bởi dấu phẩy">';
      seriesContainer.appendChild(row);
    });

    function parseNumberList(str) {
      return str.split(",").map(function (s) { return parseFloat(s.trim()); });
    }

    generateBtn.addEventListener("click", function () {
      var type = typeSelect.value;
      var categories = categoriesInput.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var rows = Array.from(seriesContainer.querySelectorAll(".builder-series-row"));
      var series = rows.map(function (row, i) {
        var name = row.querySelector(".builder-series-name").value.trim() || ("Series " + (i + 1));
        var values = parseNumberList(row.querySelector(".builder-series-values").value);
        return { name: name, values: values };
      }).filter(function (s) { return s.values.length > 0 && !s.values.some(isNaN); });

      if (categories.length < 2) {
        showToast(type === "pie" ? "Cần ít nhất 2 phần." : "Cần ít nhất 2 nhãn trục X.");
        return;
      }
      if (type === "pie" && categories.length > 6) {
        showToast("Pie chart chỉ nên có tối đa 6 phần.");
        return;
      }
      if (series.length === 0) {
        showToast("Hãy nhập ít nhất 1 chuỗi dữ liệu hợp lệ.");
        return;
      }
      var mismatched = series.some(function (s) { return s.values.length !== categories.length; });
      if (mismatched) {
        showToast("Số giá trị mỗi chuỗi phải bằng số nhãn trục X (" + categories.length + ").");
        return;
      }

      var html;
      if (type === "line") {
        html = renderLineChart(categories, series);
      } else if (type === "bar") {
        html = renderBarChart(categories, series);
      } else {
        html = renderPieChart(categories, series[0].values);
      }

      chartReference.innerHTML = html;
      chartReference.style.display = "";

      var title = titleInput.value.trim();
      var typeLabel = type === "line" ? "The graph below shows" : type === "bar" ? "The chart below shows" : "The chart below shows";
      questionInput.value = typeLabel + " " + (title || "the data described below") + ". Summarise the information by selecting and reporting the main features, and make comparisons where relevant.";

      showToast("Đã tạo biểu đồ!");
    });

    clearBtn.addEventListener("click", function () {
      chartReference.innerHTML = "";
      chartReference.style.display = "none";
    });
  }

  init();
})();

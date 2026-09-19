// Lets a learner type in their own numbers and get a Task 1 chart to
// describe — useful once the 3 bundled sample charts have been used up.
// Reuses the same categorical palette tokens and layout conventions as
// chart-data.js so generated charts look consistent with the site.
(function () {
  "use strict";

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
        html = window.ChartRender.line(categories, series);
      } else if (type === "bar") {
        html = window.ChartRender.bar(categories, series);
      } else {
        html = window.ChartRender.pie(categories, series[0].values);
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

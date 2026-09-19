// Shared chart renderers (line, bar, pie, table, process, map-schematic).
// Used by the custom chart builder AND by the real question bank, so a
// question's chart always renders the same way wherever it appears
// (question-bank.html list, and again in practice.html after "Luyện đề này").
window.ChartRender = (function () {
  "use strict";

  var SERIES_COLORS = ["var(--chart-series-1)", "var(--chart-series-2)", "var(--chart-series-3)"];
  var PIE_SLOT_VARS = ["--chart-series-1", "--chart-series-2", "--chart-series-3", "--chart-series-4", "--chart-series-5", "--chart-series-6"];
  var PIE_TEXT_COLOR = ["#ffffff", "#ffffff", "#ffffff", "#12141c", "#12141c", "#ffffff"];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

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

  function line(categories, series, opts) {
    opts = opts || {};
    var axis = niceAxis(Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.values); }, [])));
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
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function bar(categories, series, opts) {
    opts = opts || {};
    var axis = niceAxis(Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.values); }, [])));
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
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function polarToCartesian(cx, cy, r, angleDeg) {
    var a = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function pieSvg(categories, values) {
    var total = values.reduce(function (a, b) { return a + b; }, 0) || 1;
    var cx = 130, cy = 130, r = 110;
    var angle = 0;
    var pathsHtml = "", labelsHtml = "";

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
      angle += sweep;
    });

    return '<svg class="viz-root" viewBox="0 0 260 260" width="260" height="260" role="img">' + pathsHtml + labelsHtml + "</svg>";
  }

  function pieLegend(categories) {
    return categories.map(function (cat, i) {
      var colorVar = "var(" + PIE_SLOT_VARS[i % PIE_SLOT_VARS.length] + ")";
      return '<span class="viz-legend-item"><span class="viz-legend-dot" style="background:' + colorVar + '"></span>' + escapeHtml(cat) + "</span>";
    }).join("");
  }

  function pie(categories, values, opts) {
    opts = opts || {};
    return '<figure class="viz-figure">' +
      '<div class="viz-pies"><div class="viz-pie-block">' + pieSvg(categories, values) + "</div></div>" +
      '<div class="viz-legend">' + pieLegend(categories) + "</div>" +
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function piePair(categories, valuesA, valuesB, labelA, labelB, opts) {
    opts = opts || {};
    return '<figure class="viz-figure">' +
      '<div class="viz-pies">' +
      '<div class="viz-pie-block">' + pieSvg(categories, valuesA) + '<div class="viz-caption">' + escapeHtml(labelA) + "</div></div>" +
      '<div class="viz-pie-block">' + pieSvg(categories, valuesB) + '<div class="viz-caption">' + escapeHtml(labelB) + "</div></div>" +
      "</div>" +
      '<div class="viz-legend">' + pieLegend(categories) + "</div>" +
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function table(columns, rows, opts) {
    opts = opts || {};
    var headHtml = columns.map(function (c) { return "<th>" + escapeHtml(c) + "</th>"; }).join("");
    var bodyHtml = rows.map(function (r) {
      return "<tr>" + r.map(function (cell) { return "<td>" + escapeHtml(cell) + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<figure class="viz-figure">' +
      "<table><thead><tr>" + headHtml + "</tr></thead><tbody>" + bodyHtml + "</tbody></table>" +
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function process(steps, opts) {
    opts = opts || {};
    var html = steps.map(function (step, i) {
      var stepHtml = '<div class="process-step">' +
        '<span class="process-step-no">BƯỚC ' + (i + 1) + "</span>" +
        '<span class="process-icon">' + (step.icon || "▪️") + "</span>" +
        '<span class="process-label">' + escapeHtml(step.label) + "</span>" +
        "</div>";
      if (i < steps.length - 1) {
        return '<div class="process-pair">' + stepHtml + '<span class="process-arrow">→</span></div>';
      }
      return stepHtml;
    }).join("");
    return '<figure class="viz-figure"><div class="process-flow">' + html + "</div>" +
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function map(before, after, opts) {
    opts = opts || {};
    function panel(title, zones) {
      var items = zones.map(function (z) {
        return '<div class="viz-legend-item" style="font-size:0.85rem;"><span class="viz-legend-dot" style="background:' + z.color + '"></span>' + escapeHtml(z.label) + "</div>";
      }).join("");
      return '<div class="viz-pie-block" style="min-width:200px;">' +
        '<div style="font-weight:800; margin-bottom:10px;">' + escapeHtml(title) + "</div>" +
        '<div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">' + items + "</div>" +
        "</div>";
    }
    return '<figure class="viz-figure">' +
      '<p style="font-size:0.78rem; color:var(--color-text-muted); margin:0 0 12px;">Sơ đồ đơn giản hóa các khu vực thay đổi (không phải bản đồ địa lý thật):</p>' +
      '<div class="viz-pies">' + panel(before.title, before.zones) + '<span class="process-arrow" style="align-self:center;">→</span>' + panel(after.title, after.zones) + "</div>" +
      (opts.caption ? '<p class="viz-caption">' + escapeHtml(opts.caption) + "</p>" : "") +
      "</figure>";
  }

  function renderSpec(spec) {
    if (!spec) return "";
    switch (spec.type) {
      case "line": return line(spec.categories, spec.series, spec.opts);
      case "bar": return bar(spec.categories, spec.series, spec.opts);
      case "pie": return pie(spec.categories, spec.values, spec.opts);
      case "piePair": return piePair(spec.categories, spec.valuesA, spec.valuesB, spec.labelA, spec.labelB, spec.opts);
      case "table": return table(spec.columns, spec.rows, spec.opts);
      case "process": return process(spec.steps, spec.opts);
      case "map": return map(spec.before, spec.after, spec.opts);
      default: return "";
    }
  }

  return { line: line, bar: bar, pie: pie, piePair: piePair, table: table, process: process, map: map, renderSpec: renderSpec };
})();

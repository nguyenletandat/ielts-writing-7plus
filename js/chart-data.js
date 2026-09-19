// Shared Task 1 reference images (line graph, pie charts, process diagram).
// Used by both question-bank.html and practice.js so the exact same visual
// is shown wherever a given sample question appears.
window.IELTS_TASK1_CHARTS = [
  // 0 — Line graph: museum visitors 2000-2020
  {
    id: "line-museum",
    html: `
      <figure class="viz-figure">
        <svg class="viz-root" viewBox="0 0 680 340" role="img" aria-label="Line graph showing visitor numbers at three museums between 2000 and 2020">
          <line class="viz-grid" x1="60" y1="300" x2="600" y2="300"/>
          <line class="viz-grid" x1="60" y1="244" x2="600" y2="244"/>
          <line class="viz-grid" x1="60" y1="188" x2="600" y2="188"/>
          <line class="viz-grid" x1="60" y1="132" x2="600" y2="132"/>
          <line class="viz-grid" x1="60" y1="76"  x2="600" y2="76"/>
          <line class="viz-grid" x1="60" y1="20"  x2="600" y2="20"/>

          <text x="52" y="304" text-anchor="end" font-size="11">0</text>
          <text x="52" y="248" text-anchor="end" font-size="11">200</text>
          <text x="52" y="192" text-anchor="end" font-size="11">400</text>
          <text x="52" y="136" text-anchor="end" font-size="11">600</text>
          <text x="52" y="80"  text-anchor="end" font-size="11">800</text>
          <text x="52" y="24"  text-anchor="end" font-size="11">1000</text>

          <line class="viz-axis" x1="60" y1="300" x2="600" y2="300"/>
          <line class="viz-axis" x1="60" y1="20"  x2="60"  y2="300"/>

          <text x="60"  y="318" text-anchor="middle" font-size="11">2000</text>
          <text x="195" y="318" text-anchor="middle" font-size="11">2005</text>
          <text x="330" y="318" text-anchor="middle" font-size="11">2010</text>
          <text x="465" y="318" text-anchor="middle" font-size="11">2015</text>
          <text x="600" y="318" text-anchor="middle" font-size="11">2020</text>

          <polyline class="viz-line" stroke="var(--chart-series-1)" points="60,244 195,210.4 330,160 465,109.6 600,62"/>
          <polyline class="viz-line" stroke="var(--chart-series-2)" points="60,188 195,193.6 330,182.4 465,190.8 600,185.2"/>
          <polyline class="viz-line" stroke="var(--chart-series-3)" points="60,132 195,165.6 330,202 465,230 600,258"/>

          <circle class="viz-dot" cx="60"  cy="244"   r="4" fill="var(--chart-series-1)"/>
          <circle class="viz-dot" cx="195" cy="210.4" r="4" fill="var(--chart-series-1)"/>
          <circle class="viz-dot" cx="330" cy="160"   r="4" fill="var(--chart-series-1)"/>
          <circle class="viz-dot" cx="465" cy="109.6" r="4" fill="var(--chart-series-1)"/>
          <circle class="viz-dot" cx="600" cy="62"    r="4" fill="var(--chart-series-1)"/>

          <circle class="viz-dot" cx="60"  cy="188"   r="4" fill="var(--chart-series-2)"/>
          <circle class="viz-dot" cx="195" cy="193.6" r="4" fill="var(--chart-series-2)"/>
          <circle class="viz-dot" cx="330" cy="182.4" r="4" fill="var(--chart-series-2)"/>
          <circle class="viz-dot" cx="465" cy="190.8" r="4" fill="var(--chart-series-2)"/>
          <circle class="viz-dot" cx="600" cy="185.2" r="4" fill="var(--chart-series-2)"/>

          <circle class="viz-dot" cx="60"  cy="132" r="4" fill="var(--chart-series-3)"/>
          <circle class="viz-dot" cx="195" cy="165.6" r="4" fill="var(--chart-series-3)"/>
          <circle class="viz-dot" cx="330" cy="202" r="4" fill="var(--chart-series-3)"/>
          <circle class="viz-dot" cx="465" cy="230" r="4" fill="var(--chart-series-3)"/>
          <circle class="viz-dot" cx="600" cy="258" r="4" fill="var(--chart-series-3)"/>

          <rect x="608" y="57"    width="8" height="8" fill="var(--chart-series-1)"/>
          <text class="viz-endlabel" x="620" y="66">850k</text>
          <rect x="608" y="180.2" width="8" height="8" fill="var(--chart-series-2)"/>
          <text class="viz-endlabel" x="620" y="189.2">410k</text>
          <rect x="608" y="253"   width="8" height="8" fill="var(--chart-series-3)"/>
          <text class="viz-endlabel" x="620" y="262">150k</text>
        </svg>
        <div class="viz-legend">
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-1)"></span>Museum A</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-2)"></span>Museum B</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-3)"></span>Museum C</span>
        </div>
        <p class="viz-caption">Number of visitors (thousands) to three museums, 2000–2020</p>
      </figure>`
  },

  // 1 — Pie charts: household spending 1980 vs 2020
  {
    id: "pie-household",
    html: `
      <figure class="viz-figure">
        <div class="viz-pies">
          <div class="viz-pie-block">
            <svg class="viz-root" viewBox="0 0 260 260" width="260" height="260" role="img" aria-label="Pie chart of household spending in 1980">
              <path d="M 130,130 L 130.00,20.00 A 110,110 0 0 1 238.05,109.39 Z" fill="var(--chart-series-1)"/>
              <path d="M 130,130 L 238.05,109.39 A 110,110 0 0 1 116.21,239.13 Z" fill="var(--chart-series-2)"/>
              <path d="M 130,130 L 116.21,239.13 A 110,110 0 0 1 54.70,210.19 Z" fill="var(--chart-series-3)"/>
              <path d="M 130,130 L 54.70,210.19 A 110,110 0 0 1 20.87,116.21 Z" fill="var(--chart-series-4)"/>
              <path d="M 130,130 L 20.87,116.21 A 110,110 0 0 1 65.34,41.01 Z" fill="var(--chart-series-5)"/>
              <path d="M 130,130 L 65.34,41.01 A 110,110 0 0 1 130.00,20.00 Z" fill="var(--chart-series-6)"/>
              <text class="viz-slice-label" x="173.5" y="77.5"  text-anchor="middle" fill="#ffffff">22%</text>
              <text class="viz-slice-label" x="179.7" y="176.7" text-anchor="middle" fill="#ffffff">30%</text>
              <text class="viz-slice-label" x="101.0" y="191.7" text-anchor="middle" fill="#ffffff">10%</text>
              <text class="viz-slice-label" x="65.8"  y="153.1" text-anchor="middle" fill="#12141c">15%</text>
              <text class="viz-slice-label" x="71.3"  y="95.3"  text-anchor="middle" fill="#12141c">13%</text>
              <text class="viz-slice-label" x="108.9" y="65.1"  text-anchor="middle" fill="#ffffff">10%</text>
            </svg>
            <div class="viz-caption">1980</div>
          </div>
          <div class="viz-pie-block">
            <svg class="viz-root" viewBox="0 0 260 260" width="260" height="260" role="img" aria-label="Pie chart of household spending in 2020">
              <path d="M 130,130 L 130.00,20.00 A 110,110 0 0 1 218.99,194.66 Z" fill="var(--chart-series-1)"/>
              <path d="M 130,130 L 218.99,194.66 A 110,110 0 0 1 130.00,240.00 Z" fill="var(--chart-series-2)"/>
              <path d="M 130,130 L 130.00,240.00 A 110,110 0 0 1 25.38,163.99 Z" fill="var(--chart-series-3)"/>
              <path d="M 130,130 L 25.38,163.99 A 110,110 0 0 1 25.38,96.01 Z" fill="var(--chart-series-4)"/>
              <path d="M 130,130 L 25.38,96.01 A 110,110 0 0 1 77.01,33.61 Z" fill="var(--chart-series-5)"/>
              <path d="M 130,130 L 77.01,33.61 A 110,110 0 0 1 130.00,20.00 Z" fill="var(--chart-series-6)"/>
              <text class="viz-slice-label" x="190.8" y="99.0"  text-anchor="middle" fill="#ffffff">35%</text>
              <text class="viz-slice-label" x="161.0" y="190.8" text-anchor="middle" fill="#ffffff">15%</text>
              <text class="viz-slice-label" x="89.9"  y="185.2" text-anchor="middle" fill="#ffffff">20%</text>
              <text class="viz-slice-label" x="61.8"  y="130.0" text-anchor="middle" fill="#12141c">10%</text>
              <text class="viz-slice-label" x="77.5"  y="86.5"  text-anchor="middle" fill="#12141c">12%</text>
              <text class="viz-slice-label" x="113.0" y="63.9"  text-anchor="middle" fill="#ffffff">8%</text>
            </svg>
            <div class="viz-caption">2020</div>
          </div>
        </div>
        <div class="viz-legend">
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-1)"></span>Housing</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-2)"></span>Food</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-3)"></span>Leisure</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-4)"></span>Clothing</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-5)"></span>Transport</span>
          <span class="viz-legend-item"><span class="viz-legend-dot" style="background:var(--chart-series-6)"></span>Other</span>
        </div>
        <p class="viz-caption">Proportion of household spending, 1980 vs 2020</p>
      </figure>`
  },

  // 2 — Process diagram: plastic bottle recycling
  {
    id: "process-recycling",
    html: `
      <figure class="viz-figure">
        <div class="process-flow">
          <div class="process-pair">
            <div class="process-step">
              <span class="process-step-no">BƯỚC 1</span>
              <span class="process-icon">🗑️</span>
              <span class="process-label">Collection<br>(thu gom)</span>
            </div>
            <span class="process-arrow">→</span>
          </div>
          <div class="process-pair">
            <div class="process-step">
              <span class="process-step-no">BƯỚC 2</span>
              <span class="process-icon">🔀</span>
              <span class="process-label">Sorting<br>(phân loại)</span>
            </div>
            <span class="process-arrow">→</span>
          </div>
          <div class="process-pair">
            <div class="process-step">
              <span class="process-step-no">BƯỚC 3</span>
              <span class="process-icon">💧</span>
              <span class="process-label">Cleaning<br>(làm sạch)</span>
            </div>
            <span class="process-arrow">→</span>
          </div>
          <div class="process-pair">
            <div class="process-step">
              <span class="process-step-no">BƯỚC 4</span>
              <span class="process-icon">⚙️</span>
              <span class="process-label">Shredding<br>(nghiền nhỏ)</span>
            </div>
            <span class="process-arrow">→</span>
          </div>
          <div class="process-pair">
            <div class="process-step">
              <span class="process-step-no">BƯỚC 5</span>
              <span class="process-icon">🔥</span>
              <span class="process-label">Melting<br>(nung chảy)</span>
            </div>
            <span class="process-arrow">→</span>
          </div>
          <div class="process-step">
            <span class="process-step-no">BƯỚC 6</span>
            <span class="process-icon">⚪</span>
            <span class="process-label">Pelletizing<br>(tạo hạt nhựa)</span>
          </div>
        </div>
        <p class="viz-caption">The process of recycling plastic bottles</p>
      </figure>`
  }
];

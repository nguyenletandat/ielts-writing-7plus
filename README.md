# IELTS Writing 7.0+

Website tĩnh (HTML/CSS/JS thuần, không cần build) giúp tự học IELTS Writing hướng tới band 7.0 - 7.5.
Cài đặt được như một app (PWA), dùng offline sau lần mở đầu tiên.

## Tính năng

- **Bài học lý thuyết** (`lessons.html`) — cấu trúc bài, từ vựng, ngữ pháp và lỗi thường gặp cho cả Task 1 (biểu đồ, tiến trình, bản đồ) và Task 2 (opinion, discussion, problem-solution...).
- **Ngân hàng đề & bài mẫu** (`question-bank.html`) — 12 đề tiêu biểu kèm bài mẫu band 7.0 - 7.5 có ghi chú phân tích, cộng thêm **78 đề thi thật 2024-2026** tổng hợp từ báo cáo của thí sinh. Cả 13 đề Task 1 trong đó đều có **biểu đồ minh họa** (bar/line/pie/table/process/map). Lọc theo dạng bài và theo năm; mỗi đề có nút "Luyện đề này" mở thẳng sang trang luyện viết với đề (và biểu đồ, nếu có) đã điền sẵn.
- **Luyện viết** (`practice.html`) — chọn đề, bấm giờ (20'/40'), đếm từ tự động, lưu bài và xem lại lịch sử, checklist tự chấm nhanh, thống kê tiến độ (streak, số bài, biểu đồ 7 ngày gần nhất), xuất/nhập tiến trình dưới dạng `.json`, và **tự tạo biểu đồ Task 1** bằng dữ liệu tuỳ ý.
- **Chấm điểm bằng AI** (trong `practice.html`) — gọi trực tiếp Gemini API (Google AI Studio) bằng API key miễn phí của chính người dùng, chấm theo 4 tiêu chí IELTS kèm nhận xét và gợi ý sửa câu. Khóa chỉ lưu trên trình duyệt người dùng, trang web không có backend nên không thể lưu hay nhìn thấy khóa.
- **Flashcard từ vựng** (`flashcards.html`) — 66 từ theo 8 chủ đề, ôn bằng lặp lại ngắt quãng (spaced repetition) kiểu box, lưu tiến độ trên trình duyệt.
- **Paraphrase** (`paraphrase.html`) — 35 nhóm từ đồng nghĩa (verbs/adjectives/nouns/quantifiers/connectors) kèm ví dụ, có tìm kiếm và lọc.
- **Ngữ pháp** (`grammar.html`) — 10 chủ đề ngữ pháp trọng tâm cho band 7+ (mệnh đề quan hệ, câu điều kiện, bị động, cụm phân từ, đảo ngữ...) kèm checklist lỗi thường gặp.

Toàn bộ dữ liệu (lịch sử luyện viết, tiến độ flashcard, cài đặt AI) lưu bằng `localStorage` trên trình duyệt — không có tài khoản, không có backend.

## Dùng tính năng chấm điểm AI

1. Vào trang **Luyện viết**, mở khung "Chấm điểm bằng AI".
2. Bấm "Lấy khóa miễn phí" để tạo API key tại [Google AI Studio](https://aistudio.google.com/apikey) (cần tài khoản Google, có hạn mức miễn phí).
3. Dán khóa vào ô và bấm "Lưu khóa" — khóa chỉ lưu trong `localStorage` của trình duyệt này.
4. Viết bài xong, bấm "Chấm bài viết này".

## Chạy thử local

Không cần cài đặt gì — mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server đơn giản
(service worker/PWA chỉ hoạt động khi chạy qua HTTP(S), không hoạt động khi mở file trực tiếp bằng `file://`):

```bash
npx serve .
# hoặc
python -m http.server 8080
```

## Cấu trúc thư mục

```
├── index.html            # Trang chủ
├── lessons.html          # Bài học lý thuyết
├── question-bank.html    # Ngân hàng đề + bài mẫu
├── practice.html         # Luyện viết: bấm giờ, lưu bài, AI chấm điểm, thống kê, chart builder
├── flashcards.html       # Flashcard từ vựng (spaced repetition)
├── paraphrase.html       # Từ đồng nghĩa để paraphrase
├── grammar.html          # Ngữ pháp cho Writing
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker (cache app-shell để dùng offline)
├── assets/               # Icon PWA
├── css/style.css         # Toàn bộ style, hỗ trợ light/dark mode
└── js/
    ├── main.js                # Nav mobile, theme toggle, đăng ký service worker, tabs/accordion dùng chung
    ├── practice.js             # Timer, đếm từ, lưu/đọc lịch sử, thống kê, xuất/nhập .json
    ├── ai-grading.js           # Gọi Gemini API (Google AI Studio) để chấm điểm
    ├── chart-render.js         # Renderer dùng chung: line/bar/pie/table/process/map
    ├── chart-data.js           # 3 biểu đồ SVG tĩnh cho bài mẫu Task 1 minh họa
    ├── chart-builder.js        # UI tự tạo biểu đồ Task 1 với dữ liệu riêng
    ├── question-bank-data.js   # 78 đề thi thật 2024-2026 (+ dữ liệu biểu đồ cho 13 đề Task 1)
    ├── vocab-data.js           # 66 từ vựng cho flashcard
    ├── flashcards.js           # Logic spaced repetition
    └── paraphrase-data.js      # 35 nhóm từ đồng nghĩa
```

Đề thi thật trong `question-bank-data.js` được tổng hợp lại từ các trang chia sẻ đề thi công khai
(ieltsbuddy.com, ielts69.com, geeksforgeeks.org...) — chỉ giữ phần câu hỏi để luyện tập, không phải
nội dung độc quyền của IELTS/British Council/IDP. Dữ liệu biểu đồ cho 13 đề Task 1 là số liệu minh
họa tự dựng lại để luyện tập (nguồn gốc chỉ mô tả loại biểu đồ, không kèm số liệu thật).

## Triển khai lên GitHub Pages

Vào **Settings → Pages** của repo, chọn source là branch `master`, thư mục `/ (root)`.

# IELTS Writing 7.0+

Website tĩnh (HTML/CSS/JS thuần, không cần build) giúp tự học IELTS Writing hướng tới band 7.0 - 7.5.

## Tính năng

- **Bài học lý thuyết** (`lessons.html`) — cấu trúc bài, từ vựng, ngữ pháp và lỗi thường gặp cho cả Task 1 (biểu đồ, tiến trình, bản đồ) và Task 2 (opinion, discussion, problem-solution...).
- **Ngân hàng đề & bài mẫu** (`question-bank.html`) — đề thi kèm bài mẫu band 7.0 - 7.5 có ghi chú phân tích, lọc theo Task 1 / Task 2.
- **Luyện viết** (`practice.html`) — chọn đề, bấm giờ (20'/40'), đếm từ tự động, lưu bài và xem lại lịch sử luyện tập, checklist tự chấm nhanh. Dữ liệu lưu bằng `localStorage`, không cần tài khoản hay backend.

## Chạy thử local

Không cần cài đặt gì — mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server đơn giản:

```bash
npx serve .
# hoặc
python -m http.server 8080
```

## Cấu trúc thư mục

```
├── index.html          # Trang chủ
├── lessons.html         # Bài học lý thuyết
├── question-bank.html   # Ngân hàng đề + bài mẫu
├── practice.html        # Luyện viết có bấm giờ & lưu bài
├── css/style.css        # Toàn bộ style, hỗ trợ light/dark mode
└── js/
    ├── main.js           # Nav mobile, theme toggle, tabs/accordion dùng chung
    └── practice.js        # Logic timer, đếm từ, lưu/đọc lịch sử luyện tập
```

## Triển khai lên GitHub Pages

Vào **Settings → Pages** của repo, chọn source là branch `main`, thư mục `/ (root)`.

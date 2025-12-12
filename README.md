```markdown
# Demo: Website đặt chỗ chiếu phim (Front-end only)

Mô tả:
- Suất chiếu cố định: 19:30 ngày 19/12/2025 (hiển thị trên giao diện).
- Trang chọn ghế (index.html): sơ đồ ghế, ghế trống/đang chọn/đã đặt.
- Sau khi chọn ghế bấm "Tiếp tục đặt" => đến checkout (checkout.html) có form thông tin, thời gian giữ ghế (30 phút), QR code để khách quét thanh toán, nút hủy và xác nhận.
- Toàn bộ logic hiện tại chạy trên client, lưu tạm ghế đã chọn trong localStorage.

Chạy:
1. Tải tất cả file vào cùng thư mục:
   - index.html
   - checkout.html
   - styles.css
   - app.js
   - checkout.js
   - README.md
2. Mở `index.html` bằng trình duyệt (hoặc host tĩnh).
3. Chọn ghế (những ghế "occupied" là ví dụ), bấm "Tiếp tục đặt".
4. Điền thông tin, quét QR để thanh toán (QR là mã ví dụ chứa chuỗi PAY|...); bấm "Xác nhận đặt chỗ" để kết thúc.

Gợi ý mở rộng:
- Kết nối backend để quản lý trạng thái ghế thật (API để check/cập nhật ghế).
- Tạo trang ticket/success chi tiết sau khi thanh toán thành công.
- Giao dịch thực tế: tích hợp cổng thanh toán hoặc tạo QR tĩnh cho từng giao dịch => thanh toán thực.
```
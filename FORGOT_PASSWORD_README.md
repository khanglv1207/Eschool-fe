# Chức năng Quên Mật khẩu - eSchoolMed

## Tổng quan
Chức năng quên mật khẩu đã được tích hợp hoàn chỉnh vào hệ thống eSchoolMed, bao gồm cả frontend và backend.

## Các tính năng

### 1. Trang Quên Mật khẩu Riêng biệt
- **URL**: `/forgot-password`
- **Giao diện**: Hiện đại, responsive với progress indicator
- **3 bước thực hiện**:
  1. Nhập email để nhận OTP
  2. Xác thực mã OTP
  3. Đặt mật khẩu mới

### 2. Tích hợp trong Trang Login
- Link "Quên mật khẩu?" trong trang đăng nhập
- Modal quên mật khẩu (đã có sẵn)

## API Endpoints được sử dụng

### 1. Gửi OTP
```javascript
POST /api/users/request-password-reset
Body: { email: "user@example.com" }
```

### 2. Xác thực OTP
```javascript
POST /api/users/verify-otp
Body: { email: "user@example.com", otpCode: "123456" }
```

### 3. Đặt mật khẩu mới
```javascript
POST /api/users/reset-password
Body: { email: "user@example.com", newPassword: "newPassword123" }
```

## Cách sử dụng

### Cho người dùng:
1. Truy cập trang đăng nhập (`/login`)
2. Click vào link "Quên mật khẩu?" hoặc truy cập trực tiếp `/forgot-password`
3. Nhập email đã đăng ký
4. Kiểm tra email và nhập mã OTP
5. Đặt mật khẩu mới
6. Đăng nhập lại với mật khẩu mới

### Cho developer:
1. Đảm bảo backend đang chạy trên `localhost:8080`
2. Frontend sẽ tự động kết nối với backend
3. Các API calls được xử lý trong `src/services/userApi.js`

## Cấu trúc file

```
src/
├── pages/
│   ├── Login.jsx (đã có modal quên mật khẩu)
│   └── ForgotPassword.js (trang quên mật khẩu riêng biệt)
├── services/
│   ├── api.js (cấu hình axios)
│   └── userApi.js (các hàm API)
└── App.js (routing)
```

## Tính năng bảo mật

- Validation email format
- Validation mật khẩu (tối thiểu 6 ký tự)
- Xác nhận mật khẩu
- Loading states để tránh spam
- Error handling chi tiết
- Auto-redirect sau khi thành công

## Giao diện

- **Progress indicator**: Hiển thị tiến trình 3 bước
- **Responsive design**: Hoạt động tốt trên mobile và desktop
- **Loading states**: Hiển thị trạng thái đang xử lý
- **Error/Success messages**: Thông báo rõ ràng cho người dùng
- **Navigation**: Có thể quay lại hoặc bắt đầu lại

## Lưu ý

1. Backend cần có các endpoint tương ứng
2. Email service cần được cấu hình để gửi OTP
3. OTP có thời gian hết hạn (thường 5-10 phút)
4. Mật khẩu mới phải khác mật khẩu cũ
5. Cần có rate limiting để tránh spam

## Troubleshooting

### Lỗi thường gặp:
1. **"Không gửi được OTP"**: Kiểm tra email có tồn tại trong hệ thống
2. **"OTP không hợp lệ"**: Kiểm tra mã OTP và thời gian hết hạn
3. **"Đổi mật khẩu thất bại"**: Kiểm tra format mật khẩu và kết nối backend

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Đảm bảo backend đang chạy và accessible 
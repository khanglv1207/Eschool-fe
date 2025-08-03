# Form Khai Báo Sức Khỏe - Health Profile Form

## Tổng quan

Form khai báo sức khỏe mới được tạo để gửi dữ liệu lên database thông qua API endpoint `/health-profile`. Form này thay thế cho form khai báo sức khỏe cũ chỉ lưu dữ liệu local.

## Tính năng

### 1. Giao diện người dùng
- **Thiết kế hiện đại**: Sử dụng glassmorphism và gradient effects
- **Dark mode**: Có thể chuyển đổi giữa chế độ sáng và tối
- **Responsive**: Tương thích với các thiết bị khác nhau
- **Animations**: Hiệu ứng mượt mà khi tương tác

### 2. Các trường thông tin
- **Dị ứng**: Textarea để nhập các dị ứng (nếu có)
- **Bệnh mãn tính**: Textarea để nhập các bệnh mãn tính
- **Tiền sử bệnh**: Textarea để nhập tiền sử bệnh
- **Thị lực**: Dropdown với các lựa chọn (Tốt, Trung bình, Kém, Cần đeo kính)
- **Thính lực**: Dropdown với các lựa chọn (Tốt, Trung bình, Kém, Cần máy trợ thính)
- **Lịch sử tiêm chủng**: Textarea để nhập lịch sử tiêm chủng

### 3. Xử lý dữ liệu
- **Validation**: Kiểm tra dữ liệu trước khi gửi
- **Loading state**: Hiển thị trạng thái đang xử lý
- **Error handling**: Xử lý lỗi và hiển thị thông báo
- **Success feedback**: Thông báo thành công với animation

## Cấu trúc Database

Form gửi dữ liệu đến bảng `health_profiles` với các cột:

```sql
CREATE TABLE health_profiles (
    profile_id UUID PRIMARY KEY,
    student_id UUID,
    allergies VARCHAR(255),
    chronic_diseases VARCHAR(255),
    medical_history VARCHAR(255),
    eyesight VARCHAR(255),
    hearing VARCHAR(255),
    vaccination_record VARCHAR(255),
    created_at TIMESTAMP,
    last_updated_at TIMESTAMP
);
```

## API Endpoints

### POST /health-profile
- **Mô tả**: Tạo hoặc cập nhật health profile
- **Request Body**:
```json
{
  "allergies": "string",
  "chronicDiseases": "string", 
  "medicalHistory": "string",
  "eyesight": "string",
  "hearing": "string",
  "vaccinationRecord": "string"
}
```
- **Response**:
```json
{
  "message": "Khai báo sức khỏe thành công",
  "result": "OK"
}
```

## Cách sử dụng

### 1. Truy cập form
- Điều hướng đến `/health-declaration`
- Nhấn nút "Gửi khai báo sức khỏe"
- Chọn "OK" để sử dụng form mới (gửi lên database)
- Chọn "Cancel" để sử dụng form cũ (lưu local)

### 2. Điền thông tin
- Điền đầy đủ các trường thông tin
- Các trường có dấu * là bắt buộc
- Sử dụng textarea cho thông tin chi tiết
- Chọn từ dropdown cho thị lực và thính lực

### 3. Gửi form
- Nhấn nút "Gửi khai báo sức khỏe"
- Đợi xử lý và nhận thông báo kết quả
- Form sẽ tự động reset sau khi thành công

## Files liên quan

### Components
- `src/pages/HealthProfileForm.js` - Form chính
- `src/components/Notification.js` - Component thông báo

### Services
- `src/services/healthProfileApi.js` - API service cho health profile
- `src/services/api.js` - Base API configuration

### Routing
- `src/App.js` - Route configuration
- Route: `/health-profile-form`

## Tính năng bảo mật

1. **Authentication**: Kiểm tra đăng nhập trước khi truy cập
2. **JWT Token**: Tự động gửi token trong header
3. **Input Validation**: Kiểm tra dữ liệu đầu vào
4. **Error Handling**: Xử lý lỗi an toàn

## Tùy chỉnh

### Thêm trường mới
1. Thêm field vào state trong `HealthProfileForm.js`
2. Thêm input/textarea tương ứng
3. Cập nhật API service nếu cần
4. Cập nhật database schema

### Thay đổi styling
- Chỉnh sửa object `styles` trong component
- Thêm CSS animations trong `index.css`
- Tùy chỉnh component `Notification.js`

## Troubleshooting

### Lỗi thường gặp

1. **"react-scripts is not recognized"**
   - Chạy `npm install --legacy-peer-deps`
   - Khởi động lại development server

2. **API connection error**
   - Kiểm tra backend server có đang chạy không
   - Kiểm tra URL trong `api.js`
   - Kiểm tra JWT token trong localStorage

3. **Form không submit được**
   - Kiểm tra console để xem lỗi
   - Kiểm tra network tab trong DevTools
   - Đảm bảo đã đăng nhập

### Debug
- Mở DevTools (F12)
- Kiểm tra Console tab cho lỗi JavaScript
- Kiểm tra Network tab cho API calls
- Kiểm tra Application tab cho localStorage

## Tương lai

### Tính năng có thể thêm
1. **File upload**: Cho phép upload file đính kèm
2. **Auto-save**: Tự động lưu draft
3. **History**: Xem lịch sử khai báo
4. **Export**: Xuất báo cáo PDF
5. **Multi-language**: Hỗ trợ đa ngôn ngữ

### Cải tiến
1. **Performance**: Lazy loading, code splitting
2. **Accessibility**: ARIA labels, keyboard navigation
3. **Testing**: Unit tests, integration tests
4. **Documentation**: API documentation, user guide 
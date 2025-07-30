# Nurse Portal - EschoolMED

## Tổng quan
Nurse Portal là hệ thống quản lý dành riêng cho y tá trường học với đầy đủ các chức năng cần thiết để thực hiện công việc hàng ngày.

## Các tính năng chính

### 1. Dashboard Y tá
- **Tổng quan thống kê**: Hiển thị số lượng yêu cầu thuốc, học sinh đã xác nhận, lịch trình hôm nay
- **Thao tác nhanh**: Các nút truy cập nhanh đến các chức năng chính
- **Hoạt động gần đây**: Timeline các hoạt động đã thực hiện
- **Thống kê tuần**: Biểu đồ thống kê công việc trong tuần

### 2. Quản lý Yêu cầu Thuốc
- **Danh sách yêu cầu**: Hiển thị tất cả yêu cầu thuốc đang chờ xử lý
- **Thông tin chi tiết**: Học sinh, loại thuốc, liều lượng, thời gian, lý do
- **Cập nhật trạng thái**: Duyệt, từ chối, hoàn thành yêu cầu thuốc
- **Ghi chú**: Thêm ghi chú khi cập nhật trạng thái

### 3. Kiểm tra Sức khỏe
- **Danh sách học sinh**: Hiển thị học sinh đã xác nhận và sẵn sàng kiểm tra
- **Form kiểm tra chi tiết**: 
  - Thông tin cơ bản: nhiệt độ, huyết áp, nhịp tim
  - Thông tin thể chất: cân nặng, chiều cao
  - Triệu chứng và chẩn đoán
  - Khuyến nghị điều trị
  - Theo dõi và tái khám

### 4. Layout dành riêng cho Y tá
- **Sidebar navigation**: Menu điều hướng với các chức năng chính
- **Header**: Hiển thị thông tin y tá và logo
- **Responsive design**: Tương thích với mọi thiết bị

## Kết nối API

### Endpoints được sử dụng:
- `GET /api/nurse/today-schedules/{studentId}` - Lấy lịch trình hôm nay
- `GET /api/nurse/medication-requests/pending` - Lấy yêu cầu thuốc đang chờ
- `GET /api/nurse/confirmed-students` - Lấy học sinh đã xác nhận
- `POST /api/nurse/health-checkup` - Gửi kết quả kiểm tra sức khỏe
- `PUT /api/nurse/update-medication-status` - Cập nhật trạng thái thuốc
- `PUT /api/nurse/mark-schedule-as-taken/{scheduleId}` - Đánh dấu lịch trình đã thực hiện

### Cấu trúc Response cho Medication Requests:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "requestId": "uuid",
      "studentName": "string",
      "className": "string",
      "medicationName": "string",
      "dosage": "string",
      "frequency": "string",
      "startDate": "date",
      "endDate": "date",
      "reason": "string",
      "status": "PENDING"
    }
  ]
}
```

### Cấu trúc Response cho Confirmed Students:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "studentId": "uuid",
      "studentName": "string",
      "className": "string",
      "registrationDate": "date",
      "checkupReason": "string"
    }
  ]
}
```

### Cấu trúc Request cho Health Checkup:
```json
{
  "studentId": "uuid",
  "checkupDate": "date",
  "temperature": "number",
  "bloodPressure": "string",
  "heartRate": "number",
  "weight": "number",
  "height": "number",
  "symptoms": "string",
  "diagnosis": "string",
  "recommendations": "string",
  "followUpNeeded": "boolean",
  "followUpDate": "date"
}
```

### Cấu trúc Request cho Update Medication Status:
```json
{
  "requestId": "uuid",
  "status": "APPROVED|REJECTED|COMPLETED",
  "notes": "string"
}
```

## Xử lý lỗi

### Error Handling:
- Hiển thị alert error với nút đóng
- Loading states cho tất cả actions
- Validation form
- Network error handling
- API error message display

### Loading States:
- Spinner khi tải danh sách
- Disable buttons khi đang xử lý
- Loading text trên buttons

## Giao diện

### Responsive Design:
- Bootstrap 5 components
- Mobile-friendly layout
- Responsive table
- Modal dialogs
- Tab navigation

### UI/UX Features:
- Clean và modern design
- Consistent styling với NurseLayout
- Intuitive navigation
- Clear action buttons
- Confirmation dialogs
- Avatar placeholders cho học sinh
- Badge màu sắc phân biệt trạng thái
- Timeline cho hoạt động

## Cách sử dụng

### Truy cập portal:
1. Đăng nhập với tài khoản y tá
2. Truy cập `/nurse/dashboard`
3. Hoặc truy cập trực tiếp các trang con

### Xử lý yêu cầu thuốc:
1. Vào menu "Yêu cầu thuốc"
2. Xem danh sách yêu cầu đang chờ
3. Click icon edit để cập nhật trạng thái
4. Chọn trạng thái và thêm ghi chú
5. Click "Cập nhật"

### Kiểm tra sức khỏe:
1. Vào menu "Kiểm tra sức khỏe"
2. Xem danh sách học sinh đã xác nhận
3. Click "Kiểm tra" bên cạnh học sinh
4. Điền thông tin kiểm tra chi tiết
5. Click "Gửi kết quả"

### Dashboard:
- Xem tổng quan thống kê
- Sử dụng các nút thao tác nhanh
- Theo dõi hoạt động gần đây
- Xem thống kê tuần

## Cấu hình

### Environment Variables:
- API base URL được cấu hình trong `src/services/api.js`
- CORS settings cần được cấu hình ở backend

### Dependencies:
- React 18+
- Bootstrap 5
- Font Awesome icons
- Axios cho API calls

## Troubleshooting

### Lỗi thường gặp:
1. **API không kết nối**: Kiểm tra backend server và CORS
2. **Validation errors**: Kiểm tra required fields
3. **Network errors**: Kiểm tra internet connection
4. **UUID format errors**: Kiểm tra format ID

### Debug:
- Mở Developer Tools (F12)
- Xem Console tab cho error messages
- Xem Network tab cho API calls
- Kiểm tra Response format từ API

## Cập nhật và bảo trì

### Code Structure:
- Layout: `src/pages/nurse/NurseLayout.js`
- Dashboard: `src/pages/nurse/NurseDashboard.js`
- Medication Requests: `src/pages/nurse/MedicationRequests.js`
- Health Checkup: `src/pages/nurse/HealthCheckup.js`
- API Service: `src/services/nurseApi.js`

### Future Enhancements:
- Lịch trình chi tiết
- Quản lý thuốc inventory
- Báo cáo thống kê
- Export dữ liệu
- Notification system
- Mobile app
- Advanced filtering
- Bulk operations

## Lưu ý quan trọng

### Data Validation:
- Date format validation
- Number range validation
- Required fields validation
- UUID format validation

### Security:
- Authentication required
- Authorization checks
- Input sanitization
- CSRF protection

### Performance:
- Lazy loading cho large datasets
- Debounced search
- Caching strategies
- Optimized API calls 
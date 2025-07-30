# Trang Quản lý Tiêm chủng - EschoolMED

## Tổng quan
Trang quản lý tiêm chủng đã được hoàn thiện với đầy đủ các chức năng quản lý vaccine, gửi thông báo, gửi kết quả và xác nhận tiêm chủng.

## Các tính năng chính

### 1. Quản lý tiêm chủng đang chờ xử lý
- Hiển thị danh sách học sinh cần tiêm chủng
- Thông tin: tên học sinh, lớp, loại vaccine, ngày tiêm dự kiến
- Avatar placeholder với chữ cái đầu của tên học sinh
- Các thao tác: gửi thông báo, gửi kết quả, xác nhận tiêm

### 2. Quản lý kết quả tiêm chủng
- Hiển thị danh sách kết quả tiêm chủng đã hoàn thành
- Thông tin: học sinh, lớp, loại vaccine, ngày tiêm, phản ứng, cần tăng cường
- Trạng thái: hoàn thành, đang xử lý
- Badge màu sắc phân biệt các trạng thái

### 3. Gửi thông báo tiêm chủng
- Modal form với các trường:
  - Loại vaccine (bắt buộc)
  - Ngày tiêm dự kiến (bắt buộc)
  - Địa điểm (bắt buộc)
  - Ghi chú (tùy chọn)
- Tự động điền thông tin học sinh
- Loading state khi gửi

### 4. Gửi kết quả tiêm chủng
- Modal form với các trường:
  - Ngày tiêm (bắt buộc)
  - Ghi chú (tùy chọn)
  - Có phản ứng (checkbox)
  - Cần theo dõi (checkbox)
  - Cần tăng cường (checkbox)
- Validation form
- Loading state khi gửi

### 5. Tạo loại vaccine mới
- Modal form với các trường:
  - Tên vaccine (bắt buộc)
  - Mô tả (tùy chọn)
  - Số liều cần thiết (bắt buộc)
  - Khoảng cách giữa các liều (ngày)
- Validation form
- Loading state khi tạo

### 6. Xác nhận tiêm chủng
- Xác nhận nhanh với confirmation dialog
- Tự động cập nhật trạng thái
- Loading state khi xác nhận

## Kết nối API

### Endpoints được sử dụng:
- `GET /api/vaccinations/students-need-vaccination` - Lấy danh sách học sinh cần tiêm
- `GET /api/vaccinations/vaccination-result` - Lấy kết quả tiêm chủng
- `POST /api/vaccinations/send-vaccination-notices` - Gửi thông báo tiêm chủng
- `POST /api/vaccinations/vaccination/result` - Gửi kết quả tiêm chủng
- `POST /api/vaccinations/create-vaccine-type` - Tạo loại vaccine mới
- `POST /api/vaccinations/confirm-vaccination` - Xác nhận tiêm chủng

### Cấu trúc Response cho Students Need Vaccination:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "confirmationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "studentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "string",
      "className": "string",
      "vaccineName": "string",
      "vaccinationDate": "2025-07-30"
    }
  ]
}
```

### Cấu trúc Response cho Vaccination Results:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "confirmationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "studentName": "string",
      "className": "string",
      "vaccineName": "string",
      "vaccinationDate": "2025-07-30T18:37:48.870Z",
      "hasReaction": true,
      "reactionNote": "string",
      "needsBooster": true,
      "finalized": true
    }
  ]
}
```

### Cấu trúc Request cho Send Notice:
```json
{
  "vaccineName": "string",
  "scheduledDate": "2025-07-30",
  "location": "string",
  "note": "string",
  "studentIds": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
}
```

### Cấu trúc Request cho Send Result:
```json
{
  "confirmationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "vaccinationDate": "2025-07-30T18:38:34.373Z",
  "notes": "string",
  "hasReaction": true,
  "followUpNeeded": true,
  "needsBooster": true
}
```

### Cấu trúc Request cho Create Vaccine Type:
```json
{
  "name": "string",
  "description": "string",
  "dosesRequired": 0,
  "intervalDays": 0
}
```

### Cấu trúc Request cho Confirm Vaccination:
```json
{
  "confirmationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "ACCEPTED",
  "parentNote": "string"
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
- Consistent styling với AdminLayout
- Intuitive navigation
- Clear action buttons
- Confirmation dialogs
- Avatar placeholders cho học sinh
- Badge màu sắc phân biệt trạng thái
- Tab navigation với counter

## Cách sử dụng

### Truy cập trang:
1. Đăng nhập với tài khoản admin
2. Vào menu "Vaccine" trong sidebar
3. Hoặc truy cập trực tiếp `/admin/VaccineManage`

### Gửi thông báo tiêm chủng:
1. Click icon bell (🔔) bên cạnh học sinh
2. Điền thông tin trong modal
3. Click "Gửi thông báo"

### Gửi kết quả tiêm chủng:
1. Click icon clipboard-check (📋) bên cạnh học sinh
2. Điền thông tin trong modal
3. Click "Gửi kết quả"

### Xác nhận tiêm chủng:
1. Click icon check (✓) bên cạnh học sinh
2. Xác nhận trong dialog
3. Hệ thống sẽ tự động cập nhật

### Tạo loại vaccine mới:
1. Click nút "Tạo loại vaccine"
2. Điền thông tin trong modal
3. Click "Tạo vaccine"

### Chuyển đổi tab:
- Click tab "Đang chờ xử lý" để xem danh sách cần tiêm
- Click tab "Kết quả tiêm chủng" để xem kết quả đã hoàn thành

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
4. **UUID format errors**: Kiểm tra format confirmationId

### Debug:
- Mở Developer Tools (F12)
- Xem Console tab cho error messages
- Xem Network tab cho API calls
- Kiểm tra Response format từ API

## Cập nhật và bảo trì

### Code Structure:
- Component: `src/pages/admin/VaccineManage.js`
- API Service: `src/services/adminApi.js`
- Layout: `src/pages/admin/AdminLayout.js`

### Future Enhancements:
- Bulk operations (gửi thông báo hàng loạt)
- Vaccine schedule management
- Advanced filtering (theo lớp, loại vaccine)
- Export/Import functionality
- Vaccine inventory management
- Performance metrics
- Activity logs
- Advanced search với multiple criteria

## Lưu ý quan trọng

### Data Validation:
- Date format validation
- Required fields validation
- UUID format validation
- Number range validation

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
# Trang Quản lý Y tá Trường học - EschoolMED

## Tổng quan
Trang quản lý y tá trường học đã được hoàn thiện với đầy đủ các chức năng CRUD (Create, Read, Update, Delete) và kết nối API backend.

## Các tính năng chính

### 1. Hiển thị danh sách y tá
- Hiển thị tất cả y tá với thông tin: họ tên, email, số điện thoại, chuyên môn
- Avatar placeholder với chữ cái đầu của tên
- Hỗ trợ phân trang (10, 25, 50 items per page)
- Tìm kiếm y tá theo tên, email, số điện thoại, chuyên môn
- Loading state khi tải dữ liệu

### 2. Tạo y tá mới
- Modal form với các trường:
  - Họ và tên (bắt buộc)
  - Email (bắt buộc)
  - Số điện thoại (bắt buộc)
  - Chuyên môn (bắt buộc)
- Validation form
- Loading state khi tạo

### 3. Chỉnh sửa y tá
- Modal form tương tự tạo mới
- Hiển thị dữ liệu hiện tại
- Cập nhật thông tin y tá
- Loading state khi cập nhật

### 4. Xóa y tá
- Modal xác nhận trước khi xóa
- Hiển thị tên y tá sẽ xóa
- Cảnh báo hành động không thể hoàn tác

### 5. Tìm kiếm và lọc
- Tìm kiếm real-time với debounce 500ms
- Tự động reset về trang 1 khi tìm kiếm
- Hiển thị số lượng kết quả

### 6. Phân trang
- Điều hướng Previous/Next
- Hiển thị số trang
- Thay đổi số lượng items per page
- Hiển thị thông tin "Showing X to Y of Z entries"

## Kết nối API

### Endpoints được sử dụng:
- `GET /api/nurse/get-all-nurse` - Lấy danh sách y tá
- `POST /api/nurse/create-nurse` - Tạo y tá mới
- `PUT /api/nurse/update-nurse` - Cập nhật y tá
- `DELETE /api/nurse/delete-nurse/{id}` - Xóa y tá

### Cấu trúc Response:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "nurseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string"
    }
  ]
}
```

### Cấu trúc Request cho Create/Update:
```json
{
  "nurseId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Chỉ cần cho update
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "specialization": "string"
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

### UI/UX Features:
- Clean và modern design
- Consistent styling với AdminLayout
- Intuitive navigation
- Clear action buttons
- Confirmation dialogs
- Avatar placeholders cho y tá
- Clickable email và phone links

## Cách sử dụng

### Truy cập trang:
1. Đăng nhập với tài khoản admin
2. Vào menu "School Nurse" trong sidebar
3. Hoặc truy cập trực tiếp `/admin/manageSchoolNurse`

### Tạo y tá mới:
1. Click nút "Thêm y tá mới"
2. Điền thông tin trong modal
3. Click "Tạo y tá"

### Chỉnh sửa y tá:
1. Click icon edit (✏️) bên cạnh y tá
2. Chỉnh sửa thông tin trong modal
3. Click "Cập nhật"

### Xóa y tá:
1. Click icon delete (🗑️) bên cạnh y tá
2. Xác nhận trong modal
3. Click "Xóa"

### Tìm kiếm:
- Gõ vào ô tìm kiếm
- Kết quả sẽ tự động cập nhật sau 500ms

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
4. **UUID format errors**: Kiểm tra format nurseId

### Debug:
- Mở Developer Tools (F12)
- Xem Console tab cho error messages
- Xem Network tab cho API calls
- Kiểm tra Response format từ API

## Cập nhật và bảo trì

### Code Structure:
- Component: `src/pages/admin/SchoolNurseManagement.js`
- API Service: `src/services/adminApi.js`
- Layout: `src/pages/admin/AdminLayout.js`

### Future Enhancements:
- Upload avatar cho y tá
- Bulk operations (import/export Excel)
- Advanced filtering (theo chuyên môn, trạng thái)
- Nurse scheduling system
- Performance metrics
- Activity logs
- Advanced search với multiple criteria

## Lưu ý quan trọng

### Data Validation:
- Email phải đúng format
- Phone number validation
- Required fields validation
- Unique email constraint

### Security:
- Authentication required
- Authorization checks
- Input sanitization
- CSRF protection

### Performance:
- Pagination để tối ưu performance
- Debounced search
- Lazy loading cho large datasets
- Caching strategies 
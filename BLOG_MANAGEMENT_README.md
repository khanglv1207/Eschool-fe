# Trang Quản lý Blog - EschoolMED

## Tổng quan
Trang quản lý blog đã được hoàn thiện với đầy đủ các chức năng CRUD (Create, Read, Update, Delete) và kết nối API backend.

## Các tính năng chính

### 1. Hiển thị danh sách blog
- Hiển thị tất cả blogs với thông tin: tiêu đề, nội dung, ngày tạo, trạng thái
- Hỗ trợ phân trang (10, 25, 50 items per page)
- Tìm kiếm blog theo tiêu đề hoặc nội dung
- Loading state khi tải dữ liệu

### 2. Tạo blog mới
- Modal form với các trường:
  - Tiêu đề (bắt buộc)
  - Nội dung (bắt buộc)
  - Hình ảnh (tùy chọn)
- Preview hình ảnh trước khi upload
- Validation form
- Loading state khi tạo

### 3. Chỉnh sửa blog
- Modal form tương tự tạo mới
- Hiển thị dữ liệu hiện tại
- Có thể thay đổi hình ảnh hoặc giữ nguyên
- Preview hình ảnh mới và hiển thị hình ảnh hiện tại

### 4. Xóa blog
- Modal xác nhận trước khi xóa
- Hiển thị tên blog sẽ xóa
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
- `GET /api/blogs/get_all_blog` - Lấy danh sách blogs
- `POST /api/blogs` - Tạo blog mới
- `PUT /api/blogs/update_document/{id}` - Cập nhật blog
- `DELETE /api/blogs/delete_document/{id}` - Xóa blog
- `GET /api/blogs/get/{id}` - Lấy chi tiết blog

### Cấu trúc Response:
```json
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "documentId": 0,
      "userId": 0,
      "title": "string",
      "content": "string",
      "createdAt": "2025-07-30T18:22:04.271Z"
    }
  ]
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

## Cách sử dụng

### Truy cập trang:
1. Đăng nhập với tài khoản admin
2. Vào menu "Blogs" trong sidebar
3. Hoặc truy cập trực tiếp `/admin/manageBlogs`

### Tạo blog mới:
1. Click nút "Tạo Blog mới"
2. Điền thông tin trong modal
3. Upload hình ảnh (tùy chọn)
4. Click "Tạo Blog"

### Chỉnh sửa blog:
1. Click icon edit (✏️) bên cạnh blog
2. Chỉnh sửa thông tin trong modal
3. Click "Cập nhật"

### Xóa blog:
1. Click icon delete (🗑️) bên cạnh blog
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
2. **Upload ảnh lỗi**: Kiểm tra file size và format
3. **Validation errors**: Kiểm tra required fields
4. **Network errors**: Kiểm tra internet connection

### Debug:
- Mở Developer Tools (F12)
- Xem Console tab cho error messages
- Xem Network tab cho API calls
- Kiểm tra Response format từ API

## Cập nhật và bảo trì

### Code Structure:
- Component: `src/pages/admin/BlogManagement.js`
- API Service: `src/services/blogApi.js`
- Layout: `src/pages/admin/AdminLayout.js`

### Future Enhancements:
- Rich text editor cho content
- Image gallery management
- Blog categories/tags
- Bulk operations
- Export/Import functionality
- Advanced filtering options 
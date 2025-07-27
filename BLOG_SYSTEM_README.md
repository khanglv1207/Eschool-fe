# Hệ thống Blog EschoolMED

## Tổng quan

Hệ thống blog được xây dựng để chia sẻ kiến thức y tế học đường và sức khỏe cộng đồng. Hệ thống bao gồm các tính năng upload, quản lý và hiển thị bài viết.

## Tính năng chính

### 1. Upload Blog (Admin)
- **Đường dẫn**: `/admin/uploadBlog`
- **Tính năng**:
  - Soạn thảo bài viết với rich text editor
  - Upload ảnh đại diện và nhiều ảnh bổ sung
  - Preview bài viết trước khi đăng
  - Quản lý trạng thái (Nháp/Đăng ngay)
  - Thêm tags và mô tả

### 2. Quản lý Blog (Admin)
- **Đường dẫn**: `/admin/manageBlogs`
- **Tính năng**:
  - Xem danh sách tất cả bài viết
  - Tìm kiếm và lọc bài viết
  - Chỉnh sửa và xóa bài viết
  - Thay đổi trạng thái bài viết

### 3. Hiển thị Blog (Public)
- **Đường dẫn**: `/blogs`
- **Tính năng**:
  - Xem danh sách bài viết đã đăng
  - Tìm kiếm bài viết
  - Phân trang
  - Hiển thị bài viết phổ biến và gần đây

### 4. Chi tiết Blog (Public)
- **Đường dẫn**: `/blog/:id`
- **Tính năng**:
  - Xem nội dung đầy đủ bài viết
  - Like và chia sẻ bài viết
  - Bình luận bài viết
  - Xem thông tin tác giả

## API Endpoints

### Blog Management
```
GET    /api/blogs                    # Lấy danh sách blog
GET    /api/blogs/:id                # Lấy chi tiết blog
POST   /api/blogs                    # Tạo blog mới
PUT    /api/blogs/:id                # Cập nhật blog
DELETE /api/blogs/:id                # Xóa blog
PATCH  /api/blogs/:id/status         # Thay đổi trạng thái
```

### Admin Blog Management
```
GET    /api/admin/blogs              # Lấy danh sách blog (admin)
POST   /api/admin/blogs              # Tạo blog mới (admin)
PUT    /api/admin/blogs/:id          # Cập nhật blog (admin)
DELETE /api/admin/blogs/:id          # Xóa blog (admin)
PATCH  /api/admin/blogs/:id/status   # Thay đổi trạng thái (admin)
```

### Blog Interactions
```
POST   /api/blogs/:id/like           # Like/Unlike blog
POST   /api/blogs/:id/comments       # Thêm comment
GET    /api/blogs/:id/comments       # Lấy comments
```

### Blog Search & Filter
```
GET    /api/blogs/search             # Tìm kiếm blog
GET    /api/blogs/popular            # Blog phổ biến
GET    /api/blogs/recent             # Blog gần đây
GET    /api/blogs/category/:category # Blog theo danh mục
```

### Image Upload
```
POST   /api/blogs/upload-image       # Upload ảnh đơn
POST   /api/blogs/upload-images      # Upload nhiều ảnh
```

## Cấu trúc dữ liệu Blog

```javascript
{
  id: "string",
  title: "string",
  content: "string",
  description: "string",
  author: "string",
  status: "draft" | "published",
  tags: "string", // comma-separated
  featuredImage: "string", // URL
  images: ["string"], // Array of URLs
  likes: number,
  views: number,
  createdAt: "date",
  updatedAt: "date"
}
```

## Hướng dẫn sử dụng

### 1. Upload bài viết mới

1. Đăng nhập với tài khoản admin
2. Truy cập `/admin/uploadBlog`
3. Điền thông tin bài viết:
   - **Tiêu đề**: Tiêu đề bài viết
   - **Tác giả**: Tên tác giả
   - **Mô tả**: Mô tả ngắn về bài viết
   - **Tags**: Các từ khóa, phân cách bằng dấu phẩy
   - **Nội dung**: Nội dung chính của bài viết
   - **Ảnh đại diện**: Ảnh chính của bài viết
   - **Ảnh bổ sung**: Các ảnh khác (tùy chọn)
   - **Trạng thái**: Nháp hoặc Đăng ngay
4. Xem preview bên phải
5. Nhấn "Đăng bài viết"

### 2. Quản lý bài viết

1. Truy cập `/admin/manageBlogs`
2. Sử dụng thanh tìm kiếm để tìm bài viết
3. Nhấn nút "Upload Blog" để tạo bài mới
4. Sử dụng các nút chỉnh sửa/xóa để quản lý

### 3. Xem bài viết

1. Truy cập `/blogs` để xem danh sách
2. Sử dụng thanh tìm kiếm để tìm bài viết
3. Nhấn "Đọc thêm" để xem chi tiết
4. Tương tác với bài viết (like, comment)

## Tùy chỉnh

### Thêm danh mục mới

1. Cập nhật danh mục trong `BlogList.js` và `BlogDetail.js`
2. Thêm API endpoint cho danh mục mới
3. Cập nhật giao diện hiển thị

### Tùy chỉnh giao diện

- **BlogList.js**: Giao diện danh sách blog
- **BlogDetail.js**: Giao diện chi tiết blog
- **UploadBlog.js**: Giao diện upload blog
- **BlogManagement.js**: Giao diện quản lý blog

### Tùy chỉnh API

- **blogApi.js**: Tất cả API calls cho blog
- **adminApi.js**: API cho admin (có thể merge vào blogApi.js)

## Lưu ý

1. **Bảo mật**: Chỉ admin mới có quyền upload và quản lý blog
2. **Validation**: Cần validate dữ liệu đầu vào
3. **Performance**: Sử dụng pagination cho danh sách lớn
4. **SEO**: Thêm meta tags cho SEO
5. **Responsive**: Giao diện đã responsive cho mobile

## Troubleshooting

### Lỗi upload ảnh
- Kiểm tra kích thước file (max 5MB)
- Kiểm tra định dạng file (jpg, png, gif)
- Kiểm tra quyền ghi thư mục upload

### Lỗi API
- Kiểm tra kết nối backend
- Kiểm tra authentication token
- Kiểm tra CORS configuration

### Lỗi hiển thị
- Kiểm tra console browser
- Kiểm tra network tab
- Kiểm tra response API 
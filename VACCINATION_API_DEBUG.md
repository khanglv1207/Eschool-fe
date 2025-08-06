# 🔍 Debug Lỗi 403 Forbidden - Vaccination API

## 📋 Tóm Tắt Vấn Đề

Hiện tại đang gặp lỗi **403 Forbidden** khi gọi API `/api/vaccinations/confirmation-status`, ngay cả khi người dùng có vai trò 'admin'.

## 🔍 Thông Tin Debug Hiện Tại

### Frontend Logs:
```
🔐 Debug Authentication Chi Tiết:
  - Access Token: ✅ Có token (eyJhbGciOiJIUzI1NiJ9...)
  - User Role: admin
  - User ID: [user-id]
  - User Email: [email]

🔧 API Request Debug:
  - URL: /api/vaccinations/confirmation-status
  - Method: GET
  - Has Token: true
  - Authorization Header: Bearer eyJhbGciOiJIUzI1NiJ9...

🚫 403 Forbidden - Phân tích lỗi:
  - Có thể do thiếu quyền truy cập endpoint
  - Có thể do token không hợp lệ
  - Có thể do backend chưa cấu hình đúng quyền
```

## 🚨 Nguyên Nhân Có Thể

### 1. **Backend Spring Security Configuration**
- Endpoint `/api/vaccinations/confirmation-status` có thể chưa được cấu hình đúng quyền
- Cần kiểm tra `@PreAuthorize` hoặc `@Secured` annotations

### 2. **Vai Trò Người Dùng**
- Frontend lưu role là `"admin"` (chữ thường)
- Backend có thể mong đợi `"ADMIN"` (chữ hoa)
- Cần kiểm tra mapping vai trò trong backend

### 3. **Token Authentication**
- Token có thể đã hết hạn
- JWT signature có thể không hợp lệ
- Backend có thể không nhận diện được token

## 🔧 Cách Khắc Phục

### Bước 1: Kiểm Tra Backend Configuration

```java
// Kiểm tra trong VaccinationController.java
@GetMapping("/confirmation-status")
@PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")  // Đảm bảo có annotation này
public ApiResponse<List<VaccinationConfirmationResponse>> getVaccinationConfirmations(
    @AuthenticationPrincipal Jwt jwt) {
    // ...
}
```

### Bước 2: Kiểm Tra Role Mapping

```java
// Trong UserDetailsService hoặc JwtAuthenticationFilter
// Đảm bảo role được map đúng từ database sang Spring Security
```

### Bước 3: Debug Backend Logs

Thêm logging vào backend để xem:
- Token có được parse đúng không
- User role có được extract đúng không
- Authorization có pass không

### Bước 4: Test API Trực Tiếp

Sử dụng Postman hoặc curl để test:

```bash
curl -X GET "http://localhost:8080/api/vaccinations/confirmation-status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 📊 Trạng Thái Hiện Tại

### ✅ Đã Hoàn Thành:
- [x] Thêm debug logs chi tiết
- [x] Xử lý lỗi 403 gracefully
- [x] Hiển thị thông báo lỗi thân thiện
- [x] Thêm nút "Thử Lại"
- [x] Kiểm soát truy cập dựa trên vai trò ở frontend

### ⏳ Cần Kiểm Tra:
- [ ] Backend Spring Security configuration
- [ ] Role mapping trong backend
- [ ] JWT token validation
- [ ] Endpoint permissions

## 🎯 Bước Tiếp Theo

1. **Kiểm tra backend logs** khi gọi API
2. **Xác nhận cấu hình Spring Security** cho endpoint này
3. **Test API trực tiếp** với Postman
4. **Cập nhật role mapping** nếu cần thiết

## 📝 Ghi Chú

- Frontend hiện đang xử lý lỗi 403 bằng cách trả về mảng rỗng
- UI vẫn hoạt động bình thường, chỉ không hiển thị dữ liệu
- Cần khắc phục ở backend để có dữ liệu thực 
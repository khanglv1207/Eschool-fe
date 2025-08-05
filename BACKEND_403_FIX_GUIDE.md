# Hướng Dẫn Khắc Phục Lỗi 403 Forbidden - Vaccination Confirmation API

## 🔍 Phân Tích Vấn Đề

**Lỗi hiện tại:** `GET /api/vaccinations/confirmation-status` trả về **403 Forbidden**

**Thông tin từ Frontend:**
- User Role: `nurse` (thay vì `admin`)
- Token: Có token hợp lệ
- Endpoint: `/api/vaccinations/confirmation-status`
- Method: GET

## 🎯 Nguyên Nhân Có Thể

### 1. **Spring Security Configuration**
Backend có thể chưa cấu hình đúng quyền cho endpoint này.

### 2. **Role Mapping**
Frontend gửi role `"nurse"` nhưng backend có thể mong đợi `"NURSE"` hoặc `"ROLE_NURSE"`.

### 3. **@PreAuthorize Annotation**
Endpoint có thể thiếu annotation `@PreAuthorize` hoặc cấu hình sai.

## 🔧 Các Bước Khắc Phục

### Bước 1: Kiểm Tra VaccinationController.java

Tìm file `VaccinationController.java` và kiểm tra endpoint:

```java
@GetMapping("/confirmation-status")
@PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")  // Thêm annotation này
public ApiResponse<List<VaccinationConfirmationResponse>> getVaccinationConfirmations(@AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject());
    List<VaccinationConfirmationResponse> responses = vaccinationService.getVaccinationConfirmations(userId);
    return ApiResponse.<List<VaccinationConfirmationResponse>>builder()
        .code(1000)
        .message("Lấy danh sách xác nhận tiêm chủng thành công.")
        .result(responses)
        .build();
}
```

### Bước 2: Kiểm Tra SecurityConfig.java

Đảm bảo endpoint được cấu hình trong SecurityConfig:

```java
.antMatchers(HttpMethod.GET, "/api/vaccinations/confirmation-status")
.hasAnyRole("ADMIN", "NURSE")
```

### Bước 3: Kiểm Tra Role Mapping

Trong `application.properties` hoặc `application.yml`:

```properties
# Đảm bảo role mapping đúng
spring.security.oauth2.resourceserver.jwt.claim-names=roles
```

### Bước 4: Debug Backend Logs

Thêm logging vào backend để debug:

```java
@GetMapping("/confirmation-status")
@PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")
public ApiResponse<List<VaccinationConfirmationResponse>> getVaccinationConfirmations(@AuthenticationPrincipal Jwt jwt) {
    log.info("🔍 User ID từ JWT: {}", jwt.getSubject());
    log.info("🔍 User Authorities: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
    
    UUID userId = UUID.fromString(jwt.getSubject());
    List<VaccinationConfirmationResponse> responses = vaccinationService.getVaccinationConfirmations(userId);
    
    log.info("✅ Trả về {} kết quả", responses.size());
    return ApiResponse.<List<VaccinationConfirmationResponse>>builder()
        .code(1000)
        .message("Lấy danh sách xác nhận tiêm chủng thành công.")
        .result(responses)
        .build();
}
```

### Bước 5: Test API Trực Tiếp

Sử dụng Postman hoặc curl để test:

```bash
curl -X GET "http://localhost:8080/api/vaccinations/confirmation-status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 🚨 Các Trường Hợp Đặc Biệt

### Trường Hợp 1: Role Mapping Không Đúng
- Frontend: `"nurse"`
- Backend mong đợi: `"NURSE"` hoặc `"ROLE_NURSE"`

**Giải pháp:** Cập nhật role mapping trong backend hoặc frontend.

### Trường Hợp 2: JWT Token Không Chứa Roles
- Kiểm tra JWT token có chứa thông tin roles không
- Đảm bảo JWT được tạo với đúng authorities

### Trường Hợp 3: Endpoint Chưa Được Đăng Ký
- Kiểm tra `@RequestMapping` trong controller
- Đảm bảo endpoint được map đúng

## 📋 Checklist Khắc Phục

- [ ] Thêm `@PreAuthorize("hasRole('ADMIN') or hasRole('NURSE')")` vào endpoint
- [ ] Kiểm tra SecurityConfig có cấu hình endpoint này không
- [ ] Debug backend logs để xem user authorities
- [ ] Test API trực tiếp với Postman
- [ ] Kiểm tra JWT token có chứa roles không
- [ ] Xác nhận role mapping giữa frontend và backend

## 🔄 Sau Khi Khắc Phục

1. **Restart backend server**
2. **Test lại từ frontend**
3. **Kiểm tra console logs**
4. **Xác nhận dữ liệu hiển thị đúng**

## 📞 Liên Hệ Hỗ Trợ

Nếu vẫn gặp vấn đề, hãy cung cấp:
- Backend logs chi tiết
- JWT token payload
- SecurityConfig configuration
- VaccinationController code

---

**Lưu ý:** Frontend đã được cấu hình để xử lý lỗi 403 gracefully và hiển thị thông báo thân thiện cho người dùng. 
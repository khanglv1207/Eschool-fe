# Hướng dẫn Setup Real API

## Backend Endpoint
```java
@PostMapping("/health-profile")
public ResponseEntity<ApiResponse<String>> createOrUpdateHealthProfile(
    @RequestBody HealthProfileRequest request,
    @AuthenticationPrincipal Jwt jwt) {
    UUID userId = UUID.fromString(jwt.getSubject());
    parentService.createOrUpdateHealthProfile(userId, request);
    return ResponseEntity.ok(ApiResponse.<String>builder()
            .message("Khai báo sức khỏe thành công")
            .result("OK")
            .build());
}
```

## Các bước test Real API

### 1. Đảm bảo đã đăng nhập
- Truy cập `/login`
- Đăng nhập với tài khoản hợp lệ
- Kiểm tra token được lưu trong localStorage

### 2. Test Token
- Mở form `/health-profile-form`
- Ở góc trên bên trái có "Token Test"
- Nhấn "Check Token" để kiểm tra:
  - Token có tồn tại không
  - Token có hợp lệ không
  - User info có đầy đủ không

### 3. Test API
- Ở góc trên bên phải có "API Test"
- Nhấn "Test Real API" để test endpoint
- Kiểm tra console logs

### 4. Test Form
- Chuyển sang "Real API" mode (toggle ở góc dưới bên trái)
- Điền form và submit
- Kiểm tra response

## Debug Information

### Console Logs cần theo dõi:
```
🚀 Calling Real API with data: {allergies: "...", ...}
✅ Real API Response: {message: "...", result: "OK"}
```

### Network Tab:
- URL: `POST /health-profile`
- Headers: `Authorization: Bearer <token>`
- Request Body: JSON data
- Response: 200 OK với ApiResponse format

### Token Requirements:
- Token phải có trong localStorage với key `"access_token"`
- Token phải có format JWT hợp lệ
- Token phải chưa hết hạn
- Token phải có subject (user ID)

## Troubleshooting

### Lỗi 401 Unauthorized:
- Token không tồn tại hoặc hết hạn
- Token không được gửi trong header
- Token format không đúng

### Lỗi 404 Not Found:
- Backend server chưa chạy
- Endpoint `/health-profile` không tồn tại
- Method không phải POST

### Lỗi 500 Internal Server Error:
- Backend có lỗi xử lý
- Database connection issues
- Validation errors

## Test với Postman

```http
POST http://localhost:8080/health-profile
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "allergies": "Không có",
  "chronicDiseases": "Không có",
  "medicalHistory": "Không có",
  "eyesight": "Tốt",
  "hearing": "Tốt",
  "vaccinationRecord": "Đã tiêm đầy đủ"
}
```

Expected Response:
```json
{
  "message": "Khai báo sức khỏe thành công",
  "result": "OK"
}
```

## Cấu hình Backend

### CORS Configuration:
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HealthProfileController {
    // ...
}
```

### Security Configuration:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // JWT configuration
    // CORS configuration
    // Authentication configuration
}
```

## Monitoring

### Frontend Logs:
- API Request/Response logs
- Token validation logs
- Error handling logs

### Backend Logs:
- Request received logs
- Authentication logs
- Database operation logs
- Error logs

## Success Criteria

✅ **Token Test**: Token tồn tại và hợp lệ  
✅ **API Test**: Real API trả về success response  
✅ **Form Test**: Form submit thành công với Real API  
✅ **Database**: Data được lưu vào database  
✅ **Error Handling**: Lỗi được xử lý đúng cách 
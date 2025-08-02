# Khắc phục lỗi API - Troubleshooting Guide

## Lỗi 404 - API Endpoint Not Found

### Nguyên nhân:
1. **Backend server chưa chạy**
2. **API endpoint không tồn tại**
3. **Base URL không đúng**
4. **CORS issues**

### Giải pháp:

#### 1. Kiểm tra Backend Server
```bash
# Kiểm tra xem backend có đang chạy không
curl http://localhost:8080/health

# Hoặc kiểm tra trong browser
http://localhost:8080/health
```

#### 2. Cập nhật Base URL
Trong file `src/services/api.js`:
```javascript
const API_BASE_URL = "http://localhost:8080"; // Đảm bảo port đúng
```

#### 3. Kiểm tra API Endpoint
Đảm bảo endpoint `/health-profile` tồn tại trong backend:
```java
@PostMapping("/health-profile")
public ResponseEntity<ApiResponse<String>> createOrUpdateHealthProfile(
    @RequestBody HealthProfileRequest request,
    @AuthenticationPrincipal Jwt jwt) {
    // Implementation
}
```

#### 4. Sử dụng Mock API tạm thời
Khi backend chưa sẵn sàng, sử dụng mock API:
- Form sẽ tự động sử dụng mock API
- Có thể chuyển đổi giữa mock và real API bằng toggle button
- Mock API sẽ simulate response thành công

### Các lỗi thường gặp:

#### Lỗi CORS
```
Access to XMLHttpRequest at 'http://localhost:8080/health-profile' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Giải pháp:**
Thêm CORS configuration trong backend:
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HealthProfileController {
    // ...
}
```

#### Lỗi Authentication
```
401 Unauthorized
```

**Giải pháp:**
- Kiểm tra JWT token trong localStorage
- Đảm bảo đã đăng nhập
- Kiểm tra token format và expiration

#### Lỗi Network
```
Network Error: Cannot connect to server
```

**Giải pháp:**
- Kiểm tra backend server có đang chạy không
- Kiểm tra port number
- Kiểm tra firewall settings

### Debug Steps:

1. **Mở DevTools (F12)**
2. **Kiểm tra Console tab** cho JavaScript errors
3. **Kiểm tra Network tab** cho API calls
4. **Kiểm tra Application tab** cho localStorage

### Test API với Postman:

```http
POST http://localhost:8080/health-profile
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "allergies": "Không có",
  "chronicDiseases": "Không có", 
  "medicalHistory": "Không có",
  "eyesight": "Tốt",
  "hearing": "Tốt",
  "vaccinationRecord": "Đã tiêm đầy đủ"
}
```

### Environment Variables:

Tạo file `.env` trong root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_USE_MOCK_API=true
```

Cập nhật `api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
```

### Fallback Strategy:

1. **Mock API**: Sử dụng khi backend chưa sẵn sàng
2. **Local Storage**: Lưu tạm thời khi không có network
3. **Offline Mode**: Cache data và sync khi online

### Monitoring:

Thêm logging để debug:
```javascript
console.log('API Request:', {
  url: config.url,
  method: config.method,
  data: config.data,
  headers: config.headers,
});
```

### Performance:

- Sử dụng loading states
- Implement retry logic
- Cache responses
- Optimize bundle size 
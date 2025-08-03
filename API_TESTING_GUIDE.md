# Hướng dẫn Test API - API Testing Guide

## Tình trạng hiện tại

✅ **Mock API**: Hoạt động thành công  
❌ **Real API**: Gặp lỗi 404 - Endpoint không tồn tại

## Cách test API

### 1. Sử dụng API Test Component
- Mở form khai báo sức khỏe tại `/health-profile-form`
- Ở góc trên bên phải sẽ có component "API Test"
- Nhấn "Test Mock API" để test mock API
- Nhấn "Test Real API" để test real API

### 2. Sử dụng Toggle Button
- Ở góc dưới bên trái có toggle button
- Chuyển đổi giữa "Mock API" và "Real API"
- Form sẽ sử dụng API tương ứng

## Debug Real API

### Vấn đề hiện tại:
```
POST http://localhost:3000/health-profile 404 (Not Found)
```

### Nguyên nhân có thể:

1. **Backend server chưa chạy**
   ```bash
   # Kiểm tra backend có đang chạy không
   curl http://localhost:8080/health
   ```

2. **Endpoint không tồn tại**
   - Kiểm tra xem có endpoint `/health-profile` trong backend không
   - Đảm bảo method là POST

3. **CORS issues**
   - Backend cần có CORS configuration cho `localhost:3000`

4. **Authentication issues**
   - Kiểm tra JWT token có hợp lệ không
   - Token có được gửi trong header không

### Các bước khắc phục:

#### 1. Kiểm tra Backend Server
```bash
# Test backend health
curl http://localhost:8080/health

# Test endpoint trực tiếp
curl -X POST http://localhost:8080/health-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "allergies": "test",
    "chronicDiseases": "test",
    "medicalHistory": "test",
    "eyesight": "Tốt",
    "hearing": "Tốt",
    "vaccinationRecord": "test"
  }'
```

#### 2. Kiểm tra Backend Code
Đảm bảo có endpoint trong backend:
```java
@PostMapping("/health-profile")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<ApiResponse<String>> createOrUpdateHealthProfile(
    @RequestBody HealthProfileRequest request,
    @AuthenticationPrincipal Jwt jwt) {
    // Implementation
}
```

#### 3. Kiểm tra Network Tab
1. Mở DevTools (F12)
2. Chuyển sang tab Network
3. Submit form
4. Kiểm tra request URL và response

#### 4. Kiểm tra Console Logs
Form sẽ log các thông tin debug:
```
Current API Mode: REAL
Selected API: healthProfileApi
API Request: {url: '/health-profile', method: 'post', ...}
```

## Cấu hình hiện tại

### API Base URL
```javascript
// src/services/api.js
const API_BASE_URL = ""; // Sử dụng proxy từ package.json
```

### Proxy Configuration
```json
// package.json
{
  "proxy": "http://localhost:8080"
}
```

### Expected API Response
```json
{
  "message": "Khai báo sức khỏe thành công",
  "result": "OK"
}
```

## Fallback Strategy

### Khi Real API không hoạt động:
1. **Sử dụng Mock API**: Form sẽ hoạt động bình thường
2. **Test với Postman**: Để verify backend endpoint
3. **Check Backend Logs**: Để debug server-side issues

### Khi Backend sẵn sàng:
1. Chuyển sang "Real API" mode
2. Test lại form
3. Verify data được lưu vào database

## Monitoring

### Console Logs cần theo dõi:
- `Current API Mode`: MOCK hoặc REAL
- `Selected API`: Tên API đang sử dụng
- `API Request`: Chi tiết request
- `API Response`: Chi tiết response hoặc error

### Network Tab:
- Request URL: `/health-profile`
- Request Method: POST
- Request Headers: Content-Type, Authorization
- Response Status: 200 (success) hoặc error code

## Troubleshooting Checklist

- [ ] Backend server đang chạy trên port 8080
- [ ] Endpoint `/health-profile` tồn tại trong backend
- [ ] CORS configuration cho `localhost:3000`
- [ ] JWT token hợp lệ trong localStorage
- [ ] Request format đúng (JSON)
- [ ] Response format đúng (ApiResponse)

## Next Steps

1. **Test Mock API**: Đảm bảo form hoạt động với mock data
2. **Setup Backend**: Đảm bảo backend có endpoint `/health-profile`
3. **Test Real API**: Chuyển sang real API và test
4. **Production**: Deploy và monitor 
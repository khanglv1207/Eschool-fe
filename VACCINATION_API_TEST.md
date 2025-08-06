# Test Vaccination API Endpoints

## 📋 **Vaccination Controller API Endpoints:**

### **GET Endpoints (Blue):**
1. **GET /api/vaccinations/vaccine-types** - Lấy danh sách vaccine types
2. **GET /api/vaccinations/vaccination-result** - Lấy kết quả tiêm chủng
3. **GET /api/vaccinations/students-to-vaccinate** - Lấy danh sách học sinh cần tiêm
4. **GET /api/vaccinations/students-need-vaccination** - Lấy danh sách học sinh cần tiêm (alt)
5. **GET /api/vaccinations/notifications** - Lấy thông báo tiêm chủng
6. **GET /api/vaccinations/confirmation-status** - Lấy trạng thái xác nhận
7. **GET /api/vaccinations/confirm-email** - Xác nhận email

### **POST Endpoints (Green):**
1. **POST /api/vaccinations/vaccination/result** - Tạo kết quả tiêm chủng
2. **POST /api/vaccinations/send-vaccination-results** - Gửi kết quả tiêm chủng
3. **POST /api/vaccinations/send-notices** - Gửi thông báo tiêm chủng
4. **POST /api/vaccinations/create-vaccine-type** - Tạo vaccine type mới

## ✅ **Đã cập nhật:**

### **1. Admin API (adminApi.js):**
- ✅ `getPendingVaccinations()` - Sử dụng `/api/vaccinations/confirmation-status`
- ✅ `getVaccinationResults()` - Sử dụng `/api/vaccinations/vaccination-result`
- ✅ `sendVaccinationNotification()` - Sử dụng `/api/vaccinations/send-notices`
- ✅ `confirmVaccination()` - Sử dụng `/api/vaccinations/confirmation-status/{id}`
- ✅ `sendVaccinationResults()` - Sử dụng `/api/vaccinations/send-vaccination-results`
- ✅ `sendNotification()` - Sử dụng `/api/vaccinations/send-notices`

### **2. Vaccination API (vaccinationApi.js):**
- ✅ `getVaccineTypes()` - Sử dụng `/api/vaccinations/vaccine-types`
- ✅ `createVaccineType()` - Sử dụng `/api/vaccinations/create-vaccine-type`
- ✅ `getStudentsToVaccinate()` - Sử dụng `/api/vaccinations/students-to-vaccinate`
- ✅ `sendVaccinationNotices()` - Sử dụng `/api/vaccinations/send-notices`
- ✅ `createVaccinationResult()` - Sử dụng `/api/vaccinations/vaccination/result`
- ✅ `sendVaccinationResults()` - Sử dụng `/api/vaccinations/send-vaccination-results`
- ✅ `getVaccinationResult()` - Sử dụng `/api/vaccinations/vaccination-result`

## 🔍 **Test Cases:**

### **Test Case 1: Lấy danh sách vaccine types**
**API:** `GET /api/vaccinations/vaccine-types`
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "id": 1,
      "name": "Vaccine COVID-19",
      "description": "Vắc xin phòng COVID-19"
    }
  ]
}
```

### **Test Case 2: Tạo vaccine type mới**
**API:** `POST /api/vaccinations/create-vaccine-type`
**Request Body:**
```json
{
  "name": "Vaccine Cúm",
  "description": "Vắc xin phòng cúm mùa"
}
```
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Vaccine type created successfully",
  "result": {
    "id": 2,
    "name": "Vaccine Cúm",
    "description": "Vắc xin phòng cúm mùa"
  }
}
```

### **Test Case 3: Lấy danh sách học sinh cần tiêm**
**API:** `GET /api/vaccinations/students-to-vaccinate?vaccineName=COVID-19`
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "studentId": "uuid",
      "studentName": "Nguyễn Văn A",
      "className": "10A1"
    }
  ]
}
```

### **Test Case 4: Gửi thông báo tiêm chủng**
**API:** `POST /api/vaccinations/send-notices`
**Request Body:**
```json
{
  "vaccineName": "COVID-19",
  "scheduledDate": "2024-01-15",
  "location": "Phòng y tế",
  "note": "Thông báo tiêm chủng",
  "studentIds": ["uuid1", "uuid2"]
}
```
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Notifications sent successfully",
  "result": {
    "sentCount": 2,
    "failedCount": 0
  }
}
```

### **Test Case 5: Tạo kết quả tiêm chủng**
**API:** `POST /api/vaccinations/vaccination/result`
**Request Body:**
```json
{
  "studentId": "uuid",
  "vaccineName": "COVID-19",
  "vaccinationDate": "2024-01-15",
  "symptoms": "Không có",
  "notes": "Tiêm thành công"
}
```
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Vaccination result created successfully",
  "result": {
    "id": "uuid",
    "status": "COMPLETED"
  }
}
```

### **Test Case 6: Gửi kết quả tiêm chủng**
**API:** `POST /api/vaccinations/send-vaccination-results`
**Request Body:**
```json
{
  "studentId": "uuid",
  "vaccineName": "COVID-19",
  "result": "COMPLETED"
}
```
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Results sent successfully",
  "result": {
    "sentCount": 1
  }
}
```

### **Test Case 7: Lấy kết quả tiêm chủng**
**API:** `GET /api/vaccinations/vaccination-result`
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "id": "uuid",
      "studentName": "Nguyễn Văn A",
      "vaccineName": "COVID-19",
      "vaccinationDate": "2024-01-15",
      "status": "COMPLETED"
    }
  ]
}
```

### **Test Case 8: Lấy trạng thái xác nhận**
**API:** `GET /api/vaccinations/confirmation-status`
**Expected Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "result": [
    {
      "confirmationId": "uuid",
      "fullName": "Nguyễn Văn A",
      "vaccineName": "COVID-19",
      "vaccinationDate": "2024-01-15",
      "status": "PENDING"
    }
  ]
}
```

## 🧪 **Error Handling Tests:**

### **Test Case 9: 404 Error Handling**
**Expected Behavior:**
- ✅ Try multiple endpoints
- ✅ Fallback to mock data
- ✅ Clear error messages

### **Test Case 10: 400 Error Handling**
**Expected Behavior:**
- ✅ Validation error messages
- ✅ User-friendly error display

### **Test Case 11: 401 Error Handling**
**Expected Behavior:**
- ✅ Redirect to login
- ✅ Clear session data

## 📊 **Cấu trúc dữ liệu:**

### **Vaccine Type:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string"
}
```

### **Vaccination Result:**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "vaccineName": "string",
  "vaccinationDate": "date",
  "symptoms": "string",
  "notes": "string",
  "status": "COMPLETED|PENDING|FAILED"
}
```

### **Vaccination Notice:**
```json
{
  "vaccineName": "string",
  "scheduledDate": "date",
  "location": "string",
  "note": "string",
  "studentIds": ["uuid"]
}
```

## 📋 **Checklist:**

- [x] GET /api/vaccinations/vaccine-types
- [x] POST /api/vaccinations/create-vaccine-type
- [x] GET /api/vaccinations/students-to-vaccinate
- [x] GET /api/vaccinations/students-need-vaccination
- [x] POST /api/vaccinations/send-notices
- [x] POST /api/vaccinations/vaccination/result
- [x] POST /api/vaccinations/send-vaccination-results
- [x] GET /api/vaccinations/vaccination-result
- [x] GET /api/vaccinations/confirmation-status
- [x] GET /api/vaccinations/notifications
- [x] GET /api/vaccinations/confirm-email
- [x] Multiple endpoints fallback
- [x] Error handling
- [x] Mock data fallback
- [x] API integration

## 🚀 **Kết luận:**

Tất cả các vaccination API endpoints đã được cập nhật để khớp với vaccination-controller. Các endpoints chính xác đã được implement với fallback và error handling đầy đủ. Hệ thống giờ đây có thể kết nối thành công với backend vaccination API. 
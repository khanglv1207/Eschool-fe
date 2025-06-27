import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";


import KhaiBaoSucKhoe from "./pages/KhaiBaoSucKhoe";
import DangKyThuocForm from "./pages/DangKyThuocForm";
import HealthIncidentForm from "./pages/HealthIncidentForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ContactSupport from "./pages/ContactSupport";
import Vaccination from "./pages/Vaccination";
import MedicalCheckup from "./pages/MedicalCheckup";
import MedicalEvents from "./pages/MedicalEvents";
import SendMedicine from "./pages/SendMedicine";
import Inventory from "./pages/Inventory";
import InventoryCheck from "./pages/InventoryCheck";
import MedicineReport from "./pages/MedicineReport";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import BlogManagement from "./pages/admin/BlogManagement";
import FeedBackManagement from "./pages/admin/FeedBackManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import SchoolNurseManagement from "./pages/admin/SchoolNurseManagement";


function App() {
  // Kiểm tra nếu đường dẫn nằm trong folder admin
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <Router>
      {/* Chỉ hiển thị Navbar nếu không phải trang admin */}
      {!isAdminRoute && <Navbar />}

      {/* Phần nội dung sẽ thay đổi theo Route */}
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/health-declaration" element={<KhaiBaoSucKhoe />} />
        <Route path="/vaccination" element={<Vaccination />} />
        <Route path="/medical-checkup" element={<MedicalCheckup />} />
        <Route path="/medical-events" element={<MedicalEvents />} />
        <Route path="/send-medicine" element={<SendMedicine />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory-check" element={<InventoryCheck />} />
        <Route path="/medicine-registration" element={<DangKyThuocForm />} />
        <Route path="/medicine-report" element={<MedicineReport />} />
        <Route path="/incident-form" element={<HealthIncidentForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/usermanage" element={<UserManagement />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/manageBlogs" element={<BlogManagement />} />
        <Route path="/admin/manageFeedbacks" element={<FeedBackManagement />} />
        <Route path="/admin/manageChildren" element={<StudentManagement />} />
        <Route path="/admin/manageSchoolNurse" element={<SchoolNurseManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

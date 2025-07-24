import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";


import KhaiBaoSucKhoe from "./pages/KhaiBaoSucKhoe";
import HealthIncidentForm from "./pages/HealthIncidentForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ContactSupport from "./pages/ContactSupport";
import Vaccination from "./pages/Vaccination";
import MedicalCheckup from "./pages/MedicalCheckup";
import MedicalEvents from "./pages/MedicalEvents";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import BlogManagement from "./pages/admin/BlogManagement";
import FeedBackManagement from "./pages/admin/FeedBackManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import SchoolNurseManagement from "./pages/admin/SchoolNurseManagement";
import MedicalManagement from "./pages/admin/MedicalManagement";
import MedicalEventRecording from "./pages/admin/MedicalEventRecording";
import NurseHealthDeclaration from "./pages/NurseHealthDeclaration";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
// import BlogManagement from "./pages/manager/BlogManagement";
// import FeedBackManagement from "./pages/manager/FeedBackManagement";
// import StudentManagement from "./pages/manager/StudentManagement";
// import SchoolNurseManagement from "./pages/manager/SchoolNurseManagement";
// import UserManagement from "./pages/manager/UserManagement";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import DangKyThuocForm from "./pages/DangKyThuocForm";

function App() {

  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const isManagerRoute = window.location.pathname.startsWith("/manager");

  return (
    <Router>
      {/* Chỉ hiển thị Navbar nếu không phải trang admin & manager  */}
      {!isAdminRoute && !isManagerRoute && <Navbar />}

      {/* Phần nội dung sẽ thay đổi theo Route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/health-declaration" element={<KhaiBaoSucKhoe />} />
        <Route path="/vaccination" element={<Vaccination />} />
        <Route path="/medical-checkup" element={<MedicalCheckup />} />
        <Route path="/medical-events" element={<HealthIncidentForm />} />
        <Route path="/incident-form" element={<HealthIncidentForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/usermanage" element={<UserManagement />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/manageBlogs" element={<BlogManagement />} />
        <Route path="/admin/manageFeedbacks" element={<FeedBackManagement />} />
        <Route path="/admin/manageChildren" element={<StudentManagement />} />
        <Route path="/admin/manageSchoolNurse" element={<SchoolNurseManagement />} />
        <Route path="/admin/ConsultationManagement" element={<ConsultationManagement />} />
        <Route path="/admin/MedicalManagement" element={<MedicalManagement />} />
        <Route path="/admin/medicaleventrecording" element={<MedicalEventRecording />} />
        <Route path="/nurse/health-declaration" element={<NurseHealthDeclaration />} />
        <Route path="/manager" element={<ManagerLayout />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/medicine-registration" element={<DangKyThuocForm onBack={() => window.history.back()} />} />
      </Routes>
    </Router>
  );
}

export default App;

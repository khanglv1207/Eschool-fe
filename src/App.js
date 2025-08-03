import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";


import KhaiBaoSucKhoe from "./pages/KhaiBaoSucKhoe";
import HealthDeclarationForm from "./pages/HealthDeclarationForm";
import HealthDeclarationList from "./pages/HealthDeclarationList";
import HealthIncidentForm from "./pages/HealthIncidentForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ParentProfile from "./pages/ParentProfile";
import ContactSupport from "./pages/ContactSupport";
import VaccinationManagement from "./pages/VaccinationManagement";
import VaccinationConfirmation from "./pages/VaccinationConfirmation";
import VaccinationNotification from "./components/VaccinationNotification";
import VaccinationNotifications from "./pages/VaccinationNotifications";
import MedicalCheckup from "./pages/MedicalCheckup";

import ChangePassword from "./pages/ChangePassword";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import BlogManagement from "./pages/admin/BlogManagement";
import UploadBlog from "./pages/admin/UploadBlog";
import FeedBackManagement from "./pages/admin/FeedBackManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import SchoolNurseManagement from "./pages/admin/SchoolNurseManagement";
import MedicalManagement from "./pages/admin/MedicalManagement";
import MedicalEventRecording from "./pages/admin/MedicalEventRecording";
import HealthProfileForm from "./pages/HealthProfileForm";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import VaccinManage from "./pages/admin/VaccineManage";
// import BlogManagement from "./pages/manager/BlogManagement";
// import FeedBackManagement from "./pages/manager/FeedBackManagement";
// import StudentManagement from "./pages/manager/StudentManagement";
// import SchoolNurseManagement from "./pages/manager/SchoolNurseManagement";
// import UserManagement from "./pages/manager/UserManagement";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import MedicineListManagement from "./pages/admin/MedicineListManagement";
import MedicationManagement from "./pages/MedicationManagement";
import NurseLayout from "./pages/nurse/NurseLayout";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import DangKyThuocForm from "./pages/DangKyThuocForm";
import ParentMedicineList from "./pages/ParentMedicineList";

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
        <Route path="/update-profile" element={<ParentProfile />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/health-declaration" element={<KhaiBaoSucKhoe />} />
        <Route path="/health-declaration-form" element={<HealthProfileForm />} />
        <Route path="/health-declaration-list" element={<HealthDeclarationList />} />
        <Route path="/vaccination" element={<VaccinationManagement />} />
        <Route path="/vaccination-confirmation" element={<VaccinationConfirmation />} />
        <Route path="/vaccination-notifications" element={<VaccinationNotifications />} />
        <Route path="/medical-checkup" element={<MedicalCheckup />} />
        <Route path="/health-incident-form" element={<HealthIncidentForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/usermanage" element={<UserManagement />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/manageBlogs" element={<BlogManagement />} />
        <Route path="/admin/uploadBlog" element={<UploadBlog />} />
        <Route path="/admin/manageFeedbacks" element={<FeedBackManagement />} />
        <Route path="/admin/manageChildren" element={<StudentManagement />} />
        <Route path="/admin/manageSchoolNurse" element={<SchoolNurseManagement />} />
        <Route path="/admin/ConsultationManagement" element={<ConsultationManagement />} />
        <Route path="/admin/MedicineListManagement" element={<MedicineListManagement />} />
        <Route path="/admin/MedicalManagement" element={<MedicalManagement />} />
        <Route path="/admin/medicaleventrecording" element={<MedicalEventRecording />} />
        <Route path="/admin/VaccineManage" element={<VaccinManage />} />
        <Route path="/health-profile-form" element={<HealthProfileForm />} />
                    <Route path="/manager" element={<ManagerLayout />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/medicine-registration" element={<DangKyThuocForm onBack={() => window.history.back()} />} />
            <Route path="/parent-medicine-list" element={<MedicineListManagement />} />
            <Route path="/medication-management" element={<MedicationManagement />} />
            <Route path="/medicine-list-management" element={<MedicationManagement />} />
            
            {/* Nurse Routes */}
            <Route path="/nurse" element={<NurseLayout><NurseDashboard /></NurseLayout>} />
            <Route path="/nurse/dashboard" element={<NurseLayout><NurseDashboard /></NurseLayout>} />
            <Route path="/nurse/medication-management" element={<NurseLayout><MedicationManagement /></NurseLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

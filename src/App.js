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
import VaccinationNotifications from "./pages/VaccinationNotifications";
import VaccinationResults from "./pages/VaccinationResults";
import VaccinationTest from "./pages/VaccinationTest";
import VaccinationCreateTest from "./pages/VaccinationCreateTest";
import MedicalCheckup from "./pages/MedicalCheckup";
import HealthCheckupManagement from "./pages/HealthCheckupManagement";

import HealthCheckupResults from "./pages/HealthCheckupResults";
import HealthCheckupTest from "./pages/HealthCheckupTest";
import HealthCheckupResultForm from "./pages/HealthCheckupResultForm";

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
import VaccinManage from "./pages/admin/VaccineManage";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import MedicineListManagement from "./pages/admin/MedicineListManagement";
import MedicationManagement from "./pages/nurse/MedicationManagement";
import Schedules from "./pages/nurse/Schedules";
import MedicationRequests from "./pages/nurse/MedicationRequests";
import HealthCheckup from "./pages/nurse/HealthCheckup";
import NurseLayout from "./pages/nurse/NurseLayout";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import DangKyThuocForm from "./pages/DangKyThuocForm";
import ParentMedicineList from "./pages/ParentMedicineList";
import TodayMedicationSchedules from "./pages/TodayMedicationSchedules";

function App() {

  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const isNurseRoute = window.location.pathname.startsWith("/nurse");
 

  return (
    <Router>
      {/* Chỉ hiển thị Navbar nếu không phải trang admin & nurse  */}
      {!isAdminRoute && !isNurseRoute && <Navbar />}

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
        <Route path="/vaccination-confirmation/:confirmationId" element={<VaccinationConfirmation />} />
        <Route path="/vaccination-notifications" element={<VaccinationNotifications />} />
        <Route path="/vaccination-results" element={<VaccinationResults />} />
        <Route path="/vaccination-test" element={<VaccinationTest />} />
        <Route path="/vaccination-create-test" element={<VaccinationCreateTest />} />
        <Route path="/medical-checkup" element={<MedicalCheckup />} />
        <Route path="/health-checkup" element={<HealthCheckupManagement />} />

        <Route path="/health-checkup-results" element={<HealthCheckupResults />} />
        <Route path="/health-checkup-test" element={<HealthCheckupTest />} />
        <Route path="/health-checkup-result-form/:studentId?" element={<HealthCheckupResultForm />} />
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
        <Route path="/medicine-registration" element={<DangKyThuocForm onBack={() => window.history.back()} />} />
        <Route path="/parent-medicine-list" element={<MedicineListManagement />} />
        <Route path="/today-medication-schedules" element={<TodayMedicationSchedules />} />

        {/* Nurse Routes */}
        <Route path="/nurse" element={<NurseLayout><NurseDashboard /></NurseLayout>} />
        <Route path="/nurse/dashboard" element={<NurseLayout><NurseDashboard /></NurseLayout>} />
        <Route path="/nurse/medication-management" element={<NurseLayout><MedicationManagement /></NurseLayout>} />
        <Route path="/nurse/schedules" element={<Schedules />} />
        <Route path="/nurse/health-checkup" element={<HealthCheckup />} />
        <Route path="/nurse/medication-requests" element={<MedicationRequests />} />
      </Routes>
    </Router>
  );
}

export default App;
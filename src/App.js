import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";

// Các trang
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
import NurseHealthDeclaration from "./pages/NurseHealthDeclaration";

function App() {
  return (
    <Router>
      {/* Navbar luôn luôn hiển thị */}
      <Navbar />

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
        <Route path="/nurse/health-declaration" element={<NurseHealthDeclaration />} />
      </Routes>
    </Router>
  );
}

export default App;

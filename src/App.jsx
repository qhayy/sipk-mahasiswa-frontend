import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registrasi from "./pages/Registrasi";
import LupaPassword from "./pages/LupaPassword";
import Dashboard from "./pages/Dashboard";
import DaftarKegiatan from "./pages/DaftarKegiatan";
import DetailPendaftaran from "./pages/DetailPendaftaran";
import ResetPassword from "./pages/ResetPassword";

import AdminDashboard from "./admin/pages/Dashboard";
import AdminDataKegiatan from "./admin/pages/DataKegiatan";
import AdminDataPeserta from "./admin/pages/DataPeserta";
import AdminVerifikasiKegiatan from "./admin/pages/VerifikasiKegiatan";
import AdminVerifikasiPeserta from "./admin/pages/VerifikasiPeserta";
import AdminLaporan from "./admin/pages/Laporan";
import "./admin/admin.css";
import Sidebar from "./admin/components/Sidebar";
import PengajuanSaya from "./pages/PengajuanSaya";

import "./App.css";

function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />

      <div
        className={
          isSidebarCollapsed
            ? "admin-content collapsed"
            : "admin-content expanded"
        }
      >
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrasi />} />
        <Route path="/forgot-password" element={<LupaPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daftar-kegiatan" element={<DaftarKegiatan />} />
        <Route path="/detail-pendaftaran" element={<DetailPendaftaran />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/data-kegiatan" element={<AdminLayout><AdminDataKegiatan /></AdminLayout>} />
        <Route path="/admin/data-peserta" element={<AdminLayout><AdminDataPeserta /></AdminLayout>} />
        <Route path="/admin/verifikasi-kegiatan" element={<AdminLayout><AdminVerifikasiKegiatan /></AdminLayout>} />
        <Route path="/admin/verifikasi-peserta" element={<AdminLayout><AdminVerifikasiPeserta /></AdminLayout>} />
        <Route path="/admin/laporan" element={<AdminLayout><AdminLaporan /></AdminLayout>} />
        <Route path="/pengajuan-saya" element={<PengajuanSaya />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
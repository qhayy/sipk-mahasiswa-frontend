// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Users, FileText,
  CheckCircle, UserCheck, LogOut, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';

const Sidebar = ({ onLogout, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menus = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/data-kegiatan', name: 'Data Kegiatan', icon: ClipboardList },
    { path: '/admin/verifikasi-kegiatan', name: 'Verifikasi Kegiatan', icon: CheckCircle },
    { path: '/admin/data-peserta', name: 'Data Peserta', icon: Users },
    { path: '/admin/verifikasi-peserta', name: 'Verifikasi Peserta', icon: UserCheck },
    { path: '/admin/laporan', name: 'Laporan', icon: FileText },
  ];

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <>
      {/* MOBILE TRIGGER BUTTON: Diubah ke warna Orange */}
      {isMobile && (
        <button
          onClick={toggleMobile}
          className="fixed top-4 left-4 z-50 p-2 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 transition-colors"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* ASIDE CONTAINER: Mengikuti admin.css Anda dengan background krem #fff7ed & border #fed7aa */}
      <aside className={`
        fixed left-0 top-0 h-full bg-[#fff7ed] text-slate-800 z-50
        transition-all duration-300 ease-in-out border-r border-[#fed7aa]
        flex flex-col ${sidebarWidth}
        ${isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
      `}>
        {/* ARROW TOGGLE BUTTON: Diubah ke warna Orange */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-orange-600 text-white rounded-full items-center justify-center border-2 border-[#fff7ed] hover:bg-orange-500 z-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* LOGO BOX AREA: Menggunakan gradasi Orange Cerah */}
        <div className={`p-5 lg:p-6 border-b border-[#fed7aa]/60 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="min-w-[36px] lg:min-w-[40px] h-9 lg:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <LayoutDashboard className="text-white" size={20} />
          </div>

          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-base lg:text-xl font-extrabold tracking-tight text-slate-900">Admin Panel</h1>
              <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-orange-600 font-bold">
                Management System
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION MENUS: Diubah total saat AKTIF menjadi Orange Gradasi hangat */}
        <nav className="flex-1 mt-6 lg:mt-8 px-3 space-y-1 overflow-y-auto">
          {menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center rounded-xl transition-all duration-200 py-3 lg:py-3.5
                ${isCollapsed ? 'justify-center px-0' : 'px-3 lg:px-4 gap-3'}
                ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 font-semibold'
                  : 'text-slate-600 hover:bg-[#ffedd5] hover:text-[#ea580c]'
                }
              `}
            >
              <menu.icon size={20} />
              {!isCollapsed && (
                <span className="text-xs lg:text-sm font-semibold whitespace-nowrap">
                  {menu.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT BUTTON: Diubah ke Orange Orange pekat/Rose Red agar serasi */}
        <div className="p-4 border-t border-[#fed7aa]/60 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-xl text-orange-600 hover:bg-orange-50 transition-colors font-bold text-sm py-3 w-full ${isCollapsed ? 'justify-center' : 'px-3 lg:px-4 gap-3'}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-xs lg:text-sm">Keluar Akun</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
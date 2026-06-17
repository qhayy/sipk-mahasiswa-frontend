// frontend/src/pages/DataKegiatan.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Edit, Trash2, Eye, Plus, X, 
  CheckCircle, XCircle, Clock, Download,
  User, Layers
} from 'lucide-react';
import { kegiatanService } from '../services/api';

const DataKegiatan = () => {
  // ============ STATE MANAGEMENT ============
  const [kegiatan, setKegiatan] = useState([]);          
  const [search, setSearch] = useState('');              
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [loading, setLoading] = useState(true);            
  const [isModalOpen, setIsModalOpen] = useState(false);   
  const [isEditMode, setIsEditMode] = useState(false);     
  const [selectedKegiatan, setSelectedKegiatan] = useState(null); 
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailKegiatan, setDetailKegiatan] = useState(null);

  const [formData, setFormData] = useState({               
    nama: '',
    deskripsi: '',
    kuota: '',
    pengaju: '',
    nim_pengaju: '',
    kategori: '',
    lokasi: '',
    poin: ''
  });

  // ============ READ ============
  const fetchKegiatan = async () => {
    try {
      const response = await kegiatanService.getAll();      
      setKegiatan(response.data.data || []);
    } catch (error) {
      console.error('Gagal fetch kegiatan:', error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  // ============ EFFECT ============
  useEffect(() => {
    fetchKegiatan();
  }, []);

  // ============ EXPORT TO CSV ============
  const handleExport = () => {
    if (filteredKegiatan.length === 0) {
      alert('Tidak ada data yang bisa diexport');
      return;
    }

    const headers = ['Nama Kegiatan', 'Kategori', 'Pengaju', 'NIM Pengaju', 'Kuota', 'Terdaftar', 'Status', 'Lokasi', 'Poin'];
    const rows = filteredKegiatan.map(keg => [
      `"${keg.nama || ''}"`,
      `"${keg.kategori || ''}"`,
      `"${keg.pengaju || ''}"`,
      `"${keg.nim_pengaju || ''}"`,
      keg.kuota || 0,
      keg.terdaftar || 0,
      `"${keg.status || 'pending'}"`,
      `"${keg.lokasi || ''}"`,
      keg.poin || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Kegiatan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============ DELETE - Hapus kegiatan ============
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus kegiatan "${nama}"?`)) {
      try {
        await kegiatanService.delete(id);                   
        fetchKegiatan();                                    
        alert('Kegiatan berhasil dihapus');
      } catch (error) {
        alert('Gagal menghapus kegiatan');
      }
    }
  };

  // ============ UPDATE - Edit kegiatan ============
  const handleEdit = (keg) => {
    setSelectedKegiatan(keg);
    setFormData({
      nama: keg.nama || '',
      deskripsi: keg.deskripsi || '',
      kuota: keg.kuota || '',
      pengaju: keg.pengaju || '',
      nim_pengaju: keg.nim_pengaju || '',
      kategori: keg.kategori || '',
      lokasi: keg.lokasi || '',
      poin: keg.poin || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // ============ DETAIL - Lihat Detail Kegiatan ============
  const handleDetail = (keg) => {
    setDetailKegiatan(keg);
    setIsDetailModalOpen(true);
  };

  // ============ CREATE ============
  const handleAdd = () => {
    setFormData({
      nama: '',
      deskripsi: '',
      kuota: '',
      pengaju: '',
      nim_pengaju: '',
      kategori: '',
      lokasi: '',
      poin: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // ============ CREATE & UPDATE - Simpan data kegiatan ============
  const handleSave = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        kuota: formData.kuota !== '' ? Number(formData.kuota) : 0,
        poin: formData.poin !== '' ? Number(formData.poin) : 0
      };

      if (isEditMode && selectedKegiatan) {
        await kegiatanService.update(selectedKegiatan.id, dataToSubmit);
        alert('Kegiatan berhasil diupdate');
      } else {
        await kegiatanService.create(dataToSubmit);
        alert('Kegiatan berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchKegiatan();                                      
    } catch (error) {
      console.error('Detail Objek Error:', error);
      if (error.response) {
        const serverData = error.response.data;
        const statusHttp = error.response.status;
        const detailPesan = typeof serverData === 'object' 
          ? (serverData.message || JSON.stringify(serverData)) 
          : serverData;
        alert(`Server Error (${statusHttp}): ${detailPesan}`);
      } else {
        alert(`Koneksi Error: ${error.message}`);
      }
    }
  };

  // ============ FILTER & SEARCH ============
  const filteredKegiatan = kegiatan.filter(k => {
    const matchesSearch = k.nama?.toLowerCase().includes(search.toLowerCase()) ||
                          k.pengaju?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || k.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ============ COMPONENT - Status Badge ============
  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, text: 'Pending', class: 'bg-orange-50 text-orange-600 border-orange-200' },
      disetujui: { icon: CheckCircle, text: 'Disetujui', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      ditolak: { icon: XCircle, text: 'Ditolak', class: 'bg-rose-50 text-rose-600 border-rose-100' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.class}`}>
        <Icon size={12} className="stroke-[2.5]" /> {badge.text}
      </span>
    );
  };

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Memuat data kegiatan...</p>
        </div>
      </div>
    );
  }

  // ============ RENDER UI ============
  return (
    <div className="w-full px-2 sm:px-4 max-w-[100%] overflow-x-hidden">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Data Kegiatan</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Kelola seluruh data kegiatan mahasiswa secara terpusat</p>
          </div>
          {/* TOMBOL ORANGE HIDUP */}
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all duration-200 text-sm whitespace-nowrap w-full sm:w-auto"
          >
            <Plus size={18} className="stroke-[3]" /> Tambah Kegiatan
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari kegiatan atau pengaju..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-44 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-orange-400 transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
            
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-orange-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50/30 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* LIST DATA DENGAN GRID RESPONSIVE - PAS SCREEN & ANTI SCROLL HORIZONTAL */}
        <div className="space-y-3 w-full">
          
          {/* HEADER LIST (Hanya muncul di layar laptop ke atas) */}
          <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-4">Nama Kegiatan</div>
            <div className="col-span-2">Pengaju</div>
            <div className="col-span-2 text-center">Kuota / Terdaftar</div>
            <div className="col-span-2 text-center">Status Berkas</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {/* BODY CARDS LOOPER */}
          {filteredKegiatan.map((keg) => {
            const kuota = keg.kuota || 1;
            const terdaftar = keg.terdaftar || 0;
            const percentFilled = Math.min((terdaftar / kuota) * 100, 100);

            return (
              <div 
                key={keg.id} 
                className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-0 items-start md:items-center px-5 py-4 bg-white border border-orange-100/60 rounded-2xl hover:border-orange-200 shadow-sm transition-all"
              >
                {/* 1. Nama & Kategori */}
                <div className="md:col-span-4 flex items-center gap-3 w-full">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500 shrink-0">
                    <Layers size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-700 text-sm tracking-tight block truncate">
                      {keg.nama}
                    </span>
                    <span className="text-xs text-slate-400 font-medium capitalize mt-0.5 inline-block">
                      {keg.kategori || 'Seminar'}
                    </span>
                  </div>
                </div>

                {/* 2. Pengaju */}
                <div className="md:col-span-2 flex items-center gap-2 text-slate-600 w-full">
                  <User size={14} className="text-slate-400 md:hidden" />
                  <span className="text-xs md:text-sm font-semibold tracking-tight">
                    <span className="md:hidden text-slate-400 font-normal">Pengaju: </span>{keg.pengaju}
                  </span>
                </div>

                {/* 3. Kuota / Terdaftar */}
                <div className="md:col-span-2 w-full md:px-2">
                  <div className="flex flex-col items-start md:items-center w-full max-w-[150px]">
                    <div className="flex justify-between w-full text-xs font-bold text-slate-500 mb-1">
                      <span className="md:hidden text-slate-400 font-normal">Terdaftar: </span>
                      <span>{terdaftar} / {kuota}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" 
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Status Badge */}
                <div className="md:col-span-2 flex items-center justify-start md:justify-center w-full">
                  {getStatusBadge(keg.status)}
                </div>

                {/* 5. AKSI (TAMPILAN BARU: SEGAR, HIDUP, DAN INTERAKTIF) */}
                <div className="md:col-span-2 flex items-center justify-end md:justify-center gap-2 w-full border-t border-slate-100 md:border-none pt-3 md:pt-0 mt-2 md:mt-0">
                  
                  {/* Tombol Lihat (Nuansa Biru Modern) */}
                  <button
                    onClick={() => handleDetail(keg)}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                    title="Detail"
                  >
                    <Eye size={16} className="stroke-[2.5]" />
                  </button>

                  {/* Tombol Edit (Nuansa Kuning/Amber Hangat) */}
                  <button
                    onClick={() => handleEdit(keg)}
                    className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                    title="Edit"
                  >
                    <Edit size={16} className="stroke-[2.5]" />
                  </button>

                  {/* Tombol Hapus (Nuansa Merah Tegas) */}
                  <button
                    onClick={() => handleDelete(keg.id, keg.nama)}
                    className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                    title="Hapus"
                  >
                    <Trash2 size={16} className="stroke-[2.5]" />
                  </button>

                </div>
              </div>
            );
          })}

          {/* Kosong State */}
          {filteredKegiatan.length === 0 && (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-12 text-center text-slate-400">
              <Search size={40} className="text-slate-200 mx-auto mb-2" />
              <p className="font-medium text-sm">Tidak ada data kegiatan ditemukan</p>
            </div>
          )}
        </div>

      </div>

      {/* ============ MODAL FORM ============ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-orange-50 animate-in zoom-in-95 duration-150">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-lg font-extrabold text-slate-800">
                {isEditMode ? '🔧 Edit Kegiatan' : '✨ Tambah Kegiatan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Kegiatan <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                  placeholder="Masukkan nama kegiatan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Deskripsi <span className="text-rose-500">*</span></label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                  placeholder="Deskripsi kegiatan"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Kuota <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={formData.kuota}
                    onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                    placeholder="Jumlah kuota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Poin SKPI</label>
                  <input
                    type="number"
                    value={formData.poin}
                    onChange={(e) => setFormData({ ...formData, poin: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                    placeholder="Poin kegiatan"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Pengaju <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.pengaju}
                    onChange={(e) => setFormData({ ...formData, pengaju: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                    placeholder="Nama pengaju"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">NIM Pengaju <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.nim_pengaju}
                    onChange={(e) => setFormData({ ...formData, nim_pengaju: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                    placeholder="NIM pengaju"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Kompetisi">Kompetisi</option>
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Lomba">Lomba</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Lokasi <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition"
                    placeholder="Lokasi kegiatan"
                  />
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3 z-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition shadow-md shadow-orange-500/10"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL DETAIL ============ */}
      {isDetailModalOpen && detailKegiatan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl border border-orange-50 animate-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-800">🔍 Detail Informasi Kegiatan</h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  {detailKegiatan.kategori || 'Tanpa Kategori'}
                </span>
                <h4 className="text-lg font-black text-slate-800 mt-2.5 tracking-tight">{detailKegiatan.nama}</h4>
              </div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Pengaju</p>
                  <p className="text-slate-700 font-bold mt-0.5">{detailKegiatan.pengaju}</p>
                  <p className="text-slate-400 text-xs font-medium">{detailKegiatan.nim_pengaju || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Lokasi</p>
                  <p className="text-slate-700 font-bold mt-0.5">{detailKegiatan.lokasi}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Kuota / Terdaftar</p>
                  <p className="text-slate-700 font-bold mt-0.5">{detailKegiatan.kuota} / {detailKegiatan.terdaftar || 0} Mhs</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Poin SKPI</p>
                  <p className="text-amber-600 font-black mt-0.5 text-base">{detailKegiatan.poin || 0} Poin</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Deskripsi Kegiatan</p>
                <p className="text-sm text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-medium">
                  {detailKegiatan.deskripsi || 'Tidak ada deskripsi kegiatan.'}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition text-sm font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataKegiatan;
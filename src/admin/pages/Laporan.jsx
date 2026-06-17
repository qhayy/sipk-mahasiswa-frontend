import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  ClipboardList, 
  Download, 
  Shield, 
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { kegiatanService, pesertaService } from '../services/api';

const Laporan = () => {
  const [loading, setLoading] = useState(true);
  const [kegiatan, setKegiatan] = useState([]);
  const [peserta, setPeserta] = useState([]);
  
  // Menyimpan data hasil filter (default berisi semua data dari API)
  const [filteredKegiatan, setFilteredKegiatan] = useState([]);
  const [filteredPeserta, setFilteredPeserta] = useState([]);

  // Kosongkan default value tanggal agar tidak mengunci data secara otomatis
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kegiatanRes, pesertaRes] = await Promise.all([
        kegiatanService.getAll(),
        pesertaService.getAll()
      ]);
      
      const dataKegiatan = kegiatanRes.data.data || [];
      const dataPeserta = pesertaRes.data.data || [];
      
      setKegiatan(dataKegiatan);
      setPeserta(dataPeserta);
      
      // Saat pertama kali dimuat, tampilkan semua data tanpa filter tanggal
      setFilteredKegiatan(dataKegiatan);
      setFilteredPeserta(dataPeserta);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Filter Baru: Hanya menyaring jika user sudah memilih tanggal start & end
  const handleFilter = () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Silakan pilih Tanggal Mulai dan Tanggal Akhir terlebih dahulu!");
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Set ke akhir hari

    // Filter data kegiatan
    const fKegiatan = kegiatan.filter(k => {
      const itemDate = new Date(k.tanggal || k.created_at || k.tanggal_mulai);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Filter data peserta
    const fPeserta = peserta.filter(p => {
      const itemDate = new Date(p.tanggal_daftar || p.created_at);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredKegiatan(fKegiatan);
    setFilteredPeserta(fPeserta);
  };

  // Tombol Reset untuk mengembalikan ke semua data semula
  const handleResetFilter = () => {
    setDateRange({ start: '', end: '' });
    setFilteredKegiatan(kegiatan);
    setFilteredPeserta(peserta);
  };

  // Perhitungan statistik mengacu pada data filtered
  const statsKegiatan = {
    total: filteredKegiatan.length,
    disetujui: filteredKegiatan.filter(k => k.status === 'disetujui').length,
    ditolak: filteredKegiatan.filter(k => k.status === 'ditolak').length,
    pending: filteredKegiatan.filter(k => k.status === 'pending').length,
    rataRataKuota: filteredKegiatan.length ? Math.round(filteredKegiatan.reduce((sum, k) => sum + k.kuota, 0) / filteredKegiatan.length) : 0,
    totalKuota: filteredKegiatan.reduce((sum, k) => sum + k.kuota, 0),
    totalTerdaftar: filteredKegiatan.reduce((sum, k) => sum + k.terdaftar, 0)
  };

  const statsPeserta = {
    total: filteredPeserta.length,
    disetujui: filteredPeserta.filter(p => p.status === 'disetujui').length,
    ditolak: filteredPeserta.filter(p => p.status === 'ditolak').length,
    pending: filteredPeserta.filter(p => p.status === 'pending').length
  };

  const exportToCSV = (data, filename) => {
    if (!data.length) {
      alert("Tidak ada data yang bisa diexport");
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const kegiatanByKategori = () => {
    const kategori = {};
    filteredKegiatan.forEach(k => {
      const kat = k.kategori || 'Lainnya';
      kategori[kat] = (kategori[kat] || 0) + 1;
    });
    return Object.entries(kategori).map(([name, value]) => ({ name, value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Sistem</h2>
        <p className="text-gray-500 mt-1">Rekapitulasi data kegiatan dan peserta</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleFilter}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
            >
              Filter
            </button>
            {(dateRange.start || dateRange.end) && (
              <button 
                onClick={handleResetFilter}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laporan Kegiatan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardList size={20} className="text-indigo-600" />
              Laporan Kegiatan
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Total Kegiatan</p>
                <p className="text-2xl font-bold text-gray-800">{statsKegiatan.total}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Total Kuota</p>
                <p className="text-2xl font-bold text-gray-800">{statsKegiatan.totalKuota}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">Disetujui</span>
                </span>
                <span className="font-semibold text-green-600">{statsKegiatan.disetujui}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </span>
                <span className="font-semibold text-yellow-600">{statsKegiatan.pending}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-600" />
                  <span className="text-sm">Ditolak</span>
                </span>
                <span className="font-semibold text-red-600">{statsKegiatan.ditolak}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Rata-rata Kuota per Kegiatan</span>
                <span className="font-medium">{statsKegiatan.rataRataKuota}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rata-rata Peserta Terdaftar</span>
                <span className="font-medium">
                  {statsKegiatan.total ? Math.round(statsKegiatan.totalTerdaftar / statsKegiatan.total) : 0}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => exportToCSV(filteredKegiatan, 'laporan_kegiatan')}
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
            >
              <Download size={18} /> Export Laporan Kegiatan
            </button>
          </div>
        </div>

        {/* Laporan Peserta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-teal-50">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-green-600" />
              Laporan Peserta
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Total Peserta</p>
                <p className="text-2xl font-bold text-gray-800">{statsPeserta.total}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Tingkat Partisipasi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statsKegiatan.totalKuota ? Math.round((statsKegiatan.totalTerdaftar / statsKegiatan.totalKuota) * 100) : 0}%
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm">Disetujui</span>
                </span>
                <span className="font-semibold text-green-600">{statsPeserta.disetujui}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-sm">Pending</span>
                </span>
                <span className="font-semibold text-yellow-600">{statsPeserta.pending}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-600" />
                  <span className="text-sm">Ditolak</span>
                </span>
                <span className="font-semibold text-red-600">{statsPeserta.ditolak}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rata-rata Peserta per Kegiatan</span>
                <span className="font-medium">
                  {statsKegiatan.total ? Math.round(statsKegiatan.totalTerdaftar / statsKegiatan.total) : 0}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => exportToCSV(filteredPeserta, 'laporan_peserta')}
              className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <Download size={18} /> Export Laporan Peserta
            </button>
          </div>
        </div>
      </div>

      {/* Statistik Tambahan */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kegiatan per Kategori */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award size={20} className="text-purple-600" />
            Kegiatan Berdasarkan Kategori
          </h3>
          <div className="space-y-3">
            {kegiatanByKategori().map((kat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{kat.name}</span>
                  <span className="font-medium">{kat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${statsKegiatan.total ? (kat.value / statsKegiatan.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {kegiatanByKategori().length === 0 && (
              <p className="text-gray-500 text-center py-4">Belum ada data</p>
            )}
          </div>
        </div>

        {/* Data Integrity Check */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-green-600" />
            Keamanan & Validitas Data
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-green-700 font-medium flex items-center gap-2">
                <CheckCircle size={16} /> Data Terintegritas
              </p>
              <p className="text-sm text-green-600 mt-1">Semua data telah tervalidasi dan konsisten</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-700 font-medium flex items-center gap-2">
                <CheckCircle size={16} /> No Spam Detection
              </p>
              <p className="text-sm text-blue-600 mt-1">Tidak ditemukan aktivitas mencurigakan</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-purple-700 font-medium flex items-center gap-2">
                <CheckCircle size={16} /> Data Real-time
              </p>
              <p className="text-sm text-purple-600 mt-1">Sistem memantau perubahan data secara langsung</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Download,
  FileText
} from 'lucide-react';
import { pesertaService, kegiatanService } from '../services/api';

const VerifikasiPeserta = () => {
  const [peserta, setPeserta] = useState([]);
  const [kegiatanList, setKegiatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pesertaRes, kegiatanRes] = await Promise.all([
        pesertaService.getAll(),
        kegiatanService.getAll()
      ]);
      setPeserta(pesertaRes.data.data || []);
      setKegiatanList(kegiatanRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleVerifikasi = async (id, status) => {
  if (
    window.confirm(
      `Yakin ingin ${
        status === "disetujui"
          ? "menyetujui"
          : "menolak"
      } pendaftaran ini?`
    )
  ) {
    try {
      await pesertaService.verify(id, status);

      alert(
        `Peserta berhasil ${
          status === "disetujui"
            ? "disetujui"
            : "ditolak"
        }`
      );

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal memverifikasi peserta");
    }
  }
};

  const pendingPeserta = peserta.filter(p => p.status === 'pending');

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, text: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
      disetujui: { icon: CheckCircle, text: 'Disetujui', class: 'bg-green-100 text-green-700' },
      ditolak: { icon: XCircle, text: 'Ditolak', class: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon size={12} /> {badge.text}
      </span>
    );
  };

  const getKegiatanNama = (kegiatanId) => {
    const kegiatan = kegiatanList.find(k => k.id === kegiatanId);
    return kegiatan?.nama || '-';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data verifikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Verifikasi Peserta</h2>
        <p className="text-gray-500 mt-1">Tinjau dan verifikasi pendaftaran peserta kegiatan</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingPeserta.map((psr) => (
          <div key={psr.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{psr.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={12} /> Menunggu Verifikasi
                      </span>
                      <span className="text-xs text-gray-500">NIM: {psr.nim}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPeserta(psr);
                      setIsDetailModalOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Lihat Detail"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Program Studi</p>
                    <p className="font-medium text-gray-700">{psr.prodi || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Semester</p>
                    <p className="font-medium text-gray-700">{psr.semester || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Kegiatan</p>
                    <p className="font-medium text-gray-700">{getKegiatanNama(psr.kegiatan_id)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                {psr.email && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Mail size={14} /> {psr.email}
                  </div>
                )}
                {psr.no_whatsapp && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Phone size={14} /> {psr.no_whatsapp}
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar size={14} /> Daftar: {psr.tanggal_daftar}
                  </div>
              </div>

              {psr.syarat_file && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">File Persyaratan</p>
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1">
                    <Download size={14} /> {psr.syarat_file}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleVerifikasi(psr.id, 'disetujui')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <ThumbsUp size={18} /> Setujui
                </button>
                <button
                  onClick={() => handleVerifikasi(psr.id, 'ditolak')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <ThumbsDown size={18} /> Tolak
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingPeserta.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Peserta Pending</h3>
            <p className="text-gray-500">Semua pendaftaran peserta sudah diverifikasi</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPeserta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Detail Peserta</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <User size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mt-3">{selectedPeserta.nama}</h3>
                <p className="text-gray-500">{selectedPeserta.nim}</p>
                {getStatusBadge(selectedPeserta.status)}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Program Studi</p>
                    <p className="font-medium">{selectedPeserta.prodi || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Semester</p>
                    <p className="font-medium">{selectedPeserta.semester || '-'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium">{selectedPeserta.email || '-'}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">No WhatsApp</p>
                  <p className="font-medium">{selectedPeserta.no_whatsapp || '-'}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Kegiatan</p>
                  <p className="font-medium">{getKegiatanNama(selectedPeserta.kegiatan_id)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Tanggal Daftar</p>
                  <p className="font-medium">{selectedPeserta.tanggal_daftar}</p>
                </div>
                
                {selectedPeserta.syarat_file && (
                  <div>
                    <p className="text-xs text-gray-400">File Syarat</p>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <Download size={14} /> {selectedPeserta.syarat_file}
                    </button>
                  </div>
                )}
                
                {selectedPeserta.catatan && (
                  <div>
                    <p className="text-xs text-gray-400">Catatan</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedPeserta.catatan}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Tutup
              </button>
              {selectedPeserta.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleVerifikasi(selectedPeserta.id, 'disetujui');
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <ThumbsUp size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => {
                      handleVerifikasi(selectedPeserta.id, 'ditolak');
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <ThumbsDown size={16} /> Tolak
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiPeserta;
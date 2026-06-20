import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  MapPin,
  Users,
  Award,
  UserCheck,
  FileText
} from 'lucide-react';
import { kegiatanService } from '../services/api';

const VerifikasiKegiatan = () => {
  const [kegiatan, setKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      const response = await kegiatanService.getAll();
      setKegiatan(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch kegiatan:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleVerifikasi = async (id, status) => {
  try {
    let reason = "";

    if (status === "ditolak") {
      reason = prompt("Berikan alasan penolakan:");

      if (!reason || reason.trim() === "") {
        alert("Alasan penolakan wajib diisi");
        return;
      }
    }

    await kegiatanService.verify(
      id,
      status,
      reason
    );

    alert(`Kegiatan berhasil ${status}`);

    loadKegiatan();

  } catch (error) {
    console.error(error);
    alert("Gagal memverifikasi kegiatan");
  }
};

  const pendingKegiatan = kegiatan.filter(k => k.status === 'pending');

  const getStatusIcon = (status) => {
    switch(status) {
      case 'disetujui': return <CheckCircle size={16} className="text-green-600" />;
      case 'ditolak': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
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
        <h2 className="text-2xl font-bold text-gray-800">Verifikasi Kegiatan</h2>
        <p className="text-gray-500 mt-1">Tinjau dan verifikasi pengajuan kegiatan mahasiswa</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingKegiatan.map((keg) => (
          <div key={keg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{keg.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={12} /> Menunggu Verifikasi
                      </span>
                      <span className="text-xs text-gray-500">Pengajuan: {keg.tanggal_ajuan}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedKegiatan(keg);
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
              <p className="text-gray-600 mb-4 line-clamp-2">{keg.deskripsi}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <UserCheck size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Pengaju</p>
                    <p className="font-medium text-gray-700">{keg.pengaju}</p>
                    <p className="text-xs text-gray-400">{keg.nim_pengaju}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Kuota</p>
                    <p className="font-medium text-gray-700">{keg.kuota} peserta</p>
                    <p className="text-xs text-gray-400">Terdaftar: {keg.terdaftar}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Lokasi</p>
                    <p className="font-medium text-gray-700">{keg.lokasi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Kategori</p>
                    <p className="font-medium text-gray-700">{keg.kategori || '-'}</p>
                    <p className="text-xs text-gray-400">Poin: {keg.poin || 0}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleVerifikasi(keg.id, 'disetujui')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <ThumbsUp size={18} /> Setujui
                </button>
                <button
                  onClick={() => handleVerifikasi(keg.id, 'ditolak')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <ThumbsDown size={18} /> Tolak
                </button>
              </div>
            </div>
          </div>
        ))}

        {pendingKegiatan.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Kegiatan Pending</h3>
            <p className="text-gray-500">Semua kegiatan sudah diverifikasi</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedKegiatan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Detail Kegiatan</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Nama Kegiatan</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kategori</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.kategori || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pengaju</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.pengaju}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIM Pengaju</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.nim_pengaju}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tanggal Ajuan</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.tanggal_ajuan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.lokasi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kuota</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.kuota}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terdaftar</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.terdaftar}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Poin</p>
                  <p className="font-medium text-gray-800">{selectedKegiatan.poin || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(selectedKegiatan.status)}
                    <span className="font-medium capitalize">{selectedKegiatan.status}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Deskripsi</p>
                <p className="text-gray-700 mt-1 text-sm">{selectedKegiatan.deskripsi}</p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Tutup
              </button>
              {selectedKegiatan.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleVerifikasi(selectedKegiatan.id, 'disetujui');
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <ThumbsUp size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => {
                      handleVerifikasi(selectedKegiatan.id, 'ditolak');
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

export default VerifikasiKegiatan;
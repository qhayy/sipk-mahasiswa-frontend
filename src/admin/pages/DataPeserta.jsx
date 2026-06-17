// frontend/src/pages/DataPeserta.jsx

import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Download,
  X,
  Clock,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';

import { pesertaService } from '../services/api';

const DataPeserta = () => {
  const [peserta, setPeserta] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await pesertaService.getAll();
      setPeserta(response.data.data || []);
    } catch (error) {
      console.error('Gagal fetch peserta:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPeserta = peserta.filter((p) => {
    const matchesSearch =
      p.nama?.toLowerCase().includes(search.toLowerCase()) ||
      p.nim?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      'Nama',
      'NIM',
      'Prodi',
      'Email',
      'Status',
    ];

    const rows = filteredPeserta.map((p) => [
      p.nama || '',
      p.nim || '',
      p.prodi || '',
      p.email || '',
      p.status || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `Data_Peserta_${
      new Date().toISOString().split('T')[0]
    }.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        text: 'Pending',
        class: 'bg-orange-50 text-orange-600 border-orange-200',
      },
      disetujui: {
        icon: CheckCircle,
        text: 'Disetujui',
        class: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      ditolak: {
        icon: XCircle,
        text: 'Ditolak',
        class: 'bg-rose-50 text-rose-600 border-rose-100',
      },
    };

    const badge = badges[status] || badges.pending;

    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.class}`}
      >
        <Icon
          size={12}
          className="stroke-[2.5]"
        />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 max-w-[100%] overflow-x-hidden">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Data Peserta
            </h2>

            <p className="text-slate-500 mt-1 text-sm font-medium">
              Kelola seluruh data peserta kegiatan
            </p>
          </div>

          <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
            <span className="text-sm font-bold text-orange-600">
              Total Peserta: {filteredPeserta.length}
            </span>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex-1 relative w-full group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari peserta (nama/NIM)..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value)
              }
              className="w-full md:w-44 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="disetujui">
                Disetujui
              </option>

              <option value="ditolak">
                Ditolak
              </option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-orange-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition-all"
            >
              <Download size={16} />
              Export
            </button>

          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3 w-full">

          <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-4">
              Nama Peserta
            </div>

            <div className="col-span-2">
              NIM / Prodi
            </div>

            <div className="col-span-3 text-center">
              Kegiatan
            </div>

            <div className="col-span-2 text-center">
              Status
            </div>

            <div className="col-span-1 text-center">
              Aksi
            </div>
          </div>

          {filteredPeserta.map((psr) => (
            <div
              key={psr.id}
              className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-0 items-start md:items-center px-5 py-4 bg-white border border-orange-100/60 rounded-2xl hover:border-orange-200 shadow-sm transition-all"
            >

              <div className="md:col-span-4 flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500">
                  <User size={18} />
                </div>

                <div>
                  <p className="font-bold text-slate-700 text-sm">
                    {psr.nama}
                  </p>

                  <p className="text-xs text-slate-400 font-medium">
                    Peserta
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-slate-700">
                  {psr.nim}
                </p>

                <p className="text-xs text-slate-400">
                  {psr.prodi || '-'}
                </p>
              </div>

              <div className="md:col-span-3 text-sm font-medium text-slate-600">
                {psr.kegiatan?.nama || '-'}
              </div>

              <div className="md:col-span-2 flex justify-start md:justify-center">
                {getStatusBadge(psr.status)}
              </div>

              <div className="md:col-span-1 flex justify-end md:justify-center">
                <button
                  onClick={() => {
                    setSelectedPeserta(psr);
                    setIsDetailModalOpen(true);
                  }}
                  className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                >
                  <Eye size={16} />
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* DETAIL MODAL */}

      {isDetailModalOpen &&
        selectedPeserta && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">

              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg">
                  Detail Peserta
                </h3>

                <button
                  onClick={() =>
                    setIsDetailModalOpen(false)
                  }
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 text-sm">

                <p>
                  <strong>Nama:</strong>{' '}
                  {selectedPeserta.nama}
                </p>

                <p>
                  <strong>NIM:</strong>{' '}
                  {selectedPeserta.nim}
                </p>

                <p>
                  <strong>Prodi:</strong>{' '}
                  {selectedPeserta.prodi}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {selectedPeserta.email}
                </p>

                <p>
                  <strong>No WhatsApp:</strong>{' '}
                  {selectedPeserta.no_whatsapp}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  {selectedPeserta.status}
                </p>

              </div>

            </div>

          </div>
        )}
    </div>
  );
};

export default DataPeserta;
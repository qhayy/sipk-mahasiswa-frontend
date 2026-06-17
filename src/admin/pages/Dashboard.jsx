import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  Clock,
  Users,
  UserCheck,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import StatCard from "../components/StatCard";
import { kegiatanService, pesertaService } from "../services/api";
import "../admin.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [kegiatan, setKegiatan] = useState([]);
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const kegiatanRes = await kegiatanService.getAll();
      const pesertaRes = await pesertaService.getAll();

      setKegiatan(kegiatanRes.data.data || []);
      setPeserta(pesertaRes.data.data || []);
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalKegiatan = kegiatan.length;
  const kegiatanPending = kegiatan.filter((item) => item.status === "pending").length;
  const kegiatanDisetujui = kegiatan.filter((item) => item.status === "disetujui").length;
  const kegiatanDitolak = kegiatan.filter((item) => item.status === "ditolak").length;

  const totalPeserta = peserta.length;
  const pesertaPending = peserta.filter((item) => item.status === "pending").length;

  const chartMap = {};
  peserta.forEach((item) => {
    const tanggal = new Date(item.tanggal_daftar).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    });

    if (!chartMap[tanggal]) {
      chartMap[tanggal] = { name: tanggal, peserta: 0 };
    }
    chartMap[tanggal].peserta += 1;
  });

  const chartData = Object.values(chartMap);

  const pieData = [
    { name: "Disetujui", value: kegiatanDisetujui, color: "#ea580c" },
    { name: "Pending", value: kegiatanPending, color: "#f97316" },
    { name: "Ditolak", value: kegiatanDitolak, color: "#fcd34d" },
  ];

  const kegiatanTerbaru = [...kegiatan].sort((a, b) => b.id - a.id).slice(0, 5);

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Memuat Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="space-y-10 animate-in fade-in duration-700">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Monitoring
          </h2>
          <p className="text-slate-500 mt-1 text-lg font-medium">
            Selamat datang, berikut ringkasan sistem hari ini.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Kegiatan" value={totalKegiatan} icon={ClipboardList} color="bg-orange-600" />
          <StatCard title="Kegiatan Pending" value={kegiatanPending} icon={Clock} color="bg-amber-500" />
          <StatCard title="Total Peserta" value={totalPeserta} icon={Users} color="bg-orange-500" />
          <StatCard title="Peserta Pending" value={pesertaPending} icon={UserCheck} color="bg-amber-600" />
        </div>

        {/* CHART CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-bold text-slate-800 text-xl mb-8">
              Pendaftaran Peserta
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />

                <Area
                  type="step"
                  dataKey="peserta"
                  name="Peserta"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#orangeGradient)"
                  dot={{ r: 3, fill: '#ffffff', stroke: '#f97316', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#ea580c' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 text-xl mb-8">
              Status Kegiatan
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KEGIATAN TERBARU - DESAIN CARDS LIST MODERN */}
        <div className="card overflow-hidden">
          <div className="px-8 py-6 border-b border-orange-100 flex justify-between items-center bg-gradient-to-r from-white to-[#fff7ed]">
            <div>
              <h3 className="font-bold text-slate-800 text-xl">
                Kegiatan Terbaru
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Lima aktivitas dan pengajuan proposal terakhir masuk sistem.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/data-kegiatan")}
              className="text-sm font-bold text-orange-600 flex items-center gap-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-full transition-all duration-200 group"
            >
              Lihat Semua
              <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] p-6 space-y-3">
              {/* HEADER LIST */}
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <div className="col-span-6">Nama Kegiatan</div>
                <div className="col-span-3 text-center">Status Berkas</div>
                <div className="col-span-3 text-right">Tanggal Pengajuan</div>
              </div>

              {/* BODY LIST LOOPER */}
              {kegiatanTerbaru.map((item) => {
                let badgeStyle = "bg-orange-50 text-orange-600 border-orange-200";
                if (item.status === "disetujui") badgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-100";
                if (item.status === "ditolak") badgeStyle = "bg-rose-50 text-rose-600 border-rose-100";

                return (
                  <div 
                    key={item.id}
                    className="grid grid-cols-12 items-center px-4 py-4 bg-white border border-orange-100/70 rounded-2xl hover:bg-[#fffbf7] hover:border-orange-200 hover:translate-x-1 transition-all duration-200 shadow-sm shadow-orange-500/[0.01]"
                  >
                    {/* Nama Kegiatan */}
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="font-semibold text-slate-700 text-sm tracking-tight">
                        {item.nama}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-3 flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${badgeStyle}`}>
                        <CheckCircle size={12} className="stroke-[2.5]" />
                        {item.status}
                      </span>
                    </div>

                    {/* Tanggal */}
                    <div className="col-span-3 text-right font-medium text-slate-500 text-sm">
                      {item.tanggal 
                        ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })
                        : "-"
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
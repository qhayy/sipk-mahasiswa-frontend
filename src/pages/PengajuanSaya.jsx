import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function PengajuanSaya() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPengajuanSaya();
  }, []);

  const getPengajuanSaya = async () => {
    try {
      const response = await axiosInstance.get("/admin/kegiatan");

      const semuaKegiatan = response.data?.data || [];

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const dataSaya = semuaKegiatan.filter(
        (item) =>
          String(item.nim_pengaju) ===
          String(user?.nim)
      );

      setPengajuan(dataSaya);
    } catch (error) {
      console.error(
        "Gagal mengambil data pengajuan:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "disetujui":
        return (
          <span
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Diterima
          </span>
        );

      case "ditolak":
        return (
          <span
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Ditolak
          </span>
        );

      default:
        return (
          <span
            style={{
              background: "#fef3c7",
              color: "#92400e",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Sedang Diproses
          </span>
        );
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>SIPK Mahasiswa</h2>

        <div className="nav-menu">
          <Link to="/dashboard">
            <button>Kembali ke Dashboard</button>
          </Link>
        </div>
      </nav>

      <section className="dashboard">
        <h1 className="dashboard-title">
          Pengajuan Saya
        </h1>

        <p className="dashboard-subtitle">
          Daftar kegiatan yang pernah Anda
          ajukan sebagai panitia kegiatan.
        </p>

        {loading ? (
          <p>Memuat data...</p>
        ) : pengajuan.length === 0 ? (
          <div className="kegiatan-card">
            <h3>Belum Ada Pengajuan</h3>
            <p>
              Anda belum pernah mengajukan
              kegiatan.
            </p>
          </div>
        ) : (
          <div className="kegiatan-grid">
            {pengajuan.map((item) => (
              <div
                key={item.id}
                className="kegiatan-card"
              >
                <span className="card-badge">
                  {item.kategori}
                </span>

                <h3>{item.nama}</h3>

                <p>
                  <strong>Tanggal:</strong>{" "}
                  {formatTanggal(item.tanggal)}
                </p>

                <p>
                  <strong>Lokasi:</strong>{" "}
                  {item.lokasi}
                </p>

                <p>
                  <strong>Kuota:</strong>{" "}
                  {item.kuota} peserta
                </p>

                <p>
                  <strong>Pengaju:</strong>{" "}
                  {item.pengaju}
                </p>

                <p>
                  <strong>Alasan:</strong>
                  {item.alasan_penolakan}
                </p>

                <div
                  style={{
                    marginTop: "12px",
                  }}
                >
                  {getStatusBadge(
                    item.status
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PengajuanSaya;
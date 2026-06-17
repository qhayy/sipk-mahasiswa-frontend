import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DetailPendaftaran() {
  const location = useLocation();
  const navigate = useNavigate();

  const pendaftaran = location.state?.pendaftaran;
  const kembaliKe = location.state?.kembaliKe;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Kalau data kosong → langsung balik dashboard
  if (!pendaftaran) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  return (
    <div className="app">
      <section className="dashboard daftar-container">
        <h1 className="dashboard-title">
          Detail Pendaftaran {pendaftaran.nama}
        </h1>

        <p className="dashboard-subtitle">
          Informasi lengkap mengenai pendaftaran kegiatan.
        </p>

        <div className="daftar-grid">
          <div className="kegiatan-card daftar-card">
            <span className="card-badge">{pendaftaran.kategori}</span>
            <h3>{pendaftaran.nama}</h3>

            <p>Tanggal Kegiatan: {pendaftaran.tanggalKegiatan}</p>
            <p>Lokasi: {pendaftaran.lokasi}</p>
          </div>

          <div className="kegiatan-card daftar-card">
            <h3>Informasi Pendaftaran</h3>

            <p>
              <strong>Status:</strong> {pendaftaran.status}
            </p>
            <p>
              <strong>Tanggal Daftar:</strong> {pendaftaran.tanggalDaftar}
            </p>

            <div className="daftar-actions">
              <button
                className="card-btn"
                onClick={() =>
                  navigate("/dashboard", {
                    state: kembaliKe,
                  })
                }
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetailPendaftaran;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function DaftarKegiatan() {
  const location = useLocation();
  const navigate = useNavigate();

  const kegiatan = location.state?.kegiatan;
  const kembaliKe = location.state?.kembaliKe;

  const [formData, setFormData] = useState({
    namaLengkap: "",
    nim: "",
    programStudi: "",
    email: "",
    noHp: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [infoKuota, setInfoKuota] = useState({
    kuota: kegiatan?.kuota || 0,
    terdaftar: 0,
    sisaKuota: kegiatan?.kuota || 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!kegiatan) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const getInfoKuota = async () => {
    try {
      const response = await axiosInstance.get(
        `/pendaftaran-info/${kegiatan.id}`
      );

      setInfoKuota(response.data);
    } catch (error) {
      console.error("Gagal mengambil info kuota:", error);
    }
  };

  useEffect(() => {
    if (kegiatan) {
      getInfoKuota();
    }
  }, [kegiatan]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/pendaftaran", {
        nama: formData.namaLengkap,
        nim: formData.nim,
        prodi: formData.programStudi,
        email: formData.email,
        no_whatsapp: formData.noHp,
        kegiatan_id: kegiatan.id,
      });

      setIsSuccess(true);
      setMessage(
        response.data.message ||
          `Pendaftaran ${kegiatan.nama} berhasil dikirim. Status pendaftaran kamu: Menunggu.`
      );

      await getInfoKuota();

      setFormData({
        namaLengkap: "",
        nim: "",
        programStudi: "",
        email: "",
        noHp: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setIsSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim pendaftaran"
      );
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "Belum ditentukan";

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) {
      return "Belum ditentukan";
    }

    const bulanIndonesia = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const hari = date.getDate();
    const bulan = bulanIndonesia[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} ${bulan} ${tahun}`;
  };

  return (
    <div className="app">
      <section className="dashboard daftar-container">
        <h1 className="dashboard-title">Pendaftaran {kegiatan.nama}</h1>

        <p className="dashboard-subtitle">
          Lengkapi data berikut untuk mendaftar kegiatan ini.
        </p>

        <div className="daftar-grid">
          <div className="kegiatan-card daftar-card">
            <span className="card-badge">{kegiatan.kategori}</span>
            <h3>{kegiatan.nama}</h3>
            <p>Tanggal: {formatTanggal(kegiatan.tanggal)}</p>
            <p>Lokasi: {kegiatan.lokasi}</p>
            <p>Kuota: {infoKuota.kuota} peserta</p>
            <p>Terdaftar: {infoKuota.terdaftar} peserta</p>
            <p>Sisa kuota: {infoKuota.sisaKuota} peserta</p>
          </div>

          <div className="kegiatan-card daftar-card">
            <h3>Form Pendaftaran</h3>

            {message && (
              <div
                style={{
                  padding: "14px",
                  marginBottom: "18px",
                  borderRadius: "12px",
                  backgroundColor: isSuccess ? "#e8f8ee" : "#fdecec",
                  color: isSuccess ? "#1f7a3f" : "#b42318",
                  fontWeight: "600",
                }}
              >
                {message}
              </div>
            )}

            {!isSuccess ? (
              <form className="daftar-form" onSubmit={handleSubmit}>
                <p>Nama Lengkap</p>
                <input
                  type="text"
                  name="namaLengkap"
                  placeholder="Masukkan nama lengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                />

                <p>NIM</p>
                <input
                  type="text"
                  name="nim"
                  placeholder="Masukkan NIM"
                  value={formData.nim}
                  onChange={handleChange}
                  required
                />

                <p>Program Studi</p>
                <input
                  type="text"
                  name="programStudi"
                  placeholder="Masukkan program studi"
                  value={formData.programStudi}
                  onChange={handleChange}
                  required
                />

                <p>Email</p>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <p>No. HP</p>
                <input
                  type="text"
                  name="noHp"
                  placeholder="Masukkan nomor HP"
                  value={formData.noHp}
                  onChange={handleChange}
                  required
                />

                <div className="daftar-actions">
                  <button type="submit" className="card-btn">
                    Kirim Pendaftaran
                  </button>

                  <button
                    type="button"
                    className="detail-btn"
                    onClick={() =>
                      navigate("/dashboard", {
                        state: kembaliKe,
                      })
                    }
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="daftar-actions">
                <button
                  type="button"
                  className="card-btn"
                  onClick={() =>
                    navigate("/dashboard", {
                      state: kembaliKe,
                    })
                  }
                >
                  Kembali ke Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DaftarKegiatan;
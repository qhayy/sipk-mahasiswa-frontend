import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownKegiatan, setDropdownKegiatan] = useState(false);
  const [filterKegiatan, setFilterKegiatan] = useState("Semua Kegiatan");

  const [dropdownPendaftaran, setDropdownPendaftaran] = useState(false);
  const [filterPendaftaran, setFilterPendaftaran] =
    useState("Semua Pendaftaran");

  const [dropdownProfil, setDropdownProfil] = useState(false);
  const [menuProfil, setMenuProfil] = useState("Data Diri");

  const [halamanAktif, setHalamanAktif] = useState("kegiatan");

  const [kegiatan, setKegiatan] = useState([]);
  const [pendaftaran, setPendaftaran] = useState([]);

  const [profile, setProfile] = useState(null);

  const [showPengajuan, setShowPengajuan] = useState(false);
  
  const [pengajuanData, setPengajuanData] = useState({
    nama: "",
    kategori: "Seminar",
    tanggal: "",
    lokasi: "",
    kuota: 50,
  });

  const [editProfile, setEditProfile] = useState({
    name: "",
    prodi: "",
    no_whatsapp: "",
  });

  const [passwordData, setPasswordData] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getKegiatan();
    getPendaftaran();
    getProfile();
  }, [navigate]);

  const getKegiatan = async () => {
    try {
      const response = await axios.get( "https://sipk-mahasiswa-backend-production.up.railway.app/kegiatan");
      setKegiatan(response.data);
    } catch (error) {
      console.error("Gagal mengambil data kegiatan:", error);
    }
  };

  const getPendaftaran = async () => {
    try {
      const response = await axiosInstance.get("/pendaftaran-saya");
      setPendaftaran(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pendaftaran:", error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get("/profile");

      setProfile(response.data);

      setEditProfile({
        name: response.data.name || "",
        prodi: response.data.prodi || "",
        no_whatsapp: response.data.no_whatsapp || "",
      });
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
    }
  };

  useEffect(() => {
    if (location.state?.halamanAktif) {
      setHalamanAktif(location.state.halamanAktif);
    }

    if (location.state?.filterKegiatan) {
      setFilterKegiatan(location.state.filterKegiatan);
    }

    if (location.state?.filterPendaftaran) {
      setFilterPendaftaran(location.state.filterPendaftaran);
    }

    if (location.state?.menuProfil) {
      setMenuProfil(location.state.menuProfil);
    }
  }, [location.state]);

  const handleDaftar = (kegiatan) => {
    navigate("/daftar-kegiatan", {
      state: {
        kegiatan: kegiatan,
        kembaliKe: {
          halamanAktif: halamanAktif,
          filterKegiatan: filterKegiatan,
          filterPendaftaran: filterPendaftaran,
          menuProfil: menuProfil,
        },
      },
    });
  };

  const handleDetailPendaftaran = (pendaftaran) => {
    navigate("/detail-pendaftaran", {
      state: {
        pendaftaran: pendaftaran,
        kembaliKe: {
          halamanAktif: halamanAktif,
          filterKegiatan: filterKegiatan,
          filterPendaftaran: filterPendaftaran,
          menuProfil: menuProfil,
        },
      },
    });
  };

  const kembaliKeDashboard = () => {
    setHalamanAktif("kegiatan");
    setFilterKegiatan("Semua Kegiatan");
    setFilterPendaftaran("Semua Pendaftaran");
    setMenuProfil("Data Diri");

    setDropdownKegiatan(false);
    setDropdownPendaftaran(false);
    setDropdownProfil(false);
  };

  const pilihKategori = (kategori) => {
    setFilterKegiatan(kategori);
    setHalamanAktif("kegiatan");

    setDropdownKegiatan(false);
    setDropdownPendaftaran(false);
    setDropdownProfil(false);
  };

  const pilihPendaftaran = (status) => {
    setFilterPendaftaran(status);
    setHalamanAktif("pendaftaran");

    setDropdownPendaftaran(false);
    setDropdownKegiatan(false);
    setDropdownProfil(false);
  };

  const pilihProfil = (menu) => {
    setMenuProfil(menu);
    setHalamanAktif("profil");

    setDropdownProfil(false);
    setDropdownKegiatan(false);
    setDropdownPendaftaran(false);
  };

  const tampilkanKegiatan = (kategori) => {
    if (filterKegiatan === "Semua Kegiatan") return true;
    if (filterKegiatan === kategori) return true;

    return false;
  };

  const ubahStatus = (status) => {
    if (status === "pending" || status === "Menunggu") {
      return "Sedang Diproses";
    }

    if (status === "disetujui" || status === "Diterima") {
      return "Diterima";
    }

    return status;
  };

  const tampilkanPendaftaran = (status, riwayat = false) => {
    const statusBaru = ubahStatus(status);

    if (filterPendaftaran === "Semua Pendaftaran") return true;
    if (filterPendaftaran === statusBaru) return true;
    if (filterPendaftaran === "Riwayat Pendaftaran") return riwayat;

    return false;
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

  const getDetailKegiatan = (item) => {
    return kegiatan.find(
      (data) => data.id === item.kegiatan_id || data.nama === item.kegiatan
    );
  };

  const handleChangeProfile = (e) => {
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axiosInstance.put("/profile", editProfile);

      alert(response.data.message || "Profil berhasil diperbarui");

      setProfile(response.data.data);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      setMenuProfil("Data Diri");
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert(error.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const handleChangePassword = async () => {
     console.log("TOMBOL DIKLIK");
  console.log("TOKEN:", localStorage.getItem("token"));
  try {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

   const response = await axiosInstance.put("/change-password", {
  password_lama: passwordData.oldPassword,
  password_baru: passwordData.newPassword,
  konfirmasi_password: passwordData.confirmPassword,
});

    alert(response.data.message || "Password berhasil diubah");

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Gagal mengubah password"
    );
  }
};

  const handlePengajuanChange = (e) => {
    setPengajuanData({
      ...pengajuanData,
      [e.target.name]: e.target.value,
    });
  };

  const submitPengajuan = async () => {
    try {
      const response = await axiosInstance.post(
        "/pengajuan-kegiatan",
        pengajuanData
      );

      alert(response.data.message || "Pengajuan kegiatan berhasil dikirim");

      setShowPengajuan(false);

      setPengajuanData({
        nama: "",
        kategori: "Seminar",
        tanggal: "",
        lokasi: "",
        kuota: 50,
      });

    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengirim pengajuan");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>SIPK Mahasiswa</h2>

        <div className="nav-menu">
          <button type="button" onClick={kembaliKeDashboard}>
            Dashboard
          </button>

          <div className={`nav-dropdown ${dropdownKegiatan ? "open" : ""}`}>
            <button
              type="button"
              className="nav-dropbtn"
              onClick={() => {
                setDropdownKegiatan(!dropdownKegiatan);
                setDropdownPendaftaran(false);
                setDropdownProfil(false);
              }}
            >
              Kegiatan
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <button
                type="button"
                className={filterKegiatan === "Semua Kegiatan" ? "active" : ""}
                onClick={() => pilihKategori("Semua Kegiatan")}
              >
                Semua Kegiatan
              </button>

              <button
                type="button"
                className={filterKegiatan === "Seminar" ? "active" : ""}
                onClick={() => pilihKategori("Seminar")}
              >
                Seminar
              </button>

              <button
                type="button"
                className={filterKegiatan === "Workshop" ? "active" : ""}
                onClick={() => pilihKategori("Workshop")}
              >
                Workshop
              </button>

              <button
                type="button"
                className={filterKegiatan === "Pelatihan" ? "active" : ""}
                onClick={() => pilihKategori("Pelatihan")}
              >
                Pelatihan
              </button>
            </div>
          </div>

          <div className={`nav-dropdown ${dropdownPendaftaran ? "open" : ""}`}>
            <button
              type="button"
              className="nav-dropbtn"
              onClick={() => {
                setDropdownPendaftaran(!dropdownPendaftaran);
                setDropdownKegiatan(false);
                setDropdownProfil(false);
              }}
            >
              Pendaftaran Saya
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <button
                type="button"
                className={
                  filterPendaftaran === "Semua Pendaftaran" ? "active" : ""
                }
                onClick={() => pilihPendaftaran("Semua Pendaftaran")}
              >
                Semua Pendaftaran
              </button>

              <button
                type="button"
                className={
                  filterPendaftaran === "Sedang Diproses" ? "active" : ""
                }
                onClick={() => pilihPendaftaran("Sedang Diproses")}
              >
                Sedang Diproses
              </button>

              <button
                type="button"
                className={filterPendaftaran === "Diterima" ? "active" : ""}
                onClick={() => pilihPendaftaran("Diterima")}
              >
                Diterima
              </button>

              <button
                type="button"
                className={
                  filterPendaftaran === "Riwayat Pendaftaran" ? "active" : ""
                }
                onClick={() => pilihPendaftaran("Riwayat Pendaftaran")}
              >
                Riwayat Pendaftaran
              </button>
            </div>
          </div>

          <div className={`nav-dropdown ${dropdownProfil ? "open" : ""}`}>
            <button
              type="button"
              className="nav-dropbtn"
              onClick={() => {
                setDropdownProfil(!dropdownProfil);
                setDropdownKegiatan(false);
                setDropdownPendaftaran(false);
              }}
            >
              Profil
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <button
                type="button"
                className={menuProfil === "Data Diri" ? "active" : ""}
                onClick={() => pilihProfil("Data Diri")}
              >
                Data Diri
              </button>

              <button
                type="button"
                className={menuProfil === "Edit Profil" ? "active" : ""}
                onClick={() => pilihProfil("Edit Profil")}
              >
                Edit Profil
              </button>

              <button
                type="button"
                className={menuProfil === "Ubah Password" ? "active" : ""}
                onClick={() => pilihProfil("Ubah Password")}
              >
                Ubah Password
              </button>

              <button
                type="button"
                className={menuProfil === "Riwayat Aktivitas" ? "active" : ""}
                onClick={() => pilihProfil("Riwayat Aktivitas")}
              >
                Riwayat Aktivitas
              </button>
            </div>
          </div>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className="dashboard">
        <h1 className="dashboard-title">Halo, Mahasiswa 👋</h1>

        <p className="dashboard-subtitle">
          Temukan kegiatan kampus, lakukan pendaftaran, dan pantau status
          pendaftaran kamu dalam satu tempat.
        </p>

        <div className="dashboard-cards">
          <div className="dash-card">
            <div className="dash-icon">📅</div>
            <h3>{kegiatan.length}</h3>
            <p>Kegiatan Tersedia</p>
          </div>

          <div className="dash-card">
            <div className="dash-icon">📝</div>
            <h3>{pendaftaran.length}</h3>
            <p>Pendaftaran Saya</p>
          </div>

          <div className="dash-card">
            <div className="dash-icon">✅</div>
            <h3>
              {
                pendaftaran.filter(
                  (item) => ubahStatus(item.status) === "Diterima"
                ).length
              }
            </h3>
            <p>Status Diterima</p>
          </div>

          <div className="dash-card">
            <div className="dash-icon">⏳</div>
            <h3>
              {
                pendaftaran.filter(
                  (item) => ubahStatus(item.status) === "Sedang Diproses"
                ).length
              }
            </h3>
            <p>Sedang Diproses</p>
          </div>
        </div>

        {halamanAktif === "kegiatan" && (
          <div className="dashboard-section" id="kegiatan">
            <div className="section-header">
              <div>
                <h2>Kegiatan Tersedia</h2>
                <p>
                  {filterKegiatan === "Semua Kegiatan"
                    ? "Pilih kegiatan kampus yang ingin kamu ikuti."
                    : `Menampilkan kategori: ${filterKegiatan}`}
                </p>
              </div>
            </div>

            <div className="kegiatan-grid">
              {kegiatan.length === 0 ? (
                <p>Belum ada kegiatan.</p>
              ) : (
                kegiatan
                  .filter((item) => tampilkanKegiatan(item.kategori))
                  .map((item) => (
                    <div className="kegiatan-card" key={item.id}>
                      <span className="card-badge">{item.kategori}</span>
                      <h3>{item.nama}</h3>
                      <p>Tanggal : {formatTanggal(item.tanggal)}</p>
                      <p>Lokasi: {item.lokasi}</p>
                      <p>Kuota: {item.kuota} peserta</p>

                      <button
                        className="card-btn"
                        onClick={() =>
                          handleDaftar({
                            id: item.id,
                            nama: item.nama,
                            kategori: item.kategori,
                            tanggal: item.tanggal,
                            lokasi: item.lokasi,
                            kuota: item.kuota,
                          })
                        }
                      >
                        Daftar Sekarang
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {halamanAktif === "pendaftaran" && (
          <div className="dashboard-section" id="pendaftaran">
            <div className="section-header">
              <div>
                <h2>Pendaftaran Saya</h2>
                <p>
                  {filterPendaftaran === "Semua Pendaftaran"
                    ? "Lihat semua kegiatan yang sudah kamu daftar."
                    : `Menampilkan status: ${filterPendaftaran}`}
                </p>
              </div>
            </div>

            <div className="status-list">
              {pendaftaran.length === 0 ? (
                <p>Belum ada pendaftaran.</p>
              ) : (
                pendaftaran
                  .filter((item) => tampilkanPendaftaran(item.status, true))
                  .map((item) => {
                    const detailKegiatan = getDetailKegiatan(item);

                    return (
                      <div className="status-item" key={item.id}>
                        <div>
                          <h3>
                            {detailKegiatan?.nama ||
                              item.kegiatan ||
                              "Kegiatan"}
                          </h3>
                          <p>
                            Tanggal Daftar:{" "}
                            {formatTanggal(
                              item.tanggal_daftar || item.createdAt
                            )}
                          </p>
                        </div>

                        <div className="status-right">
                          <span
                            className={
                              ubahStatus(item.status) === "Diterima"
                                ? "status success"
                                : "status pending"
                            }
                          >
                            {ubahStatus(item.status)}
                          </span>

                          <button
                            className="detail-btn"
                            onClick={() => {
                              const detailKegiatan = getDetailKegiatan(item);

                              handleDetailPendaftaran({
                                nama:
                                  detailKegiatan?.nama ||
                                  item.kegiatan ||
                                  "Kegiatan",
                                status: ubahStatus(item.status),
                                tanggalDaftar: formatTanggal(
                                  item.tanggal_daftar || item.createdAt
                                ),
                                kategori: detailKegiatan?.kategori || "",
                                tanggalKegiatan: detailKegiatan
                                  ? formatTanggal(detailKegiatan.tanggal)
                                  : "Belum ditentukan",
                                lokasi: detailKegiatan?.lokasi || "",
                                namaLengkap: item.namaLengkap || item.nama,
                                nim: item.nim,
                                programStudi: item.programStudi || item.prodi,
                                email: item.email,
                                noHp: item.noHp || item.no_whatsapp,
                              });
                            }}
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {halamanAktif === "profil" && (
          <div className="dashboard-section" id="profil">
            <div className="section-header">
              <div>
                <h2>Profil</h2>
                <p>Menampilkan menu: {menuProfil}</p>
              </div>
            </div>

            {menuProfil === "Data Diri" && (
              <div className="kegiatan-grid">
                <div className="kegiatan-card">
                  <span className="card-badge">Data Diri</span>
                  <h3>Informasi Mahasiswa</h3>
                  <p>Nama: {profile?.name || "-"}</p>
                  <p>NIM: {profile?.nim || "-"}</p>
                  <p>Program Studi: {profile?.prodi || "-"}</p>
                  <p>Email: {profile?.email || "-"}</p>
                  <p>No. WhatsApp: {profile?.no_whatsapp || "-"}</p>
                </div>
              </div>
            )}

            {menuProfil === "Edit Profil" && (
              <div className="kegiatan-grid">
                <div className="kegiatan-card">
                  <span className="card-badge">Edit Profil</span>
                  <h3>Ubah Data Profil</h3>

                  <p>Nama Lengkap</p>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={editProfile.name}
                    onChange={handleChangeProfile}
                  />

                  <p>Program Studi</p>
                  <input
                    type="text"
                    name="prodi"
                    placeholder="Masukkan program studi"
                    value={editProfile.prodi}
                    onChange={handleChangeProfile}
                  />

                  <p>No. HP</p>
                  <input
                    type="text"
                    name="no_whatsapp"
                    placeholder="Masukkan nomor HP"
                    value={editProfile.no_whatsapp}
                    onChange={handleChangeProfile}
                  />

                  <button className="card-btn" onClick={handleUpdateProfile}>
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {menuProfil === "Ubah Password" && (
              <div className="kegiatan-grid">
                <div className="kegiatan-card">
                  <span className="card-badge">Ubah Password</span>
                  <h3>Ganti Password Akun</h3>

                  <p>Password Lama</p>
                 <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                setPasswordData({
                ...passwordData,
                oldPassword: e.target.value,
           })
  }
/>
                <p>Password Baru</p>
              <input
            type="password"
            value={passwordData.newPassword}
           onChange={(e) =>
          setPasswordData({
          ...passwordData,
          newPassword: e.target.value,
        })
  }
/>
            <p>Konfirmasi Password Baru</p>
          <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
         setPasswordData({
        ...passwordData,
        confirmPassword: e.target.value,
      })
  }
/>
                  <button
  className="card-btn"
  onClick={handleChangePassword}
>
  Ubah Password
</button>
                </div>
              </div>
            )}

            {menuProfil === "Riwayat Aktivitas" && (
              <div className="status-list">
                {pendaftaran.length === 0 ? (
                  <p>Belum ada aktivitas.</p>
                ) : (
                  pendaftaran.map((item) => {
                    const detailKegiatan = getDetailKegiatan(item);

                    return (
                      <div className="status-item" key={item.id}>
                        <div>
                          <h3>
                            Mendaftar{" "}
                            {detailKegiatan?.nama ||
                              item.kegiatan ||
                              "Kegiatan"}
                          </h3>

                          <p>
                            {formatTanggal(
                              item.tanggal_daftar || item.createdAt
                            )}
                          </p>
                        </div>

                        <span
                          className={
                            ubahStatus(item.status) === "Diterima"
                              ? "status success"
                              : "status pending"
                          }
                        >
                          {ubahStatus(item.status)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {showPengajuan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Pengajuan Kegiatan</h2>

              <input
                type="text"
                name="nama"
                placeholder="Nama Kegiatan"
                value={pengajuanData.nama}
                onChange={handlePengajuanChange}
              />

              <select
                name="kategori"
                value={pengajuanData.kategori}
                onChange={handlePengajuanChange}
              >
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
                <option value="Pelatihan">Pelatihan</option>
              </select>

              <input
                type="date"
                name="tanggal"
                value={pengajuanData.tanggal}
                onChange={handlePengajuanChange}
              />

              <input
                type="text"
                name="lokasi"
                placeholder="Lokasi"
                value={pengajuanData.lokasi}
                onChange={handlePengajuanChange}
              />

              <input
                type="number"
                name="kuota"
                placeholder="Kuota"
                value={pengajuanData.kuota}
                onChange={handlePengajuanChange}
              />

              <div className="modal-actions">
                <button className="card-btn" onClick={submitPengajuan}>
                  Kirim Pengajuan
                </button>

                <button
                  className="detail-btn"
                  onClick={() => setShowPengajuan(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
        
{halamanAktif === "kegiatan" && (
  <button
    type="button"
    className="floating-btn"
    onClick={() => setShowPengajuan(true)}
    title="Ajukan Kegiatan Baru"
  >
    +
  </button>
)}
    </div>
  );
}

export default Dashboard;

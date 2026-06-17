import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Registrasi() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    prodi: "",
    no_whatsapp: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const dataKirim = {
        name: formData.nama,
        nim: formData.nim,
        prodi: formData.prodi,
        no_whatsapp: formData.no_whatsapp,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:5000/register",
        dataKirim
      );

      alert(response.data.message || "Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat registrasi"
      );
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>SIPK Mahasiswa</h2>

        <div className="nav-menu">
          <Link to="/">
            <button>Beranda</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </nav>

      <section className="login-page">
        <div className="login-container">
          <div className="login-left">
            <h1>Gabung Sekarang 🚀</h1>
            <p>
              Daftarkan akun untuk mengikuti berbagai kegiatan kampus dengan
              sistem yang lebih mudah dan terorganisir.
            </p>
          </div>

          <div className="login-card">
            <h2>Registrasi</h2>
            <p className="login-subtitle">Isi data diri kamu</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>NIM</label>
                <input
                  type="text"
                  name="nim"
                  placeholder="Masukkan NIM"
                  value={formData.nim}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Program Studi</label>
                <input
                  type="text"
                  name="prodi"
                  placeholder="Masukkan program studi"
                  value={formData.prodi}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>No. WhatsApp</label>
                <input
                  type="text"
                  name="no_whatsapp"
                  placeholder="Masukkan nomor WhatsApp"
                  value={formData.no_whatsapp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Daftar Sekarang
              </button>
            </form>

            <p className="register-text">
              Sudah punya akun? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registrasi;
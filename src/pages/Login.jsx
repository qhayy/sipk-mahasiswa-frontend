import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/login",
        formData
      );

      const user = response.data.data;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Langsung masuk tanpa popup

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat login",
        confirmButtonColor: "#ef4444",
      });
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
            <h1>Selamat Datang 👋</h1>
            <p>
              Masuk ke Sistem Informasi Pendaftaran Kegiatan Mahasiswa untuk
              melihat informasi kegiatan dan melakukan pendaftaran secara
              online.
            </p>
          </div>

          <div className="login-card">
            <h2>Masuk ke Akun</h2>
            <p className="login-subtitle">
              Silakan login untuk melanjutkan
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email atau NIM</label>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Masukkan email atau NIM"
                  value={formData.identifier}
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

              <div className="forgot-password">
                <Link to="/forgot-password">
                  Lupa password?
                </Link>
              </div>

              <button type="submit" className="login-btn">
                Login
              </button>
            </form>

            <p className="register-text">
              Belum punya akun? <Link to="/register">Daftar</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
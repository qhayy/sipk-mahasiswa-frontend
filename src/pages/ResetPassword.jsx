import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordBaru !== konfirmasiPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    if (passwordBaru.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/reset-password",
        {
          email: email,
          password_baru: passwordBaru,
        }
      );

      alert(
        response.data.message ||
          "Password berhasil diubah"
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Gagal mengubah password"
      );
    } finally {
      setLoading(false);
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

          {/* KIRI */}
          <div className="login-left">
            <h1>Password Baru 🔑</h1>

            <p>
              Masukkan password baru untuk akun kamu.
            </p>
          </div>

          {/* FORM */}
          <div className="login-card">
            <h2>Reset Password</h2>

            <p className="login-subtitle">
              Email: <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Password Baru</label>

                <input
                  type="password"
                  placeholder="Masukkan password baru"
                  value={passwordBaru}
                  onChange={(e) =>
                    setPasswordBaru(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Konfirmasi Password
                </label>

                <input
                  type="password"
                  placeholder="Ulangi password baru"
                  value={konfirmasiPassword}
                  onChange={(e) =>
                    setKonfirmasiPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading
                  ? "Menyimpan..."
                  : "Simpan Password"}
              </button>
            </form>

            <p className="register-text">
              Kembali ke{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
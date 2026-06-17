import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LupaPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://sipk-mahasiswa-backend-production.up.railway.app/forgot-password",
        {
          email: email,
        }
      );

      navigate("/reset-password", {
        state: {
          email: email,
        },
      });
    } catch (error) {
      console.error("Error:", error);

      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memproses lupa password"
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

          {/* KIRI */}
          <div className="login-left">
            <h1>Lupa Password 🔐</h1>

            <p>
              Masukkan email yang terdaftar untuk
              mengatur ulang password akun kamu.
            </p>
          </div>

          {/* FORM */}
          <div className="login-card">
            <h2>Reset Password</h2>

            <p className="login-subtitle">
              Masukkan email yang sudah terdaftar
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
              >
                Lanjut Reset Password
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

export default LupaPassword;
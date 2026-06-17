import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>SIPK Mahasiswa</h2>

        <div className="nav-menu">
          <a href="#kegiatan">
            <button>Beranda</button>
          </a>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="main-title">
            Sistem Informasi Pendaftaran Kegiatan Mahasiswa
          </h1>

          <h2 className="sub-title">
            Daftar kegiatan kampus jadi lebih mudah
          </h2>

          <p className="hero-text">
            Temukan informasi seminar, workshop, pelatihan, dan kegiatan
            mahasiswa lainnya dalam satu platform yang praktis dan terorganisir.
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary-btn">Mulai Sekarang</button>
            </Link>

            <Link to="/login">
              <button className="secondary-btn">Lihat Kegiatan</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="kegiatan-section" id="kegiatan">
        <p className="section-label">Kegiatan</p>
        <h2>Daftar Kegiatan Mahasiswa</h2>

        <div className="landing-info">
          <div className="info-left">
            <h3>Platform Terpusat untuk Kegiatan Mahasiswa</h3>
            <p>
              Kelola dan ikuti berbagai kegiatan kampus dengan sistem yang lebih
              terorganisir dan mudah digunakan.
            </p>

            <ul>
              <li>✔ Lihat informasi kegiatan dengan mudah</li>
              <li>✔ Daftar kegiatan secara online</li>
              <li>✔ Pantau status pendaftaran</li>
            </ul>
          </div>

          <div className="info-right">
            <div className="feature-box">
              <span>📅</span>
              <h4>Informasi Kegiatan</h4>
              <p>Lihat jadwal dan detail kegiatan kampus secara terpusat.</p>
            </div>

            <div className="feature-box">
              <span>📝</span>
              <h4>Pendaftaran Online</h4>
              <p>Daftar kegiatan mahasiswa dengan lebih mudah dan praktis.</p>
            </div>

            <div className="feature-box">
              <span>✅</span>
              <h4>Status Pendaftaran</h4>
              <p>Pantau proses dan status pendaftaran kegiatan secara jelas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
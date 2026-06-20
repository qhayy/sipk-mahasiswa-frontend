import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://sipk-mahasiswa-backend-production.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const formatResponse = (response) => {
  if (Array.isArray(response.data)) {
    return {
      ...response,
      data: {
        data: response.data,
      },
    };
  }

  return response;
};

export const authService = {
  login: (credentials) => api.post("/login", credentials),

  register: (userData) => api.post("/register", userData),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export const kegiatanService = {
  getAll: async () => {
    const response = await api.get("/admin/kegiatan");
    return formatResponse(response);
  },

  getById: async (id) => {
    return await api.get(`/kegiatan/${id}`);
  },

  // DIPERBAIKI: Ditambahkan /admin agar tidak Error 404 saat Tambah Kegiatan
  create: async (data) => {
    return await api.post("/admin/kegiatan", data);
  },

  // DIPERBAIKI: Ditambahkan /admin agar tidak Error 404 saat Edit/Simpan Kegiatan
  update: async (id, data) => {
    return await api.put(`/admin/kegiatan/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/admin/kegiatan/${id}`);
  },

  verify: async (id, status, alasan_penolakan = "") => {
    return await api.put(
      `/admin/kegiatan/${id}/verifikasi`,
      { status, 
        alasan_penolakan,
      }
    );
  },
  
};

export const pesertaService = {
  getAll: async () => {
    const response = await api.get("/peserta");
    return formatResponse(response);
  },

  create: async (data) => {
    return await api.post("/peserta", data);
  },

  update: async (id, data) => {
    return await api.put(`/peserta/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/peserta/${id}`);
  },

  verify: async (id, status) => {
    return await api.put(
      `/peserta/${id}/verifikasi`,
      { status }
    );
  },
};

export default api;
// axios/book.ts
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import router from "../router";

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

export const bookAxios = axios.create({
  baseURL: `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
});

bookAxios.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    router.push("/auth?message=auth");
    const store = useAuthStore();
    store.logout();
  }
  return Promise.reject(error);
});

// Интерсептор для добавления токена
bookAxios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

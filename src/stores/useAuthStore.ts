// stores/useAuthStore.ts
import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAlertStore } from "./useAlertStore";
import { error } from "../utils/error";
import router from "../router";

const FB_KEY = import.meta.env.VITE_FB_KEY;
const TOKEN_KEY = "jwt-token";
const USER_KEY = "user-data"; // ← Добавим сохранение данных пользователя

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || null);
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || "null")); // ← Сохраняем данные юзера
  const isAuthLoading = ref(false);
  const isAuth = computed(() => !!token.value);

  const alertStore = useAlertStore();

  const setAuthData = (data: {
    idToken: string;
    email: string;
    localId: string;
    displayName?: string;
    photoUrl?: string;
    refreshToken?: string;
  }) => {
    token.value = data.idToken;
    localStorage.setItem(TOKEN_KEY, data.idToken);

    user.value = {
      id: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      displayName: data.displayName,
      photoUrl: data.photoUrl,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  };

  const showErrorAlert = (message?: string) => {
    alertStore.setAlert({
      type: "danger",
      message: error(message) ?? "Что-то пошло не так",
    });
  };

  const showSuccessAlert = (message: string) => {
    alertStore.setAlert({
      type: "primary",
      message,
    });
  };

  const login = async (formData: Record<string, string>) => {
    isAuthLoading.value = true;
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FB_KEY}`;
      const res = await axios.post(url, {
        ...formData,
        returnSecureToken: true,
      });

      setAuthData({
        idToken: res.data.idToken,
        email: res.data.email,
        localId: res.data.localId,
        refreshToken: res.data.refreshToken,
      });

      // Перенаправляем после входа
      router.push("/");
      showSuccessAlert("Добро пожаловать!");
    } catch (e) {
      const err = e as AxiosError<{ error: { message: string } }>;
      showErrorAlert(err.response?.data.error.message);
    } finally {
      isAuthLoading.value = false;
    }
  };

  const signUp = async (formData: Record<string, string>) => {
    isAuthLoading.value = true;
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FB_KEY}`;
      const res = await axios.post(url, {
        ...formData,
        returnSecureToken: true,
      });

      if (res.status === 200) {
        router.push("/auth");
        alertStore.setAlert({
          type: "primary",
          message: "Регистрация прошла успешно! Теперь войдите.",
        });
      }
    } catch (e) {
      const err = e as AxiosError<{ error: { message: string } }>;
      showErrorAlert(err.response?.data.error.message);
    } finally {
      isAuthLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    router.push("/auth");
  };

  return {
    isAuth,
    logout,
    signUp,
    login,
    isAuthLoading,
    token,
    user,
    showErrorAlert,
  };
});

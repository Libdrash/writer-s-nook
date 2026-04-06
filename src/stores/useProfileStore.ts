import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./useAuthStore";
import { bookAxios } from "../axios/book";
import type { ProfileForm } from "../types/profile";
import { useAlertStore } from "./useAlertStore";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<ProfileForm | null>(null);
  const authStore = useAuthStore();
  const { showErrorAlert, setAlert } = useAlertStore();
  const isFetchingProfile = ref(false);
  const isSavingProfile = ref(false);

  const createProfile = async () => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return null;
    }

    isSavingProfile.value = true;

    try {
      const fields: Record<string, any> = {
        fio: { stringValue: "" },
        pseudonym: { stringValue: "" },
        photoUrl: { stringValue: "" },
      };

      const response = await bookAxios.post(
        `/users/${userId}/profile?documentId=userProfile`,
        {
          fields,
        },
      );

      profile.value = {
        fio: "",
        pseudonym: "",
        photoUrl: "",
      };

      return response.data;
    } catch (error: any) {
      showErrorAlert("Не удалось создать профиль");
      return null;
    } finally {
      isSavingProfile.value = false;
    }
  };

  const fetchProfile = async () => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return null;
    }

    isFetchingProfile.value = true;

    try {
      const response = await bookAxios.get(
        `/users/${userId}/profile/userProfile`,
      );

      const doc = response.data;

      profile.value = {
        fio: doc.fields.fio?.stringValue || "",
        pseudonym: doc.fields.pseudonym?.stringValue || "",
        photoUrl: doc.fields.photoUrl?.stringValue || "",
      };

      return profile.value;
    } catch (error: any) {
      if (error.response?.status === 404) {
        profile.value = null;
        return null;
      }
      showErrorAlert("Не удалось загрузить профиль");
      return null;
    } finally {
      isFetchingProfile.value = false;
    }
  };

  const updateProfile = async (data: ProfileForm) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return null;
    }

    isSavingProfile.value = true;

    try {
      const fields: Record<string, any> = {
        fio: { stringValue: data.fio },
      };

      if (data.pseudonym !== undefined) {
        fields.pseudonym = { stringValue: data.pseudonym || "" };
      }

      if (data.photoUrl !== undefined) {
        fields.photoUrl = { stringValue: data.photoUrl || "" };
      }

      const response = await bookAxios.patch(
        `/users/${userId}/profile/userProfile`,
        {
          fields,
        },
      );

      profile.value = data;
      setAlert({
        type: "primary",
        message: "Успешно!",
      });
      return response.data;
    } catch (error: any) {
      showErrorAlert("Не удалось обновить профиль");
      return null;
    } finally {
      isSavingProfile.value = false;
    }
  };

  const saveProfile = async (data: ProfileForm) => {
    if (profile.value) {
      return updateProfile(data);
    } else {
      await createProfile();
      return updateProfile(data);
    }
  };

  const initProfile = async () => {
    await fetchProfile();
    if (!profile.value) {
      await createProfile();
    }
  };

  return {
    profile,
    isFetchingProfile,
    isSavingProfile,
    createProfile,
    fetchProfile,
    updateProfile,
    saveProfile,
    initProfile,
  };
});

import { ref } from "vue";
import { error } from "../utils/error";

type Alert = {
  type: "primary" | "danger";
  message: string;
};

const alert = ref<Alert | null>(null);

export const useAlertStore = () => {
  const closeAlert = () => (alert.value = null);
  const setAlert = (value: Alert) => {
    alert.value = value;

    setTimeout(() => {
      closeAlert();
    }, 7000);
  };

  const showErrorAlert = (message?: string) => {
    setAlert({
      type: "danger",
      message: error(message, true) ?? "Что-то пошло не так",
    });
  };

  return { alert, setAlert, closeAlert, showErrorAlert };
};

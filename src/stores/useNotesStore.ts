import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { useAlertStore } from "./useAlertStore";
import { error } from "../utils/error";
import { useAuthStore } from "./useAuthStore";
import { bookAxios } from "../axios/book";
import type { Note, NoteForm } from "../types/note";

const showModal: Ref<boolean> = ref(false);
export const useNotesStore = defineStore("notes", () => {
  const isEditMode = ref(false);
  const notes = ref<Note[]>([]);
  const selectedNote = ref<Note | null>(null);
  const isAddNoteLoading = ref(false);
  const isEditNoteLoading = ref(false);
  const isRemoveNoteLoading = ref(false);
  const isFetchingNotes = ref(false);
  const isFetchingNote = ref(false);

  const alertStore = useAlertStore();
  const authStore = useAuthStore();

  const showErrorAlert = (message?: string) => {
    alertStore.setAlert({
      type: "danger",
      message: error(message) ?? "Что-то пошло не так",
    });
  };

  const handleSelectNote = (note: Note) => {
    selectedNote.value = note;
  };

  const handleResetNote = () => {
    selectedNote.value = null;
  };

  const handleCloseModal = () => {
    showModal.value = false;
    handleResetNote();
  };

  const loadById = async (id?: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;
    isFetchingNote.value = true;

    if (!id) {
      showErrorAlert("Не найден id заметки, которую нужно загрузить");
      return;
    }

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    try {
      const response = await bookAxios.get(`/users/${userId}/notes/${id}`);
      // wait bookAxios.post(`/users/${userId}/notes`, noteData)
      // return response.data;
      const noteData = response.data;

      const name = noteData.name.split("/").pop();
      return {
        id: name,
        title: noteData.fields.title?.stringValue || "",
        content: noteData.fields.content?.stringValue || "",
        createdAt:
          noteData.fields.createdAt?.timestampValue || new Date().toISOString(),
      };
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось загрузить заметку",
      );
      throw error;
    } finally {
      isFetchingNote.value = false;
    }
  };

  // Добавить новую заметку
  const addNote = async (formData: NoteForm) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isAddNoteLoading.value = true;

    try {
      const noteData: Record<string, any> = {
        fields: {
          title: { stringValue: formData.title },
          content: { stringValue: formData.content },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      };

      const response = await bookAxios.post(`/users/${userId}/notes`, noteData);

      alertStore.setAlert({
        type: "primary",
        message: "Заметка успешно добавлена!",
      });

      await fetchNotes();
      handleCloseModal();

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось добавить заметку",
      );
      throw error;
    } finally {
      isAddNoteLoading.value = false;
    }
  };

  // Обновить заметку
  const updateNote = async (id: string, formData: NoteForm) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isEditNoteLoading.value = true;

    try {
      const noteData: Record<string, any> = {
        fields: {},
      };

      if (formData.title !== undefined) {
        noteData.fields.title = { stringValue: formData.title };
      }
      if (formData.content !== undefined) {
        noteData.fields.content = { stringValue: formData.content };
      }

      const response = await bookAxios.patch(
        `/users/${userId}/notes/${id}`,
        noteData,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Заметка успешно обновлена!",
      });

      await fetchNotes();

      handleCloseModal();

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось обновить заметку",
      );
      throw error;
    } finally {
      isEditNoteLoading.value = false;
      selectedNote.value = null;
    }
  };

  // Удалить заметку
  const removeNote = async (noteId: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isRemoveNoteLoading.value = true;

    try {
      const response = await bookAxios.delete(
        `/users/${userId}/notes/${noteId}`,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Заметка успешно удалена!",
      });

      notes.value = notes.value.filter((note) => note.id !== noteId);

      if (selectedNote.value?.id === noteId) {
        handleResetNote();
      }

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось удалить заметку",
      );
      throw error;
    } finally {
      isRemoveNoteLoading.value = false;
    }
  };

  // Получить список заметок
  const fetchNotes = async () => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return [];
    }

    isFetchingNotes.value = true;

    try {
      const response = await bookAxios.get(`/users/${userId}/notes`);

      notes.value = (response.data.documents || []).map((doc: any) => {
        const name = doc.name.split("/").pop();

        return {
          id: name,
          title: doc.fields.title?.stringValue || "",
          content: doc.fields.content?.stringValue || "",
          createdAt:
            doc.fields.createdAt?.timestampValue || new Date().toISOString(),
        };
      });

      return notes.value;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось загрузить список заметок",
      );
      return [];
    } finally {
      isFetchingNotes.value = false;
    }
  };

  return {
    addNote,
    updateNote,
    fetchNotes,
    removeNote,
    handleSelectNote,
    handleResetNote,
    handleCloseModal,
    loadById,
    isFetchingNote,
    isEditMode,
    showModal,
    selectedNote,
    notes,
    isFetchingNotes,
    isAddNoteLoading,
    isEditNoteLoading,
    isRemoveNoteLoading,
  };
});

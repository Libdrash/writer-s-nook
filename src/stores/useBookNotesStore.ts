// stores/useBookNotesStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAlertStore } from "./useAlertStore";
import { useAuthStore } from "./useAuthStore";
import { useBooksStore } from "./useBooksStore";
import { bookAxios } from "../axios/book";
import type { BookNote, BookNoteForm } from "../types/bookNote";

export const useBookNotesStore = defineStore("bookNotes", () => {
  const alertStore = useAlertStore();
  const authStore = useAuthStore();
  const booksStore = useBooksStore();

  // Состояние
  const bookNotes = ref<BookNote[]>([]);
  const selectedBookNote = ref<BookNote | null>(null);

  // Состояния загрузки
  const isAddLoading = ref(false);
  const isEditLoading = ref(false);
  const isRemoveLoading = ref(false);
  const isFetchingLoading = ref(false);

  // UI состояния
  const showModal = ref(false);
  const isEditMode = ref(false);

  // 🔥 Computed: Заметки по конкретной книге
  const getNotesByBookId = computed(() => (bookId: string) => {
    return bookNotes.value.filter((note) => note.bookId === bookId);
  });

  // 🔥 Computed: Заметки с данными о книге для отображения
  const bookNotesWithBookInfo = computed(() => {
    return bookNotes.value.map((note) => ({
      ...note,
      bookTitle:
        booksStore.books.find((b) => b.id === note.bookId)?.title ||
        "Неизвестная книга",
    }));
  });

  const showErrorAlert = (message?: string) => {
    alertStore.setAlert({
      type: "danger",
      message: message ?? "Что-то пошло не так",
    });
  };

  const showSuccessAlert = (message: string) => {
    alertStore.setAlert({
      type: "primary",
      message,
    });
  };

  // ========== ОСНОВНЫЕ МЕТОДЫ ==========

  // Получить все заметки ко всем книгам
  const fetchAllBookNotes = async () => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return [];
    }

    isFetchingLoading.value = true;

    try {
      // Получаем все книги пользователя
      const booksResponse = await bookAxios.get(`/users/${userId}/books`);
      const books = booksResponse.data.documents || [];

      // Параллельно получаем заметки для каждой книги
      const notesPromises = books.map(async (book: any) => {
        const bookId = book.name.split("/").pop();
        const bookTitle = book.fields.title?.stringValue || "";

        try {
          const notesResponse = await bookAxios.get(
            `/users/${userId}/books/${bookId}/notes`,
          );

          const notes = (notesResponse.data.documents || []).map((doc: any) => {
            const noteId = doc.name.split("/").pop();
            return {
              id: noteId,
              bookId: bookId,
              bookTitle: bookTitle,
              title: doc.fields.title?.stringValue || "",
              content: doc.fields.content?.stringValue || "",
              createdAt:
                doc.fields.createdAt?.timestampValue ||
                new Date().toISOString(),
              updatedAt: doc.fields.updatedAt?.timestampValue,
            };
          });

          return notes;
        } catch (e) {
          console.error(`Error fetching notes for book ${bookId}:`, e);
          return [];
        }
      });

      const allNotesArrays = await Promise.all(notesPromises);
      bookNotes.value = allNotesArrays.flat();

      return bookNotes.value;
    } catch (error: any) {
      console.error("Error fetching book notes:", error);
      showErrorAlert("Не удалось загрузить заметки к книгам");
      return [];
    } finally {
      isFetchingLoading.value = false;
    }
  };

  // Получить заметки для конкретной книги
  const fetchNotesByBookId = async (bookId: string) => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return [];
    }

    isFetchingLoading.value = true;

    try {
      const response = await bookAxios.get(
        `/users/${userId}/books/${bookId}/notes`,
      );

      const bookTitle =
        booksStore.books.find((b) => b.id === bookId)?.title || "";

      const notes = (response.data.documents || []).map((doc: any) => {
        const noteId = doc.name.split("/").pop();
        return {
          id: noteId,
          bookId: bookId,
          bookTitle: bookTitle,
          title: doc.fields.title?.stringValue || "",
          content: doc.fields.content?.stringValue || "",
          createdAt:
            doc.fields.createdAt?.timestampValue || new Date().toISOString(),
          updatedAt: doc.fields.updatedAt?.timestampValue,
        };
      });

      // Обновляем в сторе
      bookNotes.value = [
        ...bookNotes.value.filter((n) => n.bookId !== bookId),
        ...notes,
      ];

      return notes;
    } catch (error: any) {
      showErrorAlert("Не удалось загрузить заметки для книги");
      return [];
    } finally {
      isFetchingLoading.value = false;
    }
  };

  // Добавить заметку к книге
  const addBookNote = async (
    bookId: string,
    formData: Omit<BookNoteForm, "bookId">,
  ) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isAddLoading.value = true;

    try {
      const noteData = {
        fields: {
          title: { stringValue: formData.title },
          content: { stringValue: formData.content },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      };

      const response = await bookAxios.post(
        `/users/${userId}/books/${bookId}/notes`,
        noteData,
      );

      const bookTitle =
        booksStore.books.find((b) => b.id === bookId)?.title || "";

      const newNote: BookNote = {
        id: response.data.name.split("/").pop(),
        bookId: bookId,
        bookTitle: bookTitle,
        title: formData.title,
        content: formData.content,
        createdAt: new Date().toISOString(),
      };

      bookNotes.value.push(newNote);

      showSuccessAlert("Заметка к книге добавлена!");
      handleCloseModal();

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось добавить заметку",
      );
      throw error;
    } finally {
      isAddLoading.value = false;
    }
  };

  // Обновить заметку
  const updateBookNote = async (
    bookId: string,
    noteId: string,
    formData: Omit<BookNoteForm, "bookId">,
  ) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isEditLoading.value = true;

    try {
      const noteData = {
        fields: {
          title: { stringValue: formData.title },
          content: { stringValue: formData.content },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      };

      await bookAxios.patch(
        `/users/${userId}/books/${bookId}/notes/${noteId}`,
        noteData,
      );

      // Обновляем в сторе
      fetchAllBookNotes();

      showSuccessAlert("Заметка обновлена!");
      handleCloseModal();
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось обновить заметку",
      );
      throw error;
    } finally {
      isEditLoading.value = false;
    }
  };

  // Удалить заметку
  const removeBookNote = async (bookId: string, noteId: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isRemoveLoading.value = true;

    try {
      await bookAxios.delete(
        `/users/${userId}/books/${bookId}/notes/${noteId}`,
      );

      // Удаляем из стора
      bookNotes.value = bookNotes.value.filter((n) => n.id !== noteId);

      if (selectedBookNote.value?.id === noteId) {
        handleResetNote();
      }

      showSuccessAlert("Заметка удалена!");
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось удалить заметку",
      );
      throw error;
    } finally {
      isRemoveLoading.value = false;
    }
  };

  // Получить одну заметку
  const fetchBookNoteById = async (bookId: string, noteId: string) => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return null;
    }

    isFetchingLoading.value = true;

    try {
      const response = await bookAxios.get(
        `/users/${userId}/books/${bookId}/notes/${noteId}`,
      );

      const data = response.data;
      const bookTitle =
        booksStore.books.find((b) => b.id === bookId)?.title || "";

      const note: BookNote = {
        id: noteId,
        bookId: bookId,
        bookTitle: bookTitle,
        title: data.fields.title?.stringValue || "",
        content: data.fields.content?.stringValue || "",
        createdAt:
          data.fields.createdAt?.timestampValue || new Date().toISOString(),
        updatedAt: data.fields.updatedAt?.timestampValue,
      };

      return note;
    } catch (error: any) {
      showErrorAlert("Не удалось загрузить заметку");
      return null;
    } finally {
      isFetchingLoading.value = false;
    }
  };

  // ========== UI МЕТОДЫ ==========

  const handleSelectNote = (note: BookNote) => {
    selectedBookNote.value = note;
    isEditMode.value = true;
    showModal.value = true;
  };

  const handleResetNote = () => {
    selectedBookNote.value = null;
    isEditMode.value = false;
  };

  const handleOpenModal = () => {
    showModal.value = true;
    isEditMode.value = false;
    selectedBookNote.value = null;
  };

  const handleCloseModal = () => {
    showModal.value = false;
    handleResetNote();
  };

  return {
    // Данные
    bookNotes,
    selectedBookNote,
    getNotesByBookId,
    bookNotesWithBookInfo,

    // Состояния
    isAddLoading,
    isEditLoading,
    isRemoveLoading,
    isFetchingLoading,
    showModal,
    isEditMode,

    // Методы
    fetchAllBookNotes,
    fetchNotesByBookId,
    fetchBookNoteById,
    addBookNote,
    updateBookNote,
    removeBookNote,

    // UI методы
    handleSelectNote,
    handleResetNote,
    handleOpenModal,
    handleCloseModal,
  };
});

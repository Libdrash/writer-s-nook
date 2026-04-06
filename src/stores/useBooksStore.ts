import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { useAlertStore } from "./useAlertStore";
import { error } from "../utils/error";
import { useAuthStore } from "./useAuthStore";
import { bookAxios } from "../axios/book";
import type { Book, BookForm } from "../types/book";

const showModal: Ref<boolean> = ref(false);
export const useBooksStore = defineStore("books", () => {
  const isEditMode = ref(false);
  const books = ref<Book[]>([]);
  const selectedBook = ref<Book | null>(null);
  const isAddBookLoading = ref(false);
  const isEditBookLoading = ref(false);
  const isRemoveBookLoading = ref(false);
  const isFetchingBooks = ref(false);

  const alertStore = useAlertStore();
  const authStore = useAuthStore();

  const showErrorAlert = (message?: string) => {
    alertStore.setAlert({
      type: "danger",
      message: error(message) ?? "Что-то пошло не так",
    });
  };

  const handleSelectBook = (book: Book) => {
    selectedBook.value = book;
  };

  const handleResetBook = () => {
    selectedBook.value = null;
  };

  const handleCloseModal = () => {
    showModal.value = false;
    handleResetBook();
  };

  // Добавить новую книгу
  const addBook = async (formData: BookForm) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isAddBookLoading.value = true;

    try {
      const bookData: Record<string, any> = {
        fields: {
          title: { stringValue: formData.title },
          author: { stringValue: formData.author },
          status: { stringValue: formData.status },
          createdAt: { timestampValue: new Date().toISOString() },
        },
      };

      // Убеждаемся, что год отправляется как число (не строка)
      if (formData.year !== undefined && formData.year !== null) {
        const yearNum =
          typeof formData.year === "string"
            ? parseInt(formData.year, 10)
            : formData.year;

        if (!isNaN(yearNum)) {
          bookData.fields.year = { integerValue: yearNum };
        }
      }

      if (formData.genre) {
        bookData.fields.genre = { stringValue: formData.genre };
      }

      if (formData.rating !== undefined && formData.rating !== null) {
        const ratingNum =
          typeof formData.rating === "string"
            ? parseInt(formData.rating, 10)
            : formData.rating;

        if (!isNaN(ratingNum)) {
          bookData.fields.rating = { integerValue: ratingNum };
        }
      }

      if (formData.coverUrl) {
        bookData.fields.coverUrl = { stringValue: formData.coverUrl };
      }

      const response = await bookAxios.post(`/users/${userId}/books`, bookData);

      alertStore.setAlert({
        type: "primary",
        message: "Книга успешно добавлена!",
      });

      await fetchBooks();
      handleCloseModal();

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось добавить книгу",
      );
      throw error;
    } finally {
      isAddBookLoading.value = false;
    }
  };

  // Обновить книгу
  const updateBook = async (id: string, formData: BookForm) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isEditBookLoading.value = true;

    try {
      const bookData: Record<string, any> = {
        fields: {},
      };

      if (formData.title !== undefined) {
        bookData.fields.title = { stringValue: formData.title };
      }
      if (formData.author !== undefined) {
        bookData.fields.author = { stringValue: formData.author };
      }
      if (formData.status !== undefined) {
        bookData.fields.status = { stringValue: formData.status };
      }

      if (formData.year !== undefined && formData.year !== null) {
        const yearNum =
          typeof formData.year === "string"
            ? parseInt(formData.year, 10)
            : formData.year;

        if (!isNaN(yearNum)) {
          bookData.fields.year = { integerValue: yearNum };
        }
      } else if (formData.year === null) {
        // Если год явно удален, можно отправить null (если API поддерживает)
        bookData.fields.year = { nullValue: null };
      }

      if (formData.genre !== undefined && formData.genre !== null) {
        bookData.fields.genre = { stringValue: formData.genre };
      }

      if (formData.rating !== undefined && formData.rating !== null) {
        const ratingNum =
          typeof formData.rating === "string"
            ? parseInt(formData.rating, 10)
            : formData.rating;

        if (!isNaN(ratingNum)) {
          bookData.fields.rating = { integerValue: ratingNum };
        }
      } else if (formData.rating === null) {
        bookData.fields.rating = { nullValue: null };
      }

      if (formData.coverUrl !== undefined && formData.coverUrl !== null) {
        bookData.fields.coverUrl = { stringValue: formData.coverUrl };
      }

      const response = await bookAxios.patch(
        `/users/${userId}/books/${id}`,
        bookData,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Книга успешно обновлена!",
      });

      await fetchBooks();

      handleCloseModal();

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось обновить книгу",
      );
      throw error;
    } finally {
      isEditBookLoading.value = false;
      selectedBook.value = null;
    }
  };

  // Удалить книгу
  const removeBook = async (bookId: string) => {
    const userId = authStore.user?.id;
    const token = authStore.token;

    if (!userId || !token) {
      showErrorAlert("Вы не авторизованы");
      return;
    }

    isRemoveBookLoading.value = true;

    try {
      const response = await bookAxios.delete(
        `/users/${userId}/books/${bookId}`,
      );

      alertStore.setAlert({
        type: "primary",
        message: "Книга успешно удалена!",
      });

      books.value = books.value.filter((book) => book.id !== bookId);

      if (selectedBook.value?.id === bookId) {
        handleResetBook();
      }

      return response.data;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message || "Не удалось удалить книгу",
      );
      throw error;
    } finally {
      isRemoveBookLoading.value = false;
    }
  };

  // Получить список книг
  const fetchBooks = async () => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return [];
    }

    isFetchingBooks.value = true;

    try {
      const response = await bookAxios.get(`/users/${userId}/books`);

      books.value = (response.data.documents || []).map((doc: any) => {
        const name = doc.name.split("/").pop();

        // 🔑 Преобразуем integerValue из строки в число
        let year = null;
        if (doc.fields.year?.integerValue !== undefined) {
          const yearValue = doc.fields.year.integerValue;
          year =
            typeof yearValue === "string" ? parseInt(yearValue, 10) : yearValue;
        }

        let rating = null;
        if (doc.fields.rating?.integerValue !== undefined) {
          const ratingValue = doc.fields.rating.integerValue;
          rating =
            typeof ratingValue === "string"
              ? parseInt(ratingValue, 10)
              : ratingValue;
        }

        return {
          id: name,
          title: doc.fields.title?.stringValue || "",
          author: doc.fields.author?.stringValue || "",
          year: year,
          rating: rating,
          genre: doc.fields.genre?.stringValue || "",
          coverUrl: doc.fields.coverUrl?.stringValue || null,
          status: doc.fields.status?.stringValue || "Хочу прочитать",
          createdAt:
            doc.fields.createdAt?.timestampValue || new Date().toISOString(),
        };
      });

      return books.value;
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось загрузить список книг",
      );
      return [];
    } finally {
      isFetchingBooks.value = false;
    }
  };

  const fetchBookOptions = async (): Promise<
    Array<{ title: string; value: string }>
  > => {
    const userId = authStore.user?.id;

    if (!userId) {
      showErrorAlert("Вы не авторизованы");
      return [];
    }

    isFetchingBooks.value = true;

    try {
      const response = await bookAxios.get(`/users/${userId}/books`);

      books.value = (response.data.documents || []).map((doc: any) => {
        const name = doc.name.split("/").pop();

        let year = null;
        if (doc.fields.year?.integerValue !== undefined) {
          const yearValue = doc.fields.year.integerValue;
          year =
            typeof yearValue === "string" ? parseInt(yearValue, 10) : yearValue;
        }

        let rating = null;
        if (doc.fields.rating?.integerValue !== undefined) {
          const ratingValue = doc.fields.rating.integerValue;
          rating =
            typeof ratingValue === "string"
              ? parseInt(ratingValue, 10)
              : ratingValue;
        }

        return {
          id: name,
          title: doc.fields.title?.stringValue || "",
          author: doc.fields.author?.stringValue || "",
          year: year,
          rating: rating,
          genre: doc.fields.genre?.stringValue || "",
          coverUrl: doc.fields.coverUrl?.stringValue || null,
          status: doc.fields.status?.stringValue || "Хочу прочитать",
          createdAt:
            doc.fields.createdAt?.timestampValue || new Date().toISOString(),
        };
      });

      // Возвращаем опции
      return books.value.map((book) => ({
        title: book.title,
        value: book.id,
      }));
    } catch (error: any) {
      showErrorAlert(
        error.response?.data?.error?.message ||
          "Не удалось загрузить список книг",
      );
      return [];
    } finally {
      isFetchingBooks.value = false;
    }
  };

  return {
    addBook,
    updateBook,
    fetchBooks,
    removeBook,
    handleSelectBook,
    handleResetBook,
    handleCloseModal,
    isEditMode,
    showModal,
    selectedBook,
    books,
    isFetchingBooks,
    isAddBookLoading,
    isEditBookLoading,
    isRemoveBookLoading,
    fetchBookOptions,
  };
});

<template>
  <AppConfirm
    @cancel="handleCancel"
    @confirm="handleDelete"
    :loading="isRemoveNoteLoading || isRemoveBookNoteLoading"
    :modelValue="!!confirmData"
    :confirmData="confirmData"
    :title="`Вы действительно хотите удалить эту заметку?`"
    message="Это действие нельзя отменить. Заметка будет удалена навсегда."
  />
  <NoteViewModal
    :note="currentNote"
    :modelValue="isModalVisible"
    @close="handleResetCurrentNote"
  />
  <div
    v-if="$route.name === 'Notes'"
    class="with-nav page-container flex flex-col gap-24"
  >
    <div class="flex justify-between">
      <h2 class="title-note">Мои заметки</h2>
      <router-link
        v-if="
          (selected === 'list' && notes.length) ||
          (selected === 'books' && booksWithNotes.length)
        "
        :to="selected === 'list' ? '/notes/create' : '/notes/create-book-note'"
      >
        {{
          selected === "list" ? "Создать заметку" : "Добавить заметку к книге"
        }}
      </router-link>
    </div>

    <v-btn-toggle
      v-model="selected"
      mandatory
      rounded="xl"
      color="primary"
      bg-color="grey-lighten-2"
      group
      class="custom-toggle"
    >
      <v-btn value="list">
        <div class="flex gap-4">
          <v-icon>mdi-file-document-outline</v-icon>
          Служебные
        </div>
      </v-btn>
      <v-btn value="books">
        <div class="flex gap-4">
          <v-icon>mdi-book-open-blank-variant-outline</v-icon>
          По книгам
        </div>
      </v-btn>
    </v-btn-toggle>

    <AppLoader v-if="isLoading" />

    <!-- Служебные заметки -->
    <template v-else-if="selected === 'list'">
      <div v-if="notes?.length" class="flex flex-col gap-12">
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @click="handleChooseCurrentNote(note)"
          @remove="handleShowRemoveConfirm"
          class="card"
        />
      </div>
      <div v-else class="flex-center flex-col">
        <h3 class="nothing">Ничего не найдено</h3>
        <router-link to="/notes/create" class="button">
          Создать первую заметку
        </router-link>
      </div>
    </template>

    <!-- Книги с заметками -->
    <template v-else-if="selected === 'books'">
      <div v-if="booksWithNotes?.length" class="flex flex-col gap-24">
        <v-expansion-panels
          class="books-accordion separated"
          v-model="openedBooks"
          multiple
        >
          <BookWithNotesCard
            @delete-note="handleShowRemoveConfirmFromBookNotes"
            @showNote="handleChooseCurrentNote"
            :book="book"
            v-for="book in booksWithNotes"
          />
        </v-expansion-panels>
      </div>
      <div v-else class="flex-center flex-col">
        <h3 class="nothing">Нет книг с заметками</h3>
        <router-link to="/books" class="button"> Добавить книгу </router-link>
      </div>
    </template>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useNotesStore } from "../stores/useNotesStore";
import { useBooksStore } from "../stores/useBooksStore";
import { useBookNotesStore } from "../stores/useBookNotesStore";
import AppLoader from "../components/ui/AppLoader.vue";
import NoteCard from "../components/notes/NoteCard.vue";
import AppConfirm from "../components/ui/AppConfirm.vue";
import NoteViewModal from "../components/notes/NoteViewModal.vue";
import type { Note } from "../types/note";
import type { Book } from "../types/book";
import type { BookNote } from "../types/bookNote";
import BookWithNotesCard from "../components/book/BookWithNotesCard.vue";

export default defineComponent({
  name: "Notes",
  components: {
    AppLoader,
    NoteCard,
    AppConfirm,
    NoteViewModal,
    BookWithNotesCard,
  },
  setup() {
    // Сторы
    const notesStore = useNotesStore();
    const booksStore = useBooksStore();
    const bookNotesStore = useBookNotesStore();
    const openedBooks = ref<string[]>([]);

    // Состояния из сторов
    const { notes, isFetchingNotes, isRemoveNoteLoading } =
      storeToRefs(notesStore);
    const { books, isFetchingBooks } = storeToRefs(booksStore);
    const {
      bookNotes,
      isFetchingLoading: isFetchingBookNotes,
      isRemoveLoading: isRemoveBookNoteLoading,
    } = storeToRefs(bookNotesStore);

    // Локальное состояние
    const currentNote = ref<Note | null>(null);
    const confirmData = ref<string | null>(null);
    const confirmBookId = ref<string | null>(null);
    const isModalVisible = ref(false);
    const selected = ref<"list" | "books">("list");
    const isBookNoteModalVisible = ref(false);
    const selectedBookForNote = ref<Book | null>(null);
    const selectedBookNote = ref<BookNote | null>(null);

    // СВЯЗКА КНИГ С ЗАМЕТКАМИ
    const booksWithNotes = computed(() => {
      return books.value.map((book) => ({
        ...book,
        notes: bookNotes.value.filter((note) => note.bookId === book.id),
        notesCount: bookNotes.value.filter((note) => note.bookId === book.id)
          .length,
      }));
    });

    const isLoading = computed(() => {
      if (selected.value === "list") {
        return isFetchingNotes.value;
      }
      return isFetchingBooks.value || isFetchingBookNotes.value;
    });

    const handleDelete = async (id: string) => {
      if (selected.value === "list") {
        await notesStore.removeNote(id);
        confirmData.value = null;
        return;
      } else {
        handleDeleteBookNote();
      }
    };

    const handleCancel = () => {
      confirmData.value = null;
    };

    const handleShowRemoveConfirm = (id: string) => {
      confirmData.value = id;
    };

    const handleShowRemoveConfirmFromBookNotes = (
      noteId: string,
      bookId: string,
    ) => {
      confirmData.value = noteId;
      confirmBookId.value = bookId;
    };

    const handleChooseCurrentNote = (note: Note) => {
      isModalVisible.value = true;
      currentNote.value = note;
    };

    const handleResetCurrentNote = () => {
      isModalVisible.value = false;
      currentNote.value = null;
    };

    // ========== Методы для заметок к книгам (временные) ==========
    const handleAddNoteToBook = (book: Book) => {
      selectedBookForNote.value = book;
      selectedBookNote.value = null;
      isBookNoteModalVisible.value = true;
      // TODO: открыть модалку для создания заметки к книге
      alert(`Добавить заметку к книге "${book.title}"`);
    };

    const handleEditBookNote = (note: BookNote) => {
      const book = books.value.find((b) => b.id === note.bookId);
      if (book) {
        selectedBookForNote.value = book;
        selectedBookNote.value = note;
        isBookNoteModalVisible.value = true;
        // TODO: открыть модалку для редактирования заметки
        alert(`Редактировать заметку "${note.title}"`);
      }
    };

    const handleDeleteBookNote = async () => {
      if (confirmBookId.value && confirmData.value) {
        await bookNotesStore.removeBookNote(
          confirmBookId.value,
          confirmData.value,
        );
      }

      confirmData.value = null;
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    // ========== Следим за переключением вкладок ==========
    watch(selected, async (newVal) => {
      if (newVal === "list") {
        await notesStore.fetchNotes();
      } else if (newVal === "books") {
        await Promise.all([
          booksStore.fetchBooks(),
          bookNotesStore.fetchAllBookNotes(),
        ]);
      }
    });

    onMounted(async () => {
      await notesStore.fetchNotes();
    });

    return {
      // Состояния
      selected,
      notes,
      booksWithNotes,
      isLoading,
      isFetchingNotes,
      isRemoveNoteLoading,
      currentNote,
      isModalVisible,
      confirmData,
      openedBooks,
      isRemoveBookNoteLoading,

      // Методы
      handleDelete,
      handleCancel,
      handleShowRemoveConfirm,
      handleChooseCurrentNote,
      handleResetCurrentNote,

      // Методы для книжных заметок
      handleAddNoteToBook,
      handleEditBookNote,
      handleDeleteBookNote,
      formatDate,
      handleShowRemoveConfirmFromBookNotes,
    };
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
  font-size: 1.5rem;
  color: var(--primary);
}
a:active {
  scale: 1.05;
}

.nothing {
  font-size: 2rem;
  margin-bottom: 16px;
  font-weight: normal;
}

.title-note {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.card:hover {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.card {
  cursor: pointer;
}

/* ========== Стили для книжных заметок (временные) ========== */
.book-notes-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.book-notes-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.book-author {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.add-note-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-note-btn:hover {
  background: #e5e7eb;
  transform: scale(0.98);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 12px;
  transition: background 0.2s ease;
}

.note-item:hover {
  background: #f3f4f6;
}

.note-content {
  flex: 1;
  cursor: pointer;
}

.note-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.note-text {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.note-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.delete-note-btn {
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-note-btn:hover {
  background: #fee2e2;
  transform: scale(0.95);
}

.empty-notes {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
}

/* Адаптивность */
@media (max-width: 640px) {
  .book-header {
    flex-direction: column;
    gap: 12px;
  }

  .add-note-btn {
    align-self: flex-start;
  }

  .note-item {
    flex-direction: column;
  }

  .delete-note-btn {
    align-self: flex-end;
  }
}

.books-accordion.separated :deep(.v-expansion-panel) {
  margin-bottom: 16px;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

/* Отключаем анимацию раскрытия */
.books-accordion.separated :deep(.v-expansion-panel-transition) {
  transition: none !important;
}

/* Или делаем более плавную анимацию */
.books-accordion.separated :deep(.v-expansion-panel-transition) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  transform: translateZ(0);
  will-change: transform;
}
</style>

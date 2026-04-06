<template>
  <div
    class="flex gap-4"
    v-if="
      (isBookNote || isBookNoteById || isEditBookNoteById) &&
      !bookOptions.length &&
      !isLoadingBooks
    "
  >
    <h4>Книги не найдены, попробуйте</h4>
    <router-link to="/books"><h4>создать книгу</h4></router-link>
  </div>

  <app-loader
    v-else-if="
      (isBookNote || isBookNoteById || isEditBookNoteById) && isLoadingBooks
    "
  />
  <form v-else @submit.prevent="onSubmit" class="mt-8 flex flex-col gap-16">
    <div class="mt-8" v-if="isBookNote || isBookNoteById || isEditBookNoteById">
      <v-autocomplete
        :disabled="isBookNoteById || isEditBookNoteById"
        v-model="selectedBookId"
        :items="bookOptions"
        :loading="isLoadingBooks"
        no-data-text="Ничего не найдено"
        item-title="title"
        item-value="value"
        :rounded="true"
        :filter="customFilter"
        label="Выберите книгу"
        placeholder="Начните вводить название"
        variant="outlined"
        density="comfortable"
        :rules="[(v) => !!v || 'Выберите книгу']"
        required
      />
    </div>

    <v-text-field
      v-model="title"
      :error-messages="titleError"
      @blur="titleBlur"
      label="Название*"
      variant="outlined"
      :rounded="true"
      color="primary"
      baseColor="secondary"
      required
    ></v-text-field>
    <v-textarea
      color="primary"
      label="Начните писать заметку..."
      baseColor="secondary"
      variant="outlined"
      :rounded="true"
      v-model="content"
      :error-messages="contentError"
      @blur="contentBlur"
      auto-grow
      persistent-hint
    ></v-textarea>
    <div class="footer">
      <router-link to="/notes" class="button radius-16 btn secondary"
        >Отменить</router-link
      >

      <v-btn
        color="primary"
        class="button btn primary radius-16"
        variant="flat"
        @click="onSubmit"
        :loading="isLoading"
      >
        Сохранить
      </v-btn>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  type PropType,
  type Ref,
} from "vue";
import { useNotesStore } from "../../stores/useNotesStore";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNoteForm } from "../../composables/useNoteForm";
import type { NoteForm } from "../../types/note";
import { ref } from "vue";
import { useBooksStore } from "../../stores/useBooksStore";
import AppLoader from "../ui/AppLoader.vue";
import { useBookNotesStore } from "../../stores/useBookNotesStore";

export default defineComponent({
  name: "NoteForm",
  components: { AppLoader },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    note: {
      type: Object as PropType<Ref<NoteForm | null> | NoteForm>,
      default: null,
    },
  },
  setup(props) {
    const { isEdit, note } = props;
    const notesStore = useNotesStore();
    const router = useRouter();
    const { isAddNoteLoading, isEditNoteLoading } = storeToRefs(notesStore);
    const route = useRoute();
    const noteId = route.params.id;
    const bookToNoteId = route.params.id as string | undefined;
    const bookToEditId = route.params.bookId as string | undefined;

    const booksStore = useBooksStore();
    const isBookNote = route.name === "CreateBookNote";
    const isBookNoteById = route.name === "CreateBookNoteById";
    const isEditBookNoteById = route.name === "EditBookNoteById";
    const bookOptions = ref<Array<{ title: string; value: string }>>([]);
    const isLoadingBooks = ref(false);
    const bookNotesStore = useBookNotesStore();

    const customFilter = (item: any, queryText: string) => {
      const searchTerm = queryText.toLowerCase();
      const title = item.raw.title?.toLowerCase() || "";
      return title.includes(searchTerm);
    };

    const selectedBookId = ref<string | null>(
      (isEditBookNoteById ? bookToEditId : bookToNoteId) ?? null,
    );
    const loadBookOptions = async () => {
      isLoadingBooks.value = true;
      try {
        bookOptions.value = await booksStore.fetchBookOptions();
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        isLoadingBooks.value = false;
      }
    };
    const submit = async (noteData: NoteForm) => {
      if (isEditBookNoteById) {
        if (!bookToEditId || !noteId) {
          alert("Не найдено id книги или заметки");
          return;
        }

        await bookNotesStore.updateBookNote(bookToEditId, noteId as string, {
          title: noteData.title,
          content: noteData.content || "",
        });
      } else if (isBookNoteById) {
        if (!bookToNoteId) {
          alert("Не найдено id книги");
          return;
        }

        await bookNotesStore.addBookNote(bookToNoteId, {
          title: noteData.title,
          content: noteData.content || "",
        });
      } else if (isBookNote) {
        if (!selectedBookId.value) {
          alert("Выберите книгу");
          return;
        }

        await bookNotesStore.addBookNote(selectedBookId.value, {
          title: noteData.title,
          content: noteData.content || "",
        });
      } else if (isEdit && noteId) {
        await notesStore.updateNote(noteId as string, noteData);
      } else {
        await notesStore.addNote(noteData);
      }

      router.push("/notes");
    };
    const form = useNoteForm(submit, isEdit ? note : undefined);

    const loading = computed(() => {
      return isEdit ? isEditNoteLoading.value : isAddNoteLoading.value;
    });

    onMounted(async () => {
      if (isBookNote || isBookNoteById || isEditBookNoteById) {
        await loadBookOptions();
      }
    });

    return {
      isLoading: loading,
      isLoadingBooks,
      isBookNote,
      selectedBookId,
      bookOptions,
      customFilter,
      isBookNoteById,
      isEditBookNoteById,
      ...form,
    };
  },
});
</script>

<style scoped>
h4 {
  letter-spacing: -0.5px;
  color: #2c3e4f;
  margin: 0;
  margin-top: 8px;
}
a h4 {
  color: var(--primary) !important;
}
a {
  text-decoration: none;
}
a h4:hover {
  color: var(--secondary-light) !important;
}
</style>

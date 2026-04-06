<template>
  <div class="with-nav page-container">
    <div class="breadcrumbs">
      <router-link to="/notes" class="flex gap-8 items-center">
        <v-icon color="secondary" icon="mdi-chevron-left" />
        <p>Вернуться к списку заметок</p>
      </router-link>
    </div>
    <div v-if="isFetchingLoading">
      <AppLoader />
    </div>
    <div v-else>
      <div v-if="!note">Заметка с id {{ noteId }} не найдена</div>

      <note-form v-else :is-edit="true" :note="note" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { Note } from "../types/note";
import { useRoute } from "vue-router";
import AppLoader from "../components/ui/AppLoader.vue";
import { storeToRefs } from "pinia";
import NoteForm from "../components/notes/NoteForm.vue";
import { useBookNotesStore } from "../stores/useBookNotesStore";

export default defineComponent({
  name: "BookNote",
  components: { AppLoader, NoteForm },
  setup() {
    const route = useRoute();

    const store = useBookNotesStore();

    const note = ref<Note | null>(null);
    const noteId = route.params.id as string | undefined;
    const bookId = route.params.bookId as string | undefined;

    const { fetchBookNoteById } = store;
    const { isFetchingLoading } = storeToRefs(store);

    onMounted(async () => {
      if (bookId && noteId) {
        note.value = (await fetchBookNoteById(bookId, noteId)) || null;
      }
    });

    return { noteId, note, isFetchingLoading };
  },
});
</script>

<style scoped>
.breadcrumbs a {
  text-decoration: none;
  color: var(--secondary);
  font-size: 1.5rem;
  display: inline-block;
  line-height: 1;
}
.breadcrumbs a:active {
  transform: scale(1.05);
  transform-origin: left center;
}
</style>

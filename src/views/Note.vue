<template>
  <div class="with-nav page-container">
    <div class="breadcrumbs">
      <router-link to="/notes" class="flex gap-8 items-center">
        <v-icon color="secondary" icon="mdi-chevron-left" />
        <p>Вернуться к списку заметок</p>
      </router-link>
    </div>
    <div v-if="isFetchingNote">
      <AppLoader />
    </div>
    <div v-else>
      <div v-if="!note">Заметка с id {{ notetId }} не найдена</div>

      <note-form v-else :is-edit="true" :note="note" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useNotesStore } from "../stores/useNotesStore";
import type { Note } from "../types/note";
import { useRoute } from "vue-router";
import AppLoader from "../components/ui/AppLoader.vue";
import { storeToRefs } from "pinia";
import NoteForm from "../components/notes/NoteForm.vue";

export default defineComponent({
  name: "Note",
  components: { AppLoader, NoteForm },
  setup() {
    const route = useRoute();

    const store = useNotesStore();

    const note = ref<Note | null>(null);
    const notetId = route.params.id;

    const { loadById } = store;
    const { isFetchingNote } = storeToRefs(store);

    onMounted(async () => {
      note.value = (await loadById(notetId as string)) || null;
    });

    return { notetId, note, isFetchingNote };
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

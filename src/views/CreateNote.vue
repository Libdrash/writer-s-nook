<template>
  <div class="with-nav page-container with-footer">
    <h2 class="title-note">
      {{ title }}
    </h2>
    <note-form :is-edit="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useNotesStore } from "../stores/useNotesStore";
import { storeToRefs } from "pinia";
import NoteForm from "../components/notes/NoteForm.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "CreateNote",
  components: { NoteForm },
  setup() {
    const notesStore = useNotesStore();
    const { isAddNoteLoading } = storeToRefs(notesStore);
    const route = useRoute();

    const titleList: Record<string, string> = {
      CreateNote: "Создать заметку",
      CreateBookNote: "Добавить заметку к книге",
      CreateBookNoteById: "Добавить заметку к книге",
      EditBookNoteById: "Редактировать заметку",
    };

    const title = titleList[route.name as string];

    return {
      isAddNoteLoading,
      title,
    };
  },
});
</script>

<style scoped>
.title-note {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
}
</style>

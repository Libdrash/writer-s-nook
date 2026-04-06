<template>
  <v-expansion-panel :value="book.id">
    <v-expansion-panel-title>
      <div class="flex justify-between items-center w-full">
        <div>
          <span class="book-title">{{ book.title }}</span>
          <span class="book-author ml-2 text-grey">— {{ book.author }}</span>
        </div>
        <v-chip size="small" color="primary" variant="tonal">
          <v-icon size="16" start>mdi-file-document-outline</v-icon>
          {{ book.notesCount }}
        </v-chip>
      </div>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div v-if="book.notes?.length" class="notes-list">
        <NoteCard
          v-for="note in book.notes"
          :key="note.id"
          :book-id="book.id"
          :note="{
            id: note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
          }"
          type="bookNote"
          @click="$emit('show-note', note)"
          @remove="(id: string) => $emit('delete-note', id, book.id)"
          class="note-card-inline"
        />
      </div>

      <!-- Пустое состояние -->
      <div v-else class="empty-notes">
        <v-icon size="32" color="grey-lighten-1"
          >mdi-book-open-blank-variant-outline</v-icon
        >
        <p class="mt-2">Нет заметок к этой книге</p>

        <router-link :to="'/notes/create-book-note/' + book.id">
          <v-btn
            variant="text"
            color="primary"
            size="small"
            prepend-icon="mdi-plus"
            class="mt-2"
          >
            Добавить первую заметку
          </v-btn>
        </router-link>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { BookWithNotes } from "../../types/bookNote";
import NoteCard from "../notes/NoteCard.vue";

export default defineComponent({
  name: "BookWithNotesCard",
  components: { NoteCard },

  props: {
    book: {
      type: Object as PropType<BookWithNotes>,
      required: true,
    },
  },
  emits: {
    "add-note": (_book: BookWithNotes) => true,
    "edit-note": (_note: any) => true,
    "delete-note": (_noteId: string, _bookId: string) => true,
    "show-note": (_note: any) => true,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9fafb;
  padding: 12px;
  border-radius: 16px;
}

.note-card-inline {
  cursor: pointer;
  transition: all 0.2s ease;
}

.note-card-inline:hover {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.empty-notes {
  text-align: center;
  padding: 32px;
  background: #f9fafb;
  border-radius: 12px;
}

.empty-notes p {
  margin: 8px 0 0 0;
  color: #9ca3af;
}

.book-title {
  font-weight: 600;
  font-size: 1rem;
}

.book-author {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>

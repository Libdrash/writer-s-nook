<template>
  <v-dialog @click:outside="handleHide" v-model="visible" max-width="800">
    <v-card class="rounded-xl p-16">
      <v-card-title class="d-flex align-items-start justify-space-between">
        <h4 class="note-title">
          {{ note?.title || "Просмотр заметки" }}
        </h4>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="var(--secondary-dark)"
          size="small"
          @click="handleHide"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <p class="note-content">
          {{ note?.content || "Нет содержимого" }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Закрыть"
          variant="flat"
          class="btn primary size-s radius-12"
          color="primary"
          @click="handleHide"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue";
import type { Note } from "../../types/note";

export default defineComponent({
  name: "NoteViewModal",
  emits: ["update:modelValue", "close"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    note: {
      type: Object as PropType<Note | null>,
      required: true,
      default: null,
    },
  },
  setup(props, { emit }) {
    const visible = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const note = computed(() => {
      return props.note;
    });

    const handleHide = () => {
      emit("update:modelValue", false);
      emit("close");
    };
    return { visible, handleHide, note };
  },
});
</script>

<style scoped>
.note-title {
  text-wrap: initial;
  font-weight: 600;
  margin: 0;
  color: var(--secondary-dark);
}

.note-content {
  text-wrap: initial;
  font-weight: 500;
  margin: 0;
  color: var(--secondary-light);
  white-space: pre-wrap;
}
</style>

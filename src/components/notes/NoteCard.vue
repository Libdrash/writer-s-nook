<template>
  <div class="border radius-16 bg-white p-16">
    <div class="flex flex-col gap-8">
      <div class="flex justify-between items-center gap-12">
        <h3 class="subtitle note-title">{{ note.title }}</h3>
        <div class="flex actions items-center">
          <router-link
            :to="{
              name: isPublicNote ? 'Note' : 'EditBookNoteById',
              params: { id: note.id, ...(!isPublicNote && { bookId }) },
            }"
            v-slot="{ navigate }"
            custom
          >
            <v-btn
              @click.stop="navigate"
              size="x-small"
              class="p-0"
              variant="plain"
            >
              <v-icon
                max-width="16"
                size="x-small"
                color="gray"
                icon="mdi-square-edit-outline"
              ></v-icon> </v-btn
          ></router-link>

          <v-btn
            size="x-small"
            class="p-0"
            @click.stop="handleRemove"
            variant="plain"
          >
            <v-icon
              size="x-small"
              color="secondary"
              icon="mdi-trash-can-outline"
            ></v-icon>
          </v-btn>
        </div>
      </div>
      <h4 class="subtitle-s content text-gray">{{ note.content }}</h4>
      <div class="flex gap-4 items-center">
        <v-icon
          size="x-small"
          color="gray"
          icon="mdi-calendar-blank-outline"
        ></v-icon>
        <p class="subtitle-s text-gray">{{ formattedDate }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Note } from "../../types/note";
import dayjs from "dayjs";

export default defineComponent({
  name: "NoteCard",
  emits: ["remove"],
  props: {
    note: {
      type: Object as PropType<Note>,
      required: true,
    },
    type: {
      type: String as PropType<"bookNote" | "publicNote">,
      default: "publicNote",
    },
    bookId: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const formattedDate = dayjs(props.note.createdAt).format("DD MMMM YYYY г.");
    const handleRemove = () => {
      emit("remove", props.note.id);
    };

    return {
      formattedDate,
      handleRemove,
      isPublicNote: props.type === "publicNote",
    };
  },
});
</script>

<style scoped>
h3,
h4,
p {
  margin: 0;
}

h3 {
  font-weight: 500;
}

.actions {
  max-height: fit-content;
}

.content {
  line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.note-title {
  line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>

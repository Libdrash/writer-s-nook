<template>
  <div class="project-card">
    <div class="flex justify-between">
      <div class="flex items-center gap-12">
        <v-icon
          v-if="type === 'book'"
          size="large"
          color="primary"
          icon="mdi-book-open-blank-variant-outline"
        ></v-icon>
        <v-icon
          v-if="type === 'leaf'"
          size="large"
          color="primary"
          icon="mdi-invoice-text-outline"
        ></v-icon>
        <h4 class="subtitle">{{ title || `Новый проект: ${id}` }}</h4>
      </div>
      <div class="text-primary flex items-center gap-8">
        <v-icon
          @click.prevent.stop="$router.push('/workshop/edit/' + id)"
          size="large"
          color="secondary"
          icon="mdi-lead-pencil"
        ></v-icon>
        |
        <v-icon
          @click.prevent.stop="emit('remove')"
          size="large"
          color="danger"
          icon="mdi-trash-can-outline"
        ></v-icon>
      </div>
    </div>
    <div class="flex justify-between mt-4">
      <div>
        <p class="subtitle-s text-gray">Создан: {{ createdDate }}</p>
        <p class="subtitle-s text-gray">
          Последнее обновление: {{ updatedDate }}
        </p>
      </div>
      <v-btn
        @click.prevent.stop="emit('public')"
        color="secondary"
        rounded
        variant="tonal"
        append-icon="mdi-earth"
      >
        Опубликовать
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { ProjectFromFirestore } from "../../../types/project";

const props = defineProps<{
  project: ProjectFromFirestore;
}>();

const emit = defineEmits(["remove", "public"]);

const { project } = props;
const { title, id, type, createTime, updateTime } = project;

const createdDate = dayjs(createTime).format("DD.MM.YYYY");
const updatedDate = dayjs(updateTime).format("DD.MM.YYYY");
</script>

<style scoped>
.project-card {
  border-radius: 24px;
  background-color: white;
  padding: 24px;
  display: flex;
  border: 1px solid var(--primary-light);
  flex-direction: column;
  gap: 16px;
}

.project-card:hover {
  box-shadow: 1px 1px 4px var(--primary);
  border: none;
}
</style>

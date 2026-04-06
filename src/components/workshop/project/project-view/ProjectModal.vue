<template>
  <teleport to="body">
    <v-dialog
      scroll-strategy="block"
      @click:outside="handleDisagree"
      v-model="dialogVisible"
      max-width="900"
    >
      <v-card class="rounded-xl">
        <v-card-title class="py-4 px-6">
          Просмотр проекта: {{ project?.title || "Название отсутствует" }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text
          class="px-6 py-4"
          style="max-height: 70vh; overflow-y: auto"
        >
          <div class="book-container">
            <h1 class="title">
              {{ project?.title || "Название отсутствует" }}
            </h1>
            <p v-if="project?.type === 'leaf'" class="subtitle subtitle-leaf">
              {{ project.content }}
            </p>
            <NodeViewRenderer
              v-else
              :key="node.id"
              :node="node"
              v-for="node in project?.content"
            />
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 px-6">
          <v-spacer></v-spacer>
          <v-btn @click="handleDisagree" class="btn primary radius-16 size-m"
            >Закрыть</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../../../../types/project";
import NodeViewRenderer from "./NodeViewRenderer.vue";

const props = defineProps<{
  modelValue: boolean;
  project: Project | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleDisagree = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.title {
  text-align: center;
  letter-spacing: 8px;
  font-size: 40px;
}
.book-container {
  padding-left: 24px;
  padding-right: 24px;
}

.subtitle-leaf {
  white-space: pre-wrap;
  text-align: center;
}
</style>

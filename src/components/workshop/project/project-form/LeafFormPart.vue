<template>
  <div :class="{ 'leaf-container': !isProject }">
    <div
      class="flex justify-between mb-4 items-center gap-12"
      v-if="!isProject"
    >
      <v-text-field
        :model-value="node.title"
        @update:model-value="handleTitleChange"
        label="Название листа"
        variant="outlined"
        :rounded="true"
        hide-details
        color="primary"
        baseColor="secondary"
      ></v-text-field>
      <v-btn
        @click="handleRemovePart"
        rounded
        size="medium"
        class="trash-icon"
        variant="text"
      >
        <v-icon
          size="large"
          color="secondary"
          icon="mdi-trash-can-outline"
        ></v-icon>
      </v-btn>
    </div>
    <v-textarea
      hide-details
      :model-value="node.content"
      @update:model-value="handleContentChange"
      color="primary"
      label="Начните писать свою историю..."
      baseColor="secondary"
      variant="outlined"
      :rounded="true"
      auto-grow
      persistent-hint
    ></v-textarea>
  </div>
</template>

<script setup lang="ts">
import type { ProjectLeaf } from "../../../../types/project";

const props = defineProps<{
  node: ProjectLeaf;
  isProject?: boolean;
  parentId?: string;
}>();

const emit = defineEmits<{
  (e: "update-title", nodeId: string, title: string): void;
  (e: "update-content", nodeId: string, content: string): void;
  (e: "remove-part", parentId: string, nodeId: string): void;
}>();

const handleTitleChange = (value: string) => {
  emit("update-title", props.node.id, value);
};

const handleContentChange = (value: string) => {
  emit("update-content", props.node.id, value);
};

const handleRemovePart = () => {
  if (props.parentId) {
    emit("remove-part", props.parentId, props.node.id);
  }
};
</script>

<style scoped>
.leaf-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: white;
  border-radius: 24px;
  border: 3px solid color-mix(in srgb, var(--primary), white 50%);
  box-shadow: 1px 1px 4px color-mix(in srgb, var(--primary), white 50%);
}
</style>

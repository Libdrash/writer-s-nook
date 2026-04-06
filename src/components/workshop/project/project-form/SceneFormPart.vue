<template>
  <div class="scene-container">
    <div class="flex justify-between mb-4 items-center gap-12">
      <v-text-field
        hide-details
        :model-value="node.title"
        @update:model-value="handleTitleChange"
        label="Название сцены"
        variant="solo"
        :rounded="true"
        base-color="primary"
        color="primary"
      ></v-text-field>
      <v-btn
        @click="handleRemovePart(parentId, node.id)"
        rounded
        size="medium"
        class="trash-icon"
        variant="elevated"
      >
        <v-icon
          size="large"
          color="secondary"
          icon="mdi-trash-can-outline"
        ></v-icon>
      </v-btn>
    </div>

    <div class="children-list">
      <NodeRenderer
        :parentId="node.id"
        v-for="child in node.content"
        :key="child.id"
        :node="child"
        @remove-part="handleRemovePart"
        @add-part="handleAddPart"
        @update-title="handleUpdateTitle"
        @update-content="handleUpdateContent"
      />
    </div>

    <div class="flex gap-16 mt-16">
      <v-btn
        type="button"
        @click="handleAddPart(node.id, 'leaf')"
        variant="elevated"
        :rounded="true"
        prepend-icon="mdi-plus"
      >
        Лист
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import NodeRenderer from "./NodeRenderer.vue";
import type { ProjectBookType, ProjectScene } from "../../../../types/project";

const props = defineProps<{
  node: ProjectScene;
  parentId: string;
}>();

const emit = defineEmits<{
  (e: "add-part", parentId: string, childType: ProjectBookType): void;
  (e: "remove-part", parentId: string, nodeId: string): void;
  (e: "update-title", nodeId: string, title: string): void;
  (e: "update-content", nodeId: string, content: string): void;
}>();

const handleAddPart = (parentId: string, childType: ProjectBookType) => {
  emit("add-part", parentId, childType);
};

const handleTitleChange = (value: string) => {
  emit("update-title", props.node.id, value);
};

const handleUpdateTitle = (nodeId: string, title: string) => {
  emit("update-title", nodeId, title);
};

const handleUpdateContent = (nodeId: string, content: string) => {
  emit("update-content", nodeId, content);
};

const handleRemovePart = (parentId: string, nodeId: string) => {
  emit("remove-part", parentId, nodeId);
};
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
  background-color: color-mix(in srgb, var(--secondary), white 27%);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 1px 1px 6px color-mix(in srgb, var(--secondary), white 50%);
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

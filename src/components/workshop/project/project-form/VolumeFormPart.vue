<template>
  <div class="volume-container">
    <div class="flex justify-between mb-4 items-center gap-12">
      <v-text-field
        :model-value="node.title"
        @update:model-value="handleTitleChange"
        label="Название тома"
        variant="outlined"
        hide-details
        :rounded="true"
        color="primary"
        baseColor="secondary"
      ></v-text-field>
      <v-btn
        @click="handleRemovePart(parentId, node.id)"
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

    <div class="children-list">
      <NodeRenderer
        :parentId="node.id"
        v-for="child in node.content"
        :key="child.id"
        :node="child"
        @add-part="handleAddPart"
        @remove-part="handleRemovePart"
        @update-title="handleUpdateTitle"
        @update-content="handleUpdateContent"
      />
    </div>

    <div class="flex gap-16 mt-16">
      <v-btn
        type="button"
        @click="handleAddPart(node.id, 'chapter')"
        color="primary"
        variant="outlined"
        :rounded="true"
        prepend-icon="mdi-plus"
      >
        Глава
      </v-btn>
      <v-btn
        type="button"
        @click="handleAddPart(node.id, 'scene')"
        color="primary"
        variant="outlined"
        :rounded="true"
        prepend-icon="mdi-plus"
      >
        Сцена
      </v-btn>
      <v-btn
        type="button"
        @click="handleAddPart(node.id, 'leaf')"
        color="primary"
        variant="outlined"
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
import type { ProjectBookType, ProjectVolume } from "../../../../types/project";

const props = defineProps<{
  node: ProjectVolume;
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
.volume-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  border-radius: 24px;
  background-color: color-mix(in srgb, var(--primary), white 70%);
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

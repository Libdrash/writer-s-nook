<template>
  <div class="chapter-container">
    <div class="flex justify-between mb-4 items-center gap-12">
      <v-text-field
        :model-value="node.title"
        @update:model-value="handleTitleChange"
        label="Название главы"
        variant="outlined"
        :rounded="true"
        color="primary"
        baseColor="secondary"
        hide-details
      />

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
        @add-part="handleAddPart"
        @remove-part="handleRemovePart"
        @update-title="handleUpdateTitle"
        @update-content="handleUpdateContent"
      />
    </div>

    <div class="flex gap-16 mt-16">
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
import type {
  ProjectBookType,
  ProjectChapter,
} from "../../../../types/project";

const props = defineProps<{
  node: ProjectChapter;
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

const handleRemovePart = (parentId: string, nodeId: string) => {
  emit("remove-part", parentId, nodeId);
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
</script>

<style scoped>
.chapter-container {
  width: 100%;
  height: 100%;
  /* border: 2px solid var(--primary); */
  padding: 24px;
  border-radius: 24px;
  background-color: white;
  box-shadow: 1px 1px 4px var(--primary);
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

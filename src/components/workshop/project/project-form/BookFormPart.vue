<template>
  <div class="book-container flex flex-col gap-16">
    <div v-if="project.content.length" class="children-list">
      <NodeRenderer
        v-for="part in project.content"
        :key="part.id"
        :parentId="project.id"
        :node="part"
        @remove-part="handleRemovePart"
        @add-part="handleChooseType"
        @update-title="handleUpdateTitle"
        @update-content="handleUpdateContent"
      />
    </div>
    <div class="flex gap-16">
      <v-btn
        type="button"
        @click="handleChooseType(project.id, 'volume')"
        color="primary"
        variant="text"
        :rounded="true"
        prepend-icon="mdi-plus"
        >Том</v-btn
      >
      <v-btn
        type="button"
        @click="handleChooseType(project.id, 'chapter')"
        color="primary"
        variant="text"
        :rounded="true"
        prepend-icon="mdi-plus"
        >Глава</v-btn
      >
      <v-btn
        type="button"
        @click="handleChooseType(project.id, 'scene')"
        color="primary"
        variant="text"
        :rounded="true"
        prepend-icon="mdi-plus"
        >Сцена</v-btn
      >
      <v-btn
        type="button"
        @click="handleChooseType(project.id, 'leaf')"
        color="primary"
        variant="text"
        :rounded="true"
        prepend-icon="mdi-plus"
        >Лист</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import NodeRenderer from "./NodeRenderer.vue";
import type { ProjectBook, ProjectBookType } from "../../../../types/project";

export default defineComponent({
  name: "BookFormPart",
  components: { NodeRenderer },
  props: {
    project: {
      type: Object as PropType<ProjectBook>,
      required: true,
    },
  },
  emits: ["add-part", "update-title", "update-content", "remove-part"],
  setup(_, { emit }) {
    const handleChooseType = (parentId: string, childType: ProjectBookType) => {
      emit("add-part", parentId, childType);
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

    return {
      handleChooseType,
      handleUpdateTitle,
      handleUpdateContent,
      handleRemovePart,
    };
  },
});
</script>

<style scoped>
.book-container {
  width: 100%;
  height: 100%;
  border: 1px solid var(--primary);
  padding: 24px;
  border-radius: 24px;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

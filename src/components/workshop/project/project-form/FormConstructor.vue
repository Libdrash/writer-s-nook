<template>
  <div>
    <BookFormPart
      v-if="project.type === 'book'"
      :project="project"
      @add-part="handleAddPart"
      @remove-part="handleRemovePart"
      @update-title="handleUpdateTitle"
      @update-content="handleUpdateContent"
    />
    <LeafFormPart
      v-else
      isProject
      :node="project"
      @update-title="handleUpdateTitle"
      @update-content="handleUpdateContent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import BookFormPart from "./BookFormPart.vue";
import LeafFormPart from "./LeafFormPart.vue";
import type { Project, ProjectBookType } from "../../../../types/project";

export default defineComponent({
  name: "FormConstructor",
  components: { BookFormPart, LeafFormPart },
  emits: ["add-part", "update-title", "update-content", "remove-part"],
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  setup(_, { emit }) {
    const handleAddPart = (parentId: string, childType: ProjectBookType) => {
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
      handleAddPart,
      handleUpdateTitle,
      handleUpdateContent,
      handleRemovePart,
    };
  },
});
</script>

<style scoped>
.title-constructor {
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
}
</style>

<template>
  <VolumeFormPart
    v-if="node.type === 'volume'"
    :node="node"
    :parentId="parentId"
    @add-part="handleAddPart"
    @remove-part="handleRemovePart"
    @update-title="handleUpdateTitle"
    @update-content="handleUpdateContent"
  />
  <ChapterFormPart
    v-else-if="node.type === 'chapter'"
    :node="node"
    :parentId="parentId"
    @remove-part="handleRemovePart"
    @add-part="handleAddPart"
    @update-title="handleUpdateTitle"
    @update-content="handleUpdateContent"
  />
  <SceneFormPart
    :parentId="parentId"
    v-else-if="node.type === 'scene'"
    :node="node"
    @remove-part="handleRemovePart"
    @add-part="handleAddPart"
    @update-title="handleUpdateTitle"
    @update-content="handleUpdateContent"
  />
  <LeafFormPart
    :parentId="parentId"
    v-else
    :node="node"
    @remove-part="handleRemovePart"
    @update-title="handleUpdateTitle"
    @update-content="handleUpdateContent"
  />
</template>

<script setup lang="ts">
import type {
  ProjectBookNode,
  ProjectBookType,
} from "../../../../types/project";
import ChapterFormPart from "./ChapterFormPart.vue";
import LeafFormPart from "./LeafFormPart.vue";
import SceneFormPart from "./SceneFormPart.vue";
import VolumeFormPart from "./VolumeFormPart.vue";

const props = defineProps<{
  node: ProjectBookNode;
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

const handleUpdateTitle = (nodeId: string, title: string) => {
  emit("update-title", nodeId, title);
};

const handleUpdateContent = (nodeId: string, content: string) => {
  emit("update-content", nodeId, content);
};
</script>

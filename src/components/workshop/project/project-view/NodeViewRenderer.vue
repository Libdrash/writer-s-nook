<template>
  <component :is="titleTag" :class="titleClassName">
    {{ node.title }}
  </component>

  <p v-if="node.type === 'leaf'" class="subtitle">{{ node.content }}</p>

  <NodeViewRenderer
    :node="part"
    :key="part.id"
    v-if="node.type !== 'leaf' && node.content.length"
    v-for="part in node.content"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProjectBookNode } from "../../../../types/project";

defineOptions({
  name: "NodeViewRenderer",
});

const props = defineProps<{
  node: ProjectBookNode;
}>();

const titleTagsMap: Record<string, string> = {
  leaf: "p",
  scene: "h4",
  chapter: "h3",
  volume: "h2",
};

const titleClassNamesMap: Record<string, string> = {
  leaf: "title-leaf",
  scene: "title-scene",
  chapter: "title-chapter",
  volume: "title-volume",
};

const titleTag = computed(() => {
  return titleTagsMap[props.node.type];
});
const titleClassName = computed(() => {
  return titleClassNamesMap[props.node.type];
});
</script>

<style scoped>
.title-volume {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin: 24px 0 16px 0;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.title-chapter {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.35;
  margin: 20px 0 12px 0;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.title-scene {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  margin: 16px 0 8px 0;
  color: var(--text-primary);
  letter-spacing: -0.15px;
}

.title-leaf {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.45;
  margin: 12px 0 8px 0;
  color: var(--text-primary);
  letter-spacing: -0.1px;
}

.subtitle {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .title-volume {
    font-size: 24px;
    margin: 20px 0 12px 0;
  }

  .title-chapter {
    font-size: 20px;
    margin: 16px 0 10px 0;
  }

  .title-scene {
    font-size: 17px;
    margin: 14px 0 8px 0;
  }

  .title-leaf {
    font-size: 15px;
    margin: 10px 0 6px 0;
  }

  .subtitle {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>

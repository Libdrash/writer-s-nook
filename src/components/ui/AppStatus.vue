<template>
  <span :class="['badge', className]">{{ type }}</span>
</template>

<script lang="ts">
import { defineComponent, watch, type PropType, ref } from "vue";
type StatusType = "Прочитано" | "В процессе" | "Хочу прочитать";

export default defineComponent({
  name: "AppStatus",
  props: {
    type: {
      type: String as PropType<StatusType>,
      required: true,
      validator(value: string) {
        return ["Прочитано", "В процессе", "Хочу прочитать"].includes(value);
      },
    },
  },
  setup(props: { type: string }) {
    const classesMap: Record<string, string> = {
      Прочитано: "badge-primary",
      "В процессе": "badge-danger",
      "Хочу прочитать": "badge-primary",
    };

    const className = ref(classesMap[props.type]);

    watch(props, (value) => {
      className.value = classesMap[value.type];
    });

    return {
      className,
    };
  },
});
</script>

<style scoped></style>

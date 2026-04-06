<template>
  <component
    v-bind="$attrs"
    :height="size"
    :width="size"
    :is="Icons[icon]"
  ></component>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import * as Icons from "../svg/EXPORT";

export type IconType = keyof typeof Icons;
export const iconNames = Object.keys(Icons) as Array<keyof typeof Icons>;

export default defineComponent({
  name: "AppIcon",
  props: {
    icon: {
      type: String as PropType<IconType>,
      required: true,
      validator: (value: IconType) => {
        return iconNames.includes(value);
      },
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  setup() {
    return {
      Icons,
    };
  },
});
</script>

<style scoped></style>

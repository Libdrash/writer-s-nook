<template>
  <div class="flex w-full items-center justify-between gap-24">
    <div class="flex w-full gap-12">
      <div class="w-1/3">
        <v-text-field
          :rounded="'xl'"
          v-model="name"
          placeholder="Поиск"
          hide-details
          density="compact"
          color="primary"
          variant="outlined"
        ></v-text-field>
      </div>
      <div class="flex justify-between gap-12 items-center">
        <v-select
          label="Статус"
          v-model="status"
          :rounded="'lg'"
          :items="['Все', 'Прочитано', 'В процессе', 'Хочу прочитать']"
          required
          hide-details
          color="primary"
          density="compact"
          variant="outlined"
          style="min-width: 200px"
        ></v-select>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "BookFilter",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    const name = ref("");
    const status = ref("Все");

    watch([name, status], (values) => {
      emit("update:modelValue", {
        name: values[0],
        status: values[1],
      });
    });

    return { name, status };
  },
});
</script>

<style scoped></style>

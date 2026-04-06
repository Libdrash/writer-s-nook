<template>
  <app-alert></app-alert>
  <component v-if="layout" :is="layout + '-layout'"></component>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "./layout/MainLayout.vue";
import AuthLayout from "./layout/AuthLayout.vue";
import AppAlert from "./components/ui/AppAlert.vue";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

export default defineComponent({
  name: "App",
  components: { MainLayout, AuthLayout, AppAlert },
  setup() {
    const route = useRoute();

    const layout = computed(() => {
      return route.meta.layout;
    });
    return {
      layout,
    };
  },
});
</script>

<style scoped></style>

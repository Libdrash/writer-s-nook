<template>
  <the-navbar></the-navbar>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheNavbar from "../components/TheNavbar.vue";

export default defineComponent({
  name: "MainLayout",
  components: { TheNavbar },
});
</script>

<style scoped></style>

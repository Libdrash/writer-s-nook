<template>
  <div class="with-nav page-container flex-center flex-col gap-24">
    <img class="svg" :src="bookSvg" />
    <h2 class="title">404: Страница не найдена</h2>
    <h4>Вернуться на <router-link to="/">главную</router-link></h4>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import bookSvg from "../assets/book.svg";

export default defineComponent({
  name: "NotFound",
  setup() {
    return {
      bookSvg,
    };
  },
});
</script>

<style scoped>
h4 {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.5px;
  color: #2c3e4f;
  margin: 0;
}
a {
  text-decoration: none;
  color: var(--primary);
}
a:active {
  color: var(--secondary);
}
.svg {
  width: 140px;
  height: 140px;
  margin-top: 80px;
}
</style>

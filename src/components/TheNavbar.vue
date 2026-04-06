<template>
  <nav class="navbar">
    <div class="flex-center gap-12">
      <router-link class="none-styles" to="/">
        <h1
          style="
            font-size: 2rem;
            font-weight: 400;
            letter-spacing: -0.5px;
            color: #2c3e4f;
            margin: 0;
          "
          class=""
        >
          Writer's Nook
        </h1>
      </router-link>
    </div>
    <ul class="navbar-menu">
      <li>
        <router-link to="/">Главная</router-link>
      </li>
      <li>
        <router-link to="/library">Библиотека</router-link>
      </li>
      <li>
        <router-link to="/notes">Мои заметки</router-link>
      </li>
      <li>
        <router-link to="/workshop">Мастерская</router-link>
      </li>
      <li>
        <router-link to="/about">О проекте</router-link>
      </li>
      <li>
        <router-link to="/profile">Профиль</router-link>
      </li>
      <li>
        <a @click.prevent="logout" href="#">Выйти</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppIcon from "./ui/AppIcon.vue";
import { useAuthStore } from "../stores/useAuthStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TheNavbar",
  components: { AppIcon },
  setup() {
    const router = useRouter();
    const store = useAuthStore();

    const logout = () => {
      store.logout();
      router.push("/auth");
    };
    return {
      logout,
    };
  },
});
</script>

<style scoped>
.none-styles {
  text-decoration: none;
  color: #212529;
}
</style>

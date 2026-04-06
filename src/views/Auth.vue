<template>
  <div class="absolute-center w-1/2">
    <div class="flex-center flex-col">
      <div class="bg-primary-light circle w-64 h-64 flex-center">
        <AppIcon :size="32" :icon="`PenIcon`" />
      </div>
      <h1 class="title pt-16 pb-8">Writer's Nook</h1>

      <h4 class="text-gray subtitle">Добро пожаловать обратно</h4>
    </div>
    <form
      @submit.prevent="onSubmitLogin"
      class="card mt-32 flex-center flex-col gap-24 p-32"
    >
      <div
        :class="[
          'flex-col form-control flex gap-8 w-full',
          { invalid: emailError },
        ]"
      >
        <label for="email">Email <span class="text-danger">*</span></label>
        <input
          v-model="email"
          placeholder="your@email.com"
          class="input"
          id="email"
          type="text"
        />
        <small class="text-danger" v-if="emailError">{{ emailError }}</small>
      </div>
      <div
        :class="[
          'flex-col form-control w-full flex gap-8',
          { invalid: passwordError },
        ]"
      >
        <label for="password">Пароль <span class="text-danger">*</span></label>
        <div class="relative password-container w-full">
          <input
            placeholder="Введите пароль"
            class="input w-full with-password"
            id="password"
            v-model="password"
            @blur="passwordBlur"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="password-icon"
          >
            <AppIcon
              :icon="showPassword ? 'EyeIcon' : 'EyeOffIcon'"
              :size="20"
            />
          </button>
        </div>
        <small class="text-danger" v-if="passwordError">{{
          passwordError
        }}</small>
      </div>

      <button
        :disabled="isSubmitting"
        :class="['btn w-full primary-light', { loading: isSubmitting }]"
      >
        Войти
      </button>

      <div class="flex gap-8">
        <h4 class="text-gray subtitle">Нет аккаунта?</h4>
        <router-link class="link" to="/registration">
          <h4 class="text-secondary subtitle">Зарегистрироваться</h4>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import { useLoginForm } from "../composables/useLoginForm";
import AppLoader from "../components/ui/AppLoader.vue";

export default defineComponent({
  name: "Auth",
  components: { AppIcon, AppLoader },
  setup() {
    const showPassword = ref(false);
    const loginForm = useLoginForm();

    return {
      showPassword,

      ...loginForm,
    };
  },
});
</script>

<style scoped>
.with-password {
  padding-right: 40px !important;
}

.password-icon {
  position: absolute;
  top: 50%;
  right: 16px;
  padding: 0;
  border: none;
  height: 20px;
  background-color: transparent;
  transform: translateY(-50%);
}

.password-container {
  position: relative;
}
</style>

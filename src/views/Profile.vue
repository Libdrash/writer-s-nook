<template>
  <div class="container flex flex-col gap-24 card">
    <div class="flex flex-col gap-16 w-full">
      <h2 class="title">Профиль</h2>
      <v-divider></v-divider>
    </div>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-16">
      <div class="flex gap-16 items-center">
        <div class="w-full flex flex-col gap-16">
          <v-text-field
            hide-details
            v-model="photoUrl"
            :error-messages="photoUrlError"
            label="Фото url"
            variant="outlined"
            :rounded="true"
            :loading="isFetchingProfile || isSavingProfile"
            color="primary"
            baseColor="secondary"
          ></v-text-field>
          <v-text-field
            hide-details
            v-model="pseudonym"
            :error-messages="pseudonymError"
            label="Псевдоним"
            variant="outlined"
            :rounded="true"
            color="primary"
            baseColor="secondary"
            :loading="isFetchingProfile || isSavingProfile"
          ></v-text-field>
        </div>
        <img
          :class="['avatar', { loading: isFetchingProfile || isSavingProfile }]"
          :src="photoUrl ? photoUrl.toString() : defaultAvatar"
        />
      </div>

      <v-text-field
        v-model="fio"
        :error-messages="fioError"
        @blur="fioBlur"
        label="ФИО*"
        :loading="isFetchingProfile || isSavingProfile"
        variant="outlined"
        :rounded="true"
        color="primary"
        baseColor="secondary"
        required
      ></v-text-field>
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        :rounded="true"
        type="submit"
        :loading="isFetchingProfile || isSavingProfile"
        >Сохранить
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProfileForm } from "../composables/useProfileForm";
import { useProfileStore } from "../stores/useProfileStore";
import type { ProfileForm } from "../types/profile";
import defaultAvatar from "../assets/defaultAvatar.png";
import { onMounted } from "vue";

const profileStore = useProfileStore();
const { saveProfile, fetchProfile, createProfile } = profileStore;
const { profile, isFetchingProfile, isSavingProfile } =
  storeToRefs(profileStore);

const submit = async (profileData: ProfileForm) => {
  await saveProfile(profileData);
};

const {
  fio,
  fioBlur,
  fioError,
  photoUrl,
  photoUrlError,
  pseudonym,
  pseudonymError,
  onSubmit,
} = useProfileForm(submit, profile);

onMounted(async () => {
  await fetchProfile();

  if (!profile.value) {
    await createProfile();

    await fetchProfile();
  }
});
</script>

<style scoped>
.container {
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  width: 80%;
  border-radius: 40px;
  padding: 32px;
}

.title {
  margin: 0;
}

.loading {
  opacity: 40%;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 40px;
}
</style>

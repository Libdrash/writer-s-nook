<template>
  <teleport to="body">
    <v-dialog
      scroll-strategy="block"
      @click:outside="handleDisagree"
      v-model="dialogVisible"
      max-width="900"
    >
      <v-card class="rounded-xl">
        <v-card-title class="py-4 px-6"
          >Публикация проекта: {{ project?.title }}</v-card-title
        >

        <v-divider></v-divider>

        <v-card-text
          class="px-6 py-4 flex gap-16"
          style="max-height: 70vh; overflow-y: auto"
        >
          <div class="w-full">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="title"
                  :error-messages="titleError"
                  @blur="titleBlur"
                  label="Название*"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="author"
                  :error-messages="authorError"
                  @blur="authorBlur"
                  label="Автор*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="yearValue"
                  :error-messages="yearError"
                  @blur="yearBlur"
                  disabled
                  label="Год издания"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Жанр"
                  v-model="genre"
                  :error-messages="genreError"
                  @blur="genreBlur"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="coverUrl"
                  :error-messages="coverUrlError"
                  @blur="coverUrlBlur"
                  label="URL обложки"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div class="preview-wrap">
            <img
              @error="handleImageError"
              :src="currentImageSrc"
              class="preview"
            />
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-3 px-6">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            rounded
            size="large"
            variant="text"
            @click="handleDisagree"
          >
            Отменить
          </v-btn>
          <v-btn
            @click="onSubmitForm"
            :loading="isSubmitting"
            color="primary"
            rounded
            variant="flat"
            size="large"
            class="text-white ml-4"
          >
            Опубликовать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Project, PublicProjectForm } from "../../../types/project";
import { useProjectForm } from "../../../composables/useProjectForm";
import dayjs from "dayjs";
import { useProfileStore } from "../../../stores/useProfileStore";
import { useProjectsStore } from "../../../stores/useProjectsStore";
import { storeToRefs } from "pinia";
import defaultBook from "../../../assets/defaultBook.webp";

const props = defineProps<{
  modelValue: boolean;
  project: Project | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const profileStore = useProfileStore();
const { fetchProfile, createProfile } = profileStore;
const { profile } = storeToRefs(profileStore);
const projectsStore = useProjectsStore();
const { publishProject, createUserPublicProject, removeProject } =
  projectsStore;

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleDisagree = () => {
  emit("update:modelValue", false);
  closeDialog();
};

const submit = async (projectData: PublicProjectForm) => {
  if (!props.project) return;

  const publicProjectDoc = await publishProject(props.project, projectData);
  if (!publicProjectDoc) return;

  const publicProjectId = publicProjectDoc.name.split("/").pop();
  await createUserPublicProject(props.project, projectData, publicProjectId);
  await removeProject(props.project.id);
  closeDialog();
};

const initialFormData = computed(() => ({
  year: dayjs().year().toString(),
  title: props.project?.title || 'Проект "Без названия"',
  author: profile.value?.pseudonym || profile.value?.fio || "Автор неизвестен",
  genre: "",
}));

const form = useProjectForm(submit, initialFormData);

const {
  isSubmitting,
  onSubmitForm,
  resetForm,
  title,
  titleError,
  titleBlur,
  author,
  authorError,
  authorBlur,
  year,
  yearError,
  yearBlur,
  genre,
  genreError,
  genreBlur,
  coverUrl,
  coverUrlError,
  coverUrlBlur,
} = form;

const currentImageSrc = ref(defaultBook);

const yearValue = computed({
  get: () => {
    const val = year.value;
    if (val === null || val === undefined) return "";
    return String(val);
  },
  set: (val: string) => {
    if (val === "" || val === null || val === undefined) {
      form.year.value = null;
    } else {
      const num = Number(val);
      form.year.value = isNaN(num) ? null : num;
    }
  },
});

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const handleImageError = () => {
  currentImageSrc.value = defaultBook;
};

onMounted(async () => {
  await fetchProfile();

  if (!profile.value) {
    await createProfile();

    await fetchProfile();
  }
});

watch(
  () => coverUrl.value,
  (newUrl) => {
    currentImageSrc.value = newUrl || defaultBook;
  },
  { immediate: true },
);
</script>

<style scoped>
.preview-wrap {
  flex: 0 0 250px;
  width: 250px;
  min-width: 250px;
  height: 270px;
  min-height: 270px;
  overflow: hidden;
  border-radius: 16px;
}

.preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

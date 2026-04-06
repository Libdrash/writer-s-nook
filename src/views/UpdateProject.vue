<template>
  <ProjectModal v-model="showPreview" :project="projectToUpdate" />

  <div class="with-nav with-footer page-container flex flex-col gap-24">
    <h2 class="title-project">
      {{ isCreatePage ? "Создание проекта" : "Редактирование проекта" }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="projectTitle"
        label="Название проекта*"
        variant="outlined"
        :rounded="true"
        :width="800"
        :loading="isFetchProjectLoading"
        color="primary"
        baseColor="secondary"
        :disabled="!projectToUpdate"
        required
      ></v-text-field>
      <h4 class="subtitle text-gray mb-8">Настройте свой проект</h4>
      <div v-if="!projectType" class="flex gap-16">
        <v-btn
          type="button"
          @click="handleCreate('book')"
          color="primary"
          variant="outlined"
          :loading="isFetchProjectLoading"
          :rounded="true"
          prepend-icon="mdi-plus"
          >Создать книгу</v-btn
        >
        <v-btn
          type="button"
          @click="handleCreate('leaf')"
          color="primary"
          :loading="isFetchProjectLoading"
          variant="outlined"
          :rounded="true"
          prepend-icon="mdi-plus"
          >Создать лист</v-btn
        >
      </div>

      <div class="" v-else>
        <div class="flex justify-between items-center">
          <h3 class="title-constructor">
            Создание {{ projectType === "leaf" ? "листа" : "книги" }}
          </h3>

          <v-btn
            type="button"
            @click="handleResetForm"
            color="danger"
            variant="elevated"
            :rounded="true"
            >Сбросить</v-btn
          >
        </div>
        <FormConstructor
          v-if="projectToUpdate"
          @add-part="handleAddPart"
          @remove-part="handleRemove"
          @update-title="handleUpdateTitle"
          @update-content="handleUpdateContent"
          :project="projectToUpdate"
        />
      </div>

      <div class="footer flex justify-between">
        <v-btn
          v-if="projectToUpdate"
          type="button"
          append-icon="mdi-eye"
          prepend-icon="mdi-eye"
          class="radius-16"
          variant="outlined"
          @click="handleShowPreview"
        >
          Предпросмотр
        </v-btn>
        <div class="flex ml-auto gap-12">
          <router-link
            @click.prevent="handleResetForm"
            to="/workshop"
            class="button radius-16 btn secondary"
            >Отменить</router-link
          >

          <v-btn
            v-if="projectToUpdate"
            :loading="isUpdateProjectLoading"
            type="submit"
            color="primary"
            class="button btn primary radius-16"
            variant="flat"
          >
            Сохранить
          </v-btn>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { useProjectsStore } from "../stores/useProjectsStore";
import { storeToRefs } from "pinia";
import type { ProjectBookType } from "../types/project";
import ProjectModal from "../components/workshop/project/project-view/ProjectModal.vue";
import { useRoute } from "vue-router";
import FormConstructor from "../components/workshop/project/project-form/FormConstructor.vue";
import { useAlertStore } from "../stores/useAlertStore";

export default defineComponent({
  name: "UpdateProject",
  components: { FormConstructor, ProjectModal },

  setup() {
    const projectType = ref<"leaf" | "book" | null>(null);
    const projectsStore = useProjectsStore();
    const showPreview = ref(false);
    const {
      addChild,
      updateProjectWithId,
      cancelUpdateProject,
      updateNodeTitle,
      updateLeafContent,
      removeNode,
      createProject,
      fetchProjectById,
    } = projectsStore;
    const { projectToUpdate, isFetchProjectLoading, isUpdateProjectLoading } =
      storeToRefs(projectsStore);
    const alertStore = useAlertStore();
    const route = useRoute();

    const isCreatePage = route.name === "CreateProject";
    const projectId = route.params.id as string;

    const projectTitle = computed({
      get: () => projectToUpdate.value?.title ?? "",
      set: (value: string) => {
        if (!projectToUpdate.value) return;
        updateNodeTitle(projectToUpdate.value.id, value);
      },
    });

    const handleShowPreview = () => {
      showPreview.value = true;
    };

    const handleResetForm = () => {
      projectType.value = null;
      cancelUpdateProject();
    };

    const handleAddPart = (parentId: string, childType: ProjectBookType) => {
      if (!projectToUpdate.value) return;

      addChild(parentId, childType);
    };

    const handleCreate = (type: "book" | "leaf") => {
      projectType.value = type;
      projectsStore.createRoot(type);
    };

    const handleUpdateTitle = (nodeId: string, title: string) => {
      updateNodeTitle(nodeId, title);
    };

    const handleUpdateContent = (nodeId: string, content: string) => {
      updateLeafContent(nodeId, content);
    };
    const handleRemove = (parentId: string, nodeId: string) => {
      removeNode(parentId, nodeId);
    };

    const handleSubmit = async () => {
      if (!projectToUpdate.value) return;
      const title = projectToUpdate.value.title.trim();
      if (!title) {
        alertStore.showErrorAlert(
          "Добавьте название проекта перед сохранением",
        );
        return;
      }

      if (isCreatePage) {
        await createProject();
      } else {
        await updateProjectWithId(projectId);
      }
    };

    onMounted(async () => {
      if (!isCreatePage) {
        await fetchProjectById(projectId);
        projectType.value =
          projectToUpdate.value?.type === "book" ? "book" : "leaf";
      }
    });

    onUnmounted(() => {
      projectToUpdate.value = null;
      projectType.value = null;
    });

    return {
      projectType,
      projectTitle,
      isUpdateProjectLoading,
      showPreview,
      isCreatePage,
      projectId,
      isFetchProjectLoading,
      handleShowPreview,
      handleRemove,
      handleSubmit,
      handleCreate,
      handleResetForm,
      handleAddPart,
      handleUpdateTitle,
      handleUpdateContent,
      projectToUpdate,
    };
  },
});
</script>

<style scoped>
.title-project {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
}
</style>

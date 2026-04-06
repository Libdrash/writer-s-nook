<template>
  <AppConfirm
    @cancel="handleCancel"
    @confirm="handleDelete"
    :loading="isRemoveProjectLoading"
    :modelValue="!!confirmData"
    :confirmData="confirmData"
    title="Вы действительно хотите удалить эту работу?"
    message="Это действие нельзя отменить. Работа будет удалена навсегда."
  />
  <ProjectModal v-model="showPreview" :project="selectedProject" />

  <PublicProjectForm
    :project="selectedProject"
    v-model="showPublicProjectForm"
  />

  <div class="with-nav page-container flex flex-col gap-24">
    <div class="flex justify-between">
      <h2 class="title-note">Мастерская</h2>
      <router-link to="/workshop/create"> Добавить проект </router-link>
    </div>

    <v-btn-toggle
      v-model="selected"
      mandatory
      rounded="xl"
      color="primary"
      bg-color="grey-lighten-2"
      group
      class="custom-toggle"
    >
      <v-btn value="work">
        <div class="flex gap-4">
          <v-icon>mdi-file-edit-outline</v-icon>
          В работе
        </div>
      </v-btn>
      <v-btn value="public">
        <div class="flex gap-4">
          <v-icon>mdi-account-group</v-icon>
          Опубликованные
        </div>
      </v-btn>
    </v-btn-toggle>

    <AppLoader v-if="isFetchProjectsLoading" />

    <!-- СЛУЖЕБНЫЕ -->
    <template v-else-if="selected === 'work'">
      <div v-if="projects?.length" class="flex flex-col gap-12">
        <project-list-card
          @click.prevent.stop="handleShowPreview(project)"
          :project="project"
          :key="project.id"
          @remove="handleRemoveProject(project.id)"
          @public="handleShowPublicProject(project)"
          class="project-card"
          v-for="project in projects"
        />
      </div>
      <div v-else class="flex-center flex-col">
        <h3 class="nothing">Ничего не найдено</h3>
        <router-link to="/workshop/create" class="button">
          Создать проект
        </router-link>
      </div>
    </template>

    <!-- ОПУБЛИКОВАННЫЕ -->
    <template v-else-if="selected === 'public'">
      <div v-if="projects?.length" class="cards-grid">
        <PublicProjectCard
          canRemove
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @select="handleShowPreview"
          @remove="handleRemovePublicProject"
        />
      </div>
      <div v-else class="flex-center flex-col">
        <h3 class="nothing">Нет опубликованных проектов</h3>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";
import { defineComponent } from "vue";
import { useProjectsStore } from "../stores/useProjectsStore";
import { storeToRefs } from "pinia";
import ProjectListCard from "../components/workshop/project/ProjectListCard.vue";
import type { Project, ProjectFromFirestore } from "../types/project";
import ProjectModal from "../components/workshop/project/project-view/ProjectModal.vue";
import AppLoader from "../components/ui/AppLoader.vue";
import AppConfirm from "../components/ui/AppConfirm.vue";
import PublicProjectForm from "../components/workshop/public-project/PublicProjectForm.vue";
import PublicProjectCard from "../components/workshop/public-project/PublicProjectCard.vue";

type ConfirmData =
  | {
      type: "work";
      projectId: string;
    }
  | {
      type: "public";
      userPublicProjectId: string;
      sourceProjectId?: string;
      publicProjectId?: string;
    };

export default defineComponent({
  name: "Workshop",
  components: {
    ProjectListCard,
    ProjectModal,
    AppLoader,
    AppConfirm,
    PublicProjectForm,
    PublicProjectCard,
  },
  setup() {
    const selected = ref<"work" | "public">("work");
    const showPreview = ref(false);
    const showPublicProjectForm = ref(false);
    const projectsStore = useProjectsStore();
    const selectedProject = ref<Project | null>(null);

    const {
      fetchProjects,
      fetchUserPublicProjects,
      removeProject,
      removeUserPublicProject,
    } = projectsStore;
    const { projects, isFetchProjectsLoading, isRemoveProjectLoading } =
      storeToRefs(projectsStore);

    const confirmData = ref<ConfirmData | null>(null);

    const handleCancel = () => {
      confirmData.value = null;
    };

    const handleDelete = async (payload: ConfirmData | null) => {
      if (!payload) return;

      if (payload.type === "work") {
        await removeProject(payload.projectId);
        confirmData.value = null;
        return;
      }

      await removeUserPublicProject({
        userPublicProjectId: payload.userPublicProjectId,
        sourceProjectId: payload.sourceProjectId,
        publicProjectId: payload.publicProjectId,
      });

      confirmData.value = null;
    };

    const handleShowPreview = (project: Project) => {
      selectedProject.value = project;
      showPreview.value = true;
    };

    const handleRemoveProject = (projectId: string) => {
      confirmData.value = {
        type: "work",
        projectId,
      };
    };

    const handleRemovePublicProject = (project: ProjectFromFirestore) => {
      if (confirmData.value) {
        return;
      }
      confirmData.value = {
        type: "public",
        userPublicProjectId: project.id,
        sourceProjectId: project.sourceProjectId,
        publicProjectId: project.publicProjectId,
      };
    };
    const handleShowPublicProject = (project: Project) => {
      selectedProject.value = project;
      showPublicProjectForm.value = true;
    };

    onMounted(async () => {
      await fetchProjects();
    });

    watch(selected, async (value) => {
      if (value === "public") {
        await fetchUserPublicProjects();
        return;
      }

      await fetchProjects();
    });

    return {
      selected,
      projects,
      isFetchProjectsLoading,
      showPreview,
      selectedProject,
      isRemoveProjectLoading,
      confirmData,
      showPublicProjectForm,
      handleShowPublicProject,
      handleDelete,
      handleCancel,
      handleShowPreview,
      handleRemoveProject,
      handleRemovePublicProject,
    };
  },
});
</script>

<style scoped>
.title-note {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

a {
  text-decoration: none;
  font-size: 1.5rem;
  color: var(--primary);
}
a:active {
  scale: 1.05;
}

.project-card {
  cursor: pointer;
}

.cards-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  align-items: stretch;
}
</style>

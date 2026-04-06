<template>
  <ProjectModal v-model="showPreview" :project="selectedProject" />

  <div class="with-nav page-container flex flex-col gap-16">
    <h2 class="title-note">Все публикации</h2>

    <div class="search-row">
      <v-text-field
        :rounded="'xl'"
        :disabled="isFetchProjectsLoading"
        v-model="search"
        placeholder="Поиск по названию, автору, жанру"
        hide-details
        density="compact"
        color="primary"
        variant="outlined"
      ></v-text-field>
    </div>

    <AppLoader v-if="isFetchProjectsLoading" />

    <div v-else-if="filteredPublicProjects.length" class="cards-grid">
      <PublicProjectCard
        v-for="project in filteredPublicProjects"
        :key="project.id"
        :project="project"
        @select="handleShowPreview"
      />
    </div>

    <div v-else-if="publicProjects.length">
      Ничего не найдено по вашему запросу
    </div>
    <div v-else>Пока нет публикаций</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useProjectsStore } from "../stores/useProjectsStore";
import { storeToRefs } from "pinia";
import PublicProjectCard from "../components/workshop/public-project/PublicProjectCard.vue";
import ProjectModal from "../components/workshop/project/project-view/ProjectModal.vue";
import type { Project } from "../types/project";
import AppLoader from "../components/ui/AppLoader.vue";

const projectsStore = useProjectsStore();
const { fetchPublicProjects } = projectsStore;
const { publicProjects, isFetchProjectsLoading } = storeToRefs(projectsStore);
const showPreview = ref(false);
const selectedProject = ref<Project | null>(null);
const search = ref("");

const filteredPublicProjects = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return publicProjects.value;

  return publicProjects.value.filter((project) => {
    const title = project.title?.toLowerCase() ?? "";
    const author = project.author?.toLowerCase() ?? "";
    const genre = project.genre?.toLowerCase() ?? "";

    return (
      title.includes(query) || author.includes(query) || genre.includes(query)
    );
  });
});

const handleShowPreview = (project: Project) => {
  selectedProject.value = project;
  showPreview.value = true;
};

onMounted(async () => {
  await fetchPublicProjects();
});

defineOptions({
  name: "Main",
});
</script>

<style scoped>
.title-note {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.cards-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  align-items: stretch;
}

.search-row {
  max-width: 520px;
}
</style>

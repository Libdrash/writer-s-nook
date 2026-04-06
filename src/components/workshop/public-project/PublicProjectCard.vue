<template>
  <article
    class="radius-16 public-project-card"
    :class="{ loading: props.loading ?? false }"
    @click="emit('select', props.project)"
  >
    <div class="type-badge" :title="typeLabel">
      <v-icon
        v-if="props.project.type === 'book'"
        size="large"
        color="primary"
        icon="mdi-book-open-blank-variant-outline"
      ></v-icon>
      <v-icon
        v-else
        size="large"
        color="primary"
        icon="mdi-invoice-text-outline"
      ></v-icon>
    </div>

    <button
      v-if="canRemove"
      type="button"
      class="remove-icon"
      @click.stop.prevent="emit('remove', props.project)"
    >
      <v-icon size="large" color="primary" icon="mdi-trash-can"></v-icon>
    </button>

    <img
      loading="lazy"
      :src="props.project.coverUrl || defaultBook"
      :alt="props.project.title || 'Обложка проекта'"
    />

    <div class="p-12 card-body">
      <h4 class="subtitle text-secondary">
        {{ props.project.title || "Проект без названия" }}
      </h4>

      <h4 class="subtitle text-gray">
        {{ props.project.author || "Автор неизвестен" }}
      </h4>

      <p class="text-disabled subtitle-s">
        {{ props.project.year ? `${props.project.year} г.` : "Год неизвестен" }}
      </p>

      <div class="genre-block mt-6">
        <div class="genre-chips">
          <v-chip
            v-for="(genre, index) in genreChips"
            :key="`${genre}-${index}`"
            size="small"
            variant="outlined"
            color="primary"
            class="genre-chip"
          >
            {{ genre }}
          </v-chip>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import defaultBook from "../../../assets/defaultBook.webp";
import type { ProjectFromFirestore } from "../../../types/project";

type PublicProjectCardData = ProjectFromFirestore & {
  author?: string;
  year?: string;
  genre?: string;
  coverUrl?: string;
};

const props = defineProps<{
  project: PublicProjectCardData;
  loading?: boolean;
  canRemove?: boolean;
}>();

const emit = defineEmits<{
  (e: "select", project: PublicProjectCardData): void;
  (e: "remove", project: PublicProjectCardData): void;
}>();

const typeLabel = computed(() =>
  props.project.type === "book" ? "Проект-книга" : "Проект-лист",
);

const genreChips = computed(() => {
  const rawGenre = props.project.genre ?? "";
  const parsedGenres = rawGenre
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);

  return parsedGenres.length ? parsedGenres : ["Жанр не указан"];
});
</script>

<style scoped>
.public-project-card {
  background-color: white;
  border: 1px solid var(--border);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.public-project-card:hover {
  box-shadow: 2px 6px 16px rgba(0, 0, 0, 0.14);
}

.subtitle {
  line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

img {
  display: block;
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.type-badge {
  position: absolute;
  left: 12px;
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.remove-icon {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background-color: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
  padding: 0;
}

.public-project-card:hover .remove-icon {
  opacity: 1;
}

.genre-block {
  width: 100%;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.genre-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-chip {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading {
  opacity: 0.45;
}
</style>

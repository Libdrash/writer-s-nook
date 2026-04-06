<template>
  <div :class="['radius-16 book-card', { loading }]">
    <BookOptions @edit="onEdit" :bookId="book.id" />
    <img loading="lazy" :src="book.coverUrl ?? defaultBook" />
    <div class="p-8">
      <h4 class="subtitle text-secondary">
        {{ book.title }}
      </h4>
      <h4 class="subtitle text-gray">{{ book.author }}</h4>
      <p class="text-disabled subtitle-s">
        {{ book.year ? `${book.year} г.` : "Год неизвестен" }}
      </p>
      <div class="genre-chips mt-6">
        <v-chip
          v-for="(genre, index) in genreChips"
          :key="`${genre}-${index}`"
          size="small"
          variant="outlined"
          color="primary"
        >
          <div class="genre-chip">
            {{ genre }}
          </div>
        </v-chip>
      </div>
      <div class="flex pb-8 mt-4 flex-wrap justify-between">
        <AppStatus :type="book.status" />
        <v-rating
          half-increments
          class="mb-1"
          :length="5"
          :size="20"
          :model-value="(book.rating ?? 0).toString()"
          active-color="primary"
          color="primary"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from "vue";
import AppStatus from "../ui/AppStatus.vue";
import BookOptions from "./BookOptions.vue";
import { useBooksStore } from "../../stores/useBooksStore";
import { storeToRefs } from "pinia";
import defaultBook from "../../assets/defaultBook.webp";

interface Book {
  id: string;
  title: string;
  author: string;
  year?: number | null;
  genre?: string;
  coverUrl?: string | null;
  rating?: number | null;
  status: string;
  createdAt: string;
}

export default defineComponent({
  name: "BookCard",
  components: { AppStatus, BookOptions },
  props: {
    book: {
      type: Object as PropType<Book>,
      required: true,
    },
  },
  setup(props) {
    const booksStore = useBooksStore();
    const { showModal, isEditMode } = storeToRefs(booksStore);

    const loading = computed(() => booksStore.isRemoveBookLoading);
    const test = computed(() => props.book);
    const genreChips = computed(() => {
      const rawGenre = props.book.genre ?? "";
      const parsedGenres = rawGenre
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean);

      return parsedGenres.length ? parsedGenres : ["Жанр не указан"];
    });
    const onEdit = () => {
      booksStore.handleSelectBook(test.value);
      showModal.value = true;
      isEditMode.value = true;
    };
    return { loading, onEdit, defaultBook, genreChips };
  },
});
</script>

<style scoped>
.book-card {
  background-color: white;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
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
  height: 300px;
  width: 100%;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.loading {
  opacity: 40%;
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
  line-clamp: 1;
  white-space: nowrap;
}
</style>

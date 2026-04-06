<template>
  <div class="with-nav page-container flex flex-col gap-24">
    <div class="filters gap-32 flex">
      <BookFilter v-model="filter">
        <BookModal />
      </BookFilter>
    </div>

    <AppLoader v-if="isFetchingBooks" />
    <div v-else-if="books?.length" class="grid grid-cols-5 gap-24">
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
    <div v-else-if="!isFetchingBooks && !books?.length" class="flex-center">
      Ничего не найдено
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import BookCard from "../components/book/BookCard.vue";
import BookModal from "../components/book/BookModal.vue";
import { useBooksStore } from "../stores/useBooksStore";
import AppLoader from "../components/ui/AppLoader.vue";
import { storeToRefs } from "pinia";
import BookFilter from "../components/book/BookFilter.vue";

export default defineComponent({
  name: "Library",
  components: { BookCard, BookModal, AppLoader, BookFilter },
  setup() {
    const store = useBooksStore();
    const { fetchBooks } = store;
    const { books, isFetchingBooks } = storeToRefs(store);

    const bookList = computed(() => {
      return books.value
        .filter((book) => {
          if (filter.value?.name) {
            return book.title
              .toLowerCase()
              .includes(filter.value.name.toLowerCase());
          }
          return book;
        })
        .filter((book) => {
          if (filter.value?.status && filter.value?.status !== "Все") {
            return book.status === filter.value.status;
          }
          return book;
        });
    });

    onMounted(async () => {
      await fetchBooks();
    });

    const filter = ref();

    return {
      isFetchingBooks,
      books: bookList,
      filter,
    };
  },
});
</script>

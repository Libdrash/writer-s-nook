<template>
  <div class="text-center">
    <v-dialog @click:outside="closeDialog" v-model="showModal" max-width="800">
      <template v-slot:activator="{ props: activatorProps }">
        <button v-bind="activatorProps" class="btn primary">
          <span class="subtitle">Добавить книгу</span>
        </button>
      </template>

      <div class="modal-wrapper">
        <v-card
          class="rounded-xl p-16"
          :title="isEditMode ? 'Редактировать книгу' : 'Добавить книгу'"
        >
          <v-divider></v-divider>
          <v-card-text>
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
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="yearValue"
                  :error-messages="yearError"
                  @blur="yearBlur"
                  label="Год издания"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="genre"
                  :error-messages="genreError"
                  @blur="genreBlur"
                  label="Жанр"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="status"
                  :error-messages="statusError"
                  @blur="statusBlur"
                  :items="['Прочитано', 'В процессе', 'Хочу прочитать']"
                  label="Статус"
                  required
                ></v-select>
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

            <v-row>
              <v-col cols="12">
                <div class="rating-section">
                  <div class="rating-label">Рейтинг</div>
                  <v-rating
                    v-model="ratingValue"
                    length="5"
                    size="32"
                    hover
                    clearable
                    color="primary"
                    active-color="primary"
                  ></v-rating>
                  <div v-if="ratingValue" class="rating-value">
                    {{ ratingValue.toString() }}
                  </div>
                  <div v-else class="rating-value rating-placeholder">
                    Не оценено
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeDialog">
              Отмена
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              @click="onSubmit"
              :loading="
                isSubmitting ||
                (isEditMode ? store.isEditBookLoading : store.isAddBookLoading)
              "
            >
              {{ isEditMode ? "Обновить" : "Сохранить" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";
import { useBookForm } from "../../composables/useBookForm";
import { useBooksStore } from "../../stores/useBooksStore";
import { storeToRefs } from "pinia";
import type { BookForm } from "../../types/book";

export default defineComponent({
  name: "BookModal",
  setup() {
    const store = useBooksStore();
    const { showModal, selectedBook, isEditMode } = storeToRefs(store);

    const submit = async (bookData: BookForm) => {
      if (isEditMode.value && selectedBook.value) {
        await store.updateBook(selectedBook.value.id, bookData);
      } else {
        await store.addBook(bookData);
      }
      closeDialog();
    };

    const form = useBookForm(submit, null);

    const yearValue = computed({
      get: () => {
        const val = form.year.value;
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

    const ratingValue = computed({
      get: () => form.rating.value ?? undefined,
      set: (val) => {
        form.rating.value = val ?? null;
      },
    });

    const closeDialog = () => {
      showModal.value = false;
      isEditMode.value = false;
      store.handleResetBook();
      form.resetForm();
    };

    const test = computed(() => isEditMode.value);

    watch(test, (test) => {
      if (test && selectedBook.value !== null) {
        form.resetFormWithValues({
          title: selectedBook.value.title,
          author: selectedBook.value.author,
          year: selectedBook.value.year ?? null,
          genre: selectedBook.value.genre ?? "",
          coverUrl: selectedBook.value.coverUrl ?? null,
          rating: selectedBook.value.rating ?? null,
          status: selectedBook.value.status,
        });
      } else {
        form.resetFormWithValues(null);
      }
    });

    return {
      store,
      isEditMode,
      showModal,
      closeDialog,
      yearValue,
      ratingValue,
      ...form,
    };
  },
});
</script>

<style scoped>
.rating-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.rating-value {
  font-size: 14px;
  font-weight: 600;
  color: #ffb300;
  margin-top: 4px;
}

.rating-placeholder {
  color: rgba(0, 0, 0, 0.38);
  font-weight: normal;
}
</style>

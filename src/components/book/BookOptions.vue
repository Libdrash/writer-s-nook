<template>
  <v-container class="trigger">
    <v-btn
      icon="mdi-dots-vertical"
      size="small"
      variant="text"
      @click.stop="showMenuFromButton($event)"
    ></v-btn>

    <v-menu
      v-model="showMenu"
      activator="parent"
      :coordinates="menuCoordinates"
      offset="16 -16"
      location="bottom end"
      scroll-strategy="close"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.code"
          :value="item.code"
          @click="handleClick(item.code)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script lang="ts">
import { ref } from "vue";

import { defineComponent } from "vue";
import { useBooksStore } from "../../stores/useBooksStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "BookOptions",
  props: ["bookId"],
  emits: ["edit"],
  setup(props, { emit }) {
    const showMenu = ref(false);
    const menuCoordinates = ref({ x: 0, y: 0 });
    const router = useRouter();

    const menuItems = [
      { title: "Редактировать", icon: "mdi-pencil", code: "edit" },
      { title: "Добавить заметку", icon: "mdi-pin", code: "note" },
      { title: "Удалить", icon: "mdi-trash-can", code: "delete" },
    ];

    function showMenuFromButton(event: MouseEvent) {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();

      menuCoordinates.value = {
        x: rect.right,
        y: rect.bottom,
      };

      showMenu.value = true;
    }

    const booksStore = useBooksStore();

    const handleClick = async (code: string) => {
      showMenu.value = false;
      if (code === "delete") {
        await booksStore.removeBook(props.bookId);
      }
      if (code === "edit") {
        emit("edit");
      }
      if (code === "note") {
        router.push("/notes/create-book-note/" + props.bookId);
      }
    };

    return {
      showMenu,
      menuItems,
      menuCoordinates,
      showMenuFromButton,
      handleClick,
    };
  },
});
</script>

<style scoped>
.trigger {
  max-width: 40px;
  max-height: 40px;
  position: absolute;
  background-color: white;
  border-radius: 100%;
  top: 4px;
  right: 4px;
  padding: 0;
  visibility: hidden;
  opacity: 0;
}

.book-card:hover .trigger {
  opacity: 1;
  visibility: visible;
  transition: all;
}
</style>

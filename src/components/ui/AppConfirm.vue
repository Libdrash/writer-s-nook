<template>
  <teleport to="body">
    <v-dialog
      @click:outside="handleDisagree"
      v-model="dialogVisible"
      max-width="600"
      persistent
    >
      <v-card class="rounded-xl p-16" :text="message" :title="title">
        <template v-slot:actions>
          <v-btn class="btn size-s secondary" @click="handleDisagree"
            >Отменить</v-btn
          >

          <v-btn
            class="btn primary size-s"
            :loading="loading"
            @click="handleAgree"
            >Подтвердить</v-btn
          >
        </template>
      </v-card>
    </v-dialog>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "AppConfirm",
  emits: ["update:modelValue", "confirm", "cancel"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    confirmData: {
      type: null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Вы уверены, что хотите это сделать?",
    },
    message: {
      type: String,
      default: "Действие невозможно будет отменить",
    },
  },

  setup(props, { emit }) {
    const dialogVisible = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const handleAgree = () => {
      emit("confirm", props.confirmData);
      emit("update:modelValue", false);
    };

    const handleDisagree = () => {
      emit("cancel");
      emit("update:modelValue", false);
    };

    return { dialogVisible, handleAgree, handleDisagree };
  },
});
</script>

<style scoped></style>

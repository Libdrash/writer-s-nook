<template>
  <div v-if="alert" :class="['alert', alert.type]">
    <div class="flex gap-12">
      <AppIcon :size="24" :icon="iconType" />
      <p class="subtitle">{{ message }}</p>
    </div>
    <span @click="onClose" class="alert-close"
      ><AppIcon :size="24" icon="XIcon"
    /></span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useAlertStore } from "../../stores/useAlertStore";
import AppIcon from "./AppIcon.vue";

export default defineComponent({
  name: "AppAlert",
  components: { AppIcon },
  setup() {
    const store = useAlertStore();

    const alert = computed(() => store.alert.value);
    const message = computed(() => alert.value?.message);
    const iconType = computed(() =>
      alert.value?.type === "primary" ? "SuccessIcon" : "DangerIcon",
    );
    const onClose = () => store.closeAlert();

    return {
      message,
      iconType,
      alert,
      onClose,
    };
  },
});
</script>

<style scoped></style>

<script setup lang="ts">
const props = defineProps({
  isViewMode: Boolean,
  isDrawMode: Boolean,
  isEditMode: Boolean,
})
</script>

<template>
  <div class="flex justify-start border rounded-lg p-4 w-full space-x-3">
    <template v-if="props.isViewMode">
      <slot name="viewActions" />
    </template>

    <template v-if="props.isDrawMode">
      <slot name="drawActions" />
    </template>

    <template v-if="props.isEditMode">
      <slot name="editActions" />
    </template>
  </div>
</template>

<style scoped>

</style>
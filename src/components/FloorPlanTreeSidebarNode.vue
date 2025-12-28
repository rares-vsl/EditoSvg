<script setup >
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  indicatorClass: {
    type: String,
  },
  label: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="flex flex-row space-x-2 justify-between items-center flex-1">
    <div class="flex flex-row space-x-2 items-center">
      <div
          class="h-4 w-4"
          :class="props.indicatorClass"
          :style="{ backgroundColor: props.color }"
      />
      <b>{{ props.label }}</b>
    </div>
    <div v-if="$slots.actions" class="flex flex-row">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>

</style>
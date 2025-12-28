<script setup>
const props = defineProps({
  title: String,
  subtitle: String
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="p-card-title">{{ title }}</div>
    <div class="p-card-subtitle">{{ subtitle }}</div>
  </div>

  <div class="flex justify-center flex-1 mt-4">
    <slot name="content" />
  </div>

  <slot name="dialogs" />
</template>

<style>

</style>
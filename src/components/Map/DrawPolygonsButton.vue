<script setup>

const props = defineProps({
  label: {
    type: String,
    default: "Create new polygon",
  },
})

</script>

<template>
  <Button :label="label" severity="success"/>
</template>

<style scoped>

</style>
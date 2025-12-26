<script setup>
const props = defineProps(
    {color: String,}
)
</script>

<template>
  <path
      d="M13,9h6L8,22l3-10H5L10,2h7Z"
      :fill="props.color"
  />
</template>

<style scoped>

</style>
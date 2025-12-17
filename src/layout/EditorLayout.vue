<script setup lang="ts">
</script>

<template>
  <div class=" min-h-screen flex flex-col p-16 bg-gray-100">
    <h1 class="text-3xl  font-bold mb-6 text-gray-800">Setup Map</h1>
    <div class="flex-1 bg-white rounded-3xl shadow-lg p-8 overflow-auto h-full flex flex-col">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

</style>
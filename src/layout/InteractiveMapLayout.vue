<script setup>
</script>

<template>
  <div class="p-4 md:p-8 w-full lg:w-[1600px] flex flex-col justify-center items-center">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full">

      <!-- Main content area (floor plan, draw and edit buttons) -->
      <div class="lg:col-span-3">
        <div class="flex flex-col items-center space-y-4 w-full">
          <slot name="actions" />
          <slot name="floor-plan" />
        </div>
      </div>

      <!-- Sidebar (Tree structure) -->
      <div class="lg:col-span-1">
        <slot name="sidebar" />
      </div>
    </div>
  </div>
</template>

<style>

</style>
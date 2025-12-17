<script setup>
import FileUpload from 'primevue/fileupload';
import {ref} from "vue";
import router from "@/router/index.js";

const src = ref(null);
const fileName = ref(null);
const fileSize = ref(null);
const isDisabled = ref(true)

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function onFileSelect(event) {
  const file = event.files[0];
  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader();

    fileName.value = file.name;
    fileSize.value = formatFileSize(file.size);

    reader.onload = async (e) => {
      src.value = e.target.result;
    };

    reader.readAsDataURL(file);
    isDisabled.value = false;
  }
}

function goToEditor() {
  if (!isDisabled.value) {
    router.push('/editor/edit-floorplan')
  }
}
</script>

<template>
  <div class="flex flex-col justify-between flex-1">
    <div>
      <h2>Upload floor plan</h2>
      <FileUpload mode="basic" @select="onFileSelect" customUpload auto accept=".svg" severity="secondary"
                  class="p-button-outlined mb-4"/>
      <div v-if="src" class="border border-gray-200 p-4">
        <h3>SVG Preview</h3>
        <div class="file-info">
          <img :src="src" alt="Image" class="h-96"/>
          <p><strong>Filename:</strong> {{ fileName }}</p>
          <p><strong>Size:</strong> {{ fileSize }}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-end">
      <Button label="Next" :disabled="isDisabled" @click="goToEditor" />
    </div>
  </div>
</template>


<style scoped>
</style>
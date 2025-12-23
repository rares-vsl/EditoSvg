<script setup >
import {useOnboardingStore} from '@/stores/onboarding'
import {useInteractiveMap} from '@/stores/interactiveMap'
import {onMounted, ref} from "vue";
const onboardingStore = useOnboardingStore()
const interactiveMapStore = useInteractiveMap()
import {getSvgViewBox} from '@/compostables/getSvgViewBox'
import FloorPlan from "@/components/Map/FloorPlan.vue";

const src = ref(null);
const fileName = ref(null);
const viewBox = ref(null);

function onFileSelect(event) {
  const file = event.files[0];

  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader();

    fileName.value = file.name;

    reader.onload = async (e) => {
      src.value = e.target.result;

      interactiveMapStore.uploadSvg(src.value, fileName.value)
      viewBox.value = getSvgViewBox(src.value);
    };

    onboardingStore.completeStep()
    reader.readAsText(file);
  }
}

onMounted(()=>{
  src.value = interactiveMapStore.svgDataUrl
  fileName.value = interactiveMapStore.svgFileName
  viewBox.value = getSvgViewBox(src.value);
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2 ">
    <div class="p-card-title">Upload floor plan file</div>
    <div class="p-card-subtitle">Please upload an svg file of your floor plan</div>
    <div class="border-dashed border-gray-300 border-2 rounded-lg w-2/4 mt-4">
      <div class="p-4 flex h-fit" :class="src ? 'border-b-gray-300 border-b-2' : '' ">
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto accept=".svg" severity="secondary"
                    class="p-button-outlined" :chooseLabel="src ? 'Change' : 'Upload'"  />
      </div>
      <div v-if="src" class="p-4">
        <floor-plan :floor-plan-svg="src"></floor-plan>
        <div class="flex justify-between mt-4">
          <p class="!m-0"><strong>Filename:</strong> {{ fileName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
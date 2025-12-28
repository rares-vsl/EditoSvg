<script setup >
import {useOnboardingStore} from '@/stores/onboarding'
import {useInteractiveMap} from '@/stores/interactiveMap'
import {computed, onMounted, ref} from "vue";
import {getSvgViewBox} from '@/compostables/getSvgViewBox'
import FloorPlan from "@/components/Map/FloorPlan.vue";
import OnboardingStepLayout from "@/layout/OnboardingStepLayout.vue";

const onboardingStore = useOnboardingStore()
const interactiveMapStore = useInteractiveMap()

const src = ref(null);
const fileName = ref(null);
const viewBox = ref(null);

const showWarningDialog = ref(false);

const warningBeforeReupload = computed(() => {
  return interactiveMapStore.hasZones || interactiveMapStore.hasSmartFurnitureHookups;
})

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

function reuploadFloorPlan(event){
  interactiveMapStore.resetMap()
  onboardingStore.reset()
  showWarningDialog.value = false;

  onFileSelect(event)
}


onMounted(()=>{
  src.value = interactiveMapStore.svgDataUrl
  fileName.value = interactiveMapStore.svgFileName
  viewBox.value = getSvgViewBox(src.value);
})
</script>

<template>
  <onboarding-step-layout
    title="Upload floor plan file"
    subtitle="Please upload an svg file of your floor plan"
  >
    <template #content>
      <div class="border-dashed border-gray-300 border-2 rounded-lg w-2/4 mt-4">
        <div class="p-4 flex h-fit" :class="src ? 'border-b-gray-300 border-b-2' : '' ">
          <FileUpload v-if="!src && !warningBeforeReupload" mode="basic" @select="onFileSelect" customUpload auto accept=".svg" severity="secondary"
                      class="p-button-outlined" :chooseLabel="src ? 'Change' : 'Upload'"  />
          <Button
              v-else
              label="Change"
              variant="outlined"
              icon="pi pi-plus"
              @click="showWarningDialog = true"
          />
        </div>
        <div v-if="src" class="p-4">
          <floor-plan :floor-plan-svg="src"></floor-plan>
          <div class="flex justify-between mt-4">
            <p class="!m-0"><strong>Filename:</strong> {{ fileName }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #dialogs>
      <Dialog
          v-model:visible="showWarningDialog"
          modal
          header="Reupload floor plan"
      >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">
          Are you sure you want to reupload the floor plan? This will delete all the zones and the smart furniture hookups!
        </span>

        <div class="flex justify-end gap-2">
          <Button
              type="button"
              label="Cancel"
              severity="secondary"
              @click="showWarningDialog = false"
          />
          <FileUpload mode="basic" @select="reuploadFloorPlan" customUpload auto accept=".svg" severity="secondary"
                      class="p-button-outlined" chooseLabel="Change"  />
        </div>
      </Dialog>
    </template>
  </onboarding-step-layout>
</template>

<style scoped>

</style>
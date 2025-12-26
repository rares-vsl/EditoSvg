<script setup>

import ZoneSvg from "@/components/Map/ZoneSvg.vue";
import FloorPlan from "@/components/Map/FloorPlan.vue";
import {useOnboardingStore} from '@/stores/onboarding'
import {UtilityType} from "@/compostables/UtilityType.js";
import {useInteractiveMap} from '@/stores/interactiveMap'
import {computed, onMounted, ref} from "vue";
import SmartFurnitureHookup from "@/components/Map/SmartFurnitureHookup.vue";
import {useSmartFurnitureHookupDrawing} from "@/compostables/useSmartFurnitureHookupDrawing.js"
import Dialog from "primevue/dialog";
import axios from 'axios';
import { useConfirm, useToast } from "primevue"
import smartFurnitureHookup from "@/components/Map/SmartFurnitureHookup.vue";
import {useHookupZoneDetection} from "@/compostables/useHookupZoneDetection.js";

// Stores
const onboardingStore = useOnboardingStore()
const mapStore = useInteractiveMap()


const cursorStyle = computed(() => {
  if (mapStore.isDrawMode && !isPositioned.value) {
    return "cursor-crosshair"
  }
  return "cursor-default"
})

function useFloorPlanTree(zones, smartFurnitureHookups) {

  const zoneNodes = zones.map((zone, index) => ({
    key: index + 1,
    label: zone.name,
    color: zone.color,
    id: zone.id,
    type: "zone",
    children: smartFurnitureHookups
        .filter((sfh) => sfh.zone === zone.id)
        .map((sfh, i) => ({
          key: `${index + 1}-${i}`,
          id: sfh.id,
          label: sfh.name,
          isActive: sfh.isActive,
          type: "smart-furniture-hookup",
        }))
  }));

  zoneNodes.unshift({
    key: 0,
    label: "Floor plan",
    children: smartFurnitureHookups
        .filter((sfh) => sfh.zone === null)
        .map((sfh, i) => ({
          key: `${0}-${i}`,
          id: sfh.id,
          label: sfh.name,
          isActive: sfh.isActive,
          type: "smart-furniture-hookup",
        })),
  })

  return zoneNodes
}

const tree = computed(() =>
    useFloorPlanTree(mapStore.zones, mapStore.smartFurnitureHookups)
);

function zoneInfo(zone) {
  console.log("zone", zone)
}

function sfhInfo(sfh) {
  console.log("sfh", sfh)
}

const {draftSmartFurnitureHookup, startDrawing, cancelDrawing, isPositioned,positionNewSFH, isDrawing, finalizeHookup}
    = useSmartFurnitureHookupDrawing()

function onStartDrawing() {
  mapStore.startDrawing()
  startDrawing()
}
function onCancelDrawing() {
  mapStore.viewMap()
  cancelDrawing()
}

// Dialog state
const dialogMode = ref(null)
const showSmartFurnitureHookupDialog = ref(false)

function setupNewSmartFurnitureHookup(){
  dialogMode.value = 'create'
  showSmartFurnitureHookupDialog.value = true
  draftSmartFurnitureHookup.value.endpoint = "http://127.0.0.1:8000/api/wave-nodes/electric-oven"
}

const endpointLoading = ref(false)

async function fetchSmartFurnitureHookupInfo(){
  endpointLoading.value = true
  try {
    const response = await axios.get(draftSmartFurnitureHookup.value.endpoint);
    draftSmartFurnitureHookup.value.name = response.data.name
    draftSmartFurnitureHookup.value.utilityType = response.data.node_type
  } catch (error) {
  }
  finally {
    endpointLoading.value = false
  }
}

function onFloorPlanClick(point) {
  if (mapStore.isDrawMode) {
    positionNewSFH(point)
  }
}

onMounted(() => {
  mapStore.viewMap()

})

// MOVE
const dragState = ref({
  isDragging: false,
  hookup: null,
  startPosition: null
})

function startDragHookup(hookup, position){
  dragState.value = {
    isDragging: true,
    hookup: hookup,
    startPosition: { ...position }
  }
}
function handleDragMove(currentPosition) {
  if (!dragState.value.isDragging || !dragState.value.startPosition) {
    return
  }

  const dx = currentPosition.x - dragState.value.startPosition.x
  const dy = currentPosition.y - dragState.value.startPosition.y

  dragState.value.hookup.position.x += dx
  dragState.value.hookup.position.y += dy

  dragState.value.startPosition = { ...currentPosition }
}

function stopDrag() {
  if(!dragState.value.isDragging) return
  if(mapStore.isEditMode) {

    console.log("calc new zone")

    dragState.value.hookup.zone = findZoneForHookup(dragState.value.hookup)
  }

  dragState.value = {
    isDragging: false,
    hookup: null,
    startPosition: null
  }


  //
}
const existingZones = computed(() => mapStore.zones)
const {findZoneForHookup} = useHookupZoneDetection(existingZones)

function onSaveHookup(){
  const name = draftSmartFurnitureHookup.value.name.trim()
  const endpoint = draftSmartFurnitureHookup.value.endpoint.trim()
  const utilityType = draftSmartFurnitureHookup.value.utilityType

  const zone = findZoneForHookup(draftSmartFurnitureHookup.value)


  if (!name || !endpoint || !utilityType) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please enter a hookup name, endpoint and utility type',
      life: 3000
    })

    return
  }

  if (dialogMode.value === 'create') {
    const smartFurnitureHookup = finalizeHookup(zone)
    mapStore.addSmartFurnitureHookup(smartFurnitureHookup)

    // Complete onboarding step if first zone
    if (mapStore.zoneCount === 1) {
      onboardingStore.completeStep()
    }

    cancelDrawing()

  }

  showSmartFurnitureHookupDialog.value = false
  dialogMode.value = null

}

function onStartEditing() {
  mapStore.startEditing()
}

function onStopEditing() {
  mapStore.viewMap()
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="p-card-title">Add smart furniture hookups</div>
    <div class="p-card-subtitle">Add smart furniture hookups and position them on the floor plan</div>
  </div>

  <div class="flex justify-center flex-1">
    <div class="p-4 md:p-8 w-full lg:w-[1600px] flex flex-col justify-center items-center">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full">

        <!-- Main Map Area -->
        <div class="lg:col-span-3">
          <div class="flex flex-col items-center space-y-4 w-full">

            <!-- Action Buttons -->
            <div class="flex justify-start border rounded-lg p-4 w-full space-x-3">
              <!-- View Mode Buttons -->
              <template v-if="mapStore.isViewMode">
                <Button
                    label="Create new hookup"
                    severity="success"
                    @click="onStartDrawing"
                />
                <Button
                    label="Move hookups"
                    severity="success"
                    :disabled="!mapStore.hasSmartFurnitureHookups"
                    @click="onStartEditing"
                />
              </template>

              <!-- Draw Mode Buttons -->
              <template v-if="mapStore.isDrawMode">
                <Button
                    label="Cancel"
                    severity="secondary"
                    @click="onCancelDrawing"
                />
                <Button
                    label="Continue to setup"
                    severity="success"
                    @click="setupNewSmartFurnitureHookup"
                    :disabled="!isPositioned"
                />
              </template>

              <template v-if="mapStore.isEditMode">
                <Button
                    label="Done Editing"
                    severity="success"
                    @click="onStopEditing"
                />
              </template>
            </div>

            <!-- Floor Plan with Zones -->
            <floor-plan
                :floor-plan-svg="mapStore.svgDataUrl"
                :cursor="cursorStyle"
                @floorPlanClick="onFloorPlanClick"
                @floorPlanMouseMove="handleDragMove"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
            >

              <zone-svg
                  v-for="zone in mapStore.zones"
                  :key="zone.id"
                  :zone="zone"
                  :editModeActive="false"
              />

              <smart-furniture-hookup
                  @hookupClick="startDragHookup"
                  v-if="mapStore.isDrawMode && isPositioned"
                  :smartFurnitureHookup="draftSmartFurnitureHookup"
                  :editModeActive="true"
              />

              <smart-furniture-hookup
                  v-for="sfh in mapStore.smartFurnitureHookups"
                  :key="sfh.id"
                  :editModeActive="mapStore.isEditMode"
                  @hookupClick="startDragHookup"
                  :smartFurnitureHookup="sfh"
              />
            </floor-plan>
          </div>
        </div>

        <!-- Sidebar: Zone List -->
        <div class="lg:col-span-1 space-y-6 border rounded-lg p-4">
          <h5>Floor Plan Zones</h5>
          <p class="m-0 text-gray-600">
            {{ mapStore.hasZones ? 'Manage your zones below' : 'No zones created yet' }}
          </p>


          <Tree :value="tree"
                class="!p-0 !m-0"
                selectionMode="single"
                :pt="{
                nodeLabel: {
                  class: '!w-full'
                },
              }"
          >
            <template #default="slotProps">
              <div class="flex flex-row space-x-2 items-center">
                <div
                    class="h-4 w-4 rounded-sm "
                    :style="`background-color: ${slotProps.node.color}`"
                />
                <b>{{ slotProps.node.label }}</b>
              </div>
            </template>

            <template #zone="slotProps">
              <div class="flex flex-row space-x-2 justify-between items-center flex-1">
                <div class="flex flex-row space-x-2 items-center">
                  <div
                      class="h-4 w-4 rounded-sm "
                      :style="`background-color: ${slotProps.node.color}`"
                  />
                  <b>{{ slotProps.node.label }} - zone</b>
                </div>
                <div class="flex flex-row bg-yellow-100">
                  <Button
                      icon="pi pi-pen-to-square"
                      variant="text"
                      rounded
                      aria-label="Edit"
                      @click="zoneInfo(slotProps.node.id)"
                  />
                  <Button
                      icon="pi pi-trash"
                      severity="danger"
                      variant="text"
                      rounded
                      aria-label="Delete"
                      @click=""
                  />
                </div>
              </div>
            </template>
            <template #smart-furniture-hookup="slotProps">
              <div class="flex flex-row space-x-2 justify-between items-center flex-1">
                <div class="flex flex-row space-x-2 items-center">
                  <div
                      class="h-4 w-4 rounded-lg "
                      :style="`background-color: ${slotProps.node.isActive ? 'green' : 'gray'}`"
                  />
                  <b>{{ slotProps.node.label }}</b>
                </div>
                <div class="flex flex-row bg-yellow-100">
                  <Button
                      icon="pi pi-pen-to-square"
                      variant="text"
                      rounded
                      aria-label="Edit"
                      @click="sfhInfo(slotProps.node.id)"
                  />
                  <Button
                      icon="pi pi-trash"
                      severity="danger"
                      variant="text"
                      rounded
                      aria-label="Delete"
                      @click=""
                  />
                </div>
              </div>
            </template>
          </Tree>
        </div>
      </div>
    </div>
  </div>

  <Dialog
      v-model:visible="showSmartFurnitureHookupDialog"
      modal
      :header="dialogMode === 'create' ? 'Create new smart furniture hookup' : 'Edit smart furniture hookup'"
      :style="{ width: '35rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Smart furniture hookup information
    </span>

    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupEndpoint" class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Endpoint</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <InputText id="smartFurnitureHookupEndpoint" autocomplete="off" type="text" class="w-full"
                   v-model="draftSmartFurnitureHookup.endpoint"
                   :invalid="!draftSmartFurnitureHookup.endpoint"
        />
        <Button :disabled="!draftSmartFurnitureHookup.endpoint" :loading="endpointLoading"
                icon="pi pi-link" aria-label="Connect" class="col-span-12 md:col-span-10" @click="fetchSmartFurnitureHookupInfo"/>
      </div>
      <Message class="col-span-12"
          v-show="!draftSmartFurnitureHookup.endpoint" severity="error" variant="simple" size="small">Endpoint is required</Message>
    </div>



    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupName" class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Name</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <InputText id="smartFurnitureHookupName" autocomplete="off" type="text" class="w-full"
                   v-model="draftSmartFurnitureHookup.name"
                   :invalid="!draftSmartFurnitureHookup.name"
        />
      </div>
      <Message class="col-span-12"
               v-show="!draftSmartFurnitureHookup.name" severity="error" variant="simple" size="small">Name is required</Message>
    </div>

    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupUtilityType" class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Utility type</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <Select v-model="draftSmartFurnitureHookup.utilityType" class="w-full" :invalid="!draftSmartFurnitureHookup.utilityType"
                :options="Object.values(UtilityType)" id="smartFurnitureHookupUtilityType" placeholder="Select a utility type" />
      </div>
      <Message class="col-span-12"
               v-show="!draftSmartFurnitureHookup.utilityType" severity="error" variant="simple" size="small">Utility type is required</Message>
    </div>


    <div class="flex justify-end gap-2">
      <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="showSmartFurnitureHookupDialog = false"
      />
      <Button
          type="button"
          label="Save"
          @click="onSaveHookup"
      />
    </div>
  </Dialog>
  <ConfirmDialog/>
  <Toast/>
</template>

<style scoped>

</style>
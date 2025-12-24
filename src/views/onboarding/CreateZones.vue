<script setup>
import {computed, onMounted, ref, watch} from "vue"
import { useConfirm, useToast } from "primevue"
import Dialog from "primevue/dialog"

import { useOnboardingStore } from '@/stores/onboarding'
import { MapMode, useInteractiveMap } from '@/stores/interactiveMap'


import FloorPlan from "@/components/Map/FloorPlan.vue"
import ZoneSvg from "@/components/Map/ZoneSvg.vue"
import {useZoneDrawing} from "@/compostables/useZoneDrawing.js";
import {useZoneDrag} from "@/compostables/useZoneDrag.js";

// Stores
const onboardingStore = useOnboardingStore()
const mapStore = useInteractiveMap()

const existingZones = computed(() => mapStore.zones)

const {
  draftZone,
  colorInput,
  isPolygonClosed,
  isDrawing,
  polygonPath,
  displayColor,
  collisionError,

  startDrawing,
  cancelDrawing,
  addPoint,
  finalizeZone,
  resetDraft,
  loadZoneForEdit
} = useZoneDrawing(existingZones)


const confirm = useConfirm()
const toast = useToast()

// Dialog state
const dialogMode = ref(null)
const showZoneDialog = ref(false)

// Computed
const cursorStyle = computed(() => {
  if (mapStore.isDrawMode && !isPolygonClosed.value) {
    return "cursor-crosshair"
  }
  return "cursor-default"
})


// ======================
// Drawing Actions
// ======================

function onStartDrawing() {
  mapStore.startDrawing()
  startDrawing()

}

function onCancelDrawing() {
  mapStore.viewMap()
  cancelDrawing()
}

function onCompletePolygon() {
  dialogMode.value = 'create'
  showZoneDialog.value = true
}

function onFloorPlanClick(point) {
  if (mapStore.isDrawMode) {
    addPoint(point)
  }
}

// ======================
// Edit Actions
// ======================

function onStartEditing() {
  mapStore.startEditing()
}

function onStopEditing() {
  mapStore.viewMap()
}

function onEditZone(zoneId) {
  const zone = mapStore.findZone(zoneId)
  if (!zone) return

  loadZoneForEdit(zone)
  dialogMode.value = 'edit'
  showZoneDialog.value = true
}

function onDeleteZone(zoneId) {
  confirm.require({
    message: 'Are you sure you want to delete this zone?',
    header: 'Delete Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      mapStore.deleteZone(zoneId)

      if (mapStore.zoneCount === 0) {
        onboardingStore.uncompleteStep()
      }

      toast.add({
        severity: 'info',
        summary: 'Deleted',
        detail: 'Zone deleted successfully',
        life: 3000
      })
    }
  })
}

// ======================
// Dialog Actions
// ======================

function onSaveZone() {
  const name = draftZone.value.name.trim()

  if (!name) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please enter a zone name',
      life: 3000
    })
    return
  }

  if (dialogMode.value === 'create') {
    const newZone = finalizeZone()
    mapStore.addZone(newZone)

    // Complete onboarding step if first zone
    if (mapStore.zoneCount === 1) {
      onboardingStore.completeStep()
    }

    cancelDrawing()
    mapStore.viewMap()

  } else if (dialogMode.value === 'edit') {
    mapStore.updateZone(draftZone.value.id, {
      name: name,
      color: displayColor.value
    })

    resetDraft()
  }

  showZoneDialog.value = false
  dialogMode.value = null
}


// ======================
// Drag Actions
// ======================

const {
      startDragZone,
      startDragVertex,
      handleDragMove,
      stopDrag
} = useZoneDrag(existingZones)

watch(collisionError, (error) => {
  if (error){
    toast.add({
      severity: 'error',
      summary: 'Collision error',
      detail: error,
      life: 2000
    })
  }
  collisionError.value = null
})

// ======================
// Lifecycle
// ======================

onMounted(() => {
  mapStore.viewMap()
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="p-card-title">Create zones</div>
    <div class="p-card-subtitle">Draw polygons on the floor plan</div>
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
                    label="Create New Zone"
                    severity="success"
                    @click="onStartDrawing"
                />
                <Button
                    label="Edit Zones"
                    severity="success"
                    :disabled="!mapStore.hasZones"
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
                    v-if="isDrawing && isPolygonClosed"
                    label="Set Name & Color"
                    severity="success"
                    @click="onCompletePolygon"
                />
              </template>

              <!-- Edit Mode Buttons -->
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
              <!-- Drawing Mode: Show draft polygon -->
              <g v-if="mapStore.isDrawMode && !isPolygonClosed">
                <polyline
                    :points="polygonPath"
                    fill="none"
                    :stroke="displayColor"
                    stroke-width="6"
                    stroke-dasharray="16"
                />
                <circle
                    v-for="(point, i) in draftZone.points"
                    :key="i"
                    :cx="point.x"
                    :cy="point.y"
                    r="10"
                    :fill="displayColor"
                />
              </g>

              <!-- Drawing Mode: Show completed draft zone -->
              <zone-svg
                  v-if="mapStore.isDrawMode && isPolygonClosed && isDrawing"
                  :zone="draftZone"
                  :editModeActive="isPolygonClosed"
                  @zoneClick="startDragZone" @zoneVerticeClick="startDragVertex"
              />

              <!-- View/Edit Mode: Show saved zones -->
              <zone-svg
                  v-for="zone in mapStore.zones"
                  :key="zone.id"
                  :zone="zone"
                  :editModeActive="mapStore.isEditMode"
                  @zoneClick="startDragZone" @zoneVerticeClick="startDragVertex"
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

          <Tree
              v-if="mapStore.hasZones"
              :value="mapStore.zoneTreeNodes"
              class="!p-0 !m-0"
              selectionMode="single"
              :pt="{
                nodeLabel: {
                  class: '!w-full'
                },
              }"
          >
            <template #default="slotProps">
              <div class="flex flex-row space-x-2 justify-between items-center flex-1">
                <div class="flex flex-row space-x-2 items-center">
                  <div
                      class="h-4 w-4 rounded-sm "
                      :style="`background-color: ${slotProps.node.color}`"
                  />
                  <b>{{ slotProps.node.label }}</b>
                </div>
                <div class="flex flex-row bg-yellow-100">
                  <Button
                      icon="pi pi-pen-to-square"
                      variant="text"
                      rounded
                      aria-label="Edit"
                      @click="onEditZone(slotProps.node.id)"
                  />
                  <Button
                      icon="pi pi-trash"
                      severity="danger"
                      variant="text"
                      rounded
                      aria-label="Delete"
                      @click="onDeleteZone(slotProps.node.id)"
                  />
                </div>
              </div>
            </template>
          </Tree>
        </div>
      </div>
    </div>
  </div>

  <!-- Zone Information Dialog -->
  <Dialog
      v-model:visible="showZoneDialog"
      modal
      :header="dialogMode === 'create' ? 'Create New Zone' : 'Edit Zone'"
      :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Zone Information
    </span>

    <div class="flex items-center gap-4 mb-4">
      <label for="zoneName" class="font-semibold">Name</label>
      <div class="flex flex-col gap-1 w-full">
      <InputText
          id="zoneName"
          class="flex-auto"
          autocomplete="off"
          v-model="draftZone.name"
          :invalid="!draftZone.name"
      />
      <Message v-show="!draftZone.name" severity="error" variant="simple" size="small">Zone name is required</Message>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="zoneColor" class="font-semibold">Color</label>
      <ColorPicker
          inputId="zoneColor"
          v-model="colorInput"
          format="hex"
          pt:root:class="flex-1 flex !w-full"
          pt:preview:class="flex-1 !h-8 !w-full"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="showZoneDialog = false"
      />
      <Button
          type="button"
          label="Save"
          @click="onSaveZone"
      />
    </div>
  </Dialog>

  <ConfirmDialog />
  <Toast />
</template>

<style scoped>

</style>
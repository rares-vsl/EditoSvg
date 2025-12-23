<script setup>
import {useOnboardingStore} from '@/stores/onboarding'
import {InteractiveMapState, useInteractiveMap} from '@/stores/interactiveMap'

import FloorPlan from "@/components/Map/FloorPlan.vue";
import {computed, onMounted, ref} from "vue";
import ZoneSvg from "@/components/Map/ZoneSvg.vue";
import {zoneEditor} from "@/compostables/zoneEditor.js";
import Dialog from "primevue/dialog";
import {useConfirm, useToast} from "primevue";

const onboardingStore = useOnboardingStore()
const interactiveMapStore = useInteractiveMap()


const nodes = computed(() => {
  return interactiveMapStore.getZoneNodes
})

const floorPlanSvg = computed(() => interactiveMapStore.svgDataUrl);

//
const {
  currentPoints,
  pointConnectors,
  isZoneCompleted,
  zoneColor,
  realZoneColor,
  currentZone,
  zoneHandler,
  isShapeCompleted
} = zoneEditor()

// EDITOR

const isDrawingActive = computed(() => interactiveMapStore.state === InteractiveMapState.DRAW)
const isEditActive = computed(() => interactiveMapStore.state === InteractiveMapState.EDIT)
const cursorType = computed(() => {
  if (!isDrawingActive.value || isZoneCompleted.value)
    return "cursor-default"

  return "cursor-crosshair"
})

function startDrawing() {
  interactiveMapStore.startDrawing()
  zoneHandler.startDrawing()
}

function startEditing() {
  interactiveMapStore.startEditing()
}

function stopEditing() {
  interactiveMapStore.viewMap()
}

function stopDrawing() {
  interactiveMapStore.viewMap()

  zoneHandler.stopDrawing()
}
const showPanel = ref(false);
function createZone() {
  showPanel.value = true;
}

function handleClick(point) {
  if(isDrawingActive.value)
    zoneHandler.handleClick(point)
}

function saveZone(){
  if (!zoneName.value.trim()) {
    alert('Please enter a zone name');
    return;
  }

  if (!currentZone.value) {
    const zone = {
      id: zoneID.value,
      name: zoneName.value,
      color: realZoneColor.value,
    };

    interactiveMapStore.editZone(zone)
  }
  else{
    const newZone = {
      name: zoneName.value,
      ...currentZone.value
    };

    interactiveMapStore.addZone(newZone)
    zoneHandler.stopDrawing()

    if (interactiveMapStore.getNumberOfZones === 1)
      onboardingStore.completeStep()
  }



  showPanel.value = false;

}

onMounted(() => {
  interactiveMapStore.viewMap()
})

const draggedZone = ref(null);
const zoneName = ref("");
const draggedPointIndex = ref(null);
const dragStartPos = ref(null);
const isDragging = ref(false);

function handleZoneClick(id, point) {
  isDragging.value = true;
  draggedZone.value = id;
  dragStartPos.value = point
  console.log("handleZoneClick", id, point)
}

function handleMouseMove(point)  {
  if (!isDragging.value || !draggedZone.value || !dragStartPos.value) return;

  const currentPos = point;
  if (!currentPos) return;

  const dx = currentPos.x - dragStartPos.value.x;
  const dy = currentPos.y - dragStartPos.value.y;

  if (draggedPointIndex.value !== null) {
    // Move single point

    draggedZone.value.points[draggedPointIndex.value].x += dx;
    draggedZone.value.points[draggedPointIndex.value].y += dy;
  } else {
    // Move entire zone
    draggedZone.value.points.forEach(point => {
      point.x += dx;
      point.y += dy;
    });
  }

  dragStartPos.value = currentPos;
};

const handleMouseUp = () => {
  isDragging.value = false;
  draggedZone.value = null;
  draggedPointIndex.value = null;
  dragStartPos.value = null;
};

function handleZoneVerticeClick(id, verticle, point) {
  isDragging.value = true;
  draggedZone.value = id;
  draggedPointIndex.value = verticle;
  dragStartPos.value = point
  console.log("zoneVerticeClick", id, verticle, point)
}

const thereAreZone = computed(() => {
  return interactiveMapStore.hasZones;
})

const zoneID = ref(null)

function edit(id){
  const zone = interactiveMapStore.getZone(id)
  zoneID.value = id
  zoneName.value = zone.name
  zoneColor.value = zone.color
  showPanel.value = true

}
const confirm = useConfirm();
const toast = useToast();

const deleteZone  = (id) => {
  confirm.require({
    message: 'Do you want to delete this zone?',
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
      interactiveMapStore.deleteZone(id)
      if (interactiveMapStore.getNumberOfZones === 0)
        onboardingStore.uncompleteStep()
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => {
    }
  });
}


</script>

<template>
  <div class="flex flex-col justify-center items-center w-full space-y-2">
    <div class="p-card-title">Create zones</div>
    <div class="p-card-subtitle">Draw polygons on the floor plan</div>
  </div>
  <div class="flex justify-center flex-1 ">
    <div class="p-4 md:p-8 w-full lg:w-[1600px] flex flex-col justify-center items-center">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 w-full">
        <div class="lg:col-span-3">
          <div class="flex flex-col items-center space-y-4 w-full">
            <div class="flex justify-start border rounded-lg p-4 w-full space-x-3">
              <Button v-if="!isDrawingActive && !isEditActive" label="Create new zone" severity="success"
                      @click="startDrawing"/>
              <Button v-if="isDrawingActive" label="Done" severity="secondary"
                      @click="stopDrawing"/>

              <Button v-if="isZoneCompleted" label="Done" severity="success"
                      @click="createZone"/>

              <Button v-if="!isDrawingActive && !isEditActive" label="Edit map" severity="success" :disabled="!thereAreZone"
                      @click="startEditing"/>
              <Button v-if="isEditActive" label="Done" severity="success"
                      @click="stopEditing"/>
            </div>
            <Dialog v-model:visible="showPanel" modal :header="currentZone ? 'Create new zone' : 'Edit Zone'" :style="{ width: '25rem' }">
              <span class="text-surface-500 dark:text-surface-400 block mb-8">Zone information</span>
              <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Zone Name</label>
                <InputText id="username" class="flex-auto" autocomplete="off" v-model="zoneName" />
              </div>
              <div class="flex items-center gap-4 mb-8">
                <label for="colorZone" class="font-semibold w-24">Color</label>
                <ColorPicker inputId="colorZone" name="colorZone" v-model="zoneColor" format="hex" pt:root:class=" flex-1 flex"
                             pt:preview:class="flex-1 !h-8 !w-full"/>
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="showPanel = false"></Button>
                <Button type="button" label="Save" @click="saveZone"></Button>
              </div>
            </Dialog>
            <ConfirmDialog></ConfirmDialog>
            <Toast />
            <floor-plan
                :floor-plan-svg="floorPlanSvg"
                v-on:floorPlanClick="handleClick"
                :cursor="cursorType"
                v-on:floorPlanMouseMove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseUp"
            >
              <g v-if="isDrawingActive && !isZoneCompleted">
                <polyline
                    :points="pointConnectors.join(' ')"
                    fill="none"
                    :stroke="realZoneColor"
                    stroke-width="6"
                    stroke-dasharray="16"
                />
                <circle
                    v-for="(point, i) in currentPoints"
                    :key="i"
                    :cx="point.x"
                    :cy="point.y"
                    r="10"
                    :fill="realZoneColor"
                />
              </g>
              <zone-svg v-if="isZoneCompleted" :zone="currentZone" :editModeActive="isZoneCompleted"
                        v-on:zoneClick="handleZoneClick" v-on:zoneVerticeClick="handleZoneVerticeClick"/>
              <zone-svg v-for="zone in interactiveMapStore.zones" :zone="zone" :editModeActive="isEditActive"
                        v-on:zoneClick="handleZoneClick" v-on:zoneVerticeClick="handleZoneVerticeClick"/>
            </floor-plan>
          </div>
        </div>
        <div class="lg:col-span-1 space-y-6 border rounded-lg p-4">
          <h5>Floor plan structure</h5>
          <p class="m-0 text-gray-600">
            Here will be listed your zones
          </p>
          <Tree :value="nodes" class="!p-0 !m-0"
                selectionMode="single">
            <template #default="slotProps">
              <div class="flex flex-row space-x-2 items-center !w-full flex-1">
                <div class="h-4 w-4 rounded-sm" :style="`background-color: ${slotProps.node.color}`"></div>
                <b>{{ slotProps.node.label }}</b>
                <Button icon="pi pi-pen-to-square" variant="text" rounded aria-label="Edit" @click="edit(slotProps.node.id)" />
                <Button icon="pi pi-trash" severity="danger" variant="text" rounded aria-label="Delete" @click="deleteZone(slotProps.node.id)" />
              </div>
            </template>
          </Tree>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
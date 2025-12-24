<script setup>
import FloorPlan from "@/components/Map/FloorPlan.vue";
import DrawPolygonsButton from "@/components/Map/DrawPolygonsButton.vue";
import {useEditorDrawing} from "@/compostables/useEditorDrawing.js";
import {ref} from "vue";
import ZoneSvg from "@/components/Map/ZoneSvg.vue";

import {ZoneInformation} from "@/compostables/HandleZone.js";
import {zoneManager} from "@/compostables/zoneManager.js";

const svgUrl = new URL("@/assets/floorplan.svg", import.meta.url).href;

const zones = ref([
  {
    "name": "kitchen",
    "points": [
      {
        "x": 824.5523681640625,
        "y": 290.3343505859375
      },
      {
        "x": 1475.0836181640625,
        "y": 287.8031005859375
      },
      {
        "x": 1477.6148681640625,
        "y": 687.7406005859375
      },
      {
        "x": 824.5523681640625,
        "y": 682.6781005859375
      }
    ],
    "color": "3b82f6"
  },
  {
    "name": "bathroom",
    "points": [
      {
        "x": 556.2398681640625,
        "y": 290.3343811035156
      },
      {
        "x": 806.8336181640625,
        "y": 287.8031311035156
      },
      {
        "x": 814.4273681640625,
        "y": 675.0843505859375
      },
      {
        "x": 551.1773681640625,
        "y": 667.4906005859375
      }
    ],
    "color": "3b82f6"
  }
]);

const {
  isDrawingActive,
  startDrawing,
  stopDrawing,
  handleClick,
  cursorType
} = useEditorDrawing();

const {
  currentPoints,
  pointConnectors,
  isZoneCompleted,
  zoneColor,
  currentZone,
  zoneHandler,
  isShapeCompleted
} = zoneManager()

const {
  showZoneInfoPanel,
  zoneName,
  showZoneInformation,
  saveZoneInformation
} = ZoneInformation()


const saveZone = () => {
  const newZone = {
    id: Date.now().toString(),
    name: zoneName.value,
    points: [...currentPoints.value],
    color: zoneColor.value,
  };

  zones.value.push(newZone);

  saveZoneInformation()

}

const nodes = ref([{
  key: '0',
  color: "#3b82f6",
  label: "bathroom"
}])

</script>

<template>
  <div class="flex justify-center flex-1 space-x-12">
    <div class="w-full xl:max-w-[50vw]  max-h-[1000px] flex flex-col space-y-2">
      <div class="flex flex-row space-x-2 border rounded-lg p-4">
        <draw-polygons-button v-if="!isDrawingActive" label="Create new newZone" :disabled="isDrawingActive"
                              @click="() => startDrawing(zoneHandler)"/>
        <draw-polygons-button v-if="isDrawingActive" label="Finish drawing" :disabled="!isShapeCompleted"
                              @click="showZoneInformation"/>
        <Button label="Cancel" v-if="isDrawingActive" severity="secondary" :disabled="!isDrawingActive"
                @click="stopDrawing"/>
      </div>
      <floor-plan :floor-plan-svg-url="svgUrl" v-on:floorPlanClick="handleClick" :cursor="cursorType">
        <g v-if="isDrawingActive && !isZoneCompleted">
          <polyline
              :points="pointConnectors.join(' ')"
              fill="none"
              :stroke="'#'+zoneColor"
              stroke-width="6"
              stroke-dasharray="16"
          />
          <circle
              v-for="(point, i) in currentPoints"
              :key="i"
              :cx="point.x"
              :cy="point.y"
              r="10"
              :fill="'#'+zoneColor"
          />
        </g>
        <zone-svg v-if="isZoneCompleted" :zone="currentZone"/>
        <zone-svg v-for="newZone in zones" :zone="zone"/>
      </floor-plan>
    </div>
    <div class="w-[500px] xl:max-w-[30vw] flex">
      <div class="h-fit min-h-[200px] w-full">
        <p class="m-0">
          Here will be listed your zones
        </p>
        <Tree :value="nodes">
          <template #default="slotProps">
            <div class="flex flex-row space-x-2 items-center">
              <div class="h-4 w-4 rounded-sm" :style="`background-color: ${slotProps.node.color}`"></div>
              <b>{{ slotProps.node.label }}</b>
            </div>
          </template>
        </Tree>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
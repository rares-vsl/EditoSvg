
<script setup>
import svgContent from "@/assets/floorplan.svg?raw"
import Dialog from 'primevue/dialog';

import {computed, onMounted, ref} from "vue";

const svgViewBox = ref(null);
const svgWidth = ref(800);
const svgHeight = ref(600);

const zones = ref([
  {
    "name":"kitchen",
    "points":[
      {
        "x":824.5523681640625,
        "y":290.3343505859375
      },
      {
        "x":1475.0836181640625,
        "y":287.8031005859375
      },
      {
        "x":1477.6148681640625,
        "y":687.7406005859375
      },
      {
        "x":824.5523681640625,
        "y":682.6781005859375
      }
    ],
    "color":"3b82f6"
  },
  {
    "name":"bathroom",
    "points":[
      {
        "x":556.2398681640625,
        "y":290.3343811035156
      },
      {
        "x":806.8336181640625,
        "y":287.8031311035156
      },
      {
        "x":814.4273681640625,
        "y":675.0843505859375
      },
      {
        "x":551.1773681640625,
        "y":667.4906005859375
      }
    ],
    "color":"3b82f6"
  }
]);
const isDrawing = ref(false);
const editMode = ref(false);
const currentPoints = ref([]);

const zoneName = ref('');
const zoneColor = ref('3b82f6');
const svgRef = ref(null);

const showPanel = ref(false);
const showEditPanel = ref(false);

const aspectRatio = computed(() => svgWidth.value / svgHeight.value);

const lines = ref([])


function startDrawing(){
  console.log("startDrawing");

  isDrawing.value = true;
  currentPoints.value = [];
  zoneName.value = '';
  zoneColor.value = '3b82f6';
}

const getSvgPoint = (event) => {
  if (!svgRef.value) return null;

  const svg = svgRef.value;
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
  return { x: svgP.x, y: svgP.y };
};

const handleSvgClick = (event) => {
  if (!isDrawing.value) return;

  const point = getSvgPoint(event);

  if (!point) return;

  lines.value.push(point.x + ", "+ point.y);
  const nearby = findNearbyPoint(point);

  if (!nearby) {
    currentPoints.value.push(point);
  }

};

const findNearbyPoint = (point) => {
  if (currentPoints.value.length < 3) return null;

  for (let i = 0; i < currentPoints.value.length; i++) {
    const existingPoint = currentPoints.value[i];
    console.log(existingPoint);
    const distance = Math.sqrt(
        Math.pow(point.x - existingPoint.x, 2) +
        Math.pow(point.y - existingPoint.y, 2)
    );

    if (distance < 20) {
      return { point: existingPoint, index: i };
    }
  }

  return null;
};

const finishDrawing = () => {

  if (currentPoints.value.length < 3) {
    alert('A zone must have at least 3 points');
    return;
  }
  showPanel.value = true;
};

const saveZone = () => {
  if (!zoneName.value.trim()) {
    alert('Please enter a zone name');
    return;
  }

  const newZone = {
    name: zoneName.value,
    points: [...currentPoints.value],
    color: zoneColor.value,
  };
  zones.value.push(newZone);
  currentPoints.value = [];
  lines.value = [];

  isDrawing.value = false;
  showPanel.value = false;

}

const pointsToPath = (points) => {
  if (points.length === 0) return '';
  return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
};

const startEdit = () =>{
  editMode.value = !editMode.value ;
}

const draggedZone = ref(null);
const draggedPointIndex = ref(null);
const dragStartPos = ref(null);
const isDragging = ref(false);

const handleMouseDown = (event, zone, pointIndex = null) => {
  if (!editMode.value) return;

  event.stopPropagation();
  isDragging.value = true;
  draggedZone.value = zone;
  draggedPointIndex.value = pointIndex;
  dragStartPos.value = getSvgPoint(event);
};

const handleMouseMove = (event) => {
  if (!isDragging.value || !draggedZone.value || !dragStartPos.value) return;

  const currentPos = getSvgPoint(event);
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

const selectedId = ref(null);

const handleZoneRightClick = (event, zoneId) => {
  console.log("Click")
  selectedId.value = zoneId;
  abc.value.show(event);
};

const abc = ref();


const items = ref([
  {
    label: 'Edit zone',
    icon: 'pi pi-pen-to-square',
    command: () => {
      showPanel.value = true
    }
  },
  {
    label: 'Delete zone',
    icon: 'pi pi-trash',
    command: () => {
      console.log('delete');
    }
  }
]);

onMounted(() => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (svgElement) {
    const viewBox = svgElement.getAttribute('viewBox');
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');

    if (viewBox) {
      svgViewBox.value = viewBox;
      const [, , w, h] = viewBox.split(' ').map(Number);
      svgWidth.value = w;
      svgHeight.value = h;
    } else if (width && height) {
      // Create viewBox from width/height
      const w = parseFloat(width);
      const h = parseFloat(height);
      svgViewBox.value = `0 0 ${w} ${h}`;
    } else {
      const bbox = svgElement.getBBox?.();
      if (bbox) {
        svgViewBox.value = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
      }
    }
  }
});

</script>

<template>
  <div class="flex flex-col justify-between flex-1 h-full">
    <div class="flex-1 flex flex-col">
      <h2 class="mb-4">Floor Plan Viewer2</h2>

      <div class="flex-1 flex flex-col">
        <div class="flex flex-row space-x-2">

          <Button @click="startDrawing" label="Create a new zone" :disabled="isDrawing || editMode " severity="success" />
          <Button v-if="isDrawing" @click="finishDrawing" label="Finish drawing" severity="secondary" />
          <Button v-if="isDrawing" @click="isDrawing = false" label="Cancel" severity="secondary" />

          <Button v-if="!isDrawing" @click="startEdit" :label="editMode ? 'Exit Edit Mode': 'Edit the map'" :disabled="isDrawing || zones.length === 0" :severity="editMode ? 'info' : 'success' " />

          <Dialog v-model:visible="showPanel" modal header="Create new zone" :style="{ width: '25rem' }">
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


        </div>
        <div class="flex justify-center items-center flex-1">
          <svg
              ref="svgRef"
              @click="handleSvgClick"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
              class="h-[800px] w-auto"
              :class="{'cursor-crosshair': isDrawing || editMode}"
              :viewBox="svgViewBox"
              preserveAspectRatio="xMidYMid meet">
            <g v-html="svgContent">

            </g>

            <!-- Editor: show zone structure  -->
            <g v-if="isDrawing && currentPoints.length > 0">
              <polyline
                  :points="lines.join(' ')"
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
            <!--      end      -->
            <!-- show zones -->
            <g
                v-for="zone in zones"
                :key="zone.id"
                @mousedown="editMode ? handleMouseDown($event, zone) : null"
                @contextmenu="handleZoneRightClick($event, zone.id)"
                :style="{ cursor: editMode ? 'move' : 'pointer' }"
            >
              <path
                  :d="pointsToPath(zone.points)"
                  :fill="'#'+zone.color"
                  fill-opacity="0.4"
                  :stroke="'#'+zone.color"
                  stroke-width="2"
              />
              <g v-if="editMode">
                <circle
                    v-for="(point, i) in zone.points"
                    :key="i"
                    :cx="point.x"
                    :cy="point.y"
                    r="12"
                    :fill="'#'+zone.color"
                    stroke="white"
                    stroke-width="3"
                    style="cursor: pointer"
                    @mousedown="handleMouseDown($event, zone, i)"
                />
              </g>
              <text
                  :x="zone.points.reduce((sum, p) => sum + p.x, 0) / zone.points.length"
                  :y="zone.points.reduce((sum, p) => sum + p.y, 0) / zone.points.length"
                  text-anchor="middle"
                  fill="#000"
                  font-size="28"
                  font-weight="bold"
                  pointer-events="none"
              >
                {{ zone.id}}
              </text>
            </g>

          </svg>
          <ContextMenu ref="abc" :model="items">
            <template #item="{ item, props }">
              <a class="flex items-center" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                <i v-if="item.items" class="pi pi-angle-right ml-auto"></i>
              </a>
            </template>
          </ContextMenu>
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-end mt-4">
      <Button label="Next" :disabled="true"/>
    </div>
  </div>

</template>

<style scoped>

</style>
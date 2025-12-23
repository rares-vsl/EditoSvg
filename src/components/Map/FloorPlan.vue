<script setup>
import {onMounted, ref} from "vue";
import {getSvgViewBox} from '@/compostables/getSvgViewBox'
import { provide  } from 'vue';

const props = defineProps({
  floorPlanSvgUrl: {
    type: String
  },
  floorPlanSvg: {
    type: String
  },
  cursor: String
});

const emit = defineEmits(['floorPlanClick', 'floorPlanMouseMove'])
const svgRef = ref(null);

const getSvgPoint = (event) => {
  if (!svgRef.value) return null;

  const svg = svgRef.value;
  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

  return { x: svgP.x, y: svgP.y };
};


const svgClick = (event) => {
  if (!svgRef.value) return null;

  const point = getSvgPoint(event);

  emit("floorPlanClick", point);
}


const svgMouseMove = (event) => {
  if (!svgRef.value) return null;

  const point = getSvgPoint(event);

  emit("floorPlanMouseMove", point);
}

const viewBox = ref(null);
const svgContent = ref("")

onMounted(async () => {
  if(props.floorPlanSvgUrl)
  {
    const response = await fetch(props.floorPlanSvgUrl);
    svgContent.value = await response.text();
    viewBox.value = getSvgViewBox(svgContent.value);
  }
  else{
    svgContent.value = props.floorPlanSvg;
    viewBox.value = getSvgViewBox(svgContent.value);
  }
});

provide('floorPlan', {
  getSvgPoint,
  svgRef
});

</script>

<template>
  <svg
      ref="svgRef"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="h-full w-full"
  >
    <g :class="cursor"
       @click="svgClick"
       @mousemove="svgMouseMove"
    >
      <g v-html="svgContent"

      />
      <slot>

      </slot>
    </g>
  </svg>
</template>

<style scoped>

</style>
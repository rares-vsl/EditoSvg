<script setup>
import {computed, onMounted, ref} from "vue";
import {getSvgViewBox} from '@/compostables/getSvgViewBox'
import { provide  } from 'vue';

const props = defineProps({
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

onMounted(() => {

});

const svgContent = computed(() => props.floorPlanSvg || "");
const viewBox = computed(() => getSvgViewBox(svgContent.value));

provide('floorPlan', {
  getSvgPoint,
  svgRef
});


const xxx = computed(()=> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(props.floorPlanSvg, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) return null;

  return svgEl;
})

const modifiedSvg = computed(() => {
  if (!props.floorPlanSvg) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(props.floorPlanSvg, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) return props.floorPlanSvg;

  // Set width and height to 100%
  svgEl.setAttribute('width', '100%');
  svgEl.setAttribute('height', '100%');

  // Return the modified SVG as string
  return new XMLSerializer().serializeToString(svgEl);
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
      <g v-html="modifiedSvg"
      />
      <g>
        <slot name="zones" />
      </g>
      <g>
        <slot name="hookups" />
      </g>

      <slot>

      </slot>
    </g>
  </svg>
</template>

<style scoped>

</style>
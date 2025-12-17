<script setup>
import {onMounted, ref} from "vue";
import {getSvgViewBox} from '@/compostables/getSvgViewBox'
import ZoneSvg from "@/components/Map/ZoneSvg.vue";

const props = defineProps({
  floorPlanSvgUrl: {
    type: String,
    required: true
  },
  cursor: String
});

const emit = defineEmits(['floorPlanClick'])
const svgRef = ref(null);

const svgClick = (event) => {
  if (!svgRef.value) return null;

  const svg = svgRef.value;
  const pt = svg.createSVGPoint();

  pt.x = event.clientX;
  pt.y = event.clientY;

  const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

  const point = {x: svgP.x, y: svgP.y};

  emit("floorPlanClick", point);
}

const viewBox = ref(null);
const svgContent = ref("")

onMounted(async () => {
  const response = await fetch(props.floorPlanSvgUrl);
  svgContent.value = await response.text();
  viewBox.value = getSvgViewBox(svgContent.value);
});


</script>

<template>
  <svg
      ref="svgRef"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      class="h-full w-full bg-red-400"
  >
    <g :class="cursor"
       @click="svgClick">
      <g v-html="svgContent"

      />
      <slot>

      </slot>
    </g>
  </svg>
</template>

<style scoped>

</style>
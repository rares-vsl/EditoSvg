<script setup>
const props = defineProps({
  zone: {
    type: Object,
    required: true,
  },
  editModeActive: Boolean,
})
import { inject } from 'vue';
const floorPlan = inject('floorPlan');

const emit = defineEmits(['zoneClick', 'zoneVerticeClick'])

const pointsToPath = (points) => {
  if (points.length === 0) return '';
  return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
};

const zoneClick = (event, zoneID, pointID = null) => {
  console.log(pointID);
  //console.log(props.editModeActive);
  if (!props.editModeActive) return;

  event.stopPropagation();
  const p = floorPlan.getSvgPoint(event);

  if(pointID != null){
    console.log("emit zoneVerticeClick");
    emit('zoneVerticeClick', zoneID, pointID, p);
    return;
  }

  console.log("emit zoneClick");
  emit('zoneClick', zoneID, p);

}

</script>

<template>
  <g
      :key="zone.id"
      @mousedown="props.editModeActive ? zoneClick($event, zone) : null"
      :class="{'cursor-move': props.editModeActive}">
    <path
        :d="pointsToPath(props.zone.points)"
        :fill="zone.color"
        fill-opacity="0.4"
        :stroke="zone.color"
        stroke-width="2"
    />

    <g v-if="props.editModeActive">
      <circle
          v-for="(point, i) in zone.points"
          :key="i"
          :cx="point.x"
          :cy="point.y"
          r="15"
          :fill="zone.color"
          stroke="white"
          stroke-width="3"
          style="cursor: pointer"
          @mousedown="zoneClick($event, zone, i)"
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
      {{ zone.name }}
    </text>
  </g>
</template>

<style scoped>

</style>
<script setup>
const props = defineProps({
  zone: {
    type: Object,
    required: true,
  }
})

const pointsToPath = (points) => {
  if (points.length === 0) return '';
  return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
};

</script>

<template>
  <g>
    <path
        :d="pointsToPath(props.zone.points)"
        :fill="'#'+zone.color"
        fill-opacity="0.4"
        :stroke="'#'+zone.color"
        stroke-width="2"
    />
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
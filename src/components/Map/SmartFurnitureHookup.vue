<script setup>
import ElectricityIcon from "@/components/ElectricityIcon.vue";
import {UtilityType} from "@/compostables/UtilityType.js";
import GasIcon from "@/components/GasIcon.vue";
import WaterIcon from "@/components/WaterIcon.vue";
import {computed} from "vue";

const props = defineProps({
  smartFurnitureHookup: {
    type: Object,
    required: true
  },
  editModeActive: Boolean,
})
import {inject} from 'vue';
const floorPlan = inject('floorPlan');

const emit = defineEmits(['hookupClick'])

const hookupClick = (event, hookup = null) => {
  if (!props.editModeActive) return;

  event.stopPropagation();
  const p = floorPlan.getSvgPoint(event);

  emit('hookupClick', hookup, p);
  console.log("emit event, p:", p);

}

const color = computed(() => {
  return props.smartFurnitureHookup.consumptionValue > 0 ? "#008000" : "#808080";
})

</script>

<template>
  <g
      @mousedown="props.editModeActive ? hookupClick($event, props.smartFurnitureHookup) : null"
      :class="{'cursor-move': props.editModeActive}"
      :transform="`translate(${props.smartFurnitureHookup.position.x}, ${props.smartFurnitureHookup.position.y})`">
    <g :transform="`scale(2)`">
      <electricity-icon
          v-if="props.smartFurnitureHookup.utilityType === UtilityType.ELECTRICITY"
          :fill="color"/>
      <gas-icon v-else-if="props.smartFurnitureHookup.utilityType === UtilityType.GAS"
                :fill="color"/>
      <water-icon v-else-if="props.smartFurnitureHookup.utilityType === UtilityType.WATER"
                  :fill="color"/>
      <circle v-else
              r="8"
              :fill="props.color"
      />

    </g>
  </g>
</template>

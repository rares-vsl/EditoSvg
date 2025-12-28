<script setup>
import {computed} from 'vue'
import Tree from 'primevue/tree'
import FloorPlanTreeSidebarNode from "@/components/FloorPlanTreeSidebarNode.vue";

const props = defineProps({
  tree: {
    type: Array,
    required: true
  },
  hasZones: Boolean,
  hasZoneActions: {
    type: Boolean,
    default: false
  },
  disableActionsZone: {
    type: Boolean,
    default: false
  },
  hasSmartFurnitureHookupActions: {
    type: Boolean,
    default: false
  },
  disableActionsSmartFurnitureHookup: {
    type: Boolean,
    default: false

  }
})

const emit = defineEmits(['editZone', 'deleteZone', 'editSmartFurnitureHookup', 'deleteSmartFurnitureHookup'])

const expandedKeys = computed(() =>
    Object.fromEntries(props.tree.map(node => [node.key, true]))
)
</script>

<template>
  <div class="space-y-6 border rounded-lg p-4">
    <h5>Floor Plan Zones</h5>

    <Tree :value="tree"
          :expandedKeys="expandedKeys"
          class="!p-0 !m-0"
          selectionMode="single"
          :pt="{
            nodeLabel: {
              class: '!w-full'
            },
          }"
    >
      <template #default="slotProps">
        <div class="flex flex-row space-x-2 items-center">
          <b>{{ slotProps.node.label }}</b>
        </div>
      </template>

      <template #zone="slotProps">
        <floor-plan-tree-sidebar-node :label="slotProps.node.label" :color="slotProps.node.color" indicatorClass="rounded-sm">
          <template #actions v-if="props.hasZoneActions">
            <Button
                icon="pi pi-pen-to-square"
                variant="text"
                rounded
                aria-label="Edit"
                :disabled="disableActionsZone"
                @click="emit('editZone', slotProps.node.id)"
            />
            <Button
                icon="pi pi-trash"
                severity="danger"
                variant="text"
                rounded
                aria-label="Delete"
                :disabled="disableActionsZone"
                @click="emit('deleteZone', slotProps.node.id)"
            />
          </template>
        </floor-plan-tree-sidebar-node>
      </template>
      <template #smart-furniture-hookup="slotProps">
        <floor-plan-tree-sidebar-node
            :label="slotProps.node.label" :color="slotProps.node.isActive ? 'green' : 'gray'"
            indicatorClass="rounded-lg">
          <template #actions v-if="props.hasSmartFurnitureHookupActions">
            <Button
                icon="pi pi-pen-to-square"
                variant="text"
                rounded
                aria-label="Edit"
                :disabled="disableActionsSmartFurnitureHookup"
                @click="emit('editSmartFurnitureHookup', slotProps.node.id)"
            />
            <Button
                icon="pi pi-trash"
                severity="danger"
                variant="text"
                rounded
                aria-label="Delete"
                :disabled="disableActionsSmartFurnitureHookup"
                @click="emit('deleteSmartFurnitureHookup', slotProps.node.id)"
            />
          </template>
        </floor-plan-tree-sidebar-node>
      </template>
      <template #empty>
        {{ props.hasZones ? 'Manage your zones below' : 'No zones created yet' }}
      </template>
    </Tree>
  </div>
</template>

<style scoped>

</style>
<script setup>
import Dialog from "primevue/dialog";
import {computed} from "vue";

const props = defineProps({
  isOnDrawMode: Boolean
})

const zone = defineModel('zone', { type: Object });
const visible = defineModel('visible', { type: Boolean, default: false });
const colorInput = defineModel('colorInput', { type: String });

const emit = defineEmits(['hide', 'save', 'cancel'])

const dialogTitle = computed(() =>
    props.isOnDrawMode ? 'Create new zone' : 'Edit zone'
)
</script>

<template>
  <Dialog
      v-model:visible="visible"
      modal
      :header="dialogTitle"
      :style="{ width: '25rem' }"
      @hide="emit('hide')"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Zone Information
    </span>

    <div class="flex items-center gap-4 mb-4">
      <label for="zoneName" class="font-semibold">Name</label>
      <div class="flex flex-col gap-1 w-full">
        <InputText
            id="zoneName"
            class="flex-auto"
            autocomplete="off"
            v-model="props.zone.name"
            :invalid="!props.zone.name"
        />
        <Message v-show="!props.zone.name" severity="error" variant="simple" size="small">Zone name is required
        </Message>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="zoneColor" class="font-semibold">Color</label>
      <ColorPicker
          inputId="zoneColor"
          v-model="colorInput"
          format="hex"
          pt:root:class="flex-1 flex !w-full"
          pt:preview:class="flex-1 !h-8 !w-full"
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="emit('cancel')"
      />
      <Button
          type="button"
          label="Save"
          @click="emit('save')"
      />
    </div>
  </Dialog>
</template>

<style scoped>

</style>
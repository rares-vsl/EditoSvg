<script setup>
import Dialog from "primevue/dialog";
import {computed} from "vue";
import {UtilityType} from "@/compostables/UtilityType.js";

const props = defineProps({
  isOnDrawMode: Boolean,
})

const smartFurnitureHookup = defineModel('smartFurnitureHookup', { type: Object });
const visible = defineModel('visible', { type: Boolean, default: false });
const loading = defineModel('loading', { type: Boolean });

const emit = defineEmits(['hide', 'fetchInfo', 'save', 'cancel'])

const dialogTitle = computed(() =>
    props.isOnDrawMode ? 'Create new smart furniture hookup' : 'Edit Zone'
)
</script>

<template>
  <Dialog
      v-model:visible="visible"
      modal
      :header="dialogTitle"
      :style="{ width: '35rem' }"
      @hide="emit('hide')"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Smart furniture hookup information
    </span>

    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupEndpoint"
             class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Endpoint</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <InputText id="smartFurnitureHookupEndpoint" autocomplete="off" type="text" class="w-full"
                   v-model="smartFurnitureHookup.endpoint"
                   :invalid="!smartFurnitureHookup.endpoint"
        />
        <Button :disabled="!smartFurnitureHookup.endpoint" :loading="loading"
                icon="pi pi-link" aria-label="Connect" class="col-span-12 md:col-span-10"
                @click="emit('fetchInfo')"/>
      </div>
      <Message class="col-span-12"
               v-show="!smartFurnitureHookup.endpoint" severity="error" variant="simple" size="small">Endpoint is
        required
      </Message>
    </div>


    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupName" class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Name</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <InputText id="smartFurnitureHookupName" autocomplete="off" type="text" class="w-full"
                   v-model="smartFurnitureHookup.name"
                   :invalid="!smartFurnitureHookup.name"
        />
      </div>
      <Message class="col-span-12"
               v-show="!smartFurnitureHookup.name" severity="error" variant="simple" size="small">Name is required
      </Message>
    </div>

    <div class="grid grid-cols-12 gap-2 mb-4">
      <label for="smartFurnitureHookupUtilityType"
             class="flex items-center col-span-12 md:col-span-2 md:mb-0 font-semibold">Utility type</label>
      <div class="col-span-12 md:col-span-10 w-full flex space-x-4">
        <Select v-model="smartFurnitureHookup.utilityType" class="w-full"
                :invalid="!smartFurnitureHookup.utilityType"
                :options="Object.values(UtilityType)" id="smartFurnitureHookupUtilityType"
                placeholder="Select a utility type"/>
      </div>
      <Message class="col-span-12"
               v-show="!smartFurnitureHookup.utilityType" severity="error" variant="simple" size="small">Utility
        type is required
      </Message>
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
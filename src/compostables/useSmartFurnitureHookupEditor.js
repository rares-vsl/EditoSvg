import {computed, ref} from "vue";

export function useSmartFurnitureHookupEditor() {
    const draftSmartFurnitureHookup = ref({})
    const isPositioned = ref(false)
    const smartFurnitureHookupDialog = ref(false)
    const currentMode = ref(null)

    const isSmartFurnitureHookupOnDrawMode = computed(() => currentMode.value === "create")
    const isSmartFurnitureHookupOnEditMode = computed(() => currentMode.value === "edit")

    function resetState() {
        draftSmartFurnitureHookup.value = {
            id: null,
            name: "",
            position: null,
            utilityType: "",
            endpoint: ""
        }
        isPositioned.value = false
        smartFurnitureHookupDialog.value = false
        currentMode.value = null
    }

    function startDrawing() {
        resetState()
        currentMode.value = "create"
    }

    function stopDrawing() {
        resetState()
    }

    function positionSmartFurnitureHookup(point) {
        if (!point || isPositioned.value) return

        draftSmartFurnitureHookup.value.position = point

        isPositioned.value = true
    }

    function finalizeSmartFurnitureHookup() {
        const newSmartFurnitureHookup = {
            ...draftSmartFurnitureHookup.value,
            id: Date.now().toString(),
            name: draftSmartFurnitureHookup.value.name.trim(),
        }

        resetState()
        currentMode.value = "create"

        return newSmartFurnitureHookup
    }

    function goToSetup() {
        smartFurnitureHookupDialog.value = true
        currentMode.value = "create"
    }

    function loadSmartFurnitureHookupForEdit(smartFurnitureHookup) {
        draftSmartFurnitureHookup.value = {
            id: smartFurnitureHookup.id,
            name: smartFurnitureHookup.name,
            position: smartFurnitureHookup.position,
            utilityType: smartFurnitureHookup.utilityType,
            endpoint: smartFurnitureHookup.endpoint
        }

        isPositioned.value = true

        smartFurnitureHookupDialog.value = true
        currentMode.value = "edit"
    }

    function doneEditingSmartFurnitureHookup() {
        resetState()
    }

    function hideSmartFurnitureHookupDialog(){
        if (isSmartFurnitureHookupOnEditMode.value){
            resetState()
        }
    }

    return {
        draftSmartFurnitureHookup,
        isPositioned,
        smartFurnitureHookupDialog,

        isSmartFurnitureHookupOnDrawMode,
        isSmartFurnitureHookupOnEditMode,

        startDrawing,
        stopDrawing,
        positionSmartFurnitureHookup,
        finalizeSmartFurnitureHookup,
        goToSetup,
        loadSmartFurnitureHookupForEdit,
        doneEditingSmartFurnitureHookup,
        hideSmartFurnitureHookupDialog,
    }
}
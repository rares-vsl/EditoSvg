import {ref} from "vue";

export function useSmartFurnitureHookupDrawing() {
    const draftSmartFurnitureHookup = ref({
        id: null,
        name: "",
        position: null,
        utilityType: "",
        endpoint: ""
    })
    const isPositioned = ref(false)

    function resetDraft() {
        draftSmartFurnitureHookup.value = {
            id: null,
            name: "",
            position: null,
            utilityType: "",
            endpoint: ""
        }
        isPositioned.value = false
    }

    function startDrawing() {
        resetDraft()
    }

    function cancelDrawing() {
        resetDraft()
    }

    function positionNewSFH(point) {
        if (!point || isPositioned.value) return

        draftSmartFurnitureHookup.value.position = point

        isPositioned.value = true
    }

    function finalizeHookup(zone){
        return {
            ...draftSmartFurnitureHookup.value,
            id: Date.now().toString(),
            name: draftSmartFurnitureHookup.value.name.trim(),
            zone: zone
        }
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
    }

    return {
        draftSmartFurnitureHookup,
        isPositioned,
        resetDraft,
        loadSmartFurnitureHookupForEdit,
        startDrawing,
        cancelDrawing,finalizeHookup,
        positionNewSFH
    }
}
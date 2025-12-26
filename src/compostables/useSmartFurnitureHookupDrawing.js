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

    return {
        draftSmartFurnitureHookup,
        isPositioned,
        startDrawing,
        cancelDrawing,finalizeHookup,
        positionNewSFH
    }
}
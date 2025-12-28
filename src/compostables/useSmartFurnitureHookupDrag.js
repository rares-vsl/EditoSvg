import {ref} from "vue";
import {useHookupZoneDetection} from "@/compostables/useHookupZoneDetection.js";

export function useSmartFurnitureHookupDrag(existingZones) {
    const {findZoneForHookup} = useHookupZoneDetection(existingZones)

    const dragState = ref({
        isDragging: false,
        hookup: null,
        startPosition: null
    })

    function startDragSmartFurnitureHookup(hookup, position) {
        dragState.value = {
            isDragging: true,
            hookup: hookup,
            startPosition: {...position}
        }
    }

    function handleDragMove(currentPosition) {
        if (!dragState.value.isDragging || !dragState.value.startPosition) {
            return
        }

        const dx = currentPosition.x - dragState.value.startPosition.x
        const dy = currentPosition.y - dragState.value.startPosition.y

        dragState.value.hookup.position.x += dx
        dragState.value.hookup.position.y += dy

        dragState.value.startPosition = {...currentPosition}
    }

    function stopDrag() {
        if (!dragState.value.isDragging) return

        if (dragState.value.hookup.id) {
            dragState.value.hookup.zone = findZoneForHookup(dragState.value.hookup)
        }

        dragState.value = {
            isDragging: false,
            hookup: null,
            startPosition: null
        }
    }

    return {
        startDragSmartFurnitureHookup,
        handleDragMove,
        stopDrag
    }
}
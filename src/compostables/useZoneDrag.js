import { ref } from 'vue'
import {useZoneCollision} from "@/compostables/useZoneCollision.js";

export function useZoneDrag(existingZones) {
    const dragCollisionError = ref(null)

    const dragState = ref({
        isDragging: false,
        zone: null,
        vertexIndex: null,
        startPosition: null
    })

    function startDragZone(zone, position) {
        dragState.value = {
            isDragging: true,
            zone: zone,
            vertexIndex: null,
            startPosition: { ...position }
        }
    }

    function startDragVertex(zone, vertexIndex, position) {
        dragState.value = {
            isDragging: true,
            zone: zone,
            vertexIndex: vertexIndex,
            startPosition: { ...position }
        }
    }
    const collision = useZoneCollision()
    function handleDragMove(currentPosition) {
        if (!dragState.value.isDragging || !dragState.value.startPosition) {
            return
        }

        const dx = currentPosition.x - dragState.value.startPosition.x
        const dy = currentPosition.y - dragState.value.startPosition.y
        let validation

        if (dragState.value.vertexIndex !== null) {
            // Moving a single vertex
            const newVertexPosition = {
                x: dragState.value.zone.points[dragState.value.vertexIndex].x + dx,
                y: dragState.value.zone.points[dragState.value.vertexIndex].y + dy
            }

            validation = collision.canMoveVertex(
                dragState.value.zone,
                dragState.value.vertexIndex,
                newVertexPosition,
                existingZones.value
            )
        } else {
            validation = collision.canMoveZone(
                dragState.value.zone,
                dx,
                dy,
                existingZones.value
            )
        }

        if (!validation.valid) {
            dragCollisionError.value = validation.reason
            return
        }

        if (dragState.value.vertexIndex !== null) {
            // Move single vertex
            const point = dragState.value.zone.points[dragState.value.vertexIndex]
            point.x += dx
            point.y += dy
        } else {
            dragState.value.zone.points.forEach(point => {
                point.x += dx
                point.y += dy
            })
        }

        dragState.value.startPosition = { ...currentPosition }
    }

    function stopDrag() {
        dragState.value = {
            isDragging: false,
            zone: null,
            vertexIndex: null,
            startPosition: null
        }

        dragCollisionError.value = null
    }

    return {
        startDragZone,
        startDragVertex,
        handleDragMove,
        stopDrag
    }
}
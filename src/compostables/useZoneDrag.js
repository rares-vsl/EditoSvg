import { ref } from 'vue'
import {useZoneCollision} from "@/compostables/useZoneCollision.js";

export function useZoneDrag(existingZones, existingSmartFurnitureHookups) {

    const dragState = ref({
        isDragging: false,
        zone: null,
        vertexIndex: null,
        startPosition: null
    })

    const collision = useZoneCollision()

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

            // Prevent attaching hookups to a non-final zone
            if (dragState.value.zone.id)
            {
                existingSmartFurnitureHookups.value.filter((sfh) => sfh.zone === dragState.value.zone.id).forEach((sfh) => {
                    sfh.position.x += dx
                    sfh.position.y += dy
                })
            }
        }

        dragState.value.startPosition = { ...currentPosition }
    }

    function stopDrag() {
        if (!dragState.value.isDragging) return

        for (const sfh of existingSmartFurnitureHookups.value) {
            if (collision.isPointInPolygon(sfh.position, dragState.value.zone.points)) {
                sfh.zone =  dragState.value.zone.id
            } else if(sfh.zone && sfh.zone === dragState.value.zone.id) {
                sfh.zone = null
            }
        }

        dragState.value = {
            isDragging: false,
            zone: null,
            vertexIndex: null,
            startPosition: null
        }

    }

    return {
        startDragZone,
        startDragVertex,
        handleDragMove,
        stopDrag
    }
}
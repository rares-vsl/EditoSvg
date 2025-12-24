import { ref, computed } from 'vue'
import { useZoneCollision } from './useZoneCollision'

export function useZoneDrawing(existingZones) {
    const collision = useZoneCollision()

    const draftZone = ref({
        id: null,
        name: "",
        points: [],
        color: "" // Default blue color
    })

    const isPolygonClosed = ref(false)
    const isDrawing = ref(false)

    const colorInput =  ref("3b82f6")

    // Computed polygon path for SVG polyline
    const polygonPath = computed(() =>
        draftZone.value.points.map(p => `${p.x},${p.y}`).join(' ')
    )

    const displayColor = computed(() => `#${colorInput.value}`)

    // Start a new drawing session
    function startDrawing() {
        resetDraft()
        isDrawing.value = true
    }

    // Stop drawing and clear
    function cancelDrawing() {
        resetDraft()
        isDrawing.value = false
    }

    // Add a point to the polygon
    function addPoint(point) {
        if (!point || isPolygonClosed.value) return

        const pointValidation = collision.canAddPoint(
            point,
            existingZones.value
        )
        if (!pointValidation.valid) {
            console.log(pointValidation.reason)
            return
        }

        const nearbyPoint = findNearbyPoint(point, draftZone.value.points[0])

        if (nearbyPoint && draftZone.value.points.length >= 3) {
            const zoneValidation = collision.canCreateZone(
                draftZone.value.points,
                existingZones.value
            )

            if (!zoneValidation.valid) {
                console.log(zoneValidation.reason)
                return
            }

            isPolygonClosed.value = true
            return
        }

        draftZone.value.points.push({ x: point.x, y: point.y })
    }

    function findNearbyPoint(point, targetPoint) {
        if (!targetPoint) return false

        const distance = Math.sqrt(
            Math.pow(point.x - targetPoint.x, 2) +
            Math.pow(point.y - targetPoint.y, 2)
        )

        return distance < 20
    }

    function finalizeZone() {
        return {
            id: Date.now().toString(),
            name: draftZone.value.name,
            points: [...draftZone.value.points],
            color: displayColor.value,
        }
    }

    function resetDraft() {
        draftZone.value = {
            id: null,
            name: "",
            points: [],
            color: displayColor
        }
        colorInput.value =  "3b82f6"
        isPolygonClosed.value = false
    }

    function loadZoneForEdit(zone) {
        draftZone.value = {
            id: zone.id,
            name: zone.name,
            points: [...zone.points],
            color: zone.color
        }
        isPolygonClosed.value = true
        isDrawing.value = false
        colorInput.value = zone.color
    }

    return {
        // State
        draftZone,
        colorInput,
        isPolygonClosed,
        isDrawing,
        polygonPath,
        displayColor,

        // Actions
        startDrawing,
        cancelDrawing,
        addPoint,
        finalizeZone,
        resetDraft,
        loadZoneForEdit
    }
}
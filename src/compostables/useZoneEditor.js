import {computed, ref} from 'vue'
import {useZoneCollision} from './useZoneCollision'

export function useZoneEditor(existingZones) {
    const collision = useZoneCollision()

    const draftZone = ref({})
    const isPolygonClosed = ref(false)
    const colorInput = ref("")
    const collisionError = ref(null)

    const zoneDialog = ref(false)
    const currentMode = ref(null)

    const polygonPath = computed(() =>
        draftZone.value.points.map(p => `${p.x},${p.y}`).join(' ')
    )

    const displayColor = computed(() => `#${colorInput.value}`)

    const isZoneOnDrawMode = computed(() => currentMode.value === "create")
    const isZoneOnEditMode = computed(() => currentMode.value === "edit")

    function resetState() {
        draftZone.value = {
            id: null,
            name: "",
            points: [],
            color: displayColor
        }

        colorInput.value = "3b82f6"
        isPolygonClosed.value = false
        collisionError.value = null

        zoneDialog.value = false
        currentMode.value = null
    }

    function startDrawing() {
        resetState()
        currentMode.value = "create"
    }

    function stopDrawing() {
        resetState()
    }

    function addPoint(point) {
        if (!point || isPolygonClosed.value) return

        const pointValidation = collision.canAddPoint(
            point,
            existingZones.value
        )


        if (!pointValidation.valid) {
            collisionError.value = pointValidation.reason
            return
        }

        const nearbyPoint = findNearbyPoint(point, draftZone.value.points[0])

        if (nearbyPoint && draftZone.value.points.length >= 3) {
            const zoneValidation = collision.canCreateZone(
                draftZone.value.points,
                existingZones.value
            )

            if (!zoneValidation.valid) {
                collisionError.value = zoneValidation.reason
                return
            }

            isPolygonClosed.value = true

            return
        }

        draftZone.value.points.push({x: point.x, y: point.y})
        console.log(draftZone.value.points)
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
        const newZone = {
            id: Date.now().toString(),
            name: draftZone.value.name.trim(),
            points: [...draftZone.value.points],
            color: displayColor.value,
        }

        resetState()
        currentMode.value = "create"

        return newZone
    }

    function goToSetup() {
        zoneDialog.value = true
        currentMode.value = "create"
    }

    function loadZoneForEdit(zone) {
        draftZone.value = {
            id: zone.id,
            name: zone.name,
            points: [...zone.points],
            color: zone.color
        }
        isPolygonClosed.value = true
        colorInput.value = zone.color.replace('#', '')

        zoneDialog.value = true
        currentMode.value = "edit"
    }

    function hideZoneDialog(){
        if (isZoneOnEditMode.value){
            resetState()
        }
    }

    function doneEditingZone() {
        resetState()
    }

    return {
        // State
        draftZone,
        colorInput,
        isPolygonClosed,
        polygonPath,
        displayColor,
        collisionError,
        zoneDialog,
        isZoneOnDrawMode,
        isZoneOnEditMode,

        // Actions
        startDrawing,
        stopDrawing,
        doneEditingZone,
        addPoint,
        finalizeZone,
        goToSetup,
        loadZoneForEdit,
        hideZoneDialog
    }
}
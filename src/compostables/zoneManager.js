import {computed, ref} from "vue";
import {drawingModeFactory} from "@/compostables/drawingModeFactory.js";

export function zoneManager() {
    const newZone = ref({
        id: "",
        name: "",
        points: [],
        color: ""
    });

    const pointConnectors = ref([]);
    const isZoneCompleted = ref(false);

    const zoneHandler = drawingModeFactory(
        startDrawingNewZone,
        stopDrawing,
        newZonePoint,
    );

    const currentZone = computed(() => {
        return {
            ...newZone.value,
            color: hexZoneColor.value,
        }
    })

    const hexZoneColor = computed(() => {
        return "#"+newZone.value.color;
    })

    function reset() {
        newZone.value = {
            id: "",
            name: "",
            points: [],
            color: "3b82f6"
        }
        pointConnectors.value = [];
        isZoneCompleted.value = false;
    }

    function setZone(z) {
        newZone.value = z;

        isZoneCompleted.value = true;
    }

    function startDrawingNewZone() {
        reset()
    }

    function stopDrawing() {
        reset()
    }

    function newZonePoint(point) {
        if (!point || isZoneCompleted.value) return;

        const nearby = findNearbyPoint(point);

        if (nearby) {
            isZoneCompleted.value = true;

            return;
        }

        pointConnectors.value.push(point.x + ", " + point.y);
        newZone.value.points.push(point);
    }

    const findNearbyPoint = (point) => {
        if (newZone.value.points.length < 1) return null;

        for (let i = 0; i < newZone.value.points.length; i++) {
            const existingPoint = newZone.value.points[i];
            const distance = Math.sqrt(
                Math.pow(point.x - existingPoint.x, 2) +
                Math.pow(point.y - existingPoint.y, 2),
            );

            if (distance < 20) {
                return {point: existingPoint, index: i};
            }
        }

        return null;
    };



    return {
        newZone,
        pointConnectors,
        isZoneCompleted,
        zoneHandler,
        setZone,
        currentZone,
        hexZoneColor,
        reset,
    };
}

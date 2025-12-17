import { computed, ref } from "vue";
import { drawingModeFactory } from "@/compostables/drawingModeFactory.js";

export function zoneEditor() {
  const currentPoints = ref([]);
  const pointConnectors = ref([]);
  const zoneColor = ref("");
  const isZoneCompleted = ref(false);

  const currentZone = ref(null);

  const zoneHandler = drawingModeFactory(
    startDrawingNewZone,
    stopDrawing,
    newZonePoint,
  );

  function startDrawingNewZone() {
    currentPoints.value = [];
    pointConnectors.value = [];
    zoneColor.value = "3b82f6";
    isZoneCompleted.value = false;
  }

  function stopDrawing() {
    currentPoints.value = [];
    pointConnectors.value = [];
  }

  const isShapeCompleted = computed(() => {
    return currentPoints.value.length > 2;
  });

  function newZonePoint(point) {
    if (!point) return;

    pointConnectors.value.push(point.x + ", " + point.y);
    const nearby = findNearbyPoint(point);

    if (nearby) {
      isZoneCompleted.value = true;

      currentZone.value = {
        points: [...currentPoints.value],
        color: zoneColor.value,
      };

      return;
    }

    currentPoints.value.push(point);
  }

  const findNearbyPoint = (point) => {
    if (currentPoints.value.length < 1) return null;

    for (let i = 0; i < currentPoints.value.length; i++) {
      const existingPoint = currentPoints.value[i];
      const distance = Math.sqrt(
        Math.pow(point.x - existingPoint.x, 2) +
          Math.pow(point.y - existingPoint.y, 2),
      );

      if (distance < 20) {
        return { point: existingPoint, index: i };
      }
    }

    return null;
  };

  return {
    currentPoints,
    pointConnectors,
    isZoneCompleted,
    zoneColor,
    currentZone,
    zoneHandler,
    isShapeCompleted,
  };
}

import { computed, ref } from "vue";

export function useEditorDrawing() {
  const isDrawingActive = ref(false);
  const activeDrawingMode = ref(null);

  function isDrawingModeValid(mode) {
    return mode && mode.startDrawing && mode.stopDrawing && mode.handleClick;
  }

  function isCallValid() {
    return isDrawingActive.value && activeDrawingMode.value;
  }

  function startDrawing(mode) {
    if (!isDrawingModeValid(mode)) return;

    activeDrawingMode.value = mode;
    isDrawingActive.value = true;

    activeDrawingMode.value.startDrawing();
  }

  function stopDrawing() {
    if (!isCallValid()) return;
    isDrawingActive.value = false;
    activeDrawingMode.value.stopDrawing();
    activeDrawingMode.value = null;
  }

  function handleClick(point) {
    if (!isCallValid()) return;
    activeDrawingMode.value.handleClick(point);
  }

  const cursorType = computed(() => {
    return isDrawingActive.value ? "cursor-crosshair" : "cursor-default";
  });

  return {
    isDrawingActive,
    activeDrawingMode,
    startDrawing,
    stopDrawing,
    handleClick,
    cursorType,
  };
}

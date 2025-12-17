export function drawingModeFactory(onStart, onStop, onClick) {
  return {
    startDrawing: onStart,
    stopDrawing: onStop,
    handleClick: onClick,
  };
}

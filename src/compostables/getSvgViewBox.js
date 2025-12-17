export function getSvgViewBox(svgContent) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svg = doc.querySelector("svg");

    if (!svg) {
      console.warn("No SVG element found in content");
      return;
    }

    const viewBoxAttr = svg.getAttribute("viewBox");

    if (viewBoxAttr) {
      return viewBoxAttr;
    }

    const width = svg.getAttribute("width");
    const height = svg.getAttribute("height");

    if (width && height) {
      const w = parseFloat(width);
      const h = parseFloat(height);
      return `0 0 ${w} ${h}`;
    }

    if (typeof svg.getBBox === "function") {
      const bbox = svg.getBBox();
      return `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
    }
  } catch (error) {
    console.error("Error parsing SVG:", error);
  }
}

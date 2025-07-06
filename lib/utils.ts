import { Camera, Color, Layer, Point, Side, XYWH } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const COLORS = [
  "#5EABD6",
  "#FEFBC7",
  "#FFB4B4",
  "#9B177E",
  "#06923E",
  "#725CAD",
  "#64E2B7",
  "#FF9F00",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number) : string {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

export function colorToCss(color: Color){
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

// resize the bounds
export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  const result = { ...bounds };

  if ((corner & Side.Left) === Side.Left) {
    const right = result.x + result.width;
    result.x = Math.min(point.x, right);
    result.width = Math.abs(right - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.width = Math.abs(point.x - result.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    const bottom = result.y + result.height;
    result.y = Math.min(point.y, bottom);
    result.height = Math.abs(bottom - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.height = Math.abs(point.y - result.y);
  }

  return result;
}


export function findInterSectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers.get(layerId)

    if (layer == null) { 
      continue
    }

    const { x, y, width, height } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId)
    }
  }

  return ids;
}



import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { X } from "lucide-react";
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


export function getContrastingTextColor(color: Color){
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  
  return luminance > 128 ? 'black' : 'white'
}

export function penPointsToPathLayer(
  points: number[][],
  color: Color,
):PathLayer {

  if(points.length < 2){
    throw new Error('Cannot transform points with less than 2 points')
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for(const point of points){
    const [x, y] = point;

    if(left > x) left = x;
    if(top > y) top = y;
    if(right < x) right = x;
    if(bottom < y) bottom = y;
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure])=> [x - left, y - top, pressure])
  }

}

export function getSvgPathFromStroke(stroke: number[][]){

  if(!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0,y0], i, arr) =>{
      const [x1, y1] = arr[(i+1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) /2)
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  )
  d.push('Z')
  return d.join(' ')
}



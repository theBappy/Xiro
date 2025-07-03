"use client";

import { useCallback, useState } from "react";
import { Info } from "./info";
import { Participant } from "./participant";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage
} from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import throttle from "lodash/throttle";
import {nanoid} from 'nanoid'
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";

interface CanvasProps {
  boardId: string;
}

const MAX_LAYERS = 100;

export const Canvas = ({ boardId }: CanvasProps) => {
  
  const layerIds = useStorage((root) => root.layerIds)


  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const [lastUseColor, setLastUseColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  })

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(({storage, setMyPresence}, 
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    position: Point,
  ) => {
    const liveLayers = storage.get('layers')
    if(liveLayers.size >= MAX_LAYERS){
      return
    }
    const liveLayerIds = storage.get('layerIds')
    const layerId = nanoid()
    const layer = new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUseColor,
    })

    liveLayerIds.push(layerId)
    liveLayers.set(layerId, layer)

    setMyPresence({selection: [layerId]}, {addToHistory: true})
    setCanvasState({mode: CanvasMode.None})

  },[lastUseColor])

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  // ✅ Liveblocks mutation
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({ cursor: current });
    },
    [camera]
  );
  
  const onPointerLeave = useMutation(({setMyPresence})=>{
    setMyPresence({cursor: null})
  }, [])



  const onPointerUp = useMutation(({}, e) =>{
    const point = pointerEventToCanvasPoint(e, camera)

    if(canvasState.mode === CanvasMode.Inserting){
      insertLayer(canvasState.layerType, point)
    }else{
      setCanvasState({
        mode: CanvasMode.None
      })
    }
    history.resume()
  },[
    camera, canvasState, history, insertLayer,
  ])
  

  // ✅ Throttle the mutation function using lodash
  const throttledPointerMove = useCallback(
    throttle((e: React.PointerEvent) => {
      onPointerMove(e);
    }, 16), // 16ms throttle = roughly 60fps
    [onPointerMove]
  );

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participant />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <svg
        onWheel={onWheel}
        onPointerMove={throttledPointerMove} 
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        className="h-[100vh] w-[100vw]"
      >
        <g
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px)`
        }}
        >
          {layerIds?.map((layerId) => (
            <LayerPreview 
            key={layerId}
            id={layerId}
            onLayerPointerDown={() =>{}}
            selectionColor="#000"
            />
          ))}
          <CursorPresence />
        </g>
      </svg>
    </main>
  );
};

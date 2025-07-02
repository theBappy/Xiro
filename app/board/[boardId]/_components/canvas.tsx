"use client";

import { useCallback, useState } from "react";
import { Info } from "./info";
import { Participant } from "./participant";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
} from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import throttle from "lodash/throttle"; 

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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
        className="h-[100vh] w-[100vw]"
      >
        <g>
          <CursorPresence />
        </g>
      </svg>
    </main>
  );
};

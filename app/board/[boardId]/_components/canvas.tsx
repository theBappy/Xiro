'use client'


import { useState } from "react"
import { Info } from "./info"
import { Participant } from "./participant"
import { Toolbar } from "./toolbar"
import { CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react"


interface CanvasProps {
   boardId: string; 
}

export const Canvas = ({boardId}:CanvasProps) => {
   const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
   })

   const history = useHistory()
   const canUndo = useCanUndo()
   const canRedo = useCanRedo()

    
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
        </main>
    )
}
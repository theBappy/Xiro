"use client";

import { shallow, useOthersMapped } from "@liveblocks/react";
import { memo } from "react";
import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";

import { Path } from "./path";
import { colorToCss } from "@/lib/utils";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped((other) =>({
    pencilDraft: other.presence.pencilDraft,
    penColor: other.presence.penColor,
  }), shallow)

  return (
    <>
      {others.map(([key, other]) => {
        if(other.pencilDraft){
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor): '#000'}
            />
          );
        }
        return null;
      })}
    </>
  )
}

export const CursorPresence = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});

CursorPresence.displayName = "CursorPresence";

"use client";

import { memo } from "react";
import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";

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

export const CursorPresence = memo(() => {
  return (
    <>
    {/* TODO: Draft pencil component */}
      <Cursors />
    </>
  );
});

CursorPresence.displayName = "CursorPresence";

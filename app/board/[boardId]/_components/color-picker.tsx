"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      <ColorButton onClick={onChange} color={{ r: 243, g: 82, b: 35 }} />
      <ColorButton onClick={onChange} color={{ r: 52, g: 152, b: 219 }} />
      <ColorButton onClick={onChange} color={{ r: 46, g: 204, b: 113 }} />
      <ColorButton onClick={onChange} color={{ r: 155, g: 89, b: 182 }} />
      <ColorButton onClick={onChange} color={{ r: 241, g: 196, b: 15 }} />
      <ColorButton onClick={onChange} color={{ r: 230, g: 126, b: 34 }} />
      <ColorButton onClick={onChange} color={{ r: 231, g: 76, b: 60 }} />
      <ColorButton onClick={onChange} color={{ r: 52, g: 73, b: 94 }} />
      <ColorButton onClick={onChange} color={{ r: 26, g: 188, b: 156 }} />
      <ColorButton onClick={onChange} color={{ r: 149, g: 165, b: 166 }} />
      <ColorButton onClick={onChange} color={{ r: 192, g: 57, b: 43 }} />
      <ColorButton onClick={onChange} color={{ r: 39, g: 174, b: 96 }} />
      <ColorButton onClick={onChange} color={{ r: 41, g: 128, b: 185 }} />
      <ColorButton onClick={onChange} color={{ r: 142, g: 68, b: 173 }} />
      <ColorButton onClick={onChange} color={{ r: 243, g: 156, b: 18 }} />
      <ColorButton onClick={onChange} color={{ r: 44, g: 62, b: 80 }} />
      <ColorButton onClick={onChange} color={{ r: 127, g: 140, b: 141 }} />
      <ColorButton onClick={onChange} color={{ r: 26, g: 82, b: 118 }} />
      <ColorButton onClick={onChange} color={{ r: 22, g: 160, b: 133 }} />
      <ColorButton onClick={onChange} color={{ r: 243, g: 104, b: 224 }} />
      <ColorButton onClick={onChange} color={{ r: 255, g: 255, b: 255 }} />
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-6 flex items-center justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{
          background: colorToCss(color),
        }}
      />
    </button>
  );
};

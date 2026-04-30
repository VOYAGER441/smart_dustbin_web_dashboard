"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(68).fill(1);
  const cols = new Array(36).fill(1);
  const colors = [
    "56, 189, 248",
    "14, 165, 233",
    "6, 182, 212",
    "34, 197, 94",
    "74, 222, 128",
    "59, 130, 246",
    "96, 165, 250",
    "16, 185, 129",
    "45, 212, 191",
  ];

  const toRgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`;

  const getColorForCell = (rowIndex: number, colIndex: number) => {
    return colors[(rowIndex + colIndex) % colors.length];
  };

  const getBaseOpacity = (rowIndex: number, colIndex: number) => {
    const seed = rowIndex * 31 + colIndex * 17;
    if (seed % 21 === 0) return 0.14;
    if (seed % 9 === 0) return 0.08;
    return 0;
  };

  return (
    <div
      style={{
        transform: `translate(-50%,-55%) skewX(-48deg) skewY(14deg) scale(0.78) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/2 top-1/2 p-4 flex w-[130%] h-[130%] z-0 opacity-45",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="w-16 h-8 border-l border-cyan-950/60 relative"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-cyan-950/60 relative"
              style={{
                backgroundColor: toRgba(getColorForCell(i, j), getBaseOpacity(i, j)),
              }}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

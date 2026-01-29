"use client";

import { Handle, type NodeProps, useReactFlow } from "reactflow";
import { Position } from "reactflow";

export interface DelayNodeData {
  mode?: "specific" | "relative";
  specificDateTime?: string;
  relativeValue?: number;
  relativeUnit?: "minutes" | "hours" | "days";
}

export function DelayNode({ id, data }: NodeProps<DelayNodeData>) {
  const { setNodes } = useReactFlow<DelayNodeData>();
  const mode = data.mode ?? "relative";
  const specificDateTime = data.specificDateTime ?? "";
  const relativeValue = data.relativeValue ?? 0;
  const relativeUnit = data.relativeUnit ?? "minutes";

  const updateData = (updates: Partial<DelayNodeData>) => {
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n,
      ),
    );
  };

  return (
    <div className="min-w-[240px] rounded-lg border-2 border-amber-600 bg-background px-3 py-2 shadow-md">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-600"
      />
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
        Delay
      </div>
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => updateData({ mode: "specific" })}
          className={`rounded px-2 py-1 text-xs font-medium ${
            mode === "specific"
              ? "bg-amber-600 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Date & time
        </button>
        <button
          type="button"
          onClick={() => updateData({ mode: "relative" })}
          className={`rounded px-2 py-1 text-xs font-medium ${
            mode === "relative"
              ? "bg-amber-600 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Relative
        </button>
      </div>
      {mode === "specific" ? (
        <input
          type="datetime-local"
          value={specificDateTime}
          onChange={(e) => updateData({ specificDateTime: e.target.value })}
          className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={relativeValue}
            onChange={(e) =>
              updateData({
                relativeValue: Math.max(0, parseInt(e.target.value, 10) || 0),
              })
            }
            className="no-spinner w-16 rounded border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={relativeUnit}
            onChange={(e) =>
              updateData({
                relativeUnit: e.target.value as "minutes" | "hours" | "days",
              })
            }
            className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-amber-600"
      />
    </div>
  );
}

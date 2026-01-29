"use client";

import { Handle, type NodeProps, useReactFlow } from "reactflow";
import { Position } from "reactflow";

export interface ActionNodeData {
  message?: string;
}

export function ActionNode({ id, data }: NodeProps<ActionNodeData>) {
  const { setNodes } = useReactFlow<ActionNodeData>();
  const message = typeof data.message === "string" ? data.message : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, message: e.target.value } }
          : n,
      ),
    );
  };

  return (
    <div className="min-w-[220px] rounded-lg border-2 border-primary bg-background px-3 py-2 shadow-md">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Action (Email)
      </div>
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="Message to send..."
        rows={3}
        className="w-full resize-y rounded border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

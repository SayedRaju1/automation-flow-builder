"use client";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface FlowEditorProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  automationId?: string | null;
  automationName?: string;
}

export function FlowEditor({
  initialNodes,
  initialEdges,
  automationId,
  automationName,
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back</Link>
          </Button>
          {automationName && (
            <span className="text-sm font-medium text-muted-foreground">
              {automationName}
            </span>
          )}
        </div>
        {/* Save will be wired in Task 3.5 */}
      </div>
      <div className="flex-1 rounded-lg border border-border bg-muted/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          className="bg-background"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

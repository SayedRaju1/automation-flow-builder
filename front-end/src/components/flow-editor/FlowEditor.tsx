"use client";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ActionNode, DelayNode } from "./nodes";

const NODE_TYPES = {
  action: ActionNode,
  delay: DelayNode,
};

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

  const insertStepBetween = useCallback(
    (nodeType: "action" | "delay") => {
      if (edges.length === 0) return;
      const edgeToSplit = edges.find((e) => e.target === "end") ?? edges[0];
      const sourceId = edgeToSplit.source;
      const targetId = edgeToSplit.target;
      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);
      if (!sourceNode || !targetNode) return;
      const newId = `${nodeType}-${Date.now()}`;
      const midX = (sourceNode.position.x + targetNode.position.x) / 2;
      const midY = (sourceNode.position.y + targetNode.position.y) / 2 + 60;
      const newNode: Node = {
        id: newId,
        type: nodeType,
        position: { x: midX, y: midY },
        data:
          nodeType === "action"
            ? { message: "" }
            : { mode: "relative", relativeValue: 0, relativeUnit: "minutes" },
      };
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) =>
        eds
          .filter((e) => !(e.source === sourceId && e.target === targetId))
          .concat(
            { id: `e-${sourceId}-${newId}`, source: sourceId, target: newId },
            { id: `e-${newId}-${targetId}`, source: newId, target: targetId },
          ),
      );
    },
    [edges, nodes, setNodes, setEdges],
  );

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
          nodeTypes={NODE_TYPES}
          fitView
          className="bg-background"
        >
          <Controls />
          <Background />
          <Panel position="top-right" className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => insertStepBetween("action")}
            >
              Add Action
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => insertStepBetween("delay")}
            >
              Add Delay
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FlowEditor } from "@/components/flow-editor/FlowEditor";
import { getAutomation } from "@/lib/api";
import { DEFAULT_EDGES, DEFAULT_NODES } from "@/lib/default-flow";
import type { Node, Edge } from "reactflow";

function flowDataToNodesEdges(flowData: {
  nodes?: unknown[];
  edges?: unknown[];
}): { nodes: Node[]; edges: Edge[] } {
  const rawNodes = Array.isArray(flowData?.nodes) ? flowData.nodes : [];
  const rawEdges = Array.isArray(flowData?.edges) ? flowData.edges : [];
  const nodes: Node[] = rawNodes.map((n) => {
    const x = n as {
      id: string;
      type?: string;
      data?: Record<string, unknown>;
      position?: { x: number; y: number };
    };
    return {
      id: x.id,
      type: x.type ?? "default",
      data: x.data ?? {},
      position: x.position ?? { x: 0, y: 0 },
    };
  });
  const edges: Edge[] = rawEdges.map((e) => {
    const x = e as { id: string; source: string; target: string };
    return { id: x.id, source: x.source, target: x.target };
  });
  return { nodes, edges };
}

export default function EditAutomationPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const {
    data: automation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automation", id],
    queryFn: () => getAutomation(id),
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-destructive">Invalid automation ID.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/">Back</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading automation…</p>
      </div>
    );
  }

  if (error || !automation) {
    return (
      <div className="p-6">
        <p className="text-destructive">Failed to load automation.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/">Back</Link>
        </Button>
      </div>
    );
  }

  const { nodes, edges } =
    automation.flowData?.nodes?.length || automation.flowData?.edges?.length
      ? flowDataToNodesEdges(automation.flowData)
      : { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit automation</h1>
      <FlowEditor
        initialNodes={nodes}
        initialEdges={edges}
        automationId={automation._id}
        automationName={automation.name}
      />
    </div>
  );
}

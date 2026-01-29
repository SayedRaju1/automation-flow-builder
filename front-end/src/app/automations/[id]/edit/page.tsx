"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FlowEditor,
  type FlowEditorRef,
} from "@/components/flow-editor/FlowEditor";
import { getAutomation, updateAutomation } from "@/lib/api";
import { DEFAULT_EDGES, DEFAULT_NODES } from "@/lib/default-flow";
import type { UpdateAutomationInput } from "@/types/automation";
import { validateFlowDataForSave } from "@/lib/validate-flow";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef<FlowEditorRef>(null);
  const id = typeof params.id === "string" ? params.id : "";
  const [name, setName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    data: automation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automation", id],
    queryFn: () => getAutomation(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (automation?.name) setName(automation.name);
  }, [automation?.name]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateAutomationInput) =>
      updateAutomation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      queryClient.invalidateQueries({ queryKey: ["automation", id] });
      router.push("/");
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { error?: string } } };
      setSaveError(e.response?.data?.error ?? "Failed to update automation");
    },
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

  const handleSave = () => {
    setSaveError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setSaveError("Name is required");
      return;
    }
    const flowData = editorRef.current?.getFlowData();
    if (!flowData) return;
    const validationError = validateFlowDataForSave(flowData);
    if (validationError) {
      setSaveError(validationError);
      return;
    }
    updateMutation.mutate({ name: trimmed, flowData });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit automation</h1>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px]">
          <label htmlFor="edit-name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Automation name"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={updateMutation.isPending}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </div>
      {saveError && (
        <p className="mb-4 text-sm text-destructive">{saveError}</p>
      )}
      <FlowEditor
        ref={editorRef}
        key={id}
        initialNodes={nodes}
        initialEdges={edges}
        automationId={automation._id}
        automationName={name || automation.name}
      />
    </div>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FlowEditor,
  type FlowEditorRef,
} from "@/components/flow-editor/FlowEditor";
import { createAutomation } from "@/lib/api";
import { DEFAULT_EDGES, DEFAULT_NODES } from "@/lib/default-flow";
import { validateFlowDataForSave } from "@/lib/validate-flow";

export default function NewAutomationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = useRef<FlowEditorRef>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      router.push("/");
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error ?? "Failed to create automation");
    },
  });

  const handleSave = () => {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    const flowData = editorRef.current?.getFlowData();
    if (!flowData) return;
    const validationError = validateFlowDataForSave(flowData);
    if (validationError) {
      setError(validationError);
      return;
    }
    createMutation.mutate({ name: trimmed, flowData });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">New automation</h1>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[200px]">
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My automation"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={createMutation.isPending}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <FlowEditor
        ref={editorRef}
        initialNodes={DEFAULT_NODES}
        initialEdges={DEFAULT_EDGES}
        automationId={null}
      />
    </div>
  );
}

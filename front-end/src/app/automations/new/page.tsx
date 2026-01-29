"use client";

import { FlowEditor } from "@/components/flow-editor/FlowEditor";
import { DEFAULT_EDGES, DEFAULT_NODES } from "@/lib/default-flow";

export default function NewAutomationPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">New automation</h1>
      <FlowEditor
        initialNodes={DEFAULT_NODES}
        initialEdges={DEFAULT_EDGES}
        automationId={null}
      />
    </div>
  );
}

import type { FlowData } from "@/types/automation";

export function validateFlowDataForSave(flowData: FlowData): string | null {
  const actionNodes = flowData.nodes.filter(
    (n) => String(n.type).toLowerCase() === "action",
  );
  for (const node of actionNodes) {
    const message = node.data?.message;
    if (typeof message !== "string" || !message.trim()) {
      return "Each Action step must have a message.";
    }
  }
  return null;
}

import { sendEmail } from "../lib/resend";
import type {
  ActionNodeData,
  DelayNodeData,
  FlowData,
  FlowNode,
  RunContext,
} from "../types/flow";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDelayMs(data: DelayNodeData): number {
  const mode = data.mode ?? "relative";
  if (mode === "specific" && data.specificDateTime) {
    const target = new Date(data.specificDateTime).getTime();
    const now = Date.now();
    const ms = target - now;
    return ms > 0 ? ms : 0;
  }
  if (mode === "relative" && data.relativeValue != null && data.relativeUnit) {
    const value = Number(data.relativeValue);
    if (Number.isNaN(value) || value < 0) return 0;
    const unitMs: Record<string, number> = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };
    return value * (unitMs[data.relativeUnit] ?? 0);
  }
  return 0;
}

function buildNextMap(flowData: FlowData): Map<string, string> {
  const next = new Map<string, string>();
  for (const edge of flowData.edges) {
    next.set(edge.source, edge.target);
  }
  return next;
}

function getNodeById(nodes: FlowNode[], id: string): FlowNode | undefined {
  return nodes.find((n) => n.id === id);
}

/**
 * Runs the flow in the background. Finds Start, then follows edges executing
 * Action (send email) and Delay (wait). Resolves when End is reached or flow is invalid.
 */
export async function runFlow(
  flowData: FlowData,
  ctx: RunContext,
): Promise<void> {
  const { nodes, edges } = flowData;
  if (!nodes?.length || !edges?.length) {
    return;
  }
  const nextMap = buildNextMap(flowData);
  const startNode = nodes.find((n) => String(n.type).toLowerCase() === "start");
  if (!startNode) {
    return;
  }
  let currentId: string | undefined = nextMap.get(startNode.id);
  while (currentId) {
    const node = getNodeById(nodes, currentId);
    if (!node) break;
    const type = String(node.type).toLowerCase();
    if (type === "end") {
      break;
    }
    if (type === "action") {
      const data = (node.data ?? {}) as ActionNodeData;
      const message =
        typeof data.message === "string" ? data.message : "No message";
      await sendEmail({
        to: ctx.recipientEmail,
        subject: "Automation Flow Message",
        text: message,
        html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
      });
    }
    if (type === "delay") {
      const data = (node.data ?? {}) as DelayNodeData;
      const ms = getDelayMs(data);
      if (ms > 0) {
        await sleep(ms);
      }
    }
    currentId = nextMap.get(node.id);
  }
}

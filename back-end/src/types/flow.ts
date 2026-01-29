/**
 * Flow node/edge types for execution.
 * React Flow stores nodes as { id, type, data, position } and edges as { id, source, target }.
 */

export const NODE_TYPES = ["start", "end", "action", "delay"] as const;
export type NodeType = (typeof NODE_TYPES)[number];

export interface FlowNode {
  id: string;
  type: string;
  data?: Record<string, unknown>;
  position?: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** Action node data: message to send as email body */
export interface ActionNodeData {
  message?: string;
}

/** Delay node: specific date/time OR relative duration */
export interface DelayNodeData {
  mode?: "specific" | "relative";
  /** ISO date string when mode is "specific" */
  specificDateTime?: string;
  /** Number when mode is "relative" */
  relativeValue?: number;
  /** Unit when mode is "relative" */
  relativeUnit?: "minutes" | "hours" | "days";
}

export interface RunContext {
  recipientEmail: string;
}

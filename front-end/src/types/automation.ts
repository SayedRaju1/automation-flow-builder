/**
 * Types for Automation and flow data (aligned with backend API and React Flow).
 */

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

export interface Automation {
  _id: string;
  name: string;
  flowData: FlowData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationInput {
  name: string;
  flowData?: FlowData;
}

export interface UpdateAutomationInput {
  name?: string;
  flowData?: FlowData;
}

export interface TestRunInput {
  email: string;
}

export interface TestRunResponse {
  message: string;
}

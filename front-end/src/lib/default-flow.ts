import type { Edge, Node } from "reactflow";

export const DEFAULT_NODES: Node[] = [
  {
    id: "start",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
  },
  {
    id: "end",
    type: "output",
    position: { x: 280, y: 0 },
    data: { label: "End" },
  },
];

export const DEFAULT_EDGES: Edge[] = [
  { id: "e-start-end", source: "start", target: "end" },
];

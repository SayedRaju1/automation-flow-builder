import { z } from "zod";

const flowDataSchema = z.object({
  nodes: z.array(z.unknown()),
  edges: z.array(z.unknown()),
});

export const createAutomationSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  flowData: flowDataSchema.default({ nodes: [], edges: [] }),
});

export const updateAutomationSchema = z.object({
  name: z.string().min(1, "Name is required").trim().optional(),
  flowData: flowDataSchema.optional(),
});

export type CreateAutomationBody = z.infer<typeof createAutomationSchema>;
export type UpdateAutomationBody = z.infer<typeof updateAutomationSchema>;

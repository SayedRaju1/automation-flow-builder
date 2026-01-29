import mongoose, { Schema } from "mongoose";

export interface IAutomation {
  name: string;
  flowData: {
    nodes: unknown[];
    edges: unknown[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const automationSchema = new Schema<IAutomation>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    flowData: {
      type: Schema.Types.Mixed,
      required: true,
      default: () => ({ nodes: [], edges: [] }),
    },
  },
  { timestamps: true },
);

automationSchema.index({ name: 1 }, { unique: true });

export const Automation = mongoose.model<IAutomation>(
  "Automation",
  automationSchema,
);

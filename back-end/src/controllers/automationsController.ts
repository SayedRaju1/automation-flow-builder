import { Request, Response } from "express";
import mongoose from "mongoose";
import { Automation } from "../models/Automation";
import {
  createAutomationSchema,
  updateAutomationSchema,
} from "../validators/automation";

const MONGO_DUPLICATE_KEY_CODE = 11000;

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === MONGO_DUPLICATE_KEY_CODE
  );
}

export async function list(_req: Request, res: Response): Promise<void> {
  try {
    const automations = await Automation.find().sort({ updatedAt: -1 }).lean();
    res.json(automations);
  } catch (err) {
    console.error("List automations error:", err);
    res.status(500).json({ error: "Failed to list automations" });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createAutomationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  const { name, flowData } = parsed.data;
  try {
    const doc = await Automation.create({ name, flowData });
    res.status(201).json(doc);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      res
        .status(409)
        .json({ error: "An automation with this name already exists" });
      return;
    }
    console.error("Create automation error:", err);
    res.status(500).json({ error: "Failed to create automation" });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid automation ID" });
    return;
  }
  try {
    const doc = await Automation.findById(id).lean();
    if (!doc) {
      res.status(404).json({ error: "Automation not found" });
      return;
    }
    res.json(doc);
  } catch (err) {
    console.error("Get automation error:", err);
    res.status(500).json({ error: "Failed to get automation" });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid automation ID" });
    return;
  }
  const parsed = updateAutomationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  try {
    const doc = await Automation.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).lean();
    if (!doc) {
      res.status(404).json({ error: "Automation not found" });
      return;
    }
    res.json(doc);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      res
        .status(409)
        .json({ error: "An automation with this name already exists" });
      return;
    }
    console.error("Update automation error:", err);
    res.status(500).json({ error: "Failed to update automation" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid automation ID" });
    return;
  }
  try {
    const doc = await Automation.findByIdAndDelete(id);
    if (!doc) {
      res.status(404).json({ error: "Automation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error("Delete automation error:", err);
    res.status(500).json({ error: "Failed to delete automation" });
  }
}

import { apiClient } from "./axios";
import type {
  Automation,
  CreateAutomationInput,
  TestRunInput,
  TestRunResponse,
  UpdateAutomationInput,
} from "@/types/automation";

export async function listAutomations(): Promise<Automation[]> {
  const { data } = await apiClient.get<Automation[]>("/api/automations");
  return data;
}

export async function getAutomation(id: string): Promise<Automation> {
  const { data } = await apiClient.get<Automation>(`/api/automations/${id}`);
  return data;
}

export async function createAutomation(
  input: CreateAutomationInput,
): Promise<Automation> {
  const { data } = await apiClient.post<Automation>("/api/automations", input);
  return data;
}

export async function updateAutomation(
  id: string,
  input: UpdateAutomationInput,
): Promise<Automation> {
  const { data } = await apiClient.put<Automation>(
    `/api/automations/${id}`,
    input,
  );
  return data;
}

export async function deleteAutomation(id: string): Promise<void> {
  await apiClient.delete(`/api/automations/${id}`);
}

export async function testRunAutomation(
  id: string,
  input: TestRunInput,
): Promise<TestRunResponse> {
  const { data } = await apiClient.post<TestRunResponse>(
    `/api/automations/${id}/test`,
    input,
  );
  return data;
}

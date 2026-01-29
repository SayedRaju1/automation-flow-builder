"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  deleteAutomation,
  listAutomations,
  testRunAutomation,
} from "@/lib/api";
import type { Automation } from "@/types/automation";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

function TestRunDialog({
  automationId,
  automationName,
  onClose,
  onSuccess,
}: {
  automationId: string;
  automationName: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const mutation = useMutation({
    mutationFn: () => testRunAutomation(automationId, { email }),
    onSuccess: () => {
      setSuccess(true);
      onSuccess();
    },
    onError: (err: unknown) => {
      const e = err as {
        response?: { data?: { details?: Record<string, string[]> } };
        message?: string;
      };
      const details = e.response?.data?.details;
      const msg = details?.email?.[0] ?? e.message ?? "Failed to start test";
      setError(String(msg));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    mutation.mutate();
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => onClose(), 1500);
    return () => clearTimeout(t);
  }, [success, onClose]);

  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-run-title"
      >
        <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
          <p
            id="test-run-title"
            className="text-center font-medium text-primary"
          >
            Test started! The automation is running in the background.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-run-title"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
        <h2 id="test-run-title" className="mb-2 text-lg font-semibold">
          Test run: {automationName}
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Enter the email address to run this automation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="test-email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
              autoFocus
              disabled={mutation.isPending}
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Starting…" : "Start test"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HomePage() {
  const queryClient = useQueryClient();
  const [testRunTarget, setTestRunTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Automation | null>(null);

  const {
    data: automations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automations"],
    queryFn: listAutomations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      setDeleteTarget(null);
    },
  });

  const handleDeleteClick = (item: Automation) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget._id);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Automations</h1>
          <Button asChild>
            <Link href="/automations/new">Create new</Link>
          </Button>
        </div>

        {isLoading && (
          <p className="text-muted-foreground">Loading automations…</p>
        )}
        {error && (
          <p className="text-destructive">
            Failed to load automations. Please try again.
          </p>
        )}
        {automations && automations.length === 0 && (
          <p className="text-muted-foreground">
            No automations yet. Create one to get started.
          </p>
        )}
        {automations && automations.length > 0 && (
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/automations/${item._id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTestRunTarget({ id: item._id, name: item.name })
                          }
                        >
                          Test
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting…" : "Delete"}
                        </Button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {testRunTarget && (
        <TestRunDialog
          automationId={testRunTarget.id}
          automationName={testRunTarget.name}
          onClose={() => setTestRunTarget(null)}
          onSuccess={() => {}}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete automation"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

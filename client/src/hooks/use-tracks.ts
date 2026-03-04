import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TrackInput, type TrackUpdateInput } from "@shared/routes";

// Utility to safely parse JSON strings and catch Zod errors with logging
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useTracks() {
  return useQuery({
    queryKey: [api.tracks.list.path],
    queryFn: async () => {
      const res = await fetch(api.tracks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tracks");
      const data = await res.json();
      return parseWithLogging(api.tracks.list.responses[200], data, "tracks.list");
    },
  });
}

export function useTrack(id: number | null) {
  return useQuery({
    queryKey: [api.tracks.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.tracks.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch track");
      const data = await res.json();
      return parseWithLogging(api.tracks.get.responses[200], data, "tracks.get");
    },
    enabled: !!id,
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TrackInput) => {
      const validated = api.tracks.create.input.parse(data);
      const res = await fetch(api.tracks.create.path, {
        method: api.tracks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create track");
      return parseWithLogging(api.tracks.create.responses[201], await res.json(), "tracks.create");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & TrackUpdateInput) => {
      const validated = api.tracks.update.input.parse(updates);
      const url = buildUrl(api.tracks.update.path, { id });
      const res = await fetch(url, {
        method: api.tracks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update track");
      return parseWithLogging(api.tracks.update.responses[200], await res.json(), "tracks.update");
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tracks.get.path, id] });
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tracks.delete.path, { id });
      const res = await fetch(url, { method: api.tracks.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete track");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tracks.list.path] }),
  });
}

import { z } from 'zod';
import { insertTrackSchema, tracks } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tracks: {
    list: {
      method: 'GET' as const,
      path: '/api/tracks' as const,
      responses: {
        200: z.array(z.custom<typeof tracks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tracks/:id' as const,
      responses: {
        200: z.custom<typeof tracks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tracks' as const,
      input: insertTrackSchema,
      responses: {
        201: z.custom<typeof tracks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tracks/:id' as const,
      input: insertTrackSchema.partial(),
      responses: {
        200: z.custom<typeof tracks.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/tracks/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TrackInput = z.infer<typeof api.tracks.create.input>;
export type TrackResponse = z.infer<typeof api.tracks.create.responses[201]>;
export type TrackUpdateInput = z.infer<typeof api.tracks.update.input>;
export type TracksListResponse = z.infer<typeof api.tracks.list.responses[200]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;

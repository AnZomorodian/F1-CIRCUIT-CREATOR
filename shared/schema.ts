import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  creatorName: text("creator_name").notNull(),
  trackData: json("track_data").notNull(), // Stores the canvas elements (track pieces, positions, rotations, etc.)
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertTrackSchema = createInsertSchema(tracks).omit({ 
  id: true, 
  createdAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

// Request types
export type CreateTrackRequest = InsertTrack;
export type UpdateTrackRequest = Partial<InsertTrack>;

// Response types
export type TrackResponse = Track;
export type TracksListResponse = Track[];

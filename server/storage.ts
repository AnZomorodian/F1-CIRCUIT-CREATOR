import { db } from "./db";
import {
  tracks,
  type CreateTrackRequest,
  type UpdateTrackRequest,
  type TrackResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTracks(): Promise<TrackResponse[]>;
  getTrack(id: number): Promise<TrackResponse | undefined>;
  createTrack(track: CreateTrackRequest): Promise<TrackResponse>;
  updateTrack(id: number, updates: UpdateTrackRequest): Promise<TrackResponse>;
  deleteTrack(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTracks(): Promise<TrackResponse[]> {
    return await db.select().from(tracks);
  }

  async getTrack(id: number): Promise<TrackResponse | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track;
  }

  async createTrack(track: CreateTrackRequest): Promise<TrackResponse> {
    const [newTrack] = await db.insert(tracks).values(track).returning();
    return newTrack;
  }

  async updateTrack(id: number, updates: UpdateTrackRequest): Promise<TrackResponse> {
    const [updated] = await db.update(tracks)
      .set(updates)
      .where(eq(tracks.id, id))
      .returning();
    return updated;
  }

  async deleteTrack(id: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }
}

export const storage = new DatabaseStorage();

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database
  await seedDatabase();

  app.get(api.tracks.list.path, async (req, res) => {
    try {
      const tracksList = await storage.getTracks();
      res.json(tracksList);
    } catch (error) {
      console.error("Failed to get tracks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.tracks.get.path, async (req, res) => {
    try {
      const track = await storage.getTrack(Number(req.params.id));
      if (!track) {
        return res.status(404).json({ message: 'Track not found' });
      }
      res.json(track);
    } catch (error) {
      console.error("Failed to get track:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.tracks.create.path, async (req, res) => {
    try {
      const input = api.tracks.create.input.parse(req.body);
      const track = await storage.createTrack(input);
      res.status(201).json(track);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Failed to create track:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.tracks.update.path, async (req, res) => {
    try {
      const input = api.tracks.update.input.parse(req.body);
      const track = await storage.updateTrack(Number(req.params.id), input);
      res.json(track);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Failed to update track:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.tracks.delete.path, async (req, res) => {
    try {
      await storage.deleteTrack(Number(req.params.id));
      res.status(204).end();
    } catch (error) {
      console.error("Failed to delete track:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingTracks = await storage.getTracks();
    if (existingTracks.length === 0) {
      await storage.createTrack({
        title: "Monza Circuit Replica",
        description: "A fast circuit with long straights and tight chicanes.",
        creatorName: "RacingFan99",
        trackData: {
          pieces: [
            { type: "straight", x: 100, y: 100, length: 300, angle: 0 },
            { type: "chicane", x: 400, y: 100, radius: 50, angle: 0 },
            { type: "straight", x: 450, y: 150, length: 200, angle: 90 },
            { type: "hairpin", x: 450, y: 350, radius: 80, angle: 90 },
            { type: "straight", x: 290, y: 430, length: 200, angle: 180 },
            { type: "fast_corner", x: 90, y: 430, radius: 100, angle: 180 },
            { type: "straight", x: -10, y: 330, length: 230, angle: 270 }
          ]
        }
      });
      await storage.createTrack({
        title: "Simple Oval",
        description: "A basic high-speed oval track.",
        creatorName: "BeginnerDesigner",
        trackData: {
          pieces: [
            { type: "straight", x: 200, y: 100, length: 400, angle: 0 },
            { type: "hairpin", x: 600, y: 100, radius: 100, angle: 0 },
            { type: "straight", x: 600, y: 300, length: 400, angle: 180 },
            { type: "hairpin", x: 200, y: 300, radius: 100, angle: 180 }
          ]
        }
      });
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

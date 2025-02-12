import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertVehicleSchema, insertWorkOrderSchema, insertInventorySchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const vehicles = await storage.getVehicles();
    res.json(vehicles);
  });

  app.post("/api/vehicles", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertVehicleSchema.parse(req.body);
    const vehicle = await storage.createVehicle(parsed);
    res.status(201).json(vehicle);
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const vehicle = await storage.updateVehicle(parseInt(req.params.id), req.body);
    res.json(vehicle);
  });

  // Work order routes
  app.get("/api/work-orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getWorkOrders();
    res.json(orders);
  });

  app.post("/api/work-orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertWorkOrderSchema.parse(req.body);
    const order = await storage.createWorkOrder(parsed);
    res.status(201).json(order);
  });

  app.patch("/api/work-orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const order = await storage.updateWorkOrder(parseInt(req.params.id), req.body);
    res.json(order);
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getInventory();
    res.json(items);
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertInventorySchema.parse(req.body);
    const item = await storage.updateInventory(parseInt(req.params.id), parsed);
    res.json(item);
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const departments = await storage.getDepartments();
    res.json(departments);
  });

  const httpServer = createServer(app);
  return httpServer;
}

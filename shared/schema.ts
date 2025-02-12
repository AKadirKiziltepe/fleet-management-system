import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roles = {
  TECHNICIAN: "technician",
  ADVISOR: "advisor",
  MANAGER: "manager"
} as const;

export const workOrderStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
} as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["technician", "advisor", "manager"] }).notNull(),
  departmentId: integer("department_id").references(() => departments.id),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  plateNumber: text("plate_number").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  vin: text("vin").notNull(),
  status: text("status").notNull(),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
});

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  description: text("description").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "completed", "cancelled"] }).notNull(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  departmentId: integer("department_id").references(() => departments.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull(),
  minQuantity: integer("min_quantity").notNull(),
  location: text("location"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  departmentId: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles);
export const insertWorkOrderSchema = createInsertSchema(workOrders);
export const insertInventorySchema = createInsertSchema(inventory);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type WorkOrder = typeof workOrders.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Department = typeof departments.$inferSelect;
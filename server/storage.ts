import { users, vehicles, workOrders, inventory, departments, type User, type Vehicle, type WorkOrder, type Inventory, type Department, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vehicle operations
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle>;

  // Work order operations
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrder(id: number): Promise<WorkOrder | undefined>;
  createWorkOrder(workOrder: Omit<WorkOrder, "id" | "createdAt" | "updatedAt">): Promise<WorkOrder>;
  updateWorkOrder(id: number, workOrder: Partial<WorkOrder>): Promise<WorkOrder>;

  // Inventory operations
  getInventory(): Promise<Inventory[]>;
  getInventoryItem(id: number): Promise<Inventory | undefined>;
  updateInventory(id: number, item: Partial<Inventory>): Promise<Inventory>;

  // Department operations
  getDepartments(): Promise<Department[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }

  async createVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    const [created] = await db.insert(vehicles).values(vehicle).returning();
    return created;
  }

  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const [updated] = await db
      .update(vehicles)
      .set(vehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return updated;
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    return await db.select().from(workOrders);
  }

  async getWorkOrder(id: number): Promise<WorkOrder | undefined> {
    const [order] = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return order;
  }

  async createWorkOrder(workOrder: Omit<WorkOrder, "id" | "createdAt" | "updatedAt">): Promise<WorkOrder> {
    const now = new Date();
    const [created] = await db
      .insert(workOrders)
      .values({ ...workOrder, createdAt: now, updatedAt: now })
      .returning();
    return created;
  }

  async updateWorkOrder(id: number, workOrder: Partial<WorkOrder>): Promise<WorkOrder> {
    const [updated] = await db
      .update(workOrders)
      .set({ ...workOrder, updatedAt: new Date() })
      .where(eq(workOrders.id, id))
      .returning();
    return updated;
  }

  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory);
  }

  async getInventoryItem(id: number): Promise<Inventory | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item;
  }

  async updateInventory(id: number, item: Partial<Inventory>): Promise<Inventory> {
    const [updated] = await db
      .update(inventory)
      .set(item)
      .where(eq(inventory.id, id))
      .returning();
    return updated;
  }

  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }
}

export const storage = new DatabaseStorage();
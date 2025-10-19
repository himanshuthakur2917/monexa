import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schema for insert operations
export const insertUserSchema = createInsertSchema(users, {
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email().min(5).max(255),
    password: z
        .string()
        .min(8)
        .max(100)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
});

// Zod schema for select operations
export const selectUserSchema = createSelectSchema(users);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

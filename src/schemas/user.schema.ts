import { emailValidation, nameValidation, passwordValidation } from "@/lib/validators/base.validator";
import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    isVerified: varchar("is_verified", { length: 255 }).default("false").notNull(),
    forgotPasswordToken: varchar("forgot_password_token", { length: 255 }),
    forgotPasswordTokenExpiry: timestamp("forgot_password_token_expiry"),
    verifyToken: varchar("verify_token", { length: 255 }),
    verifyTokenExpiry: timestamp("verify_token_expiry"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Zod schema for insert operations
export const insertUserSchema = createInsertSchema(users, {
    firstName: nameValidation,
    lastName: nameValidation,
    email: emailValidation,
    password: passwordValidation,
});


// Zod schema for select operations
export const selectUserSchema = createSelectSchema(users);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


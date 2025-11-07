import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./account.schema";
import { relations } from "drizzle-orm";

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

export const userAccountsRelation = relations(users,({many}) => ({ 
    accounts:many(accounts)
 }))

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


import { decimal, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";


export const budgets = pgTable('budgets',{
    id: uuid('id').defaultRandom().primaryKey(),
    amount: decimal('amount',{precision:10,scale:2}).default('0'),
    lastAlertSent: timestamp('last_alert_sent'),
    userId: uuid('user_id').notNull().references(() => users.id,{onDelete:"cascade"}),
    createdAt:timestamp('createdAt').defaultNow().notNull(),
    updatedAt:timestamp('updatedAt').defaultNow().notNull()
})

export const budgetRelation = relations(budgets,({one}) => ({ 
    user: one(users,{
        fields:[budgets.userId],
        references:[users.id]
    })
 }))
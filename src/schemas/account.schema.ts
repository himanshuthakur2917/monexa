import { relations } from "drizzle-orm";
import { boolean, decimal, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { Transactions } from "./transaction.schema";

export const accountType = pgEnum('AccountType',['current','savings'])

export const accounts = pgTable("accounts",{
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar('name',{length:50}).notNull(),
    type: accountType().notNull(),
    balance: decimal('balance',{precision:10,scale:2}).default('0'),
    isDefault: boolean('isDefault').default(false),
    userId: uuid('user_id').references(() => users.id , {onDelete:"cascade"}),
    createdAt:timestamp('createdAt').defaultNow().notNull(),
    updatedAt:timestamp('updatedAt').defaultNow().notNull()
})

export const accountRelations = relations(accounts,({one}) => ({ 
    user:one(users,{
        fields:[accounts.userId],
        references:[users.id],
    })
}))

export const transactionRelations = relations(accounts,({many}) => ({ 
    transactions : many(Transactions)
 }))

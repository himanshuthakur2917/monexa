import { relations } from "drizzle-orm";
import { boolean, decimal, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { accounts } from "./account.schema";

export const transactionType = pgEnum("transaction_type", [
  "income",
  "expense",
  "transfer",
  "investment",
  "loan_payment",
  "loan_received",
  "fee",
]);

export const RecurringInterval = pgEnum("recurring_interval", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

export const TransactionStatus = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "cancelled",
]);

export const Transactions = pgTable('transactions',{
    id: uuid('id').defaultRandom().primaryKey(),
    type: transactionType(),
    amount: decimal('amount',{precision:10,scale:2}).default('0'),
    description: varchar('description',{length:1000}).default(''),
    date:timestamp('date').defaultNow(),
    category:varchar('category').notNull(),
    receiptUrl:varchar('receipt_url'),
    isRecurring:boolean('isRecurring').default(false),
    recurringInterval:RecurringInterval(),
    nextRecurringDate:timestamp('next_recurring_date'),
    lastProcessed:timestamp('last_processed'),
    status:TransactionStatus(),
    userId: uuid('user_id').notNull().references(() => users.id,{onDelete:"cascade"}),
    accountId: uuid('account_id').notNull().references(() => users.id,{onDelete:"cascade"}),
    createdAt:timestamp('createdAt').defaultNow().notNull(),
    updatedAt:timestamp('updatedAt').defaultNow().notNull()
})

export const transactionRelation = relations(Transactions,({one}) => ({ 
    user:one(users,{
        fields:[Transactions.userId],
        references:[users.id]
    })
 })) 

export const accountsRelation = relations(Transactions,({one}) => ({ 
    account: one(accounts,{
        fields:[Transactions.accountId],
        references:[accounts.id]
    })
 }))





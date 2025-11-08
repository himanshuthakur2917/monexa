import { useAuth } from "@/context/AuthProvider";
import { db } from "@/lib/db";
import { accounts, AccountType, NewAccount } from "@/schemas/account.schema";
import { users } from "@/schemas/user.schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CreateAccountData {
    name: string;
    balance: string;
    accountType: AccountType;
    isDefault: boolean;
}

export const createAccount = async (
    userId: string,
    data: CreateAccountData
) => {
    if (!userId) throw new Error("Unauthorized");
    
    const { balance, accountType } = data;

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) throw new Error("User not found");

    if (isNaN(Number(balance))) throw new Error("Invalid Balance");

    try {
        const existingAccount = await db.query.users.findMany({
            where: eq(accounts.userId, userId),
        });

        const shouldBeDefault = existingAccount.length === 0 ? true : false;
        if (shouldBeDefault) {
            await db
                .update(accounts)
                .set({ isDefault: false })
                .where(eq(accounts.userId, userId));
        }

        const newAccountData: NewAccount = {
            name: `${accountType} account`,
            type: accountType,
            balance: balance,
            userId: user.id,
            isDefault: shouldBeDefault,
        };

        const newAccount = await db.insert(accounts).values(newAccountData);
        revalidatePath("/dashboard");
        return newAccount;
    } catch (error) {
        throw new Error("Failed to create account :",error);
    }
};

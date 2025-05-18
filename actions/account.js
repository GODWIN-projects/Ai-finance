"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const serializeTransaaction = (obj) => {
    const serialized = {...obj}
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber()
    }

    return serialized
}

export async function updateDefaultAccount(accId) {

    try {
        const {userId} = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where : { clerkUserId: userId}
        })

        if (!user) throw new Error("user not found")

    
        await db.account.updateMany({
            where : {userId: user.id, isDefault: true},
            data: {isDefault: false}
        })

        await db.account.update({
            where : {userId: user.Id, id:accId},
            data : { isDefault : true}
        })


        revalidatePath("/dashboard")
        return {success: true}
    } catch (err) {
        throw new Error(err.message)
    }
    

}


export async function getAccountData(accId) {
    try {
        const {userId} = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where : { clerkUserId: userId}
        })

        if (!user) throw new Error("user not found")
        
        const account = await db.account.findUnique({
            where: {id:accId, userId: user.id},
            include: {
                transaction : {
                    orderBy: { date: "desc"}
                },
                _count : {
                    select : {transaction: true}
                }
            }
        })

        if (!account) return null;

        return {
            ...serializeTransaaction(account),
            transactions: account.transaction.map(serializeTransaaction)
        }

    } catch(err) {
        throw new Error(err.message)
    }
}


export async function bulkDeleteTransactions(transactionIds) {
    try {

        const {userId} = await auth()
        if (!userId) throw new Error("Unauthorized")

        const user = await db.user.findUnique({
            where : { clerkUserId: userId}
        })

        if (!user) throw new Error("user not found")

        const transactions = await db.transaction.findMany({
            where: {
                id : {in : transactionIds},
                userId: user.id
            }
        })

        const accountBalanceChanges = transactions.reduce((acc,transaction) => {
            const change = transaction.type == "EXPENSE" ? parseFloat(transaction.amount) : -parseFloat(transaction.amount)

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) +change

            return acc
        },{})

        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany ({
                where : {
                    id : {in: transactionIds},
                    userId : user.id
                }
            })

            for (const [accountId,balanceChange] of Object.entries(accountBalanceChanges)) {
                await tx.account.update({
                    where: {id: accountId},
                    data : {
                        balance: {
                            increment : balanceChange
                        }
                    }
                })
            }
        })

        revalidatePath("/dashboard")
        revalidatePath("/account/[id")

        return {success:true}

    } catch (err) {
        throw new Error(err.message)
    }
}
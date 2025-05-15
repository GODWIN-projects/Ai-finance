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



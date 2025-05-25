"use server"

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma"
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache"


const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
  });


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function createTransaction(data) {
    try {
        const {userId} = await auth()
        if (!userId) throw new Error("Unauthorized")

        const req = await request()

        const decision = await aj.protect(req, {
            userId,
            requested: 1, 
          });
      
          if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
              const { remaining, reset } = decision.reason
              console.error({
                code: "RATE_LIMIT_EXCEEDED",
                details: {
                  remaining,
                  resetInSeconds: reset,
                },
              });
      
              throw new Error("Too many requests. Please try again later.")
            }
      
            throw new Error("Request blocked")
          }

        const user = await db.user.findUnique({
            where : { clerkUserId: userId}
        })

        if (!user) throw new Error("user not found")

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId : user.id
            }
        })

        const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount
        const newBalance = account.balance.toNumber() + balanceChange

        const transaction = await db.$transaction(async(tx) => {
            const newTransaction = await tx.transaction.create({
                data : {
                    ...data,
                    userId:user.id,
                    nextRecurringDate:
                        data.isRecurring && data.recurringInterval 
                            ? calculateRecurringData(data.date, data.recurringInterval)
                            : null
                }
            })

            await tx.account.update({
                where: {id: data.accountId},
                data: {balance: newBalance}
            })

            return newTransaction
        })

        revalidatePath("/dashboard")
        revalidatePath(`/account/${transaction.accountId}`)

        return {success: true, data: serializeAmount(transaction)}
    } catch (err) {
        throw new Error(err.message)
    }
}


export async function scanReceipt(file) {
    try {
        const model = genAi.getGenerativeModel({model: "gemini-1.5-flash"})

        const arrayBuffer = await file.arrayBuffer()

        const base64String = Buffer.from(arrayBuffer).toString("base64")

        const prompt = `
        Analyze this receipt image and extract the following information in JSON format:
        - Total amount (just the number)
        - Date (in ISO format)
        - Description or items purchased (brief summary)
        - Merchant/store name
        - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
        
        Only respond with valid JSON in this exact format:
        {
          "amount": number,
          "date": "ISO date string",
          "description": "string",
          "merchantName": "string",
          "category": "string"
        }
  
        If its not a recipt, return an empty object
      `
        

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64String,
                    mimeType: file.type
                },
            },
            prompt
        ])
        console.log(result)

        // const response = await result.response()
        const candidate = result.response?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        const cleanedtext = text.replace(/```(?:json)?\n?/g, "").trim()


        try{
            const data = JSON.parse(cleanedtext)
            return {
                amount: parseFloat(data.amount),
                date: new Date(data.date),
                description: data.description,
                category: data.category,
                merchantName: data.merchantName
            } 
        } catch(parseError) {
            console.error("Error parsing JSON response", parseError)
            throw new Error("Invalid response from Gemini")
        }
    } catch (err) {
        console.error("Error scanning receipt", err)
        throw new Error("failed to scan receipt")
    }
}


function calculateRecurringData(startDate,interval) {
    const date = new Date(startDate)

    switch (interval) {
        case "DAILY" :
            date.setDate(date.getDate() + 1)
            break
        case "WEEKLY":
            date.setDate(date.getDate() + 7)
            break
        case "MONTHLY":
            date.setDate(date.getMonth() +1)
            break
        case "YEARLY":
            date.setDate(date.getFullYear() + 1)
            break
    }

    return date

}
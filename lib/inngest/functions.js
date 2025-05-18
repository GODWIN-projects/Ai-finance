import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async()=>{
        return await db.budget.findMany({
            include: {
                user: {
                    include: {
                        accounts: {
                            where: {
                                isDefault:true
                            }
                        }
                    }
                }
            }
        })
    })

    for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0]
        if (!defaultAccount) continue

        await step.run(`check-budget-${budget.id}`, async ()=> {
            const startDate = new Date();
            startDate.setDate(1)

            const expenses = await db.transaction.aggregate({
                where: {
                  userId: budget.userId,
                  accountId: defaultAccount.id, // Only consider default account
                  type: "EXPENSE",
                  date: {
                    gte: startDate,
                  },
                },
                _sum: {
                  amount: true,
                },
              })

            const totalExpenses = expenses._sum.amount?.toNumber() || 0
            const budgetAmount = budget.amount
            const percentageUsed = (totalExpenses / budgetAmount) * 100

            if (
                percentageUsed >= 80 && 
                (!budget.lastAlertSent ||
                  isNewMonth(new Date(budget.lastAlertSent), new Date()))
              ) {
                await sendEmail({
                    to: budget.user.email,
                    subject: `Budget Alert for ${defaultAccount.name}`,
                    react: <EmailTemplate 
                                userName={budget.user.name}
                                type="budget-alerts"
                                data={{
                                  percentageUsed,
                                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                                  totalExpenses:parseInt(totalExpenses).toFixed(1),
                                  accountName: defaultAccount.name
                                }}/>
                  })


                  await db.budget.update({
                    where: {id: budget.id},
                    data: {lastAlertSent: new Date()}
                  })
              } else{
                console.log(percentageUsed)
              }

        })
    }
  },
);



function isNewMonth(lastAlertDate, currentDate) {
    return (
      lastAlertDate.getMonth() !== currentDate.getMonth() ||
      lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
  }

"use client"

import { updateBudget } from '@/actions/budget'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import useFetch from '@/hooks/use-fetch'
import { Check, Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const BudgetProgress = ({initialBudget, currentExpenses}) => {

    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    )

    const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "")
        setIsEditing(false)
    }


    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget)

        if (isNaN(newBudget) || newBudget < 0) {
            toast.error("Please enter a valid number")
            return
        }

        await updateBudgetFn(amount)
    }

    const {
        loading: updateLoading,
        fn: updateBudgetFn,
        data: updated,
        error: updateError
    } = useFetch(updateBudget)

    useEffect(() => {
        if (!updateLoading) {
            if(updated) {
                toast.success("budget updated successfully")
                setIsEditing(false)
            } else if (updateError) {
                toast.error("Failed to update budget")
            }
        }
    },[updateLoading,updateError,updateLoading])

  return (
    <div>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className='flex-1'>
                        <CardTitle>Monthly Budget(Default Account)</CardTitle>
                        <div className='flex items-center gap-2 mt-1'>
                            {isEditing ? (
                            <div className="flex items-center gap-2 mt-2">
                                <Input
                                type="number"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
                                className="w-32"
                                placeholder="Enter amount"
                                autoFocus
                                disabled={updateLoading}
                                />
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleUpdateBudget}
                                disabled={updateLoading}
                                >
                                <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                disabled={updateLoading}
                                >
                                <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            ) : (
                            <>
                                <CardDescription>
                                    {
                                        initialBudget 
                                        ? `${currentExpenses.toFixed(2)} of
                                        ${initialBudget.amount.toFixed(2)} spent`
                                        : "No Budget set"
                                    }
                                </CardDescription>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={()=>setIsEditing(true)}>
                                    <Pencil className='h-3 w-3'/>
                                </Button>
                            </> ) }
                        </div>
                    </div>
            </CardHeader>
            <CardContent>
                 {
                    currentExpenses > initialBudget.amount &&
                    <div className='p-1 text-red-600'>
                        Expenses exceeded the monthly budged
                    </div>
                }
                {
                    initialBudget && 
                    (
                        <div>
                            <Progress value={percentUsed} 
                             extraStyles={`${
                                percentUsed >= 90
                                  ? "bg-red-500"
                                  : percentUsed >= 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}/>
                              <p className='text-xs text-muted-foreground text-right'>
                                {percentUsed.toFixed(1)} % used
                              </p>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    </div>
  )
}

export default BudgetProgress
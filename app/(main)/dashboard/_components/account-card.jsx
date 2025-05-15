"use client"

import { updateDefaultAccount } from '@/actions/account'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/use-fetch'
import { ArrowDown, ArrowUp, Loader2, } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const AccountCard = ({account}) => {

    const {name, type, balance, id, isDefault} = account

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount)


    const handlleDefaultChange = async(event) => {
        event.preventDefault()

        if (isDefault) {
            toast.warning("You need atlest one default account, change other account to automatically disable this account as default")
            return
        }
        
        await updateDefaultFn(id)
    }

    useEffect(() =>{
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully")
        }
    },[updatedAccount,updateDefaultLoading])

    useEffect(() =>{
        if (error) {
            toast.error(error.message || "Failed to change default account")
        }
    },[error])

  return (
    <div>
        <Card className="hover:shadow-md transition-shadow group relative">
            <Link href={`/account/${id}`}>
                <CardHeader className = "flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                        {name}
                        </CardTitle>
                    <Switch checked={isDefault}
                        disabled={updateDefaultLoading}
                        onClick={handlleDefaultChange}/>
                    {updateDefaultLoading && (
                        <Loader2 className="animate-spin h-5 w-5 text-gray-600" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        &#8377; {parseFloat(balance).toFixed(2)}
                    </div>
                    <p className='text-muted-foreground'>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <div className="flex items-center">
                        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    </div>
  )
}

export default AccountCard
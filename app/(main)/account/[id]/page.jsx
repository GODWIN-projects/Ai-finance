import { getAccountData } from '@/actions/account'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table'
import { BarLoader } from 'react-spinners'
import AccountChart from '../_components/account-chart'
import { TransactionFilterProvider } from '../contexts/transaction-filter-provider'

const AccountsPage = async ({params}) => {

  const {id} = await params
  const accountData = await getAccountData(id)

  if (!accountData) {
    notFound()
  }

  const {transactions, ...account} = accountData


  return (
    <div className='px-6 mt-30 space-y-8'>
      <div className='flex gap-4 items-center justify-between'>
        <div>
          <h1 className='text-5xl sm:text-6xl font-bold gradient capitalize pr-8'>
            {account.name}
          </h1>
          <p className='text-muted-foreground'>
          {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()}
          </p>
        </div>
        <div className='text-right pb-2'>
          <div className='text-xl sm:text-2xl font-bold'>
            {parseFloat(account.balance.toFixed(2))}
          </div>
          <p className='text-sm text-muted-foreground'>
            {account._count.transaction} Transaction
          </p>
        </div>
      </div>


        <TransactionFilterProvider transactions={transactions}>

          {/* chart sectiom */}
          <Suspense
            fallback={<BarLoader className="mt-4 gradient" width={"100%"} />}
          >
            <AccountChart transactions = {transactions}/>
          </Suspense>

          {/* transaction table */}
          <Suspense
            fallback={<BarLoader className="mt-4 gradient" width={"100%"} />}
          >
            <TransactionTable transactions={transactions} />
          </Suspense>
        </TransactionFilterProvider>
    </div>
      
  )
}

export default AccountsPage
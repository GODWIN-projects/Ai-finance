import { getuserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React from 'react'
import AddTransactionForm from '../_components/add-transaction-form'
import { getTransaction } from '@/actions/transaaction'

const AddTransactionpage = async({searchParams}) => {
  
  const accounts = await getuserAccounts()
  const {editId} = await searchParams

  let initialData = null 
  if (editId) {
    const transaction = await getTransaction(editId)
    initialData = transaction
  }

  return (
    <div className='mt-30 mx-auto px-5 max-w-3xl'>
      <div className='flex justify-center md:justify-normal mb-8'>
        <h1 className='gradient text-5xl font-extrabold pr-4'>{editId? "Edit":"Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}/>
    </div>
  )
}

export default AddTransactionpage
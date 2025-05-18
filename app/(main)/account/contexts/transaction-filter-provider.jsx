'use client'

import React, { createContext, useContext, useState } from 'react'

const TransactionFilterContext = createContext()

export const TransactionFilterProvider = ({ children, transactions }) => {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  return (
    <TransactionFilterContext.Provider value={{ filteredTransactions, setFilteredTransactions }}>
      {children}
    </TransactionFilterContext.Provider>
  )
}

export const useTransactionFilter = () => {
  return useContext(TransactionFilterContext)
}

"use client"

import { format} from 'date-fns'
import React, { useMemo } from 'react'
import { useTransactionFilter } from '../contexts/transaction-filter-provider'
import { Bar, BarChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
}

const AccountChart= ({transactions}) => {

  const {filteredTransactions} = useTransactionFilter()

    // Group transactions by date
    const grouped = () => {
      const groupedObj = filteredTransactions.reduce((acc, transaction) => {
        const date = format(new Date(transaction.date), "MMM dd");
        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }
        if (transaction.type === "INCOME") {
          acc[date].income += transaction.amount;
        } else {
          acc[date].expense -= transaction.amount;
        }
        return acc;
      }, {});
    
      return Object.values(groupedObj).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    };
    

  const groupedData = grouped()

  const totals = useMemo(() => {
    return groupedData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense - day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [groupedData])

  return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent >
          <div className="flex justify-around mb-6 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Total Income</p>
              <p className="text-lg font-bold text-green-500">
              ₹{totals.income.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Total Expenses</p>
              <p className="text-lg font-bold text-red-500">
              ₹{totals.expense.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Net</p>
              <p
                className={`text-lg font-bold ${
                  totals.income - totals.expense >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ₹{(totals.income - totals.expense).toFixed(2)}
              </p>
            </div>
          </div>


          <div className='h-[300px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={groupedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}/>
                <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, undefined]}/>
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="income" fill="#22c55e" radius={[4,4,0,0]}/>
                <Bar dataKey="expense" fill="#ef4444" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>

          </div>
        </CardContent>
        
      </Card>

  )
}

export default AccountChart

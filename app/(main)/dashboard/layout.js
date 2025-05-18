import React, { Suspense } from 'react'
import DasboardPage from './page'
import { BarLoader } from "react-spinners"

export default function Layout() {
  return (
    <div className='px-5 min-h-screen mt-24'>
        <div className='flex items-center justify-between mb-5'>
            <h1 className='font-bold text-6xl tracking-tight gradient'>
                Dashboard
            </h1>
        </div>

        <Suspense 
            fallback={<BarLoader className="mt-4 gradient" width={"100%"} />}>
            <DasboardPage/>
        </Suspense>
    </div>
  )
}


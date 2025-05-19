"use client"

import { scanReceipt } from '@/actions/transaaction'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { Camera, Loader2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const ReceiptScanner = ({onScanComplete}) => {

    const fileInputRef = useRef()

    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: ScanData,
        error: scanError
    } = useFetch(scanReceipt)

    const handleReceiptScan = async(file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5 mb")
            return
        }

        await scanReceiptFn(file)
    }

    useEffect(()=> {
        if (!scanReceiptLoading){
            if (scanError) {
                toast.error(scanError.message)
            } else if (ScanData) {
                onScanComplete(ScanData)
                toast.success("Receipt scnnes successfully")
            }
        }
    }, [scanReceiptLoading, scanError, ScanData])

    return (
        <div>
            <input
                type={"file"}
                ref={fileInputRef}
                accept='image/*'
                capture="environment"
                className='hidden'
                onChange={(e) =>{
                    const file = e.target.files?.[0]
                    if (file) handleReceiptScan(file)
                }}/>

                <Button className="w-full h-10 bg-gradient-to-r from-red-600 
                via-orange-500 to-gray-500 animate-gradient hover:opacity-90 hover:text-black font-semibold"
                    type="button"
                    onClick ={() => fileInputRef.current?.click()}
                    disabled={scanReceiptLoading}>
                    {
                        scanReceiptLoading ? (
                            <>
                                <Loader2 className='mr-2 animate-spin'/>
                                <span>Scanning Receipt</span>
                            </>
                        ) : (
                            <>
                                <Camera className='mr-2'/>
                                <span>Scan Receipt with AI</span>
                            </>
                        )
                    }
                </Button>
        </div>
    )
}

export default ReceiptScanner
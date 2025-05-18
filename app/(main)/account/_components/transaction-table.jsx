"use client"

import { bulkDeleteTransactions } from '@/actions/account'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import useFetch from '@/hooks/use-fetch'
import { endOfDay, format, startOfDay, subDays } from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCcw, Search, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'
import { useTransactionFilter } from '../contexts/transaction-filter-provider'

const DATE_RANGES = {
    "7D": { label: "Last 7 Days", days: 7 },
    "1M": { label: "Last Month", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    ALL: { label: "All Time", days: null },
  }

const TransactionTable = ({transactions}) => {

    const router = useRouter()

    const [dateRange,setDateRange] = useState("ALL")
    const [selectedIds,setSelectedIds] = useState([])
    const [sortConfig, setSortConfig] = useState({
        field : "date",
        direction : "desc"
    }) 

    const [searchTerm,setSearchTerm] = useState("")
    const [typeFilter,setTypeFilter] = useState("")
    const [recurringFilter,setRecurringFilter] = useState("")

    const [currentPage, setCurrentPage] = useState(1)

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
        error: deleteError
    } = useFetch(bulkDeleteTransactions)

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions]

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
              transaction.description?.toLowerCase().includes(searchLower)
            );
          }


        if (typeFilter) {
        result =
         result.filter((transaction) => transaction.type === typeFilter)
        }


        if (recurringFilter) {
            result = result.filter((transaction) => {
              if (recurringFilter === "recurring") return transaction.isRecurring
              return !transaction.isRecurring
            })
        }

        if (dateRange) {
            const now = new Date();
            const range = DATE_RANGES[dateRange];
            const startDate = range.days
                ? startOfDay(subDays(now, range.days))
                : startOfDay(new Date(0));

            result = result.filter((t) => {
                const txDate = new Date(t.date);
                return txDate >= startDate && txDate <= endOfDay(now);
            });
        }

        // sorting

        result.sort((a,b) => {
            let comparison = 0

            switch (sortConfig.field) {
                case "date":
                comparison = new Date(a.date) - new Date(b.date)
                break
                case "amount":
                const aSigned = a.type === "EXPENSE" ? -a.amount : a.amount;
                const bSigned = b.type === "EXPENSE" ? -b.amount : b.amount;
                comparison = aSigned - bSigned;
                break
                case "category":
                comparison = a.category.localeCompare(b.category)
                break
                default:
                comparison = 0
            }

            return sortConfig.direction === "asc" ? comparison : -comparison
            
        })

        return result

        },[
        transactions,
        searchTerm,
        typeFilter,
        recurringFilter,
        sortConfig,
        dateRange
    ])

    const paginationNumber = 15
    const totalPages = Math.ceil(filteredAndSortedTransactions.length/paginationNumber)
    
    const paginatatedTransacrions = useMemo(() => {
        const startIndex = (currentPage - 1) * paginationNumber
        return filteredAndSortedTransactions.slice(
            startIndex, startIndex + paginationNumber
        )
    }, [currentPage, filteredAndSortedTransactions])

    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction:
              current.field === field && current.direction === "asc" ? "desc" : "asc",
          }));
    } 

    const handleSelect = (id) => {
        setSelectedIds(current => current.includes(id)? current.filter(item => item != id): [...current,id])
    }

    const handleSelectAll = () => {
        setSelectedIds(current => current.length == filteredAndSortedTransactions.length? 
        []: filteredAndSortedTransactions.map((transaction) => transaction.id))
    }

    const handleBulkDelete = async() => {
        if(!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions`)) {
            return
        }

        deleteFn(selectedIds)
    }

    useEffect(()=> {
        if (!deleteLoading) {
            if (deleteError) {
                toast.error("Failed to delete transactions")
            } else if (deleted) {
                toast.success("Transactions deleted successfully")
            }
        }
    },[deleteLoading,deleted])

    const {setFilteredTransactions} = useTransactionFilter()

    useEffect(() => {
        setFilteredTransactions(filteredAndSortedTransactions)
    },[filteredAndSortedTransactions])

    const handleClearaFilters = () => {
        setRecurringFilter("")
        setSearchTerm("")
        setSelectedIds([])
        setTypeFilter("")
        setDateRange("ALL")
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage) 
        setSelectedIds([])
    }

  return (
    <div>
        {   deleteLoading &&
            <BarLoader className='mt-4 gradient' width={"100%"} />}

        <div className={`space-y-4 transition duration-300 mb-14
            ${deleteLoading ? "pointer-none: opacity-50 blur-sm" : ""}`}>


            {/* filters */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
                    <Input className="pl-8"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>

                <div className='flex gap-2'>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={recurringFilter} 
                onValueChange={(value) => setRecurringFilter(value)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recurring">Recurring Only</SelectItem>
                        <SelectItem value="non-recurring">Non-Recurring only</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={dateRange} 
                onValueChange={(value) => setDateRange(value)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Date Ranges" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(DATE_RANGES).map(([key, val]) => (
                            <SelectItem key={key} value={key}>
                            {val.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {
                    selectedIds.length > 0 && 
                    <div>
                        <Button variant="destructive" size={"sm"}
                            onClick ={handleBulkDelete}>
                            <Trash className='h-4 w-4 '/>
                            Delete Selected ({selectedIds.length})
                        </Button>
                    </div>
                }

                {
                    (searchTerm || typeFilter || recurringFilter || selectedIds.length > 0) && (
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick ={handleClearaFilters}
                            title="Clear filters">
                            <X className='h-4 w-5'/>
                        </Button>
                    )
                }

                </div>
            </div>

            {/* table */}
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox onCheckedChange={handleSelectAll}
                                checked ={ 
                                    selectedIds.length == filteredAndSortedTransactions.length &&
                                    filteredAndSortedTransactions.length >0
                                }/>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={()=> handleSort("date")}>
                            <div className='flex items-center'>
                                Date 
                                {sortConfig.field === "date" &&
                                (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={()=> handleSort("category")}>
                            <div className='flex items-center'>
                                Category 
                                {sortConfig.field === "category" &&
                                (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={()=> handleSort("amount")}>
                            <div className='flex items-center justify-end'>
                                Amount 
                                {sortConfig.field === "amount" &&
                                (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1 h-4 w-4" />
                                ) : (
                                <ChevronDown className="ml-1 h-4 w-4" />
                                ))}
                            </div>
                        </TableHead>
                        <TableHead>
                            Recurring
                        </TableHead>
                        <TableHead className={"w-[50px]"}/>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            paginatatedTransacrions.length === 0 ?
                            (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No teansactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatatedTransacrions.map((transaction) => {
                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="">
                                                <Checkbox onCheckedChange = {()=> handleSelect(transaction.id)}
                                                    checked ={selectedIds.includes(transaction.id)}/>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(transaction.date),"PP")}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.description}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                <span
                                                    style={{
                                                        background: categoryColors[transaction.category]
                                                    }} className='px-2 py-1 rounded text-white text-sm'>
                                                    {transaction.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium" style={{
                                                color:transaction.type ==="INCOME" ? "green" : "red"
                                            }}>
                                                {transaction.type === "INCOME" ? "+ ₹" : "- ₹"}
                                                {parseFloat(transaction.amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.isRecurring?
                                                    (<TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Badge variant="outline" className="gap-1 capitalize 
                                                                    bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                                    <RefreshCcw className='h-3 w-3'/>
                                                                    {transaction.recurringinterval.toLowerCase()}
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className='text-sm'>
                                                                    <div className='font-medium'>Next date:</div>
                                                                    <div>
                                                                        {format(new Date(transaction.nextRecurringDate),"PP")}
                                                                    </div>
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>) : (
                                                    <Badge variant="outline" className="gap-1">
                                                        <Clock className='h-3 w-3'/>
                                                        One-time
                                                    </Badge>
                                                )
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className='h-4 w-4'/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem
                                                                onClick={()=> {
                                                                    router.push(`/transaction/create?edit=${transaction.id}`)
                                                                }}>
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive"
                                                            onClick={()=> {
                                                                deleteFn([transaction.id])
                                                            }}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )
                        }
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
            )}
        </div>
    </div>
  )
}

export default TransactionTable
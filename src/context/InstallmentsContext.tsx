'use client'

import axiosInstance from '@/api/axiosInstance'
import { Category } from '@/app/common/interfaces/categories'
import { Installments } from '@/app/common/interfaces/installments'
import { Salaries } from '@/app/common/interfaces/salaries'
import { filterInstallments, filterSalaries, months } from '@/lib/useful'
import { redirect, usePathname } from 'next/navigation'
import React, { createContext, useEffect, useState } from 'react'

interface MyContextProps {
  installments: Installments[]
  filteredInstallments: Installments[]
  setFilteredInstallments: React.Dispatch<React.SetStateAction<Installments[]>>
  salaries: Salaries[]
  filteredSalaries: Salaries[]
  setFilteredSalaries: React.Dispatch<React.SetStateAction<Salaries[]>>
  setMonthCurrent: React.Dispatch<React.SetStateAction<string>>
  monthCurrent: string
  categories: Category[]
}

const InstallmentsContext = createContext<MyContextProps>({} as MyContextProps)

const InstallmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [installments, setInstallments] = useState<Installments[]>([])
  const [filteredInstallments, setFilteredInstallments] = useState(installments)
  const [filteredSalaries, setFilteredSalaries] = useState<Salaries[]>([])
  const [monthCurrent, setMonthCurrent] = useState(
    months[new Date().getMonth()]
  )
  const [salaries, setSalaries] = useState([])
  const [categories, setCategories] = useState([])
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
      return
    }
    async function fetch() {
      try {
        const installments = await axiosInstance.get('/installments')
        const salary = await axiosInstance.get('/salary')
        const category = await axiosInstance.get('/category')
        setInstallments(installments.data)
        setFilteredInstallments(
          filterInstallments(installments.data, months[new Date().getMonth()])
        )
        setFilteredSalaries(
          filterSalaries(salary.data, months[new Date().getMonth()])
        )
        setCategories(category.data)
        setSalaries(salary.data)
      } catch (error: any) {
        if (error.response?.data.statusCode === 401) {
          redirect('/login')
        }
      }
    }

    fetch()
  }, [pathname])

  return (
    <InstallmentsContext.Provider
      value={{
        installments,
        filteredInstallments,
        setFilteredInstallments,
        salaries,
        setMonthCurrent,
        monthCurrent,
        categories,
        filteredSalaries,
        setFilteredSalaries,
      }}
    >
      {children}
    </InstallmentsContext.Provider>
  )
}

export { InstallmentsContext, InstallmentsProvider }

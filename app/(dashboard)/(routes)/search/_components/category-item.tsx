"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'
import { IconType } from 'react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
interface CategoryItemProps {
  label: string,
  icon?: IconType,
  value?: string
}
import qs from 'query-string'
export default function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title');
  const isSelected = value === currentCategoryId

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value
      }
    }, { skipNull: true, skipEmptyString: true },);
    router.push(url)
  }

  return (
    <button className={cn(
      "py-2 px-3 text-sm border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition border", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800 font-semibold"
    )} type='button' onClick={onClick}>
      {Icon && <Icon size={24} />}
      <div className='truncate'>
        <span>{label}</span>
      </div>
    </button>
  )
}

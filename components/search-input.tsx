"use client"
import React, { useEffect } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import useDebounce from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
export default function SearchInput() {
  const [value, setValue] = React.useState('')
  const debouncedValue = useDebounce(value, 500)
  const router = useRouter()
  const pathname = usePathname()
  const searchParam = useSearchParams()
  const categoryId = searchParam.get('categoryId')
  useEffect(() => {
    const url = queryString.stringifyUrl({
      url: pathname,
      query: {
        categoryId,
        search: debouncedValue
      },
    },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url)
  }, [debouncedValue, categoryId, pathname, router]);
  return (
    <div className='relative'>
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input placeholder="Search for a course"
        value={value} onChange={(e) => setValue(e.target.value)} className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200' />
    </div>
  )
}

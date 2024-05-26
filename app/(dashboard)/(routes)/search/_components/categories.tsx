"use client"
import { Category } from '@prisma/client'
import React from 'react'
import { IconType } from 'react-icons'
import { FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from 'react-icons/fc'
import CategoryItem from './category-item'
interface CategoryProps {
  items: Category[]
}
const iconMap: Record<Category['name'], IconType> = {
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Engineering": FcEngineering,
  "Filming": FcFilmReel,
  "Fitness": FcSportsMode,
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
}
export default function Categories({ items }: CategoryProps) {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}

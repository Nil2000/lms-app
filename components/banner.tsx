import React from 'react'
import { AlertTriangle, CheckCircleIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
        success: "bg-green-100 border-green-500 text-green-700"
      },
    },
    defaultVariants: {
      variant: "warning"
    }
  }
);
const IconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon
}
interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
};

export default function Banner({
  label,
  variant
}: BannerProps) {

  const Icon = IconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className='h-4 w-4 mr-2' />{label}
    </div>
  )
}

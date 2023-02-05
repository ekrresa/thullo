import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { AiOutlineLoading } from 'react-icons/ai'

import { cn } from '@lib/utils'

interface ButtonProps<T extends React.ElementType>
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonClasses> {
  as?: T
  loading?: boolean
}
function ButtonInner<T extends React.ElementType = 'button'>(
  props: ButtonProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>,
  ref: React.ForwardedRef<T>
) {
  const {
    as,
    children,
    className,
    loading,
    fullWidth,
    variant,
    type = 'button',
    ...buttonProps
  } = props

  const Element = as || 'button'

  return (
    //@ts-expect-error
    <Element
      ref={ref}
      className={cn(buttonClasses({ variant, fullWidth }), className)}
      disabled={loading}
      type={type}
      {...buttonProps}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin text-xl text-inherit" />
      ) : (
        children
      )}
    </Element>
  )
}

const buttonClasses = cva(
  'flex items-center justify-center font-medium rounded-lg transition-all text-sm shadow-sm py-2.5 px-6 disabled:cursor-not-allowed disabled:opacity-60 focus:ring-1 focus:ring-offset-1',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500',
        secondary:
          'text-slate-700 bg-transparent border border-slate-200 hover:bg-slate-50 hover:border-slate-400',
        danger: 'bg-roman-500 text-white hover:bg-roman-600',
        transparent:
          'bg-transparent shadow-none border border-slate-300 hover:bg-slate-100',
        plain: 'p-0 shadow-none',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
  }
)

export const Button = React.forwardRef(ButtonInner)

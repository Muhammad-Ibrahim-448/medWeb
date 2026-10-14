// src/components/common/Button.jsx
'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/helpers'
import { forwardRef } from 'react'

// Define variant styles centrally
const variantStyles = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40',
  warning:
    'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  outline:
    'bg-transparent border-2 border-slate-600 text-slate-700 hover:border-slate-800 hover:bg-slate-50',
  premium:
    'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
  glass: 'glass text-slate-900 hover:bg-white/20',
  dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/25',

  /* ── Jewellery / luxury variants ─────────────────────────────── */
  gold:
    'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40',
  outlineAmber:
    'bg-transparent border-2 border-amber-200 text-amber-700 hover:border-amber-300 hover:bg-amber-50',
  rose:
    'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40',
  roseOutline:
    'bg-transparent border-2 border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3 text-lg rounded-xl',
  xl: 'px-10 py-4 text-xl rounded-2xl',
}

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      type = 'button',
      onClick,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant] || variantStyles.primary

    // Icon color should follow the variant's text color
    const iconColorClass = (() => {
      switch (variant) {
        case 'ghost':
        case 'outline':
          return 'text-slate-700'
        case 'outlineAmber':
          return 'text-amber-700'
        case 'roseOutline':
          return 'text-rose-600'
        case 'secondary':
          return 'text-slate-900'
        default:
          return 'text-white'
      }
    })()

    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          // Layout
          'relative inline-flex items-center justify-center gap-2',
          // Typography
          'font-semibold whitespace-nowrap',
          // Motion
          'transition-all duration-300',
          // Focus ring
          'focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-white',
          // Disabled
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyle,
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* Loading spinner replaces the left icon slot */}
        {loading && (
          <Loader2
            className={cn('h-4 w-4 shrink-0 animate-spin', iconColorClass)}
          />
        )}

        {/* Left icon (hidden while loading) */}
        {Icon && iconPosition === 'left' && !loading && (
          <Icon className={cn('h-4 w-4 shrink-0', iconColorClass)} />
        )}

        {/* Children — wrapped in an inline-flex so any icons passed as
            children (e.g. <ShoppingBag />) stay on the same row as the text */}
        {children != null && (
          <span
            className={cn(
              'inline-flex items-center gap-2',
              loading && 'opacity-90'
            )}
          >
            {children}
          </span>
        )}

        {/* Right icon (hidden while loading) */}
        {Icon && iconPosition === 'right' && !loading && (
          <Icon className={cn('h-4 w-4 shrink-0', iconColorClass)} />
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
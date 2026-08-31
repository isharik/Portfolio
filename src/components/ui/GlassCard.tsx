'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType
  interactive?: boolean
}

/**
 * Reusable liquid-glass surface. Readable by default (solid enough),
 * with a subtle top-edge light reflection provided by the `.glass` class.
 */
const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { className, children, interactive = false, as: Tag = 'div', ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        'glass rounded-2xl',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--border-strong)]',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default GlassCard

import { cn } from '../ui/utils'

export function GlassCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'glass-card rounded-xl p-6 neomorph',
        className
      )}
    />
  )
}

export function GlassForm({ className, ...props }: React.ComponentProps<'form'>) {
  return (
    <form
      {...props}
      className={cn(
        'glass-card rounded-xl p-6 space-y-6 neomorph',
        className
      )}
    />
  )
}

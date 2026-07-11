import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name: string
  hue: number
  className?: string
}

/** Avatar gerado com as iniciais do usuário sobre uma cor sólida. */
export function UserAvatar({ name, hue, className }: UserAvatarProps) {
  const initials = name
    .trim()
    .split(/[\s_.-]+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold',
        className,
      )}
      style={{
        backgroundColor: `oklch(0.35 0.09 ${hue})`,
        color: `oklch(0.92 0.03 ${hue})`,
      }}
    >
      {initials || '?'}
    </span>
  )
}

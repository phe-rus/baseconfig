import { cn } from '@baseconfig/ui/lib/utils'
import type { ReactNode } from 'react'

type HeaderTemplateProps = {
	className?: string
	headerClassName?: string
	children: ReactNode
}

export function HeaderTemplate({
	className,
	headerClassName,
	children
}: HeaderTemplateProps) {
	return (
		<header className={cn('flex border-border/15 border-b', headerClassName)}>
			<section className={cn('w-full px-5 md:px-10', className)}>
				{children}
			</section>
		</header>
	)
}

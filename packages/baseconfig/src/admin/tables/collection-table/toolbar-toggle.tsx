import { InputGroupButton } from '@baseconfig/ui/components/input-group'
import { cn } from '@baseconfig/ui/lib/utils'
import {
	ArrowDown01FreeIcons,
	ArrowUp01FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

type ToolbarToggleProps = {
	label: string
	open: boolean
	onClick: () => void
	count?: number
}

export function ToolbarToggle({
	label,
	open,
	onClick,
	count
}: ToolbarToggleProps) {
	return (
		<InputGroupButton
			aria-expanded={open}
			className={cn(open && 'bg-accent text-accent-foreground')}
			onClick={onClick}
		>
			{label}
			{count ? ` (${count})` : ''}
			<HugeiconsIcon
				icon={open ? ArrowUp01FreeIcons : ArrowDown01FreeIcons}
				size={12}
				strokeWidth={1.9}
			/>
		</InputGroupButton>
	)
}

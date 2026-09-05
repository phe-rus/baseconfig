import { SentFreeIcons, Tick02FreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function AskAI() {
	return (
		<div className='-translate-x-1/2 fixed bottom-6 left-1/2 flex w-full max-w-md items-center gap-2.5 rounded-full border border-border/35 bg-background py-2 pr-2 pl-4 shadow-lg'>
			<p className='flex-1 text-muted-foreground'>
				Ask AI to help write this page…
			</p>
			<HugeiconsIcon
				icon={SentFreeIcons}
				size={13}
				className='text-muted-foreground'
			/>
			<div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background'>
				<HugeiconsIcon icon={Tick02FreeIcons} size={12} strokeWidth={2.4} />
			</div>
		</div>
	)
}

import { Avatar, AvatarFallback } from '@baseconfig/ui/components/avatar'
import { Button } from '@baseconfig/ui/components/button'
import {
	ArrowLeft01FreeIcons,
	ArrowRight01FreeIcons,
	ArrowUpRight01FreeIcons,
	SidebarLeft01FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export const Headers = () => {
	return (
		<header className='sticky flex top-0 bg-background border-b border-border/35 z-50'>
			<section className='px-5 flex h-10 items-center justify-between w-full'>
				<div className="flex items-center gap-5">
					<nav className='flex items-center gap-1'>
						<Button
							variant='ghost'
							size='icon-sm'
						>
							<HugeiconsIcon
								icon={SidebarLeft01FreeIcons}
							/>
						</Button>
						<Button variant='ghost' size='icon-sm'>
							<HugeiconsIcon
								icon={ArrowLeft01FreeIcons}
							/>
						</Button>
						<Button variant='ghost' size='icon-sm'>
							<HugeiconsIcon
								icon={ArrowRight01FreeIcons}
							/>
						</Button>
					</nav>
					<div className='h-5 w-px bg-border' />
					<span className='text-sm text-muted-foreground'>
						Acme Skincare /
					</span>
					<span className='text-sm text-foreground'>
						dashboard
					</span>
				</div>
				<nav className='flex items-center gap-1'>
					<Button variant='secondary' size='xs'>
						<HugeiconsIcon
							icon={ArrowUpRight01FreeIcons}
							size={13}
							strokeWidth={1.9}
						/>
						Visit site
					</Button>
					<Avatar className='size-7'>
						<AvatarFallback>HQ</AvatarFallback>
					</Avatar>
				</nav>
			</section>
		</header>
	)
}

import { Badge } from '@baseconfig/ui/components/badge'
import { Button } from '@baseconfig/ui/components/button'
import { cn } from '@baseconfig/ui/lib/utils'
import { PlusIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
	Link,
	Outlet,
	useChildMatches,
	useLoaderData
} from '@tanstack/react-router'
import { collections } from '../../documents/data'

const documents = [
	{
		id: 'a1b2c3d4',
		title: 'Homepage',
		status: 'published',
		updatedAt: '2026-09-01'
	},
	{
		id: 'e5f6a7b8',
		title: 'About Us',
		status: 'published',
		updatedAt: '2026-08-28'
	},
	{
		id: 'c9d0e1f2',
		title: 'Contact',
		status: 'draft',
		updatedAt: '2026-08-20'
	},
	{
		id: 'g3h4i5j6',
		title: 'Pricing',
		status: 'published',
		updatedAt: '2026-08-15'
	},
	{
		id: 'k7l8m9n0',
		title: 'Careers',
		status: 'draft',
		updatedAt: '2026-08-02'
	}
]

export function CollectionsComponent() {
	const { slug } = useLoaderData({ strict: false }) as { slug: string }
	const childMatches = useChildMatches()

	if (childMatches.length > 0) {
		return <Outlet />
	}

	const label = collections.find((item) => item.slug === slug)?.label ?? slug

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<h1 className='font-bold text-foreground text-xl'>{label}</h1>
				<Button size='xs' variant='secondary'>
					<HugeiconsIcon icon={PlusIcon} size={13} strokeWidth={1.9} />
					New
				</Button>
			</div>

			<div className='flex flex-col overflow-hidden rounded-md border border-border/35'>
				{documents.map((doc, index) => (
					<Link
						key={doc.id}
						to={'/$slug/$id' as any}
						params={{ slug, id: doc.id } as any}
						className={cn(
							'flex items-center justify-between px-4 py-3 hover:bg-input/35',
							index !== documents.length - 1 && 'border-border/35 border-b'
						)}
					>
						<span className='text-foreground text-sm'>{doc.title}</span>
						<div className='flex items-center gap-3'>
							<Badge
								variant={doc.status === 'published' ? 'secondary' : 'outline'}
							>
								{doc.status}
							</Badge>
							<span className='text-muted-foreground text-xs'>
								{doc.updatedAt}
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

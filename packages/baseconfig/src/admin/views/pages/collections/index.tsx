import { Badge } from '@baseconfig/ui/components/badge'
import { Button } from '@baseconfig/ui/components/button'
import { PlusIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
	Link,
	Outlet,
	useChildMatches,
	useLoaderData
} from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { collections } from '../../documents/data'
import { CollectionTable } from '../../../tables/collection-table'
import { collectionTableFeatures } from '../../../tables/columns'

type Document = {
	id: string
	title: string
	status: 'published' | 'draft'
	updatedAt: string
}

const documents: Document[] = [
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

const columnHelper = createColumnHelper<
	typeof collectionTableFeatures,
	Document
>()

export function CollectionsComponent() {
	const { slug } = useLoaderData({ strict: false }) as { slug: string }
	const childMatches = useChildMatches()

	const columns = useMemo(
		() => [
			columnHelper.accessor('title', {
				header: 'Title',
				cell: (info) => (
					<Link
						to={'/$slug/$id' as any}
						params={{ slug, id: info.row.original.id } as any}
						className='text-foreground hover:underline'
					>
						{info.getValue()}
					</Link>
				)
			}),
			columnHelper.accessor('status', {
				header: 'Status',
				cell: (info) => (
					<Badge
						variant={info.getValue() === 'published' ? 'secondary' : 'outline'}
					>
						{info.getValue()}
					</Badge>
				)
			}),
			columnHelper.accessor('updatedAt', {
				header: 'Updated'
			})
		],
		[slug]
	)

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

			<div className='overflow-hidden rounded-md border border-border/35'>
				<CollectionTable columns={columns} data={documents} />
			</div>
		</div>
	)
}

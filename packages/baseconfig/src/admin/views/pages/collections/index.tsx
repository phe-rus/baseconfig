import { Avatar, AvatarFallback } from '@baseconfig/ui/components/avatar'
import { Button } from '@baseconfig/ui/components/button'
import { PlusIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Outlet, useChildMatches, useLoaderData } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import type { DocumentStatus } from '../../../editor/status-badge'
import { StatusBadge } from '../../../editor/status-badge'
import { collections } from '../../documents/data'
import { CollectionTable } from '../../../tables/collection-table'
import { collectionTableFeatures } from '../../../tables/collection-table/features'

type Author = {
	name: string
	initials: string
}

type Document = {
	id: string
	title: string
	slug: string
	status: DocumentStatus
	author: Author
	createdAt: string
	updatedAt: string
}

const amara: Author = { name: 'Amara N.', initials: 'AN' }
const jonas: Author = { name: 'Jonas T.', initials: 'JT' }

const documents: Document[] = [
	{
		id: 'a1b2c3d4-e5f6-47a8-9b3c-1d2e3f4a5b6c',
		title: 'Homepage',
		slug: 'homepage',
		status: 'published',
		author: amara,
		createdAt: '2026-07-02',
		updatedAt: '2026-09-01'
	},
	{
		id: 'b2c3d4e5-f6a7-48b9-8c4d-2e3f4a5b6c7d',
		title: 'About Us',
		slug: 'about-us',
		status: 'published',
		author: amara,
		createdAt: '2026-07-04',
		updatedAt: '2026-08-28'
	},
	{
		id: 'c3d4e5f6-a7b8-49c0-9d5e-3f4a5b6c7d8e',
		title: 'Contact',
		slug: 'contact',
		status: 'draft',
		author: jonas,
		createdAt: '2026-07-06',
		updatedAt: '2026-08-20'
	},
	{
		id: 'd4e5f6a7-b8c9-40d1-8e6f-4a5b6c7d8e9f',
		title: 'Pricing',
		slug: 'pricing',
		status: 'changed',
		author: amara,
		createdAt: '2026-07-09',
		updatedAt: '2026-08-15'
	},
	{
		id: 'e5f6a7b8-c9d0-41e2-9f70-5b6c7d8e9fa0',
		title: 'Careers',
		slug: 'careers',
		status: 'draft',
		author: jonas,
		createdAt: '2026-07-12',
		updatedAt: '2026-08-02'
	},
	{
		id: 'f6a7b8c9-d0e1-42f3-8081-6c7d8e9fa0b1',
		title: 'Blog',
		slug: 'blog',
		status: 'published',
		author: amara,
		createdAt: '2026-07-15',
		updatedAt: '2026-07-30'
	},
	{
		id: 'a7b8c9d0-e1f2-4304-9192-7d8e9fa0b1c2',
		title: 'FAQ',
		slug: 'faq',
		status: 'published',
		author: jonas,
		createdAt: '2026-07-18',
		updatedAt: '2026-07-22'
	},
	{
		id: 'b8c9d0e1-f2a3-4415-a2a3-8e9fa0b1c2d3',
		title: 'Terms of Service',
		slug: 'terms-of-service',
		status: 'draft',
		author: jonas,
		createdAt: '2026-07-20',
		updatedAt: '2026-07-20'
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
			columnHelper.accessor('id', {
				header: 'ID',
				cell: (info) => (
					<pre className='w-fit rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground'>
						{info.getValue()}
					</pre>
				)
			}),
			columnHelper.accessor('title', {
				header: 'Title',
				cell: (info) => (
					<span className='font-medium text-foreground'>{info.getValue()}</span>
				)
			}),
			columnHelper.accessor('slug', {
				header: 'Slug',
				cell: (info) => (
					<span className='font-mono text-muted-foreground text-xs'>
						/{info.getValue()}
					</span>
				)
			}),
			columnHelper.accessor('status', {
				header: 'Status',
				cell: (info) => <StatusBadge status={info.getValue()} />
			}),
			columnHelper.accessor('author', {
				header: 'Author',
				enableSorting: false,
				cell: (info) => (
					<div className='flex items-center gap-1.5'>
						<Avatar size='sm'>
							<AvatarFallback>{info.getValue().initials}</AvatarFallback>
						</Avatar>
						<span>{info.getValue().name}</span>
					</div>
				)
			}),
			columnHelper.accessor('createdAt', {
				header: 'Created At'
			}),
			columnHelper.accessor('updatedAt', {
				header: 'Updated At'
			})
		],
		[]
	)

	if (childMatches.length > 0) {
		return <Outlet />
	}

	const label = collections.find((item) => item.slug === slug)?.label ?? slug

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex items-center gap-4'>
				<h1 className='font-bold text-5xl text-foreground'>{label}</h1>
				<Button size='sm' variant='secondary'>
					<HugeiconsIcon icon={PlusIcon} size={14} strokeWidth={1.9} />
					Create New
				</Button>
			</div>

			<CollectionTable
				columns={columns}
				data={documents}
				getHref={(row) => `/${slug}/${row.id}`}
			/>
		</div>
	)
}

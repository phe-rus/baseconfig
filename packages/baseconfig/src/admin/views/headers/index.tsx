import { Avatar, AvatarFallback } from '@baseconfig/ui/components/avatar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@baseconfig/ui/components/breadcrumb'
import { Button } from '@baseconfig/ui/components/button'
import {
	ArrowLeft01FreeIcons,
	ArrowRight01FreeIcons,
	ArrowUpRight01FreeIcons,
	SidebarLeft01FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useParams, useRouter } from '@tanstack/react-router'
import { Fragment } from 'react'
import { collections, globals } from '../documents/data'

type Crumb = {
	label: string
	splat?: string
}

const useBreadcrumb = (): Crumb[] => {
	const { _splat } = useParams({ strict: false }) as { _splat?: string }
	const segments = _splat ? _splat.split('/').filter(Boolean) : []
	const root: Crumb = { label: 'Baseconfig' }

	if (segments.length === 0) {
		return [root]
	}

	const [slug, id] = segments

	if (slug === 'globals') {
		const global = globals.find((item) => item.slug === segments[1])
		return [root, { label: global?.label ?? segments[1], splat: _splat }]
	}

	const collection = collections.find((item) => item.slug === slug)
	const label = collection?.label ?? slug

	if (id) {
		return [root, { label, splat: slug }, { label: id, splat: _splat }]
	}

	return [root, { label, splat: slug }]
}

export const Headers = () => {
	const router = useRouter()
	const crumbs = useBreadcrumb()

	return (
		<header className='sticky flex top-0 bg-background border-b border-border/35 z-50'>
			<section className='px-5 flex h-10 items-center justify-between w-full'>
				<div className='flex items-center gap-5'>
					<nav className='flex items-center gap-1'>
						<Button variant='ghost' size='icon-sm'>
							<HugeiconsIcon icon={SidebarLeft01FreeIcons} />
						</Button>
						<Button
							variant='ghost'
							size='icon-sm'
							onClick={() => router.history.back()}
						>
							<HugeiconsIcon icon={ArrowLeft01FreeIcons} />
						</Button>
						<Button
							variant='ghost'
							size='icon-sm'
							onClick={() => router.history.forward()}
						>
							<HugeiconsIcon icon={ArrowRight01FreeIcons} />
						</Button>
					</nav>
					<div className='h-4 w-0.5 bg-primary/35' />
					<Breadcrumb data-not-typeset>
						<BreadcrumbList className='text-sm'>
							{crumbs.map((crumb, index) => (
								<Fragment key={crumb.label}>
									<BreadcrumbItem>
										<BreadcrumbLink
											className={index > 0 ? 'lowercase' : undefined}
											render={
												crumb.splat === undefined ? (
													<Link to='/admin' />
												) : (
													<Link
														to='/admin/$'
														params={{ _splat: crumb.splat }}
													/>
												)
											}
										>
											{crumb.label}
										</BreadcrumbLink>
									</BreadcrumbItem>
									{index < crumbs.length - 1 && <BreadcrumbSeparator />}
								</Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
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
					<Avatar className='size-5!'>
						<AvatarFallback className='text-[6px]!'>HQ</AvatarFallback>
					</Avatar>
				</nav>
			</section>
		</header>
	)
}

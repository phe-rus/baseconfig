import { cn } from '@baseconfig/ui/lib/utils'
import {
	File01FreeIcons,
	Image01FreeIcons,
	Layout01FreeIcons,
	News01FreeIcons,
	Settings02FreeIcons,
	UserGroupFreeIcons
} from '@hugeicons/core-free-icons'
import { Viewmodel } from './view-model'

const stats = [
	{ label: 'Published Pages', value: '24', sub: 'Live on the site' },
	{ label: 'Drafts', value: '3', sub: 'Awaiting publish' },
	{ label: 'Media Files', value: '156', sub: 'In R2 storage' },
	{ label: 'Team Members', value: '4', sub: 'Across 3 roles' }
]

const collections = [
	{ label: 'Pages', slug: 'pages', count: 24, icon: File01FreeIcons },
	{ label: 'Posts', slug: 'posts', count: 12, icon: News01FreeIcons },
	{ label: 'Media', slug: 'media', count: 156, icon: Image01FreeIcons },
	{ label: 'Users', slug: 'users', count: 4, icon: UserGroupFreeIcons }
]

const globals = [
	{ label: 'Headers', slug: 'headers', icon: Layout01FreeIcons },
	{ label: 'Site Settings', slug: 'site-settings', icon: Settings02FreeIcons }
]

export function Documents() {
	return (
		<>
			<section className='flex flex-col'>
				<h1>Acme Skincare</h1>
				<p className='text-muted-foreground'>
					Collections and globals for this site
				</p>
			</section>

			<section
				className={cn(
					'grid grid-cols-4 divide-x divide-border/25 cursor-pointer',
					'overflow-hidden rounded-md border shadow border-border/35',
					'bg-input/35! hover:shadow-md shadow-primary/15 backdrop-blur',
					'transition-shadow duration-300 ease-out hover:-translate-y-1!'
				)}
			>
				{stats.map((stat) => (
					<article key={stat.label} className='p-5'>
						<h1 className='font-black'>{stat.value}</h1>
						<h2 className='text-sm!'>{stat.label}</h2>
						<p className='text-xs!'>{stat.sub}</p>
					</article>
				))}
			</section>

			<Viewmodel title='Collections' items={collections} />

			<Viewmodel title='Globals' items={globals} />
		</>
	)
}

export { collections, globals }

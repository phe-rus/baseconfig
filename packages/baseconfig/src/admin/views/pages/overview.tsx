import { cn } from '@baseconfig/ui/lib/utils'
import { useAdminConfig } from '../config-context'
import { Viewmodel } from '../components/view-model'

const stats = [
	{ label: 'Published Pages', value: '24', sub: 'Live on the site' },
	{ label: 'Drafts', value: '3', sub: 'Awaiting publish' },
	{ label: 'Media Files', value: '156', sub: 'In R2 storage' },
	{ label: 'Team Members', value: '4', sub: 'Across 3 roles' }
]

export function OverviewComponent() {
	const config = useAdminConfig()

	const collections = (config.collections ?? []).map((collection) => ({
		label: collection.labels?.plural ?? collection.slug,
		slug: collection.slug
	}))

	const globals = (config.globals ?? []).map((global) => ({
		label: global.label ?? global.slug,
		slug: global.slug
	}))

	return (
		<div
			className={cn(
				'container flex w-full flex-col py-10',
				'gap-5 md:max-w-4xl!'
			)}
		>
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

			<Viewmodel title='Collections' kind='collection' items={collections} />

			<Viewmodel title='Globals' kind='global' items={globals} />
		</div>
	)
}

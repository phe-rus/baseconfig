import { cn } from '@baseconfig/ui/lib/utils'
import { useParams } from '@tanstack/react-router'
import { getRouteData } from './config/get-route-data'
import { Documents } from './documents/documents'

export function RouteComponents() {
	const { _splat } = useParams({ strict: false }) as { _splat?: string }
	const { viewType, routeParams } = getRouteData(_splat)

	return (
		<article
			className={cn(
				'container flex flex-col w-full py-10',
				'gap-5 md:max-w-4xl!'
			)}
		>
			{viewType === 'dashboard' && <Documents />}

			{viewType === 'list' && (
				<div className='text-sm text-muted-foreground'>
					Collection list for "{routeParams.collection}" — Sub-stage 1B
				</div>
			)}

			{viewType === 'document' && (
				<div className='text-sm text-muted-foreground'>
					Document editor for "{routeParams.collection ?? routeParams.global}
					{routeParams.id ? `/${routeParams.id}` : ''}" — Sub-stage 1C
				</div>
			)}

			{viewType === 'not-found' && (
				<div className='text-sm text-muted-foreground'>Not found</div>
			)}
		</article>
	)
}

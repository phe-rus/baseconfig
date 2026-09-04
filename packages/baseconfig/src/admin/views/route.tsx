import { cn } from '@baseconfig/ui/lib/utils'
import { useLoaderData } from '@tanstack/react-router'
import { Documents } from './documents/documents'
import type { RouteData } from './types'

export function RouteComponents() {
	const { viewType, routeParams } = useLoaderData({
		strict: false
	}) as RouteData

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
					Document editor for
					{routeParams.collection
						? `Collection: ${routeParams.collection}`
						: `Global: ${routeParams.global}`}
					{routeParams.id ? ` | Document ID: ${routeParams.id}` : ''} —
					Sub-stage 1C
				</div>
			)}
		</article>
	)
}

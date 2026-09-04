import { cn } from '@baseconfig/ui/lib/utils'
import { Documents } from './documents'

export function RouteComponents() {
	return (
		<article className={cn(
			'container flex flex-col w-full py-10',
			'gap-5 md:max-w-4xl!'
		)}>
			<Documents />
		</article>
	)
}
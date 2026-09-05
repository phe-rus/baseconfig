import { useLoaderData } from '@tanstack/react-router'

export function GlobalsComponent() {
	const { slug } = useLoaderData({ strict: false }) as { slug: string }

	return (
		<div className='text-sm text-muted-foreground'>
			Global editor for "{slug}" — Sub-stage 1C
		</div>
	)
}

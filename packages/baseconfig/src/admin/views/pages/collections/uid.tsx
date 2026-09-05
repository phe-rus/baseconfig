import { useParams } from '@tanstack/react-router'

export function UUIDComponent() {
	const { slug, id } = useParams({ strict: false }) as {
		slug?: string
		id?: string
	}

	return (
		<div className='text-sm text-muted-foreground'>
			Document editor for "{slug}/{id}" — Sub-stage 1C
		</div>
	)
}

import { Tabs, TabsList, TabsTrigger } from '@baseconfig/ui/components/tabs'
import { HeaderTemplate } from './header-template'

const VIEWS = [
	{ id: 'edit', label: 'Edit' },
	{ id: 'live-preview', label: 'Live Preview' },
	{ id: 'api', label: 'API' }
] as const

type HeadersOneProps = {
	title: string
}

export function HeadersOne({ title }: HeadersOneProps) {
	return (
		<HeaderTemplate className='flex h-10 items-center justify-between'>
			<h1 className='text-base!'>{title}</h1>
			<Tabs defaultValue='edit'>
				<TabsList variant='line'>
					{VIEWS.map((view) => (
						<TabsTrigger
							key={view.id}
							value={view.id}
							disabled={view.id !== 'edit'}
						>
							{view.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</HeaderTemplate>
	)
}

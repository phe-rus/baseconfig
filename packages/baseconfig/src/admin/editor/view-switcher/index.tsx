import { Tabs, TabsList, TabsTrigger } from '@baseconfig/ui/components/tabs'

const VIEWS = [
	{ id: 'edit', label: 'Edit' },
	{ id: 'live-preview', label: 'Live Preview' },
	{ id: 'api', label: 'API' }
] as const

export function ViewSwitcher() {
	return (
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
	)
}

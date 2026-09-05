import { TabsList, TabsTrigger } from '@baseconfig/ui/components/tabs'
import { HeaderTemplate } from './header-template'

const EDITOR_TABS = [
	{ id: 'hero', label: 'Hero' },
	{ id: 'layout', label: 'Layout' },
	{ id: 'seo', label: 'SEO' },
	{ id: 'settings', label: 'Settings' }
] as const

export function HeadersThree() {
	return (
		<HeaderTemplate headerClassName='sticky top-10 z-40 bg-background'>
			<TabsList variant='line'>
				{EDITOR_TABS.map((tab) => (
					<TabsTrigger key={tab.id} value={tab.id}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</HeaderTemplate>
	)
}

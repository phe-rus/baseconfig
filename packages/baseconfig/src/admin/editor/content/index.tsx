import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@baseconfig/ui/components/tabs'
import { EDITOR_TABS } from '../data'
import type { DocumentStatus } from '../status-badge'
import { HeroPanel } from './hero'
import { LayoutPanel } from './layout'
import { SeoPanel } from './seo'
import { SettingsPanel } from './settings'

type EditorTabsProps = {
	status: DocumentStatus
	updatedAt: string
}

export function EditorTabs({ status, updatedAt }: EditorTabsProps) {
	return (
		<Tabs defaultValue='hero'>
			<TabsList variant='line'>
				{EDITOR_TABS.map((tab) => (
					<TabsTrigger key={tab.id} value={tab.id}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>

			<TabsContent value='hero'>
				<HeroPanel />
			</TabsContent>
			<TabsContent value='layout'>
				<LayoutPanel />
			</TabsContent>
			<TabsContent value='seo'>
				<SeoPanel />
			</TabsContent>
			<TabsContent value='settings'>
				<SettingsPanel status={status} updatedAt={updatedAt} />
			</TabsContent>
		</Tabs>
	)
}

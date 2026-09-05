import { TabsContent } from '@baseconfig/ui/components/tabs'
import type { DocumentStatus } from '../status-badge'
import { HeroPanel } from './hero'
import { LayoutPanel } from './layout'
import { SeoPanel } from './seo'
import { SettingsPanel } from './settings'

type EditorContentProps = {
	status: DocumentStatus
	updatedAt: string
}

export function EditorContent({ status, updatedAt }: EditorContentProps) {
	return (
		<div className='container md:max-w-3xl'>
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
		</div>
	)
}

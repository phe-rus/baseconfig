import { Tabs } from '@baseconfig/ui/components/tabs'
import { AskAI } from '../../../editor/ask-ai'
import { EditorContent } from '../../../editor/content'
import { mockHero } from '../../../editor/content/hero/data'
import { HeadersOne } from '../../../editor/headers/headers-one'
import { HeadersThree } from '../../../editor/headers/headers-three'
import { HeadersTwo } from '../../../editor/headers/headers-two'

export function UUIDComponent() {
	return (
		<div className='flex flex-col pb-24'>
			<HeadersOne title={mockHero.title} />
			<HeadersTwo
				status='draft'
				createdAt='Jul 2, 2026'
				updatedAt='2 min ago'
			/>
			<Tabs defaultValue='hero'>
				<HeadersThree />
				<EditorContent status='draft' updatedAt='2 min ago' />
			</Tabs>
			<AskAI />
		</div>
	)
}

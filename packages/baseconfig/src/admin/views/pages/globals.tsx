import { Tabs } from '@baseconfig/ui/components/tabs'
import { useLoaderData } from '@tanstack/react-router'
import { AskAI } from '../../editor/ask-ai'
import { EditorContent } from '../../editor/content'
import { HeadersOne } from '../../editor/headers/headers-one'
import { HeadersThree } from '../../editor/headers/headers-three'
import { HeadersTwo } from '../../editor/headers/headers-two'
import { globals } from '../documents/data'

export function GlobalsComponent() {
	const { slug } = useLoaderData({ strict: false }) as { slug: string }
	const label = globals.find((item) => item.slug === slug)?.label ?? slug

	return (
		<div className='flex flex-col pb-24'>
			<HeadersOne title={label} />
			<HeadersTwo
				status='published'
				createdAt='Jul 2, 2026'
				updatedAt='2 min ago'
			/>
			<Tabs defaultValue='hero'>
				<HeadersThree />
				<EditorContent status='published' updatedAt='2 min ago' />
			</Tabs>
			<AskAI />
		</div>
	)
}

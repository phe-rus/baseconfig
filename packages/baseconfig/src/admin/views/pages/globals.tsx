import { useLoaderData } from '@tanstack/react-router'
import { AskAI } from '../../editor/ask-ai'
import { EditorControls } from '../../editor/controls'
import { EditorTabs } from '../../editor/tabs'
import { ViewSwitcher } from '../../editor/view-switcher'
import { globals } from '../documents/data'

export function GlobalsComponent() {
	const { slug } = useLoaderData({ strict: false }) as { slug: string }
	const label = globals.find((item) => item.slug === slug)?.label ?? slug

	return (
		<div className='flex flex-col gap-4 pb-24'>
			<div className='flex items-center justify-between'>
				<h1 className='font-bold text-3xl text-foreground'>{label}</h1>
				<ViewSwitcher />
			</div>
			<EditorControls status='published' updatedAt='2 min ago' />
			<EditorTabs status='published' updatedAt='2 min ago' />
			<AskAI />
		</div>
	)
}

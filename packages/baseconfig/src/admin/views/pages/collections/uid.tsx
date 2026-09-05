import { AskAI } from '../../../editor/ask-ai'
import { EditorControls } from '../../../editor/controls'
import { mockHero } from '../../../editor/data'
import { EditorTabs } from '../../../editor/tabs'
import { ViewSwitcher } from '../../../editor/view-switcher'

export function UUIDComponent() {
	return (
		<div className='flex flex-col gap-4 pb-24'>
			<div className='flex items-center justify-between'>
				<h1 className='font-bold text-3xl text-foreground'>{mockHero.title}</h1>
				<ViewSwitcher />
			</div>
			<EditorControls status='draft' updatedAt='2 min ago' />
			<EditorTabs status='draft' updatedAt='2 min ago' />
			<AskAI />
		</div>
	)
}

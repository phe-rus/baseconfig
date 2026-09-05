import { Button } from '@baseconfig/ui/components/button'
import {
	CloudUploadFreeIcons,
	FloppyDiskFreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { DocumentStatus } from '../status-badge'

type EditorControlsProps = {
	status: DocumentStatus
	updatedAt: string
}

const STATUS_LABEL: Record<DocumentStatus, string> = {
	draft: 'Draft',
	published: 'Published',
	changed: 'Changed'
}

export function EditorControls({ status, updatedAt }: EditorControlsProps) {
	return (
		<div className='flex items-center justify-between border-border/35 border-y py-3'>
			<p className='text-muted-foreground'>
				Status:{' '}
				<strong className='text-foreground'>{STATUS_LABEL[status]}</strong> ·
				saved {updatedAt}
			</p>
			<div className='flex items-center gap-2'>
				<Button variant='secondary' size='sm' disabled>
					<HugeiconsIcon
						icon={FloppyDiskFreeIcons}
						size={13}
						strokeWidth={1.9}
					/>
					Save Draft
				</Button>
				<Button variant='default' size='sm' disabled>
					<HugeiconsIcon
						icon={CloudUploadFreeIcons}
						size={13}
						strokeWidth={1.9}
					/>
					Publish
				</Button>
			</div>
		</div>
	)
}

import { Button } from '@baseconfig/ui/components/button'
import {
	CloudUploadFreeIcons,
	FloppyDiskFreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { DocumentStatus } from '../status-badge'
import { HeaderTemplate } from './header-template'

const STATUS_LABEL: Record<DocumentStatus, string> = {
	draft: 'Draft',
	published: 'Published',
	changed: 'Changed'
}

type HeadersTwoProps = {
	status: DocumentStatus
	createdAt: string
	updatedAt: string
}

export function HeadersTwo({ status, createdAt, updatedAt }: HeadersTwoProps) {
	return (
		<HeaderTemplate className='flex items-center justify-between py-3'>
			<div className='flex items-center gap-3'>
				<p className='text-sm!'>
					Status:{' '}
					<strong className='text-foreground text-xs!'>{STATUS_LABEL[status]}</strong>
				</p>
				<p className='text-muted-foreground text-xs!'>
					Created: <strong className='text-foreground text-xs!'>{createdAt}</strong>
				</p>
				<p className='text-muted-foreground text-xs!'>
					Updated: <strong className='text-foreground text-xs!'>{updatedAt}</strong>
				</p>
			</div>
			<div className='flex items-center gap-2'>
				<Button variant='secondary' size='xs' disabled>
					<HugeiconsIcon icon={FloppyDiskFreeIcons} />
					Save Draft
				</Button>
				<Button variant='default' size='xs' disabled>
					<HugeiconsIcon icon={CloudUploadFreeIcons} />
					Publish
				</Button>
			</div>
		</HeaderTemplate>
	)
}

import { Avatar, AvatarFallback } from '@baseconfig/ui/components/avatar'
import { Button } from '@baseconfig/ui/components/button'
import { Input } from '@baseconfig/ui/components/input'
import {
	NativeSelect,
	NativeSelectOption
} from '@baseconfig/ui/components/native-select'
import { Separator } from '@baseconfig/ui/components/separator'
import {
	AddCircleFreeIcons,
	Cancel01FreeIcons,
	PencilEdit02FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { mockDocumentCreatedAt, mockSettings } from '../data'
import type { DocumentStatus } from '../status-badge'

const STATUS_LABEL: Record<DocumentStatus, string> = {
	draft: 'Draft',
	published: 'Published',
	changed: 'Changed'
}

type SettingsPanelProps = {
	status: DocumentStatus
	updatedAt: string
}

export function SettingsPanel({ status, updatedAt }: SettingsPanelProps) {
	return (
		<div className='flex flex-col gap-5 pt-4'>
			<div className='flex flex-col gap-2'>
				<p>Authors</p>
				<div className='flex flex-col gap-1.5'>
					{mockSettings.authors.map((author) => (
						<div
							key={author.id}
							className='flex items-center gap-2.5 rounded-md border border-border/35 p-2'
						>
							<Avatar size='sm'>
								<AvatarFallback>{author.initials}</AvatarFallback>
							</Avatar>
							<div className='min-w-0 flex-1'>
								<p className='font-medium text-foreground'>{author.name}</p>
								<p className='text-muted-foreground'>{author.email}</p>
							</div>
							<Button variant='ghost' size='icon-xs'>
								<HugeiconsIcon icon={Cancel01FreeIcons} size={12} />
							</Button>
						</div>
					))}
				</div>
				<Button variant='outline' size='sm' className='w-fit'>
					<HugeiconsIcon
						icon={AddCircleFreeIcons}
						size={12}
						strokeWidth={1.9}
					/>
					Add Author
				</Button>
			</div>

			<div className='flex flex-col gap-1.5'>
				<div className='flex items-center justify-between'>
					<p>Slug</p>
					<HugeiconsIcon
						icon={PencilEdit02FreeIcons}
						size={12}
						className='text-muted-foreground'
					/>
				</div>
				<Input defaultValue={mockSettings.slug} />
				<pre>{mockSettings.resolvedUrl}</pre>
			</div>

			<label className='flex flex-col gap-1.5'>
				<p>Parent</p>
				<NativeSelect defaultValue={mockSettings.parent}>
					<NativeSelectOption value='Top Level'>
						— Top Level —
					</NativeSelectOption>
				</NativeSelect>
			</label>

			<div className='flex flex-col gap-2'>
				<p>Tags</p>
				<div className='flex flex-wrap items-center gap-1.5'>
					{mockSettings.tags.map((tag) => (
						<span
							key={tag}
							className='flex items-center gap-1.5 rounded-full bg-muted py-1 pr-1.5 pl-2.5'
						>
							{tag}
							<HugeiconsIcon
								icon={Cancel01FreeIcons}
								size={11}
								className='text-muted-foreground'
							/>
						</span>
					))}
					<Button variant='outline' size='xs'>
						<HugeiconsIcon
							icon={AddCircleFreeIcons}
							size={11}
							strokeWidth={1.9}
						/>
						Add Tag
					</Button>
				</div>
			</div>

			<Separator />

			<div className='flex flex-col gap-2'>
				<h6>Document Info</h6>
				<div className='flex flex-col gap-1.5'>
					<div className='flex items-center justify-between'>
						<p>Status</p>
						<p className='font-medium text-foreground'>
							{STATUS_LABEL[status]}
						</p>
					</div>
					<div className='flex items-center justify-between'>
						<p>Created</p>
						<p>{mockDocumentCreatedAt}</p>
					</div>
					<div className='flex items-center justify-between'>
						<p>Updated</p>
						<p>{updatedAt}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

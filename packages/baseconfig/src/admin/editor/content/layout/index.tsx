import { Button } from '@baseconfig/ui/components/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@baseconfig/ui/components/collapsible'
import { Label } from '@baseconfig/ui/components/label'
import {
	NativeSelect,
	NativeSelectOption
} from '@baseconfig/ui/components/native-select'
import { cn } from '@baseconfig/ui/lib/utils'
import {
	AddCircleFreeIcons,
	ArrowDown01FreeIcons,
	DragDropFreeIcons,
	TextBoldFreeIcons,
	TextItalicFreeIcons,
	TextUnderlineFreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { mockLayout } from './data'

export function LayoutPanel() {
	return (
		<div className='flex flex-col gap-4 pt-4'>
			<div className='flex items-center justify-between'>
				<p className='font-semibold text-foreground'>
					Layout{' '}
					<span className='font-normal text-muted-foreground'>
						· the page body, block by block
					</span>
				</p>
				<Button
					variant='outline'
					size='sm'
					className='rounded-full border-dashed'
				>
					<HugeiconsIcon
						icon={AddCircleFreeIcons}
						size={12}
						strokeWidth={1.9}
					/>
					Add Block
				</Button>
			</div>

			<div className='flex flex-col gap-2'>
				{mockLayout.map((block, index) => (
					<Collapsible key={block.id} defaultOpen={index === 0}>
						<div className='rounded-md border border-border/35'>
							<CollapsibleTrigger className='flex w-full items-center gap-2.5 p-3'>
								<HugeiconsIcon
									icon={DragDropFreeIcons}
									size={13}
									className='text-muted-foreground'
								/>
								<div
									className={cn('size-6 shrink-0 rounded-md', block.colorClass)}
								/>
								<div className='flex-1 text-left'>
									<p className='font-medium text-foreground'>{block.label}</p>
									<p className='text-muted-foreground'>{block.description}</p>
								</div>
								<HugeiconsIcon
									icon={ArrowDown01FreeIcons}
									size={13}
									className='text-muted-foreground'
								/>
							</CollapsibleTrigger>
							{block.body && (
								<CollapsibleContent className='flex flex-col gap-3 border-border/35 border-t p-3'>
									<div className='flex max-w-56 flex-col gap-1.5'>
										<Label className='text-muted-foreground'>
											Column Width
										</Label>
										<NativeSelect defaultValue={block.columnWidth} size='sm'>
											<NativeSelectOption value='Full'>Full</NativeSelectOption>
											<NativeSelectOption value='Half'>Half</NativeSelectOption>
										</NativeSelect>
									</div>
									<div className='flex flex-col gap-1.5'>
										<Label className='text-muted-foreground'>Rich Text</Label>
										<div className='rounded-md border border-border/35'>
											<div className='flex items-center gap-1 border-border/35 border-b p-1.5'>
												<Button variant='ghost' size='icon-xs'>
													<HugeiconsIcon icon={TextBoldFreeIcons} size={13} />
												</Button>
												<Button variant='ghost' size='icon-xs'>
													<HugeiconsIcon icon={TextItalicFreeIcons} size={13} />
												</Button>
												<Button variant='ghost' size='icon-xs'>
													<HugeiconsIcon
														icon={TextUnderlineFreeIcons}
														size={13}
													/>
												</Button>
											</div>
											<p className='p-3'>{block.body}</p>
										</div>
									</div>
								</CollapsibleContent>
							)}
						</div>
					</Collapsible>
				))}
			</div>
		</div>
	)
}

import { Badge } from '@baseconfig/ui/components/badge'
import { Button } from '@baseconfig/ui/components/button'
import { Checkbox } from '@baseconfig/ui/components/checkbox'
import { Input } from '@baseconfig/ui/components/input'
import {
	NativeSelect,
	NativeSelectOption
} from '@baseconfig/ui/components/native-select'
import {
	ToggleGroup,
	ToggleGroupItem
} from '@baseconfig/ui/components/toggle-group'
import {
	AddCircleFreeIcons,
	DragDropFreeIcons,
	Heading01FreeIcons,
	ListViewFreeIcons,
	TextBoldFreeIcons,
	TextItalicFreeIcons,
	TextUnderlineFreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { HERO_TYPES, mockHero } from '../data'

export function HeroPanel() {
	return (
		<div className='flex flex-col gap-5 pt-4'>
			<label className='flex flex-col gap-1.5'>
				<p>Title</p>
				<Input defaultValue={mockHero.title} />
			</label>

			<div className='flex flex-col gap-1.5'>
				<p>Type</p>
				<ToggleGroup variant='outline' defaultValue={[mockHero.type]}>
					{HERO_TYPES.map((type) => (
						<ToggleGroupItem key={type} value={type}>
							{type}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			<div className='flex flex-col gap-1.5'>
				<p>Intro Content</p>
				<div className='rounded-md border border-border/35'>
					<div className='flex items-center gap-1 border-border/35 border-b p-1.5'>
						<Button variant='ghost' size='icon-xs'>
							<HugeiconsIcon icon={TextBoldFreeIcons} size={13} />
						</Button>
						<Button variant='ghost' size='icon-xs'>
							<HugeiconsIcon icon={TextItalicFreeIcons} size={13} />
						</Button>
						<Button variant='ghost' size='icon-xs'>
							<HugeiconsIcon icon={TextUnderlineFreeIcons} size={13} />
						</Button>
						<div className='mx-1 h-4 w-px bg-border/35' />
						<Button variant='ghost' size='icon-xs'>
							<HugeiconsIcon icon={Heading01FreeIcons} size={13} />
						</Button>
						<Button variant='ghost' size='icon-xs'>
							<HugeiconsIcon icon={ListViewFreeIcons} size={13} />
						</Button>
					</div>
					<div className='p-3'>
						<p className='font-semibold text-foreground text-lg'>
							{mockHero.introHeading}
						</p>
						<p>{mockHero.introBody}</p>
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-1.5'>
				<p>Media</p>
				<div className='flex items-center gap-2.5 rounded-md border border-border/35 p-2'>
					<div className='size-10 shrink-0 rounded-md bg-linear-to-br from-amber-200 to-amber-400' />
					<pre className='flex-1'>{mockHero.mediaFile}</pre>
					<Button variant='link' size='sm'>
						Replace
					</Button>
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<p>Links</p>
					<Button variant='outline' size='sm'>
						<HugeiconsIcon
							icon={AddCircleFreeIcons}
							size={12}
							strokeWidth={1.9}
						/>
						Add Link
					</Button>
				</div>
				<div className='rounded-md border border-border/35'>
					{mockHero.links.map((link) => (
						<div key={link.id} className='flex flex-col'>
							<div className='flex items-center gap-2.5 border-border/35 border-b p-2.5'>
								<HugeiconsIcon
									icon={DragDropFreeIcons}
									size={13}
									className='text-muted-foreground'
								/>
								<Badge variant='secondary'>Button</Badge>
								<p className='flex-1 font-medium text-foreground'>
									{link.label}
								</p>
							</div>
							<div className='flex flex-col gap-3 p-3'>
								<ToggleGroup variant='outline' defaultValue={[link.type]}>
									<ToggleGroupItem value='internal'>
										Internal Link
									</ToggleGroupItem>
									<ToggleGroupItem value='custom'>Custom URL</ToggleGroupItem>
								</ToggleGroup>
								<div className='grid grid-cols-2 gap-3'>
									<label className='flex flex-col gap-1.5'>
										<p>Label</p>
										<Input defaultValue={link.label} />
									</label>
									<label className='flex flex-col gap-1.5'>
										<p>URL</p>
										<Input defaultValue={link.url} />
									</label>
								</div>
								<div className='flex items-center justify-between'>
									<label className='flex items-center gap-2'>
										<Checkbox defaultChecked={link.openInNewTab} />
										<p>Open in new tab</p>
									</label>
									<div className='flex items-center gap-2'>
										<p>Appearance</p>
										<NativeSelect defaultValue={link.appearance} size='sm'>
											<NativeSelectOption value='Default'>
												Default
											</NativeSelectOption>
											<NativeSelectOption value='Outline'>
												Outline
											</NativeSelectOption>
										</NativeSelect>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

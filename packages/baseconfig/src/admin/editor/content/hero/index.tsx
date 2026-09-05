import { Badge } from '@baseconfig/ui/components/badge'
import { Button } from '@baseconfig/ui/components/button'
import { Checkbox } from '@baseconfig/ui/components/checkbox'
import { Input } from '@baseconfig/ui/components/input'
import { Label } from '@baseconfig/ui/components/label'
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
import { HERO_TYPES, mockHero } from './data'

export function HeroPanel() {
	return (
		<div className='flex flex-col gap-5 pt-4'>
			<p className='font-semibold text-foreground'>
				Hero{' '}
				<span className='font-normal text-muted-foreground'>
					· appears at the top of the page
				</span>
			</p>

			<div className='flex flex-col gap-1.5'>
				<Label className='text-muted-foreground'>Title</Label>
				<Input defaultValue={mockHero.title} />
			</div>

			<div className='flex flex-col gap-1.5'>
				<Label className='text-muted-foreground'>Type</Label>
				<ToggleGroup variant='outline' defaultValue={[mockHero.type]}>
					{HERO_TYPES.map((type) => (
						<ToggleGroupItem
							key={type}
							value={type}
							className='rounded-full data-[state=on]:bg-foreground data-[state=on]:text-background'
						>
							{type}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			<div className='flex flex-col gap-1.5'>
				<Label className='text-muted-foreground'>Intro Content</Label>
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
				<Label className='text-muted-foreground'>Media</Label>
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
					<Label className='text-muted-foreground'>Links</Label>
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
									<ToggleGroupItem
										value='internal'
										className='rounded-full data-[state=on]:bg-foreground data-[state=on]:text-background'
									>
										Internal Link
									</ToggleGroupItem>
									<ToggleGroupItem
										value='custom'
										className='rounded-full data-[state=on]:bg-foreground data-[state=on]:text-background'
									>
										Custom URL
									</ToggleGroupItem>
								</ToggleGroup>
								<div className='grid grid-cols-2 gap-3'>
									<div className='flex flex-col gap-1.5'>
										<Label className='text-muted-foreground'>Label</Label>
										<Input defaultValue={link.label} />
									</div>
									<div className='flex flex-col gap-1.5'>
										<Label className='text-muted-foreground'>URL</Label>
										<Input defaultValue={link.url} />
									</div>
								</div>
								<div className='flex items-center justify-between'>
									<label className='flex items-center gap-2'>
										<Checkbox defaultChecked={link.openInNewTab} />
										<p>Open in new tab</p>
									</label>
									<div className='flex items-center gap-2'>
										<Label className='text-muted-foreground'>Appearance</Label>
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

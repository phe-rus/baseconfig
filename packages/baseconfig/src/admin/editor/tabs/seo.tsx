import { Badge } from '@baseconfig/ui/components/badge'
import { Button } from '@baseconfig/ui/components/button'
import { Input } from '@baseconfig/ui/components/input'
import { Progress } from '@baseconfig/ui/components/progress'
import { Textarea } from '@baseconfig/ui/components/textarea'
import { mockSeo } from '../data'

export function SeoPanel() {
	const titlePercent = Math.round(
		(mockSeo.metaTitle.length / mockSeo.metaTitleMax) * 100
	)
	const descriptionPercent = Math.round(
		(mockSeo.metaDescription.length / mockSeo.metaDescriptionMax) * 100
	)

	return (
		<div className='flex flex-col gap-5 pt-4'>
			<div className='flex flex-col gap-1.5'>
				<div className='flex items-center justify-between'>
					<p>Meta Title</p>
					<div className='flex items-center gap-1.5'>
						<Badge variant='secondary'>Good</Badge>
						<p className='text-muted-foreground'>
							{mockSeo.metaTitle.length} / {mockSeo.metaTitleMax}
						</p>
					</div>
				</div>
				<Input defaultValue={mockSeo.metaTitle} />
				<Progress value={titlePercent} />
				<p className='text-muted-foreground'>
					Auto-generated from Title · edit to override
				</p>
			</div>

			<div className='flex flex-col gap-1.5'>
				<div className='flex items-center justify-between'>
					<p>Meta Description</p>
					<div className='flex items-center gap-1.5'>
						<Badge variant='secondary'>Good</Badge>
						<p className='text-muted-foreground'>
							{mockSeo.metaDescription.length} / {mockSeo.metaDescriptionMax}
						</p>
					</div>
				</div>
				<Textarea defaultValue={mockSeo.metaDescription} />
				<Progress value={descriptionPercent} />
			</div>

			<div className='flex flex-col gap-1.5'>
				<p>Meta Image</p>
				<div className='flex items-center gap-2.5 rounded-md border border-border/35 p-2'>
					<div className='size-10 shrink-0 rounded-md bg-gradient-to-br from-amber-200 to-amber-400' />
					<pre className='flex-1'>{mockSeo.metaImage}</pre>
					<Button variant='link' size='sm'>
						Replace
					</Button>
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<h6>Search Result Preview</h6>
				<div className='flex flex-col gap-1 rounded-md border border-border/35 p-4'>
					<p className='text-blue-700 dark:text-blue-400'>
						{mockSeo.metaTitle}
					</p>
					<pre className='text-green-700 dark:text-green-500'>
						{mockSeo.previewUrl}
					</pre>
					<p>{mockSeo.metaDescription}</p>
				</div>
			</div>
		</div>
	)
}

import type { Block } from '@baseconfig/core'

export const mediaBlock: Block = {
	slug: 'media',
	fields: [
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: true
		},
		{
			name: 'caption',
			type: 'text'
		}
	]
}

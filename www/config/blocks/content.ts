import type { Block } from '@baseconfig/core'

export const contentBlock: Block = {
	slug: 'content',
	fields: [
		{
			name: 'heading',
			type: 'text'
		},
		{
			name: 'body',
			type: 'richtext'
		}
	]
}

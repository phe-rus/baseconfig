import type { Block } from '@baseconfig/core'

export const ctaBlock: Block = {
	slug: 'cta',
	fields: [
		{
			name: 'heading',
			type: 'text',
			required: true
		},
		{
			name: 'buttonLabel',
			type: 'text'
		},
		{
			name: 'buttonUrl',
			type: 'text'
		}
	]
}

import { defineGlobal } from '@baseconfig/core'

export const footer = defineGlobal({
	slug: 'footer',
	label: 'Footer',
	fields: [
		{
			name: 'navItems',
			type: 'array',
			fields: [
				{ name: 'label', type: 'text', required: true },
				{ name: 'url', type: 'text', required: true }
			]
		},
		{ name: 'copyrightText', type: 'text' }
	]
})

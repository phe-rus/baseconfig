import { defineGlobal } from '@baseconfig/core'

export const headers = defineGlobal({
	slug: 'headers',
	fields: [
		{
			name: 'logo',
			type: 'upload',
			relationTo: 'media'
		},
		{
			name: 'navItems',
			type: 'array',
			fields: [
				{
					name: 'label',
					type: 'text',
					required: true
				},
				{
					name: 'url',
					type: 'text',
					required: true
				}
			]
		}
	]
})

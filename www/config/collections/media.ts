import { defineCollection } from '@baseconfig/core'

export const media = defineCollection({
	slug: 'media',
	admin: {
		useAsTitle: 'alt',
		defaultColumns: ['alt', 'updatedAt']
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			required: true
		}
	]
})

import { defineCollection } from '@baseconfig/core'

export const users = defineCollection({
	slug: 'users',
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'email', 'role']
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true
		},
		{
			name: 'email',
			type: 'email',
			required: true,
			unique: true
		},
		{
			name: 'role',
			type: 'select',
			options: ['admin', 'editor', 'author'],
			required: true
		},
		{
			name: 'avatar',
			type: 'upload',
			relationTo: 'media'
		}
	]
})

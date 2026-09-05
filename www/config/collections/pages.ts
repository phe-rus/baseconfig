import { defineCollection } from '@baseconfig/core'
import { contentBlock } from '../blocks/content'
import { ctaBlock } from '../blocks/cta'
import { mediaBlock } from '../blocks/media'

export const pages = defineCollection({
	slug: 'pages',
	labels: {
		singular: 'Page',
		plural: 'Pages'
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt']
	},
	versions: {
		drafts: true
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			name: 'slug',
			type: 'slug',
			useAsSlug: 'title',
			required: true
		},
		{
			type: 'tabs',
			tabs: [
				{
					label: 'Hero',
					fields: [
						{
							name: 'heroType',
							type: 'select',
							options: ['none', 'high', 'medium', 'low'],
							required: true
						},
						{ name: 'heroHeading', type: 'text' },
						{ name: 'heroBody', type: 'richtext' },
						{ name: 'heroMedia', type: 'upload', relationTo: 'media' }
					]
				},
				{
					label: 'Layout',
					fields: [
						{
							name: 'layout',
							type: 'blocks',
							blocks: [contentBlock, mediaBlock, ctaBlock]
						}
					]
				},
				{
					label: 'SEO',
					fields: [
						{ name: 'metaTitle', type: 'text' },
						{ name: 'metaDescription', type: 'text' },
						{ name: 'metaImage', type: 'upload', relationTo: 'media' }
					]
				},
				{
					label: 'Settings',
					fields: [
						{ name: 'parent', type: 'relationship', relationTo: 'pages' },
						{
							name: 'tags',
							type: 'select',
							options: ['marketing', 'product', 'company'],
							hasMany: true
						},
						{ name: 'author', type: 'relationship', relationTo: 'users' }
					]
				}
			]
		}
	]
})

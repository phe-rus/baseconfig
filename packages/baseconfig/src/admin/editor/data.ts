export type EditorTabId = 'hero' | 'layout' | 'seo' | 'settings'

export const EDITOR_TABS: { id: EditorTabId; label: string }[] = [
	{ id: 'hero', label: 'Hero' },
	{ id: 'layout', label: 'Layout' },
	{ id: 'seo', label: 'SEO' },
	{ id: 'settings', label: 'Settings' }
]

export const HERO_TYPES = [
	'None',
	'High Impact',
	'Medium Impact',
	'Low Impact'
] as const

export const mockHero = {
	title: 'Home',
	type: 'High Impact' as (typeof HERO_TYPES)[number],
	introHeading: 'Skincare, simplified.',
	introBody: 'Shea butter and essential oils. Nothing else.',
	mediaFile: 'hero-banner-home.jpg',
	links: [
		{
			id: 'link-1',
			label: 'Shop Now',
			type: 'internal' as 'internal' | 'custom',
			url: '/shop',
			openInNewTab: false,
			appearance: 'Default'
		}
	]
}

export const mockLayout = [
	{
		id: 'block-1',
		blockType: 'content',
		label: 'Content Block',
		description: 'rich text column',
		colorClass: 'bg-violet-200 dark:bg-violet-900',
		columnWidth: 'Full',
		body: 'Every Acme formula starts with raw shea butter, cold-pressed and unrefined. No fillers, no fragrance oils, no synthetic anything — just what the plant already does well.'
	},
	{
		id: 'block-2',
		blockType: 'media',
		label: 'Media Block',
		description: 'full-width image or video',
		colorClass: 'bg-blue-200 dark:bg-blue-900'
	},
	{
		id: 'block-3',
		blockType: 'cta',
		label: 'CTA Block',
		description: 'call-to-action banner',
		colorClass: 'bg-orange-200 dark:bg-orange-900'
	},
	{
		id: 'block-4',
		blockType: 'archive',
		label: 'Archive Block',
		description: 'auto-populated from a collection',
		colorClass: 'bg-green-200 dark:bg-green-900'
	}
]

export const mockSeo = {
	metaTitle: 'Home — Acme Skincare',
	metaTitleMax: 60,
	metaDescription:
		'Shea butter and essential oils, nothing else. Discover clean, simple skincare from Acme.',
	metaDescriptionMax: 160,
	metaImage: 'hero-banner-home.jpg',
	previewUrl: 'acme.co › home'
}

export const mockSettings = {
	authors: [
		{
			id: 'author-1',
			name: 'Amara N.',
			email: 'amara@acme.co',
			initials: 'AN'
		},
		{ id: 'author-2', name: 'Jonas T.', email: 'jonas@acme.co', initials: 'JT' }
	],
	slug: 'home',
	resolvedUrl: 'acme.co/home',
	parent: 'Top Level',
	tags: ['Skincare', 'Homepage']
}

export const mockDocumentCreatedAt = '2026-07-02'

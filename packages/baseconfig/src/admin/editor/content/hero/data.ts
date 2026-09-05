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

import { notFound } from '@tanstack/react-router'
import { collections, globals } from './documents/documents'
import { RouteComponents } from './route'
import type { RouteData } from './types'

type LoaderArgs = {
	params: {
		_splat?: string
	}
}

const loader = ({ params }: LoaderArgs): RouteData => {
	const segments = params._splat ? params._splat.split('/').filter(Boolean) : []
	const [slug, id] = segments

	if (segments.length === 0) {
		return { viewType: 'dashboard', routeParams: {} }
	}

	const collection = collections.find((item) => item.slug === slug)

	if (collection) {
		return id
			? {
					viewType: 'document',
					routeParams: { collection: collection.slug, id }
				}
			: { viewType: 'list', routeParams: { collection: collection.slug } }
	}

	const global = globals.find((item) => item.slug === slug)

	if (global) {
		return { viewType: 'document', routeParams: { global: global.slug } }
	}

	throw notFound()
}

export const defineHandler = () => ({
	component: RouteComponents,
	loader
})

import type { RouteData } from '../../types'
import { collections, globals } from '../documents/documents'

export const getRouteData = (splat: string | undefined): RouteData => {
	const segments = splat ? splat.split('/').filter(Boolean) : []
	const [segmentOne, segmentTwo, segmentThree] = segments

	if (segments.length === 0) {
		return { viewType: 'dashboard', routeParams: {} }
	}

	if (segmentOne === 'collections' && segmentTwo) {
		const collection = collections.find((item) => item.slug === segmentTwo)

		if (collection) {
			return segmentThree
				? {
					viewType: 'document',
					routeParams: { collection: collection.slug, id: segmentThree }
				}
				: { viewType: 'list', routeParams: { collection: collection.slug } }
		}
	}

	if (segmentOne === 'globals' && segmentTwo) {
		const global = globals.find((item) => item.slug === segmentTwo)

		if (global) {
			return { viewType: 'document', routeParams: { global: global.slug } }
		}
	}

	return { viewType: 'not-found', routeParams: {} }
}

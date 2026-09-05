import {
	createRootRoute,
	createRoute,
	lazyRouteComponent,
	notFound,
	Outlet
} from '@tanstack/react-router'
import { collections, globals } from './documents/data'

const adminRootRoute = createRootRoute({
	component: () => <Outlet />
})
const dashboardRoute = createRoute({
	getParentRoute: () => adminRootRoute,
	path: '/',
	component: lazyRouteComponent(
		() => import('./pages/overview'),
		'OverviewComponent'
	)
})
const globalRoute = createRoute({
	getParentRoute: () => adminRootRoute,
	path: 'globals/$slug',
	loader: ({ params }) => {
		const global = globals.find((item) => item.slug === params.slug)
		if (!global) {
			throw notFound()
		}

		return { slug: global.slug }
	},
	component: lazyRouteComponent(
		() => import('./pages/globals'),
		'GlobalsComponent'
	)
})
const collectionRoute = createRoute({
	getParentRoute: () => adminRootRoute,
	path: '$slug',
	loader: ({ params }) => {
		const collection = collections.find((item) => item.slug === params.slug)

		if (!collection) {
			throw notFound()
		}

		return { slug: collection.slug }
	},
	component: lazyRouteComponent(
		() => import('./pages/collections'),
		'CollectionsComponent'
	)
})
const idRoute = createRoute({
	getParentRoute: () => collectionRoute,
	path: '$id',
	component: lazyRouteComponent(
		() => import('./pages/collections/uid'),
		'UUIDComponent'
	)
})
export const adminRouteTree = adminRootRoute.addChildren([
	dashboardRoute,
	globalRoute,
	collectionRoute.addChildren([idRoute])
])

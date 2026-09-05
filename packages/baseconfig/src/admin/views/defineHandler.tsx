import {
	createBrowserHistory,
	createMemoryHistory,
	createRouter,
	RouterProvider,
	useParams
} from '@tanstack/react-router'
import { Suspense, use, useMemo } from 'react'
import { adminRouteTree } from './route-tree'

const isServer = typeof document === 'undefined'

type InnerRouterProps = {
	router: Parameters<typeof RouterProvider>[0]['router']
	loadPromise: Promise<unknown>
}

function InnerRouter({ router, loadPromise }: InnerRouterProps) {
	use(loadPromise)
	return <RouterProvider router={router} />
}

function RouterMount() {
	const { _splat } = useParams({ strict: false }) as { _splat?: string }
	const { router, loadPromise } = useMemo(() => {
		const path = _splat ? `/admin/${_splat}` : '/admin/'
		const router = createRouter({
			routeTree: adminRouteTree,
			basepath: '/admin',
			history: isServer
				? createMemoryHistory({ initialEntries: [path] })
				: createBrowserHistory()
		})
		return { router, loadPromise: router.load() }
	}, [])

	return (
		<Suspense fallback={null}>
			<InnerRouter router={router} loadPromise={loadPromise} />
		</Suspense>
	)
}

export const defineHandler = () => ({
	component: RouterMount
})

import {
	createBrowserHistory,
	createMemoryHistory,
	createRouter,
	RouterProvider,
	useParams
} from '@tanstack/react-router'
import { Suspense, use, useMemo } from 'react'
import { useAdminConfig } from './config-context'
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
	const config = useAdminConfig()
	const { _splat } = useParams({ strict: false }) as { _splat?: string }
	const { router, loadPromise } = useMemo(() => {
		const path = _splat ? `/admin/${_splat}` : '/admin/'
		const router = createRouter({
			routeTree: adminRouteTree,
			basepath: '/admin',
			context: { config },
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

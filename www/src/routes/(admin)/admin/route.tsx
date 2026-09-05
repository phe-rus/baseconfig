import { RouteRoot } from '@baseconfig/core/admin'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import baseconfigConfig from '../../../../config/baseconfig'

export const Route = createFileRoute('/(admin)/admin')({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<RouteRoot config={baseconfigConfig}>
			<Outlet />
		</RouteRoot>
	)
}

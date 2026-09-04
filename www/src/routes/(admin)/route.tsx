import { RouteRoot } from '@baseconfig/core/admin'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RouteRoot>
      <Outlet />
    </RouteRoot>
  )
}

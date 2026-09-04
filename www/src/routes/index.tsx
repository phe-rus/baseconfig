import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex min-w-0 max-w-md flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">BaseConfig</h1>
          <p>
            Reset to the design phase — this is still the template starter
            page. See <code>docs/PLAN.md</code> for where the build stands.
          </p>
        </div>
      </div>
    </div>
  )
}

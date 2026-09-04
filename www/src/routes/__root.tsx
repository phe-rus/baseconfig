import { TooltipProvider } from '@baseconfig/ui/components/tooltip'
import tailwindcss from "@baseconfig/ui/globals.css?url"
import { cn } from "@baseconfig/ui/lib/utils"
import { ThemeProvider } from '@baseconfig/ui/theme-provider'
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: tailwindcss
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" className="antialiased blur-none" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn(
          "relative flex flex-col min-h-svh bg-background",
          "overflow-x-hidden selection:bg-olive-500/15",
          "typeset wrap-anywhere duration-200"
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableColorScheme
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

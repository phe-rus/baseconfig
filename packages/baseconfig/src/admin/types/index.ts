const VIEW_TYPES = {
	dashboard: 'dashboard',
	list: 'list',
	document: 'document',
	notFound: 'not-found'
} as const

type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES]

type RouteParams = {
	collection?: string
	global?: string
	id?: string
}

type RouteData = {
	viewType: ViewType
	routeParams: RouteParams
}

export { VIEW_TYPES }
export type { ViewType, RouteParams, RouteData }

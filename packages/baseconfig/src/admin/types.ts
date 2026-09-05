import type { PropsWithChildren } from 'react'
import type { IconSvgElement } from '@hugeicons/react'
import type { BuildConfigOptions } from '../types'

type AdminRouterContext = {
	config: BuildConfigOptions
}

type AdminConfigProviderProps = PropsWithChildren<{
	config: BuildConfigOptions
}>

type ViewmodelItem = {
	label: string
	slug: string
	icon?: IconSvgElement
	count?: number
}

type ViewmodelProps = {
	title: string
	kind: 'collection' | 'global'
	items: ViewmodelItem[]
	classNames?: string
}

export type {
	AdminConfigProviderProps,
	AdminRouterContext,
	ViewmodelItem,
	ViewmodelProps
}

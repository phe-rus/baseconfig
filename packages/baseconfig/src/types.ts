import type { Field } from './fields'

export type CollectionConfig = {
	slug: string
	labels?: { singular: string; plural: string }
	fields: Field[]
	admin?: { useAsTitle?: string; defaultColumns?: string[] }
	access?: Record<string, unknown>
	hooks?: Record<string, unknown>
	versions?: { drafts?: boolean }
}

export type GlobalConfig = {
	slug: string
	label?: string
	fields: Field[]
	access?: Record<string, unknown>
	hooks?: Record<string, unknown>
}

export type BuildConfigOptions = {
	collections?: CollectionConfig[]
	globals?: GlobalConfig[]
	plugins?: unknown[]
	db?: unknown
	editor?: unknown
	secret?: string
	serverURL?: string
	admin?: Record<string, unknown>
	routes?: Record<string, unknown>
	hooks?: { afterError?: Array<() => void> }
	upload?: Record<string, unknown>
	defaultDepth?: number
	maxDepth?: number
	indexSortableFields?: boolean
}

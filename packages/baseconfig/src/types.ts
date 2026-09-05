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

export type Plugin = ((
	config: BuildConfigOptions
) => BuildConfigOptions | Promise<BuildConfigOptions>) & {
	slug?: string
	order?: number
	options?: Record<string, unknown>
}

export type SendEmailOptions = {
	to: string | string[]
	from: string
	subject: string
	text?: string
	html?: string
}

export type EmailAdapter = {
	name: string
	sendEmail: (message: SendEmailOptions) => Promise<void>
}

export type Endpoint = {
	path: string
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	handler: (request: Request) => Response | Promise<Response>
}

export type JobsConfig = {
	autoRun?: Array<{ cron: string; queue: string; disableScheduling?: boolean }>
	jobsCollectionOverrides?: (args: {
		defaultJobsCollection: CollectionConfig
	}) => CollectionConfig
}

export type BuildConfigOptions = {
	collections?: CollectionConfig[]
	globals?: GlobalConfig[]
	plugins?: Plugin[]
	db?: D1Database
	editor?: unknown
	email?: EmailAdapter
	secret?: string
	previousSecrets?: string[]
	serverURL?: string
	cors?: '*' | string[]
	csrf?: string[]
	admin?: Record<string, unknown>
	routes?: { admin?: string; api?: string }
	hooks?: { afterError?: Array<() => void> }
	upload?: { adapter?: 'local' | 'r2' | 'images' }
	defaultDepth?: number
	maxDepth?: number
	defaultMaxTextLength?: number
	indexSortableFields?: boolean
	debug?: boolean
	custom?: Record<string, unknown>
	endpoints?: Endpoint[]
	jobs?: JobsConfig
	kv?: KVNamespace
}

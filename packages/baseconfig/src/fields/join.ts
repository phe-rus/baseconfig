import { z } from 'zod'

type JoinFieldOptions = {
	label?: string
	collection: string
	on: string
	hasMany?: boolean
	maxDepth?: number
}

type JoinField = {
	type: 'join'
	name: string
	schema: z.ZodTypeAny
} & JoinFieldOptions

const join = (name: string, options: JoinFieldOptions): JoinField => ({
	type: 'join',
	name,
	...options,
	schema: z.array(z.string()).optional()
})

export { join }
export type { JoinField, JoinFieldOptions }

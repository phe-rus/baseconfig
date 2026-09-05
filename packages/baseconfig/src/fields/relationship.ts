import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type RelationshipFieldOptions = BaseFieldOptions & {
	relationTo: string | string[]
	hasMany?: boolean
	maxDepth?: number
}

type RelationshipField = BaseField &
	RelationshipFieldOptions & {
		type: 'relationship'
		schema: z.ZodTypeAny
	}

const relationship = (
	name: string,
	options: RelationshipFieldOptions
): RelationshipField => {
	const value = z.string()
	const schema = options.hasMany ? z.array(value) : value

	return {
		type: 'relationship',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { relationship }
export type { RelationshipField, RelationshipFieldOptions }

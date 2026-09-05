import { z } from 'zod'
import type { AnyField, BaseFieldOptions } from './types/index'

type ArrayFieldOptions = BaseFieldOptions & {
	fields: AnyField[]
	minRows?: number
	maxRows?: number
}

type ArrayField = {
	type: 'array'
	name: string
	schema: z.ZodTypeAny
} & ArrayFieldOptions

const array = (name: string, options: ArrayFieldOptions): ArrayField => {
	const shape = Object.fromEntries(
		options.fields
			.filter((field) => field.name)
			.map((field) => [field.name as string, field.schema])
	)

	let schema = z.array(z.object(shape))

	if (options.minRows !== undefined) {
		schema = schema.min(options.minRows)
	}

	if (options.maxRows !== undefined) {
		schema = schema.max(options.maxRows)
	}

	return {
		type: 'array',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { array }
export type { ArrayField, ArrayFieldOptions }

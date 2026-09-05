import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type NumberFieldOptions = BaseFieldOptions & {
	min?: number
	max?: number
	hasMany?: boolean
}

type NumberField = BaseField &
	NumberFieldOptions & {
		type: 'number'
		schema: z.ZodTypeAny
	}

const number = (
	name: string,
	options: NumberFieldOptions = {}
): NumberField => {
	let value = z.number()

	if (options.min !== undefined) {
		value = value.min(options.min)
	}

	if (options.max !== undefined) {
		value = value.max(options.max)
	}

	const schema = options.hasMany ? z.array(value) : value

	return {
		type: 'number',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { number }
export type { NumberField, NumberFieldOptions }

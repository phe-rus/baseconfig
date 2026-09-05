import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type TextFieldOptions = BaseFieldOptions & {
	minLength?: number
	maxLength?: number
	hasMany?: boolean
}

type TextField = BaseField &
	TextFieldOptions & {
		type: 'text'
		schema: z.ZodTypeAny
	}

const text = (name: string, options: TextFieldOptions = {}): TextField => {
	let value = z.string()

	if (options.minLength !== undefined) {
		value = value.min(options.minLength)
	}

	if (options.maxLength !== undefined) {
		value = value.max(options.maxLength)
	}

	const schema = options.hasMany ? z.array(value) : value

	return {
		type: 'text',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { text }
export type { TextField, TextFieldOptions }

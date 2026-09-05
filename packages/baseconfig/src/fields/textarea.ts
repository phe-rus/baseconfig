import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type TextareaFieldOptions = BaseFieldOptions & {
	minLength?: number
	maxLength?: number
	rows?: number
}

type TextareaField = BaseField &
	TextareaFieldOptions & {
		type: 'textarea'
		schema: z.ZodTypeAny
	}

const textarea = (
	name: string,
	options: TextareaFieldOptions = {}
): TextareaField => {
	let schema = z.string()

	if (options.minLength !== undefined) {
		schema = schema.min(options.minLength)
	}

	if (options.maxLength !== undefined) {
		schema = schema.max(options.maxLength)
	}

	return {
		type: 'textarea',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { textarea }
export type { TextareaField, TextareaFieldOptions }

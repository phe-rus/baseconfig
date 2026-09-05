import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type RadioOption = { label: string; value: string } | string

type RadioFieldOptions = BaseFieldOptions & {
	options: RadioOption[]
	layout?: 'horizontal' | 'vertical'
}

type RadioField = BaseField &
	RadioFieldOptions & {
		type: 'radio'
		schema: z.ZodTypeAny
	}

const radio = (name: string, options: RadioFieldOptions): RadioField => {
	const values = options.options.map((option) =>
		typeof option === 'string' ? option : option.value
	)

	const schema =
		values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string()

	return {
		type: 'radio',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { radio }
export type { RadioField, RadioFieldOptions, RadioOption }

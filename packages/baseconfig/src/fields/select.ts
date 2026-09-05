import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type SelectOption = { label: string; value: string } | string

type SelectFieldOptions = BaseFieldOptions & {
	options: SelectOption[]
	hasMany?: boolean
}

type SelectField = BaseField &
	SelectFieldOptions & {
		type: 'select'
		schema: z.ZodTypeAny
	}

const select = (name: string, options: SelectFieldOptions): SelectField => {
	const values = options.options.map((option) =>
		typeof option === 'string' ? option : option.value
	)

	const value =
		values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string()

	const schema = options.hasMany ? z.array(value) : value

	return {
		type: 'select',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { select }
export type { SelectField, SelectFieldOptions, SelectOption }

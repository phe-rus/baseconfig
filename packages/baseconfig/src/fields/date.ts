import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type DateFieldOptions = BaseFieldOptions & {
	minDate?: string
	maxDate?: string
}

type DateField = BaseField &
	DateFieldOptions & {
		type: 'date'
		schema: z.ZodTypeAny
	}

const date = (name: string, options: DateFieldOptions = {}): DateField => {
	const schema = z.iso.datetime()

	return {
		type: 'date',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { date }
export type { DateField, DateFieldOptions }

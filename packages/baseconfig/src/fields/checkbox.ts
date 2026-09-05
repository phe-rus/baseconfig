import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type CheckboxFieldOptions = BaseFieldOptions

type CheckboxField = BaseField &
	CheckboxFieldOptions & {
		type: 'checkbox'
		schema: z.ZodTypeAny
	}

const checkbox = (
	name: string,
	options: CheckboxFieldOptions = {}
): CheckboxField => {
	const schema = z.boolean()

	return {
		type: 'checkbox',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { checkbox }
export type { CheckboxField, CheckboxFieldOptions }

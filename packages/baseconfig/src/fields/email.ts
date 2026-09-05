import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type EmailFieldOptions = BaseFieldOptions

type EmailField = BaseField &
	EmailFieldOptions & {
		type: 'email'
		schema: z.ZodTypeAny
	}

const email = (name: string, options: EmailFieldOptions = {}): EmailField => {
	const schema = z.email()

	return {
		type: 'email',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { email }
export type { EmailField, EmailFieldOptions }

import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type CodeFieldOptions = BaseFieldOptions & {
	language?: string
}

type CodeField = BaseField &
	CodeFieldOptions & {
		type: 'code'
		schema: z.ZodTypeAny
	}

const code = (name: string, options: CodeFieldOptions = {}): CodeField => {
	const schema = z.string()

	return {
		type: 'code',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { code }
export type { CodeField, CodeFieldOptions }

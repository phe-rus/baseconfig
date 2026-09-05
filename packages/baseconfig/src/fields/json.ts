import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type JsonFieldOptions = BaseFieldOptions

type JsonField = BaseField &
	JsonFieldOptions & {
		type: 'json'
		schema: z.ZodTypeAny
	}

const json = (name: string, options: JsonFieldOptions = {}): JsonField => {
	const schema = z.json()

	return {
		type: 'json',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { json }
export type { JsonField, JsonFieldOptions }

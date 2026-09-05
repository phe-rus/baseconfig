import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type UploadFieldOptions = BaseFieldOptions & {
	relationTo: string | string[]
	hasMany?: boolean
	maxDepth?: number
}

type UploadField = BaseField &
	UploadFieldOptions & {
		type: 'upload'
		schema: z.ZodTypeAny
	}

const upload = (name: string, options: UploadFieldOptions): UploadField => {
	const value = z.string()
	const schema = options.hasMany ? z.array(value) : value

	return {
		type: 'upload',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { upload }
export type { UploadField, UploadFieldOptions }

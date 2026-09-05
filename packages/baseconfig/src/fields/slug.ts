import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type SlugFieldOptions = BaseFieldOptions & {
	useAsSlug?: string
	slugify?: (value: string) => string
}

type SlugField = BaseField &
	SlugFieldOptions & {
		type: 'slug'
		schema: z.ZodTypeAny
	}

const slug = (name: string, options: SlugFieldOptions = {}): SlugField => {
	const schema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

	return {
		type: 'slug',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { slug }
export type { SlugField, SlugFieldOptions }

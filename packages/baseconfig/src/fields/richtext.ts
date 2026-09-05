import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type RichTextFieldOptions = BaseFieldOptions

type RichTextField = BaseField &
	RichTextFieldOptions & {
		type: 'richtext'
		schema: z.ZodTypeAny
	}

const richtext = (
	name: string,
	options: RichTextFieldOptions = {}
): RichTextField => {
	const schema = z.string()

	return {
		type: 'richtext',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { richtext }
export type { RichTextField, RichTextFieldOptions }

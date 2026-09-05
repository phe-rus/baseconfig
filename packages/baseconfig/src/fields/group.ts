import { z } from 'zod'
import type { AnyField, BaseFieldOptions } from './types/index'

type GroupFieldOptions = BaseFieldOptions & {
	fields: AnyField[]
}

type GroupField = {
	type: 'group'
	name?: string
	schema: z.ZodTypeAny
} & GroupFieldOptions

const group = (
	name: string | undefined,
	options: GroupFieldOptions
): GroupField => {
	const shape = Object.fromEntries(
		options.fields
			.filter((field) => field.name)
			.map((field) => [field.name as string, field.schema])
	)

	return {
		type: 'group',
		name,
		...options,
		schema: z.object(shape)
	}
}

export { group }
export type { GroupField, GroupFieldOptions }

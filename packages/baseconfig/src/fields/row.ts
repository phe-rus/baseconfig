import { z } from 'zod'
import type { AnyField } from './types/index'

type RowField = {
	type: 'row'
	fields: AnyField[]
	schema: z.ZodTypeAny
}

const row = (fields: AnyField[]): RowField => {
	const shape = Object.fromEntries(
		fields
			.filter((field) => field.name)
			.map((field) => [field.name as string, field.schema])
	)

	return {
		type: 'row',
		fields,
		schema: z.object(shape)
	}
}

export { row }
export type { RowField }

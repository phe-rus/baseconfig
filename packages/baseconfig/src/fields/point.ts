import { z } from 'zod'
import type { BaseField, BaseFieldOptions } from './types/index'

type PointFieldOptions = BaseFieldOptions

type PointField = BaseField &
	PointFieldOptions & {
		type: 'point'
		schema: z.ZodTypeAny
	}

const point = (name: string, options: PointFieldOptions = {}): PointField => {
	const schema = z.tuple([z.number(), z.number()])

	return {
		type: 'point',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { point }
export type { PointField, PointFieldOptions }

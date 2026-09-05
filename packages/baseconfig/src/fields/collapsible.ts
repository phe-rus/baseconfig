import { z } from 'zod'
import type { AnyField } from './types/index'

type CollapsibleFieldOptions = {
	initCollapsed?: boolean
}

type CollapsibleField = {
	type: 'collapsible'
	label: string
	fields: AnyField[]
	schema: z.ZodTypeAny
} & CollapsibleFieldOptions

const collapsible = (
	label: string,
	fields: AnyField[],
	options: CollapsibleFieldOptions = {}
): CollapsibleField => {
	const shape = Object.fromEntries(
		fields
			.filter((field) => field.name)
			.map((field) => [field.name as string, field.schema])
	)

	return {
		type: 'collapsible',
		label,
		fields,
		...options,
		schema: z.object(shape)
	}
}

export { collapsible }
export type { CollapsibleField, CollapsibleFieldOptions }

import { z } from 'zod'
import type { Field } from './types/index'

const wrapOptional = (schema: z.ZodTypeAny, required?: boolean) =>
	required ? schema : schema.optional()

const optionValues = (
	options:
		| { label: string; value: string }[]
		| (string | { label: string; value: string })[]
) =>
	options.map((option) => (typeof option === 'string' ? option : option.value))

const fieldToZodSchema = (field: Field): z.ZodTypeAny => {
	switch (field.type) {
		case 'text': {
			let value = z.string()
			if (field.minLength !== undefined) value = value.min(field.minLength)
			if (field.maxLength !== undefined) value = value.max(field.maxLength)
			return wrapOptional(
				field.hasMany ? z.array(value) : value,
				field.required
			)
		}
		case 'textarea': {
			let value = z.string()
			if (field.minLength !== undefined) value = value.min(field.minLength)
			if (field.maxLength !== undefined) value = value.max(field.maxLength)
			return wrapOptional(value, field.required)
		}
		case 'email':
			return wrapOptional(z.email(), field.required)
		case 'slug':
			return wrapOptional(
				z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
				field.required
			)
		case 'number': {
			let value = z.number()
			if (field.min !== undefined) value = value.min(field.min)
			if (field.max !== undefined) value = value.max(field.max)
			return wrapOptional(
				field.hasMany ? z.array(value) : value,
				field.required
			)
		}
		case 'checkbox':
			return wrapOptional(z.boolean(), field.required)
		case 'date':
			return wrapOptional(z.iso.datetime(), field.required)
		case 'select': {
			const values = optionValues(field.options)
			const value =
				values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string()
			return wrapOptional(
				field.hasMany ? z.array(value) : value,
				field.required
			)
		}
		case 'radio': {
			const values = optionValues(field.options)
			const value =
				values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string()
			return wrapOptional(value, field.required)
		}
		case 'relationship': {
			const value = z.string()
			return wrapOptional(
				field.hasMany ? z.array(value) : value,
				field.required
			)
		}
		case 'upload': {
			const value = z.string()
			return wrapOptional(
				field.hasMany ? z.array(value) : value,
				field.required
			)
		}
		case 'richtext':
			return wrapOptional(z.string(), field.required)
		case 'code':
			return wrapOptional(z.string(), field.required)
		case 'json':
			return wrapOptional(z.json(), field.required)
		case 'point':
			return wrapOptional(z.tuple([z.number(), z.number()]), field.required)
		case 'group':
			return z.object(composeFieldsShape(field.fields))
		case 'array': {
			let schema = z.array(z.object(composeFieldsShape(field.fields)))
			if (field.minRows !== undefined) schema = schema.min(field.minRows)
			if (field.maxRows !== undefined) schema = schema.max(field.maxRows)
			return wrapOptional(schema, field.required)
		}
		case 'blocks': {
			const blockSchemas = field.blocks.map((block) =>
				z.object({
					blockType: z.literal(block.slug),
					...composeFieldsShape(block.fields)
				})
			)
			const rowSchema =
				blockSchemas.length > 1
					? z.union(
							blockSchemas as unknown as [
								z.ZodTypeAny,
								z.ZodTypeAny,
								...z.ZodTypeAny[]
							]
						)
					: (blockSchemas[0] ?? z.never())
			let schema = z.array(rowSchema)
			if (field.minRows !== undefined) schema = schema.min(field.minRows)
			if (field.maxRows !== undefined) schema = schema.max(field.maxRows)
			return wrapOptional(schema, field.required)
		}
		case 'tabs':
			return z.object(composeFieldsShape([field]))
		case 'row':
			return z.object(composeFieldsShape(field.fields))
		case 'collapsible':
			return z.object(composeFieldsShape(field.fields))
		case 'ui':
			return z.undefined()
		case 'join':
			return z.array(z.string()).optional()
	}
}

const composeFieldsShape = (fields: Field[]) => {
	const shape: Record<string, z.ZodTypeAny> = {}

	for (const field of fields) {
		if ('name' in field && field.name) {
			shape[field.name] = fieldToZodSchema(field)
			continue
		}

		switch (field.type) {
			case 'row':
			case 'collapsible':
			case 'group': {
				Object.assign(shape, composeFieldsShape(field.fields))
				break
			}
			case 'tabs': {
				for (const tab of field.tabs) {
					const tabShape = composeFieldsShape(tab.fields)
					if (tab.name) {
						shape[tab.name] = z.object(tabShape)
					} else {
						Object.assign(shape, tabShape)
					}
				}
				break
			}
			default:
				break
		}
	}

	return shape
}

export { composeFieldsShape, fieldToZodSchema }

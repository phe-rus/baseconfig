import { z } from 'zod'
import type { AnyField, BaseFieldOptions } from './types/index'

type BlockConfig = {
	slug: string
	labels?: { singular: string; plural: string }
	fields: AnyField[]
}

type BlocksFieldOptions = BaseFieldOptions & {
	blocks: BlockConfig[]
	minRows?: number
	maxRows?: number
}

type BlocksField = {
	type: 'blocks'
	name: string
	schema: z.ZodTypeAny
} & BlocksFieldOptions

const block = (
	slug: string,
	fields: AnyField[],
	labels?: BlockConfig['labels']
): BlockConfig => ({ slug, fields, labels })

const blocks = (name: string, options: BlocksFieldOptions): BlocksField => {
	const blockSchemas = options.blocks.map((blockConfig) => {
		const shape = Object.fromEntries(
			blockConfig.fields
				.filter((field) => field.name)
				.map((field) => [field.name as string, field.schema])
		)

		return z.object({
			blockType: z.literal(blockConfig.slug),
			...shape
		})
	})

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

	if (options.minRows !== undefined) {
		schema = schema.min(options.minRows)
	}

	if (options.maxRows !== undefined) {
		schema = schema.max(options.maxRows)
	}

	return {
		type: 'blocks',
		name,
		...options,
		schema: options.required ? schema : schema.optional()
	}
}

export { block, blocks }
export type { BlockConfig, BlocksField, BlocksFieldOptions }

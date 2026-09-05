import { z } from 'zod'
import { composeFieldsShape } from './fields/schema'
import type {
	BuildConfigOptions,
	CollectionConfig,
	GlobalConfig
} from './types'

export const defineCollection = <const T extends CollectionConfig>(
	config: T
) => {
	const schema = z.object({
		id: z.string(),
		...composeFieldsShape(config.fields),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime()
	})

	return { ...config, schema }
}

export const defineGlobal = <const T extends GlobalConfig>(config: T) => {
	const schema = z.object({
		...composeFieldsShape(config.fields),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime()
	})

	return { ...config, schema }
}

export const buildConfig = <const T extends BuildConfigOptions>(
	config: T = {} as T
): T => {
	const collectionSlugs = new Set<string>()

	for (const collection of config.collections ?? []) {
		if (collectionSlugs.has(collection.slug)) {
			throw new Error(
				`buildConfig: duplicate collection slug "${collection.slug}"`
			)
		}

		collectionSlugs.add(collection.slug)
	}

	const globalSlugs = new Set<string>()

	for (const global of config.globals ?? []) {
		if (globalSlugs.has(global.slug)) {
			throw new Error(`buildConfig: duplicate global slug "${global.slug}"`)
		}

		globalSlugs.add(global.slug)
	}

	return config
}

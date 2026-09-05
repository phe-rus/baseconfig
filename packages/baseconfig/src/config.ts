import type { BuildConfigOptions, CollectionConfig, GlobalConfig } from './types'

export const buildConfig = (
	config: BuildConfigOptions = {}
): BuildConfigOptions => config

export const defineCollection = (
	config: CollectionConfig
): CollectionConfig => config

export const defineGlobal = (
	config: GlobalConfig
): GlobalConfig => config
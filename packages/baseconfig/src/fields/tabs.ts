import { z } from 'zod'
import type { AnyField, BaseFieldOptions } from './types/index'

type TabConfig = {
	name?: string
	label?: string
	fields: AnyField[]
}

type TabsFieldOptions = Omit<BaseFieldOptions, 'localized'> & {
	tabs: TabConfig[]
}

type TabsField = {
	type: 'tabs'
	schema: z.ZodTypeAny
} & TabsFieldOptions

const tabs = (options: TabsFieldOptions): TabsField => {
	const shape: Record<string, z.ZodTypeAny> = {}

	for (const tab of options.tabs) {
		const tabShape = Object.fromEntries(
			tab.fields
				.filter((field) => field.name)
				.map((field) => [field.name as string, field.schema])
		)

		if (tab.name) {
			shape[tab.name] = z.object(tabShape)
		} else {
			Object.assign(shape, tabShape)
		}
	}

	return {
		type: 'tabs',
		...options,
		schema: z.object(shape)
	}
}

export { tabs }
export type { TabConfig, TabsField, TabsFieldOptions }

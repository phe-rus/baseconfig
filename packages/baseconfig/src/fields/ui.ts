import { z } from 'zod'

type UiFieldOptions = {
	label?: string
	admin: {
		component: string
		position?: 'main' | 'sidebar'
	}
}

type UiField = {
	type: 'ui'
	name: string
	schema: z.ZodTypeAny
} & UiFieldOptions

const ui = (name: string, options: UiFieldOptions): UiField => ({
	type: 'ui',
	name,
	...options,
	schema: z.undefined()
})

export { ui }
export type { UiField, UiFieldOptions }

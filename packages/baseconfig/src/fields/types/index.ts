import type { z } from 'zod'

type FieldHookArgs = {
	value: unknown
	siblingData: Record<string, unknown>
	data: Record<string, unknown>
}

type FieldHook = (args: FieldHookArgs) => Promise<unknown> | unknown

type FieldAccessArgs = {
	req: { user?: unknown }
}

type FieldAccess = (args: FieldAccessArgs) => boolean

type FieldAdmin = {
	description?: string
	placeholder?: string
	readOnly?: boolean
	position?: 'main' | 'sidebar'
	condition?: (
		data: Record<string, unknown>,
		siblingData: Record<string, unknown>
	) => boolean
}

type FieldHooks = {
	beforeValidate?: FieldHook[]
	beforeChange?: FieldHook[]
	afterChange?: FieldHook[]
	afterRead?: FieldHook[]
	beforeDuplicate?: FieldHook[]
}

type FieldAccessConfig = {
	create?: FieldAccess
	read?: FieldAccess
	update?: FieldAccess
}

type BaseFieldOptions = {
	label?: string | false
	required?: boolean
	unique?: boolean
	index?: boolean
	hidden?: boolean
	localized?: boolean
	defaultValue?: unknown
	admin?: FieldAdmin
	hooks?: FieldHooks
	access?: FieldAccessConfig
	validate?: (value: unknown, args: FieldHookArgs) => string | true
}

type BaseField = {
	name: string
} & BaseFieldOptions

type AnyField = {
	type: string
	name?: string
	fields?: AnyField[]
	tabs?: Array<{ name?: string; label?: string; fields: AnyField[] }>
	blocks?: Array<{
		slug: string
		labels?: { singular: string; plural: string }
		fields: AnyField[]
	}>
	schema: z.ZodTypeAny
} & Record<string, unknown>

export type {
	AnyField,
	BaseField,
	BaseFieldOptions,
	FieldAccess,
	FieldAccessArgs,
	FieldAccessConfig,
	FieldAdmin,
	FieldHook,
	FieldHookArgs,
	FieldHooks
}

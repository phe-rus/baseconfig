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

type Option = { label: string; value: string } | string

type TextField = BaseField & {
	type: 'text'
	minLength?: number
	maxLength?: number
	hasMany?: boolean
}

type TextareaField = BaseField & {
	type: 'textarea'
	minLength?: number
	maxLength?: number
	rows?: number
}

type EmailField = BaseField & {
	type: 'email'
}

type SlugField = BaseField & {
	type: 'slug'
	useAsSlug?: string
	slugify?: (value: string) => string
}

type NumberField = BaseField & {
	type: 'number'
	min?: number
	max?: number
	hasMany?: boolean
}

type CheckboxField = BaseField & {
	type: 'checkbox'
}

type DateField = BaseField & {
	type: 'date'
	minDate?: string
	maxDate?: string
}

type SelectField = BaseField & {
	type: 'select'
	options: Option[]
	hasMany?: boolean
}

type RadioField = BaseField & {
	type: 'radio'
	options: Option[]
	layout?: 'horizontal' | 'vertical'
}

type RelationshipField = BaseField & {
	type: 'relationship'
	relationTo: string | string[]
	hasMany?: boolean
	maxDepth?: number
}

type RichTextField = BaseField & {
	type: 'richtext'
}

type UploadField = BaseField & {
	type: 'upload'
	relationTo: string | string[]
	hasMany?: boolean
	maxDepth?: number
}

type CodeField = BaseField & {
	type: 'code'
	language?: string
}

type JsonField = BaseField & {
	type: 'json'
}

type PointField = BaseField & {
	type: 'point'
}

type GroupField = BaseFieldOptions & {
	type: 'group'
	name?: string
	fields: Field[]
}

type ArrayField = BaseField & {
	type: 'array'
	fields: Field[]
	minRows?: number
	maxRows?: number
}

type Block = {
	slug: string
	labels?: { singular: string; plural: string }
	fields: Field[]
}

type BlocksField = BaseField & {
	type: 'blocks'
	blocks: Block[]
	minRows?: number
	maxRows?: number
}

type TabConfig = {
	name?: string
	label?: string
	fields: Field[]
}

type TabsField = Omit<BaseFieldOptions, 'localized'> & {
	type: 'tabs'
	tabs: TabConfig[]
}

type RowField = {
	type: 'row'
	fields: Field[]
}

type CollapsibleField = {
	type: 'collapsible'
	label: string
	fields: Field[]
	initCollapsed?: boolean
}

type UiField = {
	type: 'ui'
	name: string
	label?: string
	admin: {
		component: string
		position?: 'main' | 'sidebar'
	}
}

type JoinField = {
	type: 'join'
	name: string
	label?: string
	collection: string
	on: string
	hasMany?: boolean
	maxDepth?: number
}

type Field =
	| TextField
	| TextareaField
	| EmailField
	| SlugField
	| NumberField
	| CheckboxField
	| DateField
	| SelectField
	| RadioField
	| RelationshipField
	| RichTextField
	| UploadField
	| CodeField
	| JsonField
	| PointField
	| GroupField
	| ArrayField
	| BlocksField
	| TabsField
	| RowField
	| CollapsibleField
	| UiField
	| JoinField

export type {
	ArrayField,
	BaseField,
	BaseFieldOptions,
	Block,
	BlocksField,
	CheckboxField,
	CodeField,
	CollapsibleField,
	DateField,
	EmailField,
	Field,
	FieldAccess,
	FieldAccessArgs,
	FieldAccessConfig,
	FieldAdmin,
	FieldHook,
	FieldHookArgs,
	FieldHooks,
	GroupField,
	JoinField,
	JsonField,
	NumberField,
	Option,
	PointField,
	RadioField,
	RelationshipField,
	RichTextField,
	RowField,
	SelectField,
	SlugField,
	TabConfig,
	TabsField,
	TextField,
	TextareaField,
	UiField,
	UploadField
}

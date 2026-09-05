import { z } from 'zod'

export const FILTER_OPERATORS = [
	{ label: 'equals', value: 'equals' },
	{ label: 'is not equal to', value: 'not_equals' },
	{ label: 'is greater than', value: 'greater_than' },
	{ label: 'is greater than or equal to', value: 'greater_than_equal' },
	{ label: 'is less than', value: 'less_than' },
	{ label: 'is less than or equal to', value: 'less_than_equal' },
	{ label: 'is like', value: 'like' },
	{ label: 'contains', value: 'contains' },
	{ label: 'is in', value: 'in' },
	{ label: 'is not in', value: 'not_in' },
	{ label: 'exists', value: 'exists' }
] as const

export const filterOperatorSchema = z.enum(
	FILTER_OPERATORS.map((operator) => operator.value) as unknown as [
		string,
		...string[]
	]
)

export type FilterOperator = z.infer<typeof filterOperatorSchema>

export const filterConditionSchema = z.object({
	id: z.string(),
	field: z.string(),
	operator: filterOperatorSchema,
	value: z.string()
})

export type FilterCondition = z.infer<typeof filterConditionSchema>

const toComparable = (value: unknown): string =>
	value === null || value === undefined ? '' : String(value)

const matchesCondition = <TRow>(
	row: TRow,
	condition: FilterCondition
): boolean => {
	const raw = (row as Record<string, unknown>)[condition.field]
	const comparable = toComparable(raw)

	switch (condition.operator) {
		case 'equals':
			return comparable === condition.value
		case 'not_equals':
			return comparable !== condition.value
		case 'greater_than':
			return Number(raw) > Number(condition.value)
		case 'greater_than_equal':
			return Number(raw) >= Number(condition.value)
		case 'less_than':
			return Number(raw) < Number(condition.value)
		case 'less_than_equal':
			return Number(raw) <= Number(condition.value)
		case 'like':
			return comparable.toLowerCase().includes(condition.value.toLowerCase())
		case 'contains':
			return comparable.toLowerCase().includes(condition.value.toLowerCase())
		case 'in':
			return condition.value
				.split(',')
				.map((item) => item.trim().toLowerCase())
				.includes(comparable.toLowerCase())
		case 'not_in':
			return !condition.value
				.split(',')
				.map((item) => item.trim().toLowerCase())
				.includes(comparable.toLowerCase())
		case 'exists':
			return condition.value === 'false'
				? raw === undefined || raw === null || raw === ''
				: raw !== undefined && raw !== null && raw !== ''
		default:
			return true
	}
}

export const applyFilterConditions = <TRow>(
	data: TRow[],
	conditions: FilterCondition[]
): TRow[] => {
	const activeConditions = conditions.filter(
		(condition) => condition.operator === 'exists' || condition.value !== ''
	)
	if (activeConditions.length === 0) return data
	return data.filter((row) =>
		activeConditions.every((condition) => matchesCondition(row, condition))
	)
}

import { Button } from '@baseconfig/ui/components/button'
import { InputGroupButton } from '@baseconfig/ui/components/input-group'
import { Input } from '@baseconfig/ui/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@baseconfig/ui/components/select'
import {
	AddCircleFreeIcons,
	Cancel01FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FILTER_OPERATORS } from './conditions'
import type { FilterCondition } from './conditions'

type FiltersPanelField = {
	id: string
	label: string
}

type FiltersPanelProps = {
	fields: FiltersPanelField[]
	conditions: FilterCondition[]
	onChange: (conditions: FilterCondition[]) => void
}

export function FiltersPanel({
	fields,
	conditions,
	onChange
}: FiltersPanelProps) {
	const addCondition = () => {
		const field = fields[0]
		if (!field) return
		onChange([
			...conditions,
			{
				id: crypto.randomUUID(),
				field: field.id,
				operator: 'equals',
				value: ''
			}
		])
	}

	const updateCondition = (id: string, patch: Partial<FilterCondition>) => {
		onChange(
			conditions.map((condition) =>
				condition.id === id ? { ...condition, ...patch } : condition
			)
		)
	}

	const removeCondition = (id: string) => {
		onChange(conditions.filter((condition) => condition.id !== id))
	}

	return (
		<div className='flex flex-col gap-2 border border-border/35 bg-muted/20 p-3'>
			{conditions.length === 0 && (
				<p className='px-1 py-1'>No filters applied</p>
			)}
			{conditions.map((condition, index) => (
				<div key={condition.id} className='flex items-center gap-1.5'>
					<span className='w-10 shrink-0 text-muted-foreground'>
						{index === 0 ? 'where' : 'and'}
					</span>
					<Select
						value={condition.field}
						onValueChange={(value) =>
							updateCondition(condition.id, { field: value as string })
						}
					>
						<SelectTrigger className='flex-1'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{fields.map((field) => (
								<SelectItem key={field.id} value={field.id}>
									{field.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={condition.operator}
						onValueChange={(value) =>
							updateCondition(condition.id, {
								operator: value as FilterCondition['operator']
							})
						}
					>
						<SelectTrigger className='flex-1'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FILTER_OPERATORS.map((operator) => (
								<SelectItem key={operator.value} value={operator.value}>
									{operator.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{condition.operator === 'exists' ? (
						<Select
							value={condition.value || 'true'}
							onValueChange={(value) =>
								updateCondition(condition.id, { value: value as string })
							}
						>
							<SelectTrigger className='flex-1'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='true'>true</SelectItem>
								<SelectItem value='false'>false</SelectItem>
							</SelectContent>
						</Select>
					) : (
						<Input
							value={condition.value}
							onChange={(event) =>
								updateCondition(condition.id, { value: event.target.value })
							}
							placeholder='Value'
							className='flex-1'
						/>
					)}
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => removeCondition(condition.id)}
					>
						<HugeiconsIcon icon={Cancel01FreeIcons} size={13} />
					</Button>
				</div>
			))}
			<InputGroupButton className='w-fit' onClick={addCondition}>
				<HugeiconsIcon icon={AddCircleFreeIcons} size={13} strokeWidth={1.9} />
				Add filter
			</InputGroupButton>
		</div>
	)
}

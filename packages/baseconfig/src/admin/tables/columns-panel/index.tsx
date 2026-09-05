import { Checkbox } from '@baseconfig/ui/components/checkbox'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@baseconfig/ui/components/input-group'
import { cn } from '@baseconfig/ui/lib/utils'
import { Search01FreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { reorderColumns } from './reorder'

type ColumnsPanelColumn = {
	id: string
	label: string
	visible: boolean
}

type ColumnsPanelProps = {
	columns: ColumnsPanelColumn[]
	onToggle: (id: string, visible: boolean) => void
	onReorder: (order: string[]) => void
}

export function ColumnsPanel({
	columns,
	onToggle,
	onReorder
}: ColumnsPanelProps) {
	const [search, setSearch] = useState('')
	const [draggedId, setDraggedId] = useState<string | null>(null)
	const [dragOverId, setDragOverId] = useState<string | null>(null)

	const filtered = columns.filter((column) =>
		column.label.toLowerCase().includes(search.toLowerCase())
	)

	const handleDrop = (targetId: string) => {
		if (draggedId && draggedId !== targetId) {
			onReorder(
				reorderColumns(
					columns.map((column) => column.id),
					draggedId,
					targetId
				)
			)
		}
		setDraggedId(null)
		setDragOverId(null)
	}

	return (
		<div className='flex flex-col gap-3 border border-border/35 bg-muted/20 p-3'>
			<InputGroup>
				<InputGroupAddon>
					<HugeiconsIcon icon={Search01FreeIcons} size={13} />
				</InputGroupAddon>
				<InputGroupInput
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder='Find a column'
				/>
			</InputGroup>
			<div className='flex flex-wrap gap-2'>
				{filtered.map((column) => (
					<label
						key={column.id}
						draggable
						onDragStart={() => setDraggedId(column.id)}
						onDragOver={(event) => {
							event.preventDefault()
							if (draggedId && draggedId !== column.id) setDragOverId(column.id)
						}}
						onDragLeave={() =>
							setDragOverId((current) =>
								current === column.id ? null : current
							)
						}
						onDrop={() => handleDrop(column.id)}
						onDragEnd={() => {
							setDraggedId(null)
							setDragOverId(null)
						}}
						className={cn(
							'flex cursor-grab items-center gap-1.5 rounded-md border border-border/35 bg-background px-2 py-1 active:cursor-grabbing',
							draggedId === column.id && 'opacity-50',
							dragOverId === column.id &&
								'border-primary ring-2 ring-primary/30'
						)}
					>
						<Checkbox
							checked={column.visible}
							onCheckedChange={(checked) =>
								onToggle(column.id, checked === true)
							}
						/>
						<span className='truncate'>{column.label}</span>
					</label>
				))}
			</div>
		</div>
	)
}

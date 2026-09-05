import { Checkbox } from '@baseconfig/ui/components/checkbox'
import { cn } from '@baseconfig/ui/lib/utils'
import { Search01FreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

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

	const filtered = columns.filter((column) =>
		column.label.toLowerCase().includes(search.toLowerCase())
	)

	const handleDrop = (targetId: string) => {
		if (!draggedId || draggedId === targetId) {
			setDraggedId(null)
			return
		}
		const order = columns.map((column) => column.id)
		const fromIndex = order.indexOf(draggedId)
		const toIndex = order.indexOf(targetId)
		order.splice(fromIndex, 1)
		order.splice(toIndex, 0, draggedId)
		onReorder(order)
		setDraggedId(null)
	}

	return (
		<div className='flex flex-col gap-3 border border-border/35 bg-muted/20 p-3'>
			<div className='flex items-center gap-2 border border-border/35 bg-background px-2.5 py-1.5'>
				<HugeiconsIcon
					icon={Search01FreeIcons}
					size={13}
					className='text-muted-foreground'
				/>
				<input
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder='Find a column'
					className='w-full bg-transparent outline-none'
				/>
			</div>
			<div className='flex flex-wrap gap-2'>
				{filtered.map((column) => (
					<label
						key={column.id}
						draggable
						onDragStart={() => setDraggedId(column.id)}
						onDragOver={(event) => event.preventDefault()}
						onDrop={() => handleDrop(column.id)}
						onDragEnd={() => setDraggedId(null)}
						className={cn(
							'flex cursor-grab items-center gap-1.5 rounded-md border border-border/35 bg-background px-2 py-1 active:cursor-grabbing',
							draggedId === column.id && 'opacity-50'
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

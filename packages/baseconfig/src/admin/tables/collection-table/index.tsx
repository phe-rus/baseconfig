import { Checkbox } from '@baseconfig/ui/components/checkbox'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@baseconfig/ui/components/input-group'
import {
	NativeSelect,
	NativeSelectOption
} from '@baseconfig/ui/components/native-select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@baseconfig/ui/components/table'
import { cn } from '@baseconfig/ui/lib/utils'
import {
	ArrowDown01FreeIcons,
	ArrowUp01FreeIcons,
	MoreHorizontalFreeIcons,
	Search01FreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'
import {
	type ColumnDef,
	createColumnHelper,
	type RowData,
	useTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { ColumnsPanel } from '../columns-panel'
import { FiltersPanel } from '../filters-panel'
import {
	applyFilterConditions,
	type FilterCondition
} from '../filters-panel/conditions'
import { collectionTableFeatures } from './features'
import { ToolbarToggle } from './toolbar-toggle'

type CollectionTableProps<TRow extends RowData> = {
	columns: Array<ColumnDef<typeof collectionTableFeatures, TRow, any>>
	data: TRow[]
	getHref?: (row: TRow) => string
}

export function CollectionTable<TRow extends RowData>({
	columns,
	data,
	getHref
}: CollectionTableProps<TRow>) {
	const [globalFilter, setGlobalFilter] = useState('')
	const [conditions, setConditions] = useState<FilterCondition[]>([])
	const [openPanel, setOpenPanel] = useState<'columns' | 'filters' | undefined>(
		undefined
	)
	const columnHelper = createColumnHelper<
		typeof collectionTableFeatures,
		TRow
	>()

	const selectionColumn = columnHelper.display({
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllRowsSelected()}
				indeterminate={
					!table.getIsAllRowsSelected() && table.getIsSomeRowsSelected()
				}
				onCheckedChange={(checked) =>
					table.toggleAllRowsSelected(checked === true)
				}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(checked) => row.toggleSelected(checked === true)}
			/>
		),
		enableSorting: false,
		enableGlobalFilter: false,
		enableHiding: false
	})

	const moreActionsColumn = columnHelper.display({
		id: 'more-actions',
		header: '',
		cell: () => (
			<HugeiconsIcon
				icon={MoreHorizontalFreeIcons}
				size={13}
				className='text-muted-foreground'
			/>
		),
		enableSorting: false,
		enableGlobalFilter: false,
		enableHiding: false
	})

	const filteredData = useMemo(
		() => applyFilterConditions(data, conditions),
		[data, conditions]
	)

	const table = useTable(
		{
			features: collectionTableFeatures,
			columns: [selectionColumn, ...columns, moreActionsColumn],
			data: filteredData,
			state: { globalFilter },
			onGlobalFilterChange: setGlobalFilter,
			initialState: { pagination: { pageIndex: 0, pageSize: 10 } }
		},
		(state) => state
	)

	const { pageIndex, pageSize } = table.state.pagination
	const rowCount = table.getFilteredRowModel().rows.length
	const rangeStart = rowCount === 0 ? 0 : pageIndex * pageSize + 1
	const rangeEnd = Math.min(rowCount, (pageIndex + 1) * pageSize)

	const hideableColumns = table
		.getAllColumns()
		.filter((column) => column.getCanHide())
	const columnOrder = table.state.columnOrder
	const orderedHideableColumns =
		columnOrder.length > 0
			? columnOrder
				.map((id) => hideableColumns.find((column) => column.id === id))
				.filter((column): column is (typeof hideableColumns)[number] =>
					Boolean(column)
				)
			: hideableColumns
	const columnsPanelColumns = orderedHideableColumns.map((column) => ({
		id: column.id,
		label: column.id,
		visible: column.getIsVisible()
	}))
	const filterFields = orderedHideableColumns.map((column) => ({
		id: column.id,
		label: column.id
	}))

	const togglePanel = (panel: 'columns' | 'filters') =>
		setOpenPanel((current) => (current === panel ? undefined : panel))

	const handleColumnToggle = (id: string, visible: boolean) =>
		table.getColumn(id)?.toggleVisibility(visible)

	const handleColumnReorder = (order: string[]) =>
		table.setColumnOrder(['select', ...order])

	const firstDataColumnId = table
		.getVisibleLeafColumns()
		.find((column) => column.id !== 'select')?.id

	return (
		<div className='flex flex-col gap-5 *:no-scrollbar!'>
			<div className='flex flex-col gap-3'>
				<InputGroup className='rounded-none'>
					<InputGroupAddon>
						<HugeiconsIcon icon={Search01FreeIcons} />
					</InputGroupAddon>
					<InputGroupInput
						placeholder='Search'
						value={globalFilter}
						onChange={(event) => setGlobalFilter(event.target.value)}
					/>
					<InputGroupAddon align='inline-end'>
						<ToolbarToggle
							label='Filters'
							count={conditions.length}
							open={openPanel === 'filters'}
							onClick={() => togglePanel('filters')}
						/>
						<ToolbarToggle
							label='Columns'
							open={openPanel === 'columns'}
							onClick={() => togglePanel('columns')}
						/>
					</InputGroupAddon>
				</InputGroup>

				{openPanel === 'filters' && (
					<FiltersPanel
						fields={filterFields}
						conditions={conditions}
						onChange={setConditions}
					/>
				)}
				{openPanel === 'columns' && (
					<ColumnsPanel
						columns={columnsPanelColumns}
						onToggle={handleColumnToggle}
						onReorder={handleColumnReorder}
					/>
				)}
			</div>

			<div className='overflow-hidden border border-border/35 *:no-scrollbar!'>
				<Table data-not-typeset>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className='hover:bg-transparent'>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={cn(
											'font-normal text-muted-foreground',
											header.column.getCanSort() && 'cursor-pointer select-none'
										)}
										onClick={header.column.getToggleSortingHandler()}
									>
										{header.isPlaceholder ? null : (
											<span className='inline-flex items-center gap-1'>
												<table.FlexRender header={header} />
												{header.column.getCanSort() && (
													<span className='inline-flex flex-col'>
														<HugeiconsIcon
															icon={ArrowUp01FreeIcons}
															size={11}
															className={cn(
																'-mb-1',
																header.column.getIsSorted() === 'asc'
																	? 'text-foreground'
																	: 'text-muted-foreground/50'
															)}
														/>
														<HugeiconsIcon
															icon={ArrowDown01FreeIcons}
															size={11}
															className={cn(
																header.column.getIsSorted() === 'desc'
																	? 'text-foreground'
																	: 'text-muted-foreground/50'
															)}
														/>
													</span>
												)}
											</span>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
							>
								{row.getAllCells().map((cell) => (
									<TableCell key={cell.id}>
										{getHref && cell.column.id === firstDataColumnId ? (
											<Link
												to={getHref(row.original) as any}
												className='-m-2 inline-flex w-fit items-center p-2'
											>
												<table.FlexRender cell={cell} />
											</Link>
										) : (
											<table.FlexRender cell={cell} />
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-end gap-4 text-muted-foreground'>
				<p>
					{rangeStart}-{rangeEnd} of {rowCount}
				</p>
				<div className='flex items-center gap-1'>
					<p>Per Page:</p>
					<NativeSelect
						size='sm'
						value={pageSize}
						onChange={(event) => table.setPageSize(Number(event.target.value))}
					>
						{[10, 25, 50].map((size) => (
							<NativeSelectOption key={size} value={size}>
								{size}
							</NativeSelectOption>
						))}
					</NativeSelect>
				</div>
			</div>
		</div>
	)
}

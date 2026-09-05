import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@baseconfig/ui/components/table'
import { cn } from '@baseconfig/ui/lib/utils'
import { type ColumnDef, type RowData, useTable } from '@tanstack/react-table'
import { collectionTableFeatures } from './columns'

type CollectionTableProps<TRow extends RowData> = {
	columns: Array<ColumnDef<typeof collectionTableFeatures, TRow, any>>
	data: TRow[]
}

export function CollectionTable<TRow extends RowData>({
	columns,
	data
}: CollectionTableProps<TRow>) {
	const table = useTable(
		{
			features: collectionTableFeatures,
			columns,
			data
		},
		(state) => state
	)

	return (
		<Table data-not-typeset>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<TableHead
								key={header.id}
								className={cn(
									header.column.getCanSort() && 'cursor-pointer select-none'
								)}
								onClick={header.column.getToggleSortingHandler()}
							>
								{header.isPlaceholder ? null : (
									<table.FlexRender header={header} />
								)}
								{header.column.getIsSorted() === 'asc' && ' ↑'}
								{header.column.getIsSorted() === 'desc' && ' ↓'}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getAllCells().map((cell) => (
							<TableCell key={cell.id}>
								<table.FlexRender cell={cell} />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

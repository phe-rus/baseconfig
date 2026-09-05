import {
	columnFilteringFeature,
	columnOrderingFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures
} from '@tanstack/react-table'

export const collectionTableFeatures = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	columnFilteringFeature,
	globalFilteringFeature,
	filteredRowModel: createFilteredRowModel(),
	rowSelectionFeature,
	columnVisibilityFeature,
	columnOrderingFeature,
	rowPaginationFeature,
	paginatedRowModel: createPaginatedRowModel()
})

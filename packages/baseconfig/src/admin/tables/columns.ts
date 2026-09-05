import {
	createSortedRowModel,
	rowSortingFeature,
	tableFeatures
} from '@tanstack/react-table'

export const collectionTableFeatures = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel()
})

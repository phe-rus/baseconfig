export const reorderColumns = (
	order: string[],
	draggedId: string,
	targetId: string
): string[] => {
	if (draggedId === targetId) return order
	const withoutDragged = order.filter((id) => id !== draggedId)
	const targetIndex = withoutDragged.indexOf(targetId)
	if (targetIndex === -1) return order
	withoutDragged.splice(targetIndex, 0, draggedId)
	return withoutDragged
}

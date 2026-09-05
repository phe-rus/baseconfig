import { Badge } from '@baseconfig/ui/components/badge'

export type DocumentStatus = 'draft' | 'published' | 'changed'

type StatusBadgeProps = {
	status: DocumentStatus
}

const STATUS_LABEL: Record<DocumentStatus, string> = {
	draft: 'Draft',
	published: 'Published',
	changed: 'Changed'
}

const STATUS_VARIANT: Record<
	DocumentStatus,
	'outline' | 'secondary' | 'default'
> = {
	draft: 'outline',
	published: 'secondary',
	changed: 'default'
}

export function StatusBadge({ status }: StatusBadgeProps) {
	return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}

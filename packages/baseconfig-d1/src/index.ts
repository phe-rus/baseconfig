import { drizzle } from 'drizzle-orm/d1'

export const createD1Client = <
	TSchema extends Record<string, unknown> = Record<string, never>
>(
	binding: D1Database,
	schema?: TSchema
) => drizzle(binding, schema ? { schema } : undefined)

export type D1Client = ReturnType<typeof createD1Client>

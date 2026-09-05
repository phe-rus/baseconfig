import { AnyField } from "./fields";

export type CollectionConfig = {
    slug: string
    labels?: { singular: string; plural: string }
    fields: AnyField[]
    admin?: { useAsTitle?: string; defaultColumns?: string[] }
    access?: Record<string, unknown>
    hooks?: Record<string, unknown>
    versions?: { drafts?: boolean }
}

export type GlobalConfig = {
    slug: string
    label?: string
    fields: AnyField[]
    access?: Record<string, unknown>
    hooks?: Record<string, unknown>
}

export type BuildConfigOptions = {
    collections?: CollectionConfig[]
    globals?: GlobalConfig[]
    plugins?: unknown[]
    db?: unknown
    editor?: unknown
    secret?: string
    serverURL?: string
    admin?: Record<string, unknown>
    routes?: Record<string, unknown>
    hooks?: { afterError?: Array<() => void> }
    upload?: Record<string, unknown>
    defaultDepth?: number
    maxDepth?: number
    indexSortableFields?: boolean
}

export type StorageAdapter = 'local' | 'r2' | 'images'

export const createR2Client = (binding: R2Bucket) => binding

export type R2Client = ReturnType<typeof createR2Client>

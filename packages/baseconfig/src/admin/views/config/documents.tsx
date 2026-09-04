import {
    File01FreeIcons,
    Image01FreeIcons,
    Layout01FreeIcons,
    News01FreeIcons,
    Settings02FreeIcons,
    UserGroupFreeIcons
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const stats = [
    { label: 'Published Pages', value: '24', sub: 'Live on the site' },
    { label: 'Drafts', value: '3', sub: 'Awaiting publish' },
    { label: 'Media Files', value: '156', sub: 'In R2 storage' },
    { label: 'Team Members', value: '4', sub: 'Across 3 roles' }
]

const collections = [
    { label: 'Pages', count: 24, icon: File01FreeIcons },
    { label: 'Posts', count: 12, icon: News01FreeIcons },
    { label: 'Media', count: 156, icon: Image01FreeIcons },
    { label: 'Users', count: 4, icon: UserGroupFreeIcons }
]

const globals = [
    { label: 'Headers', icon: Layout01FreeIcons },
    { label: 'Site Settings', icon: Settings02FreeIcons }
]

export function Documents() {
    return (
        <>
            <div className='mb-7'>
                <div className='font-bold text-2xl text-foreground'>
                    Acme Skincare
                </div>
                <div className='text-[13px] text-muted-foreground'>
                    Collections and globals for this site
                </div>
            </div>

            <div className='mb-8 grid grid-cols-4 divide-x divide-border overflow-hidden rounded-lg border border-border bg-card'>
                {stats.map((stat) => (
                    <div key={stat.label} className='p-4.5'>
                        <div className='mb-0.5 font-bold text-[22px] text-foreground'>
                            {stat.value}
                        </div>
                        <div className='font-semibold text-[11.5px] text-secondary-foreground'>
                            {stat.label}
                        </div>
                        <div className='text-[11px] text-muted-foreground'>
                            {stat.sub}
                        </div>
                    </div>
                ))}
            </div>

            <div className='mb-3 font-semibold text-[10.5px] text-muted-foreground uppercase tracking-wider'>
                Collections
            </div>
            <div className='mb-8 grid grid-cols-4 gap-3.5'>
                {collections.map((collection) => (
                    <div
                        key={collection.label}
                        className='rounded-lg border border-border bg-card p-4'
                    >
                        <HugeiconsIcon
                            icon={collection.icon}
                            size={18}
                            strokeWidth={1.75}
                            className='mb-3 text-muted-foreground'
                        />
                        <div className='font-semibold text-[13px] text-foreground'>
                            {collection.label}
                        </div>
                        <div className='text-[11.5px] text-muted-foreground'>
                            {collection.count} items
                        </div>
                    </div>
                ))}
            </div>

            <div className='mb-3 font-semibold text-[10.5px] text-muted-foreground uppercase tracking-wider'>
                Globals
            </div>
            <div className='grid grid-cols-4 gap-3.5'>
                {globals.map((global) => (
                    <div
                        key={global.label}
                        className='rounded-lg border border-border bg-card p-4'
                    >
                        <HugeiconsIcon
                            icon={global.icon}
                            size={18}
                            strokeWidth={1.75}
                            className='mb-3 text-muted-foreground'
                        />
                        <div className='font-semibold text-[13px] text-foreground'>
                            {global.label}
                        </div>
                        <div className='text-[11.5px] text-muted-foreground'>
                            Global
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
import { Button } from '@baseconfig/ui/components/button'
import { cn } from '@baseconfig/ui/lib/utils'
import {
    File01FreeIcons,
    Image01FreeIcons,
    Layout01FreeIcons,
    News01FreeIcons,
    PlusIcon,
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

type ViewmodelProps = {
    title: string
    items: typeof collections | typeof globals
    classNames?: string
}

const Viewmodel = ({
    title,
    items,
    classNames
}: ViewmodelProps) => {
    return (
        <section className='flex flex-col gap-1'>
            <h1 className='text-base!'>{title}</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {items?.map(({ icon, label, ...props }, index) => (
                    <article
                        key={index}
                        className={cn(
                            'relative flex items-center gap-3 rounded-md col-span-1 px-5 py-2.5',
                            'border border-border/35 bg-input/35 hover:shadow-md shadow-primary/15',
                            'transition-shadow duration-300 ease-out cursor-pointer backdrop-blur',
                            'hover:-translate-y-1!', classNames
                        )}
                    >
                        <HugeiconsIcon
                            icon={icon}
                            className='size-5!'
                        />
                        <div className='flex flex-col'>
                            <h1 className='text-xs!'>{label}</h1>
                            <p className='text-[8px]! text-muted-foreground'>
                                {('count' in props && props.count !== undefined) ? (
                                    `${props.count} items`
                                ) : 'Global'}
                            </p>
                        </div>

                        {('count' in props && props.count !== undefined) &&
                            <div className='absolute right-2'>
                                <Button
                                    size='icon-xs'
                                    variant='secondary'
                                    className='rounded-full'
                                >
                                    <HugeiconsIcon icon={PlusIcon} />
                                </Button>
                            </div>
                        }
                    </article>
                ))}
            </div>
        </section>
    )
}

export function Documents() {
    return (
        <>
            <section className='flex flex-col'>
                <h1>Acme Skincare</h1>
                <p className='text-muted-foreground'>
                    Collections and globals for this site
                </p>
            </section>

            <section className={cn(
                'grid grid-cols-4 divide-x divide-border/25 cursor-pointer',
                'overflow-hidden rounded-md border shadow border-border/35',
                'bg-input/35! hover:shadow-md shadow-primary/15 backdrop-blur',
                'transition-shadow duration-300 ease-out hover:-translate-y-1!',
            )}>
                {stats.map((stat) => (
                    <article key={stat.label} className='p-5'>
                        <h1 className='font-black'>{stat.value}</h1>
                        <h2 className='text-sm!'>{stat.label}</h2>
                        <p className='text-xs!'>{stat.sub}</p>
                    </article>
                ))}
            </section>

            <Viewmodel
                title='Collections'
                items={collections}
            />

            <Viewmodel
                title='Globals'
                items={globals}
            />
        </>
    )
}
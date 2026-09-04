import { Button } from "@baseconfig/ui/components/button"
import { cn } from "@baseconfig/ui/lib/utils"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { collections, globals } from "./documents"

type ViewmodelProps = {
    title: string
    segment: 'collections' | 'globals'
    items: typeof collections | typeof globals
    classNames?: string
}

export const Viewmodel = ({
    title,
    segment,
    items,
    classNames
}: ViewmodelProps) => {
    return (
        <section className='flex flex-col gap-1'>
            <h1 className='text-base!'>{title}</h1>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {items?.map(({ icon, label, slug, ...props }, index) => (
                    <div key={index} className='relative'>
                        <Link
                            to='/admin/$'
                            params={{ _splat: `${segment}/${slug}` }}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-5 py-2.5',
                                'border border-border/35 bg-input/35 hover:shadow-md shadow-primary/15',
                                'transition-shadow duration-300 ease-out backdrop-blur',
                                'hover:-translate-y-1!',
                                classNames
                            )}
                        >
                            <HugeiconsIcon icon={icon} className='size-5!' />
                            <div className='flex flex-col'>
                                <h1 className='text-xs!'>{label}</h1>
                                <p className='text-[8px]! text-muted-foreground'>
                                    {'count' in props && props.count !== undefined
                                        ? `${props.count} items`
                                        : 'Global'}
                                </p>
                            </div>
                        </Link>

                        {'count' in props && props.count !== undefined && (
                            <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                                <Button
                                    size='icon-xs'
                                    variant='secondary'
                                    className='rounded-full'
                                >
                                    <HugeiconsIcon icon={PlusIcon} />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
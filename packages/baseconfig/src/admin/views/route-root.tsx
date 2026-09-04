import { PropsWithChildren } from "react"
import { Headers } from "./headers"

type RouteRootProps = PropsWithChildren<{

}>

export function RouteRoot({
    children
}: RouteRootProps) {
    return (
        <>
            <Headers />
            {children}
        </>
    )
}
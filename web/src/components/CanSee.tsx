import { useCan } from "@/hooks/useCan";
import { ReactNode } from "react";

interface CanSeeProps {
    children?: ReactNode,
    permissions?: string[],
    roles?: string[]
}

export function CanSee({ permissions , roles,children}:CanSeeProps){
    const userCanSeeComponent  = useCan({
        permissions,
        roles
    })

    if (!userCanSeeComponent) return null;

    return (
        <>
            {children}
        </>
    )
}
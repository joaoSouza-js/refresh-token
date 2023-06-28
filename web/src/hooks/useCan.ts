import { use } from "react"
import { useAuth } from "./useAuth"

type useCanProps = {
    permissions?: string[], 
    roles?: string[]
}

export function useCan({permissions, roles}: useCanProps= {}){
    const {isAuthenticated,user} = useAuth()



    if(!isAuthenticated){
        return false
    }

    if(!!permissions?.length){
        const hasPermissions  = permissions.some((permission) => user?.permissions.includes(permission))

        if(!hasPermissions){
            return false
        }
        
    }

    if(!!roles?.length){
        const hasRoles  = roles.some((role) => user?.roles.includes(role))
        
        if(!hasRoles){
            return false
        }
        
    }

    return true


}
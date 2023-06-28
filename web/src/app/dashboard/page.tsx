'use client'

import { CanSee } from "@/components/CanSee"
import { useAuth } from "@/hooks/useAuth"
import { useCan } from "@/hooks/useCan"
import { api } from "@/services/api"
import { useEffect } from "react"

export default function Deshboad(){
    const {user,signOut} = useAuth()
    const userCanSeeMetrics = useCan()
    useEffect(() => {
        api.get('/me').then((response) => console.log)
    }, [])


    return (
        <div>
            <CanSee roles={['administrator']}>
                <button onClick={signOut}>
                    Sair
                </button>
                <p>pode ver as metricas</p>
     
            </CanSee>
            <h1>Daashboar {JSON.stringify(user?.email)}</h1>
        </div>
    )
}
'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SignInCredential } from "../DTO/signIn";
import { api } from "@/services/api";
import {} from 'next/navigation'

import { setCookie,parseCookies, destroyCookie } from "nookies";


interface User {
    email: string;
    permissions: string[];
    roles: string[];
}


interface AuthContextType {
    signIn: (credentials: SignInCredential) => Promise<void>
    isAuthenticated: boolean
    user: User | undefined
    signOut: () => void
}

interface SignInResponse {
    permissions:string[]
    refreshToken: string
    roles:string[]
    token:string

}

interface  UserResponse {
    permissions: string[]
    roles: string[]
    email: string

}

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContext = createContext({} as  AuthContextType)



export function AuthContextProvider({children}: AuthContextProviderProps){
    const [user,setUser] =  useState<User>()
    const isAuthenticated = !!user



    const authChannel = new BroadcastChannel('auth',)

    async function signIn(credentials: SignInCredential){
        const { email,password } = credentials
        try {
            const response = await api.post < SignInResponse>('/sessions',{
                 email,
                 password
            })
            const { permissions, refreshToken, roles,token} = response.data

            setCookie(undefined, '@nextauth.token', token,{
                path: '/',
                maxAge: 60 * 60 * 24 * 30 // 30 days,
            })
            setCookie(undefined, '@nextauth.refreshtoken', refreshToken,{
                path: '/',
                maxAge: 60 * 60 * 24 * 30 // 30 days,
            })

            setUser({
                email,
                permissions,
                roles,
            })

            
          


        } catch (error: any) {
           console.log(error)
        }

    }

    function signOut() {
        destroyCookie(undefined, '@nextauth.token')
        destroyCookie(undefined, '@nextauth.refreshtoken')
        authChannel.postMessage('signOut')
        window.location.href = '/'
    }

    async function fetchUserData(){
        const {'@nextauth.token':token } = parseCookies()

        if(token){
            try {
                const response = await api.get < UserResponse>('/me')
                console.log(response.data)
                const {email,permissions,roles} = response.data
    
                setUser({
                    email,
                    permissions,
                    roles
                })
                

             }
             catch (error) {
                window.location.href = '/'
             }
        }


        
    }

    useEffect(() => { fetchUserData() }, [])

    useEffect(() => { 
        authChannel.onmessage = (message) =>{
            switch (message.data) {
                case 'signOut':
                    window.location.href = '/'
                    break;
            
                default:
                    break;
            }
        }
    }, [])
    return (
        <AuthContext.Provider value={{
            signOut,
            signIn,
            user,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}


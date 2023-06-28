'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { Input } from "./Input"
import { data } from "autoprefixer";
import { useAuth } from "../hooks/useAuth";
import { SignInCredential } from "../DTO/signIn";
import { useRouter } from 'next/navigation'


export function Form(){
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {signIn} = useAuth()
    const router = useRouter()
 

    async function handleSubmit(event: FormEvent<HTMLFormElement> ){
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget);
            const formValues = Object.fromEntries(formData.entries()) as SignInCredential | {} as SignInCredential
            
            try {
                await signIn({
                    email: formValues.email ,
                    password: formValues.password
                })
                
            } catch (error) {
                
            }

            router.push('/dashboard')
            
        } catch (error) {
           console.log(error) 
        }
        finally {
            setIsSubmitting(false)
        }
        
     
     
    }

    return (
        <form  onSubmit={handleSubmit} className="px-8 py-5 w-screen rounded-md max-w-md bg-zinc-800 shadow-sm shadow-zinc-700   flex flex-col gap-4 ">
            <h1 className="font-bold text-xl text-zinc-100">Formulário</h1>
            <Input 
                name="email" 
                type="email" 
                required id="email" 
                placeholder="Digite o seu email"
            />
            <Input 
                name="password" 
                required 
                placeholder="Digite a sua Senha"
                id="password"
            />
            <button 
                type="submit" 
                disabled={isSubmitting}
                className=" font-bold w-full px-3 rounded-lg py-2 text-zinc-100 bg-green-600 disabled:cursor-not-allowed disabled:bg-green-800 hover:transition-shadow hover:bg-green-500 ">
                Cadastrar
            </button>
        </form>
    )
}
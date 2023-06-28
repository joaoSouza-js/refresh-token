import {InputHTMLAttributes} from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

export function Input(props: InputProps){
    return (
         <input className='rounded text-base px-3 py-2 bg-zinc-100 text-zinc-900' {...props}/>
    )
}
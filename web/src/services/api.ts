import axios,{AxiosError,AxiosResponse,InternalAxiosRequestConfig} from "axios";
import { parseCookies,setCookie,destroyCookie } from "nookies";
import { redirect } from 'next/navigation'
import { config } from "process";



interface faliedRequestQueueProps {
    onSucess: (token: string) => void,
    onFailure: (error: AxiosError | any) => void
}

interface  AxiosReponseProps extends AxiosResponse {
   
        code?: number | string
    
}



let isRefreshing = false
let faliedRequestQueue = [] as faliedRequestQueueProps[]
export const api = axios.create({
    baseURL:'http://localhost:3333',
  
})



api.interceptors.request.use(request => {
    const {'@nextauth.token':token } = parseCookies()
    if(!token) {

        return Promise.resolve(request)
    }
    request.headers.Authorization = `Bearer ${token}`
     return Promise.resolve(request)

})

api.interceptors.response.use(response => response, async (error:AxiosError<AxiosReponseProps> ) => {
    if(error.response?.status === 401){
    
        if(error.response.data.code === 'token.expired'){
            
            const {'@nextauth.refreshtoken':refreshToken } = parseCookies()
            const originalConfig = error.config as InternalAxiosRequestConfig
           
            if(!isRefreshing){
                isRefreshing = true

                try {
                    
                    const response = await api.post('/refresh',{
                        refreshToken
                    })
    
                    const data = response.data
    
                    
                    setCookie(undefined, '@nextauth.token', data.token,{
                        path: '/',
                        maxAge: 60 * 60 * 24 * 30 // 30 days,
                    })
                    setCookie(undefined, '@nextauth.refreshtoken', data.refreshToken,{
                        path: '/',
                        maxAge: 60 * 60 * 24 * 30 // 30 days,
                    })
    
                    api.defaults.headers.common.Authorization = `Bearer ${data.token }`

                    

                     api(originalConfig)

                    faliedRequestQueue.forEach(request => request.onSucess(data.token))
                } catch (error) {
                     faliedRequestQueue.forEach(request => request.onFailure(error))
                }
                finally {
                    isRefreshing=false
                    faliedRequestQueue= []

                }
 

            }
        
            return new Promise((resolve, reject) => {
                faliedRequestQueue.push({
                    onSucess: (token: string) => {
                        originalConfig.headers.Authorization = `Bearer ${token}`
                        resolve(api(originalConfig))
                    },
                    onFailure: (error: AxiosError) => {
                        reject(error)
                    } 
                })
            })
        }


        else {
           destroyCookie(undefined,'@nextauth.token')
            destroyCookie(undefined,'@nextauth.refreshtoken')
          
        }
    }

    return Promise.reject(error)
})

/*
    refreshToken without using asynchry functionality

    import axios,{AxiosError,AxiosResponse,InternalAxiosRequestConfig} from "axios";
import { parseCookies,setCookie,destroyCookie } from "nookies";
import { redirect } from 'next/navigation'


interface faliedRequestQueueProps {
    onSucess: (token: string) => void,
    onFailure: (error: AxiosError | any) => void
}

interface  AxiosReponseProps extends AxiosResponse {
   
        code?: number | string
    
}



let isRefreshing = false
let faliedRequestQueue = [] as faliedRequestQueueProps[]
export const api = axios.create({
    baseURL:'http://localhost:3333',
  
})



api.interceptors.request.use(request => {
    const {'@nextauth.token':token } = parseCookies()
    if(!token) {

        return Promise.resolve(request)
    }
    request.headers.Authorization = `Bearer ${token}`
     return Promise.resolve(request)

})

api.interceptors.response.use(response => response,  (error:AxiosError<AxiosReponseProps> ) => {
    if(error.response?.status === 401){
    
        if(error.response.data.code === 'token.expired'){
            
            const {'@nextauth.refreshtoken':refreshToken } = parseCookies()
            const originalConfig = error.config as InternalAxiosRequestConfig
           
            if(!isRefreshing){
                isRefreshing = true

               api.post('/refresh',{
                            refreshToken
                        })
                    .then(response => {
                            
                            const data = response.data
            
                            
                            setCookie(undefined, '@nextauth.token', data.token,{
                                path: '/',
                                maxAge: 60 * 60 * 24 * 30 // 30 days,
                            })
                            setCookie(undefined, '@nextauth.refreshtoken', data.refreshToken,{
                                path: '/',
                                maxAge: 60 * 60 * 24 * 30 // 30 days,
                            })
            
                            api.defaults.headers.common.Authorization = `Bearer ${data.token }`

                            faliedRequestQueue.forEach(request => request.onSucess(data.token))
                        })
                    .catch(error => {
                            faliedRequestQueue.forEach(request => request.onFailure(error))
                        })
                    .finally(() => {
                            isRefreshing=false
                            faliedRequestQueue= []
                        })
            }
        
            return new Promise((resolve, reject) => {
                faliedRequestQueue.push({
                    onSucess: (token: string) => {
                        originalConfig.headers.Authorization = `Bearer ${token}`
                        resolve(api(originalConfig))
                    },
                    onFailure: (error: AxiosError) => {
                        reject(error)
                    } 
                })
            })
        }


        else {
            destroyCookie(undefined,'@nextauth.token')
            destroyCookie(undefined,'@nextauth.refreshtoken')
          
        }
    }

    Promise.reject(error)
})


*/


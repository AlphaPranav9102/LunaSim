import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export const setToken = (token) =>{
    // set token in localStorage
    localStorage.setItem('accountToken', token)
}
export const setUser = (token) =>{
    // set token in localStorage
    localStorage.setItem('accountUser', token)
}
export const fetchToken = (token) =>{
    return localStorage.getItem('accountToken')
}
export const fetchUser = (token) =>{
    return localStorage.getItem('accountUser')
}

export function RequireToken({children}) {
    
    useEffect(() => {
        let auth = fetchToken()
        console.log(auth)
    
        if (auth == null || auth == "") {
            if (window.location.href.includes("/d")){
                redirect("/")
            }
        }
        else {
            if (!window.location.href.includes("/dashboard")){
                redirect("/dashboard")
            }
        }
    })
  
    return children;
    
}
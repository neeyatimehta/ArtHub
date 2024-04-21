import { redirect } from "react-router-dom"
import instance from "../components/auth/axiosConfig"
import { decoded, token } from "./token"

export const isLoggedIn = () =>{
    if(token){
        return true
    }else{
        return false
    }
}

export const getLoggedUser = () =>  {
    const user = decoded?.id;
    // if(token){
    //     instance.get('/api/Auth/get-user-info', {
    //         headers:{
    //             "Authorization":`Bearer ${token}`
    //         }
    //     })
    //     .then((res)=>console.log(res))
    //     .catch((err)=>console.log(err))
    // }
   
}

export const logout = () =>{
    // console.log("logged")
    localStorage.removeItem("token")
    
    redirect('/login', {replace:true})
}
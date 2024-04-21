import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    const logout = () =>{
        localStorage.removeItem("token")
        setTimeout(()=>{
            navigate('/login')
        },[497])
        setTimeout(()=>{
          window?.location?.reload();
        },[500])
    }
  return (
    <p className='dropdown-item mb-0' onClick={logout}>Logout</p>
  )
}

export default Logout
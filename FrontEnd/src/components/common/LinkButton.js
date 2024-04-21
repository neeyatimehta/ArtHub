import React from 'react'
import { useNavigate } from 'react-router-dom'

const LinkButton = (props) => {
    let {text, type, className, link, color, textColor, border, icon} = props
    const navigate = useNavigate()
  return (
    <>
    <button onClick={()=>navigate(link)}  className={`btn px-4 rounded-0 ${!border && `border-${color}` } bg-${textColor}  ${className}` }>
      <a className={`mb-0 text-decoration-none text-${color}`}>{text} {icon && icon}</a>
      </button>
    </>
  )
}

export default LinkButton
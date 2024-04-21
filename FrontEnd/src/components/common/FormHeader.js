import React from 'react'

const FormHeader = (props) => {
    let {message, className} = props
  return (
    <h6 className={`fw-bold ${className}`}>{message}</h6>
  )
}

export default FormHeader
import React, { useEffect, useState } from 'react'
import { regexForLabels, scrollToElement } from '../../helpers/common'

const ErrorMessage = (props) => {
    let {message, className} = props
    // useEffect(()=>{
    //   if(message){
    //     scrollToElement("errorMsg")

    //   }
    // }, [message])
  return (
    <>
        <p id="errorMsg" className={`error-message text-capitalize fw-bold text-danger fw-8 m-0 ${className}`}>{ message && 
        regexForLabels(message)}</p>
    </>
  )
}

export default ErrorMessage
import React, { useEffect, useState } from 'react'
import { scrollToElement } from '../../helpers/common'

const SuccessMessage = (props) => {
    let {message, className} = props
    useEffect(()=>{
      if(message){
        scrollToElement("successMsg")
      }
    }, [message])
  return (
    <>
        <p id="successMsg" className={`error-message fw-bold text-success fw-8 m-0 ${className}`}>{message}</p>
    </>
  )
}

export default SuccessMessage
import React from 'react'

const EmptyMessage = (props) => {
    let {title, className} = props
  return (
    <p className={`fw-9 mt-2 mb-0 ${className}`}>Sorry, no {title} found.</p>
  )
}

export default EmptyMessage
import React from 'react'

const TextArea = (props) => {
    let {children, className, placeholder, onChange, name, value} = props
  return (
    <textarea 
    className={`form-control ${className}`}
    placeholder={placeholder}
    onChange={onChange}
    name={name}
    value={value}
    >
        {children}
    </textarea>
  )
}

export default TextArea
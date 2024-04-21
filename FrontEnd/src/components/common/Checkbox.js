import React from 'react'

const Checkbox = ({name, label, onChange, className}) => {
  return (
    (
        <>
        <div class="form-check" onChange={onChange} className={className} >
            <input class="form-check-input" type="checkbox" value="" id={name} name={name} />
            <label class="form-check-label ms-2" for={name}>
            {label}
            </label>
        </div>
        </>
    )
  )
}

export default Checkbox
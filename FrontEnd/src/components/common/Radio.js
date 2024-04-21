import React from 'react'

const Radio = (props) => {
    let{name, label, className, onChange, value} = props
  return (
    <>
    <div class={`form-check ${className}`} onChange={onChange}>
  <input class="form-check-input fw-9" type="radio" name={name} id={name} value={value} />
  <label class="form-check-label fw-9" for={name}>
    {label}
  </label>
</div>
    </>
  )
}

export default Radio
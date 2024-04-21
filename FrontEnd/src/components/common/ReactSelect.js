import React, { useState } from 'react'
import Select from 'react-select'


const ReactSelect = (props) => {
    let {options,onChange, name, defaultValue} = props
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRtl, setIsRtl] = useState(false);

    // console.log(options)
  return (
    <div className='mb-3'>
        <label  class="form-label text-muted mb-0 text-capitalize fw-bold">{name}</label>

       <Select 
        options={options} 
        onChange={onChange}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
        />
    </div>
  )
}

export default ReactSelect
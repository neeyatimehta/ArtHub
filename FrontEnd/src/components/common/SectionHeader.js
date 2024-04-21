import React from 'react'

const SectionHeader = ({label, className}) => {
  return (
    <span className={`section-header ${className} fw-bold`}>{label}</span>
  )
}

export default SectionHeader
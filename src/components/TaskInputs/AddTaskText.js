import React from 'react'

const AddTaskText = ({label, value, onChange, insertError=false}) => {

  return (
    <div className='form-control'>
        <label htmlFor="add_task">
          <span className={`${insertError && 'errorMsg'}`}>
            {insertError? `Error: ${insertError}` : label}
          </span>
        </label>
        <input type="text" id="add_task" placeholder={`Add ${label}`} value={value} 
            onChange={e => onChange(e.target.value)}/>     
    </div>
  )
}

export default AddTaskText